const router = require('../router/playList')
const Auth = require('../../../middleware/auth')
const Search = require('../module/search')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res, next) => {
    try {
        const { k } = req.query
        console.log(k)

        // if (!k || k.trim().length == 0) {
        //     return res.status(400).json({
        //         message: "Chưa có từ khóa tìm kiếm"
        //     })
        // }

        // k = k.toLowerCase()

        // const idUser = false
        // const authorizationHeader = req.headers['authorization']
        // if (authorizationHeader) {
        //     const token = authorizationHeader.split(' ')[1]
        //     if (token) {
        //         jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        //             if (!err) {
        //                 idUser = Auth.getTokenData(req).id_account
        //             }
        //         })
        //     }
        // }

        // const page = req.query.page;
        // const song = null

        // if (page) song = await Search.getSearch(k, page)
        // else song = await Search.getSearch(k)

        // const data = []

        // for (let i = 0; i < song.length; i++) {
        //     const song = song[i]

        //     data.push({
        //         song
        //     })
        // }

        // res.status(200).json({
        //     message: `Lấy danh sách bài viết tìm kiếm thành công`,
        //     data: data
        // })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})









module.exports = router