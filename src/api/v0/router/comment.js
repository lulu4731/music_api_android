const express = require('express')
const router = express.Router()
const Auth = require('../../../middleware/auth')
const Playlist_Song = require('../module/playlistSong')
const Comment = require('../module/comment')
const Notification = require('../module/notification')

router.get('/:id_song/comment', Auth.authenGTUser, async (req, res, next) => {
    const id_song = req.params.id_song
    let data = []

    const songExists = await Playlist_Song.hasSong(id_song)
    if (songExists) {
        const listParent = await Comment.listCommentParent(id_song)
        for (let i = 0; i < listParent.length; i++) {
            const listChildren = await Comment.listCommentChildren(listParent[i].id_cmt, id_song)
            data.push({
                id_account: listParent[i].id_account,
                id_cmt: listParent[i].id_cmt,
                content: listParent[i].content,
                day: listParent[i].day,
                time: listParent[i].time,
                commentChildren: listChildren
            })
        }

        return res.status(200).json({
            message: 'Danh sách các comment theo bài hát thành công',
            data
        })
    } else {
        return res.status(404).json({
            message: 'Bài hát không tồn tại'
        })
    }
})

router.post('/:id_song/comment', Auth.authenGTUser, async (req, res, next) => {
    try {
        const content = req.body.content.trim()
        const id_account = Auth.getTokenData(req).id_account
        const id_song = req.params.id_song

        // Tài khoản bị khóa
        // if (acc.account_status != 0) {
        //     return res.status(403).json({
        //         message: 'Tài khoản đã bị khóa, không thể bình luận'
        //     })
        // }

        const songExists = await Playlist_Song.hasSong(id_song)
        if (songExists) {
            if (content) {
                const comment = await Comment.addCommentParent(id_account, id_song, content)
                return res.status(200).json({
                    message: "Bình luận thành công",
                    data: comment
                })
            } else {
                return res.status(400).json({
                    message: 'Bạn chưa nhập nội dung bình luận'
                })
            }

        } else {
            return res.status(404).json({
                message: 'Bài hát không tồn tại'
            })
        }

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
})
router.post('/:id_song/comment/:id_cmt_parent/reply', Auth.authenGTUser, async (req, res, next) => {
    try {
        const content = req.body.content.trim()
        const id_account = Auth.getTokenData(req).id_account
        const id_song = req.params.id_song
        const id_cmt_parent = req.params.id_cmt_parent

        // Tài khoản bị khóa
        // if (acc.account_status != 0) {
        //     return res.status(403).json({
        //         message: 'Tài khoản đã bị khóa, không thể bình luận'
        //     })
        // }
        const idSongOfCmt = await Comment.has(id_cmt_parent)
        if (idSongOfCmt) {
            if (idSongOfCmt.id_song != id_song) {
                return res.status(404).json({
                    message: 'Bài hát và bình luận không khớp'
                })
            }
        } else {
            return res.status(404).json({
                message: 'Bình luận cha không tồn tại'
            })
        }

        const songExists = await Playlist_Song.hasSong(id_song)
        if (songExists) {
            if (content) {
                const comment = await Comment.addCommentChildren(id_account, id_song, content, id_cmt_parent)
                const id_account_parent = await Comment.hasIdAccount(id_cmt_parent)
                if (id_account_parent !== id_account) {
                    await Notification.addNotification(`Tài khoản có ID: ${id_account} đã trả lời bình luận của bạn`, `id_cmt-parent: ${id_cmt_parent}, id_cmt_children: ${comment.id_cmt}`, id_account_parent)
                }
                return res.status(200).json({
                    message: "Trả lời bình luận thành công",
                    data: comment
                })
            } else {
                return res.status(400).json({
                    message: 'Bạn chưa nhập nội dung bình luận'
                })
            }
        } else {
            res.status(404).json({
                message: 'Bài hát không tồn tại'
            })
        }


    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.put('/:id_song/comment/:id_cmt/update', Auth.authenGTUser, async (req, res, next) => {
    try {
        const content = req.body.content.trim()
        const id_account = Auth.getTokenData(req).id_account
        const id_song = req.params.id_song
        const id_cmt = req.params.id_cmt

        // Tài khoản bị khóa
        // if (acc.account_status != 0) {
        //     return res.status(403).json({
        //         message: 'Tài khoản đã bị khóa, không thể bình luận'
        //     })
        // }
        const songExists = await Playlist_Song.hasSong(id_song)
        if (!songExists) {
            res.status(404).json({
                message: 'Bài hát không tồn tại'
            })
        }

        const idSongOfCmt = await Comment.has(id_cmt)
        if (idSongOfCmt) {
            if (idSongOfCmt.id_song != id_song) {
                return res.status(404).json({
                    message: 'Bài hát và bình luận không khớp'
                })
            }
        } else {
            return res.status(404).json({
                message: 'Bình luận không tồn tại'
            })
        }

        const id_account_comment = await Comment.selectAccountComment(id_cmt)
        if (+id_account === +id_account_comment) {
            if (content) {
                const comment = await Comment.updateComment(id_cmt, content)
                return res.status(200).json({
                    message: "Thay đổi nội dung bình luận thành công",
                    data: comment
                })
            } else {
                return res.status(400).json({
                    message: 'Bạn chưa nhập nội dung bình luận'
                })
            }
        } else {
            return res.status(401).json({
                message: "Không phải chính chủ, không được đổi cmt",
            })
        }


    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


router.delete('/:id_song/comment/:id_cmt/delete', Auth.authenGTUser, async (req, res, next) => {
    try {
        const id_account = Auth.getTokenData(req).id_account
        const id_song = req.params.id_song
        const id_cmt = req.params.id_cmt

        // Tài khoản bị khóa
        // if (acc.account_status != 0) {
        //     return res.status(403).json({
        //         message: 'Tài khoản đã bị khóa, không thể bình luận'
        //     })
        // }
        const songExists = await Playlist_Song.hasSong(id_song)
        if (!songExists) {
            res.status(404).json({
                message: 'Bài hát không tồn tại'
            })
        }

        const cmtExist = await Comment.has(id_cmt)
        if (!cmtExist) {
            return res.status(404).json({
                message: 'Bình luận không tồn tại'
            })
        }

        const id_account_comment = await Comment.selectAccountComment(id_cmt)
        if (+id_account === +id_account_comment) {
            const comment = await Comment.delete(id_cmt)
            return res.status(200).json({
                message: "Xóa tất cả bình luận thành công",
            })
        } else {
            return res.status(401).json({
                message: "Không phải chính chủ, không được đổi cmt",
            })
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

})

module.exports = router