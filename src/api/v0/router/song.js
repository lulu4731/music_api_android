const router = require('../router/playList')
const Auth = require('../../../middleware/auth')
const Playlist_Song = require('../module/playlistSong')
const Playlist = require('../module/playList')
const jwt = require('jsonwebtoken')
const Song = require('../module/song')


router.get('/playlist', Auth.authenGTUser, async (req, res, next) => {
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
        res.status(200).json({
            message: 'Lấy danh sách playlist thành công',
            data: data
        })

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.get('/search', async (req, res, next) => {
    try {
        let { k } = req.query

        if (!k || k.trim().length == 0) {
            return res.status(400).json({
                message: "Chưa có từ khóa tìm kiếm"
            })
        }

        k = k.toLowerCase()

        let idUser = false
        let authorizationHeader = req.headers['authorization']
        if (authorizationHeader) {
            const token = authorizationHeader.split(' ')[1]
            if (token) {
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
                    if (!err) {
                        idUser = Auth.getTokenData(req).id_account
                    }
                })
            }
        }

        const page = req.query.page
        let song

        if (page) song = await Song.getSearch(k, page)
        else song = await Song.getSearch(k)

        const data = []

        // for (let i = 0; i < song.length; i++) {
        //     song = song[i]

        //     data.push(song)
        // }

        res.status(200).json({
            message: `Lấy danh sách bài viết tìm kiếm thành công`,
            data: song
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = router