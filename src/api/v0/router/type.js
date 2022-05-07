const express = require('express')
const router = express.Router()

const Type = require('../module/type')

router.get('/all', async (req, res, next) => {
    try {
        let data = await Type.getAll()
        return res.status(200).json({
            message: 'Lấy danh sách thể loại thành công',
            data: data
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

module.exports = router