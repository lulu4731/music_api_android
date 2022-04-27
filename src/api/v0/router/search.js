const express = require('express')
const router = express.Router()
const Auth = require('../../../middleware/auth')
const Search = require('../module/search')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res, next) => {
    try {
        let { k } = req.query

        if (!k || k.trim().length == 0) {
            return res.status(400).json({
                message: "Chưa có từ khóa tìm kiếm"
            })
        }

        k = k.toLowerCase()

        let idUser
        const authorizationHeader = req.headers['authorization']
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


        if (idUser) {
            const song = await Search.getSearchSong(k, 0)
            const playList = await Search.getSearchNamePlaylist(k, +idUser, 0)
            const account = await Search.getSearchNameAccount(k, 0)

            const data = {
                song: song,
                playList: playList,
                account: account
            }

            return res.status(200).json({
                message: 'Kết quả tìm kiếm',
                data: data
            })

        } else {
            const song = await Search.getSearchSong(k, 0)
            const account = await Search.getSearchNameAccount(k, 0)

            const data = {
                song: song,
                account: account
            }

            return res.status(200).json({
                message: 'Kết quả tìm kiếm',
                data: data
            })
        }
       

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})


module.exports = router