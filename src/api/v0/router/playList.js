const express = require('express')
const router = express.Router()
const Auth = require('../../../middleware/auth')
const Playlist = require('../module/playList')
const jwt = require('jsonwebtoken')


//playList
router.post('/fake', async (req, res, next) => {
    const { id_account, name_account } = req.body
    console.log(name_account)
    const accessToken = jwt.sign({ id_account, name_account }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10d' });

    return res.status(200).json({
        accessToken: accessToken
    })
})

router.post('/', Auth.authenGTUser, async (req, res, next) => {
    try {
        const { name_playlist, playlist_status } = req.body
        const id_account = Auth.getTokenData(req).id_account

        //Tài khoản bị khóa không thể tạo playlist


        if (name_playlist) {
            //Kiểm tra tên playlist có trùng không
            const name_playlistExists = await Playlist.hasName(name_playlist)
            if (name_playlistExists) {
                return res.status(400).json({
                    message: 'Tên playlist bị trùng'
                })
            }

            const playList = await Playlist.add(name_playlist, id_account, playlist_status)
            return res.status(201).json({
                message: 'Tạo playlist thành công',
                data: playList
            })
        } else {
            return res.status(400).json({
                message: 'Thiếu tên playlsit'
            })
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.put('/:id', Auth.authenGTUser, async (req, res, next) => {
    try {
        const id = req.params.id
        const playlistExists = await Playlist.has(id)

        if (playlistExists) {
            const { name_playlist, playlist_status } = req.body

            if (name_playlist) {
                const oldName_playlist = await Playlist.hasNameID(id)
                if (name_playlist != oldName_playlist) {
                    const name_playlistExists = await Playlist.hasName(name_playlist)
                    if (name_playlistExists) {
                        return res.status(400).json({
                            message: 'Tên playlist bị trùng'
                        })
                    }
                }

                const playList = {
                    name_playlist,
                    playlist_status
                }
                const playlist = await Playlist.update(id, playList)

                return res.status(200).json({
                    message: 'Cập nhật playlist thành công',
                    data: playlist
                })
            } else {
                return res.status(400).json({
                    message: 'Thiếu tên playlsit'
                })
            }
        } else {
            return res.status(404).json({
                message: 'Không tìm thấy playlist để xóa'
            })
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.delete('/:id', Auth.authenGTUser, async (req, res, next) => {
    try {
        const id = req.params.id
        const playlistExists = await Playlist.has(id)

        if (playlistExists) {
            const countSongOfPlaylist = await Playlist.countSongOfPlaylist(id)
            if (countSongOfPlaylist > 0) {
                return res.status(403).json({
                    message: 'Playlist đã có bài hát không thể xóa'
                })
            }

            await Playlist.delete(id)
            return res.status(200).json({
                message: 'Xóa playlist thành công'
            })

        } else {
            return res.status(404).json({
                message: 'Không tìm thấy playlist để xóa'
            })
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.get('/', Auth.authenGTUser, async (req, res, next) => {
    let page = req.query.page
    const id_account = Auth.getTokenData(req).id_account

    try {
        const listPlaylist = await Playlist.listPlaylistAccount(id_account, page)

        if (listPlaylist) {
            return res.status(200).json({
                message: "Lấy danh sách playlist thành công",
                data: listPlaylist
            })
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})
module.exports = router;