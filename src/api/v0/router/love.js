const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

var Account = require('../module/account');
var Song = require('../module/song');
var Love = require('../module/love')
var Auth = require('../../../middleware/auth');

router.post('/follow/:id', Auth.authenGTUser, async (req, res, next) => {
    try {
        //let acc = await Account.selectId(Auth.tokenData(req).id_account);
        let acc = Auth.getTokenData(req).id_account;
        let idSong = req.params.id;

        // Tài khoản bị khóa
        // if (acc.account_status != 0) {
        //     return res.status(403).json({
        //         message: 'Tài khoản đã bị khóa, không thể thêm bài'
        //     })
        // }

        let existLove = await Love.hasLove(acc, idSong);
        if (!existLove) {
            let data = await Love.addLove(acc, idSong);
            res.status(200).json({
                data: data,
                message: 'Yêu thích thành công'
            })
        }
        else {
            res.status(400).json({
                message: 'Đã có trong danh sách yêu thích'
            })
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/unfollow/:id', Auth.authenGTUser, async (req, res, next) => {
    try {
        //let acc = await Account.selectId(Auth.tokenData(req).id_account);
        let acc = Auth.getTokenData(req).id_account;
        let idSong = req.params.id;

        // Tài khoản bị khóa
        // if (acc.account_status != 0) {
        //     return res.status(403).json({
        //         message: 'Tài khoản đã bị khóa, không thể thêm bài'
        //     })
        // }

        let existLove = await Love.hasLove(acc, idSong);
        if (existLove) {
            let data = await Love.deleteLove(acc, idSong);
            res.status(200).json({
                data: data,
                message: 'Đã bỏ yêu thích'
            })
        }
        else {
            res.status(400).json({
                message: 'Chưa yêu thích'
            })
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Lấy danh sách bài hát mà bản thân yêu thích
router.get('/love-song', Auth.authenGTUser, async (req, res, next) => {
    try {
        //let acc = await Account.selectId(Auth.tokenData(req).id_account);
        let acc = Auth.getTokenData(req).id_account;


        // Tài khoản bị khóa
        // if (acc.account_status != 0) {
        //     return res.status(403).json({
        //         message: 'Tài khoản đã bị khóa'
        //     })
        // }

        let result = await Love.getListSong(acc);

        res.status(200).json({
            message: 'Lấy danh sách thành công',
            data: result
        })

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;