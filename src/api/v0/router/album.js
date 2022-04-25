const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const e = require('express');
const res = require('express/lib/response');
const Album = require('../module/album');

//Tạo Album
router.post('/', async (req, res, next) => {
    try {
        let name_album = req.body.name_album;
        //let acc = await Account.selectId(Auth.tokenData(req).id_account);

        // Tài khoản bị khóa
        // if (acc.account_status != 0) {
        //     return res.status(403).json({
        //         message: 'Tài khoản đã bị khóa, không thể thêm bài'
        //     })
        // }

        if (name_album) {
            let existAlbum = await Album.hasNameAlbum(name_album);
            if (!existAlbum) {
                let album = await Album.createAlbum(name_album);
                res.status(200).json({
                    message: 'Thêm mới album thành công',
                    data: album
                })
            }
            else {
                res.status(400).json({
                    message: 'Tên album đã tồn tại'
                })
            }
        }
        else {
            res.status(400).json({
                message: 'Thiếu dữ liệu'
            })
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})


module.exports = router;