const express = require('express')
const router = express.Router()
const Auth = require('../../../middleware/auth')
const Playlist_Song = require('../module/playlistSong')
const Playlist = require('../module/playList')


router.post('/:id_playlist/song/:id_song', Auth.authenGTUser, async (req, res, next) => {
    try {
        const id_song = req.params.id_song
        const id_playlist = req.params.id_playlist

        const songExists = await Playlist_Song.hasSong(id_song)
        if (songExists) {
            const playlist_songExists = await Playlist_Song.has(id_playlist, id_song)
            const play_list_exists = await Playlist.has(id_playlist)
            if (playlist_songExists) {
                return res.status(400).json({
                    message: 'Bạn đã thêm bài hát này vào playlist'
                })
            }

            if (!play_list_exists) {
                return res.status(400).json({
                    message: 'PlayList không tồn tại'
                })
            }

            await Playlist_Song.add(id_playlist, id_song)
            return res.status(200).json({
                message: 'Thêm vào playlist thành công'
            })
        } else {
            return res.status(404).json({
                message: 'Bài hát không tồn tại'
            })
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


router.delete('/:id_playlist/song/:id_song', Auth.authenGTUser, async (req, res, next) => {
    try {
        const id_song = req.params.id_song
        const id_playlist = req.params.id_playlist

        const songExists = await Playlist_Song.hasSong(id_song)
        if (songExists) {
            const play_list_exists = await Playlist.has(id_playlist)

            if (!play_list_exists) {
                return res.status(400).json({
                    message: 'PlayList không tồn tại'
                })
            }

            const playlist_songExists = await Playlist_Song.has(id_playlist, id_song)
            if (playlist_songExists) {
                await Playlist_Song.delete(id_playlist, id_song)
                return res.status(200).json({
                    message: 'Xóa bài hát ra khỏi playlist thành công'
                })
            }

            return res.status(400).json({
                message: 'Bài hát này chưa thêm vào playlist'
            })
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

router.get('/:id_playlist', async (req, res, next) => {
    let page = req.query.page
    // const id_account = Auth.getTokenData(req).id_account
    const id_playlist = req.params.id_playlist

    try {
        const listPlaylistSong = await Playlist_Song.listPlaylistSong(id_playlist, page)
        const playlistExist = await Playlist_Song.hasStatusPlaylist(id_playlist)

        if (!playlistExist) {
            return res.status(400).json({
                message: "Playlist chưa công khai",
            })
        }

        if (listPlaylistSong) {
            return res.status(200).json({
                message: "Lấy danh sách bài hát công khai trong 1 playlist công khai thành công",
                data: listPlaylistSong
            })
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.get('/', Auth.authenGTUser, async (req, res, next) => {
    try {
        const page = req.query.page
        const id_account = Auth.getTokenData(req).id_account
        const listPlaylist = await Playlist.findId_playlist(id_account)
        let songId;
        let data = [];
        for (let i = 0; i < listPlaylist.length; i++) {
            if (page) songId = await Playlist_Song.listPlaylistSong(id_account, listPlaylist[i].id_playlist, page);
            else songId = await Playlist_Song.listPlaylistSong(id_account, listPlaylist[i].id_playlist);

            data.push({
                id_playlist: listPlaylist[i].id_playlist,
                name_playlist: listPlaylist[i].name_playlist,
                playlist_status: listPlaylist[i].playlist_status,
                song: songId
            })
        }
        return res.status(200).json({
            message: 'Lấy danh sách playlist thành công',
            data: data
        })

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})
module.exports = router