const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = express.Router()
var Auth = require('../../../middleware/auth');
const Account = require('../module/account')


//Đăng nhập
router.post('/login', async (req, res, next) => {
    try {
        const account_name = req.body.account_name
        const password = req.body.password

        if (!(account_name && password)) {
            return res.status(404).json({
                message: 'Thiếu thông tin đăng nhập'
            })
        }


    } catch (error) {
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Lấy thông tin 1 tài khoản theo id
 * @params      id 
 * @permission  Theo token
 * @return      200: trả về tài khoản tìm thấy
 *              404: Không tìm thấy
 */
 router.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let accountExists = await Account.has(id);

        if (accountExists) {

            const authorizationHeader = req.headers['authorization'];
            let idUser = false;

            if (authorizationHeader) {
                const token = authorizationHeader.split(' ')[1];
                if (!token) return res.sendStatus(401);

                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(401);
                    }
                })

                idUser = Auth.getTokenData(req).id_account;
            }

            let result;
            if (idUser === false) result = await Account.selectId(id);
            else result = await Account.selectId(id, idUser);

            res.status(200).json({
                message: 'Đã tìm thấy tài khoản',
                data: result
            })
        } else {
            res.status(404).json({
                message: 'Không tìm thây tài khoản',
            })
        }

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Something wrong!'
        })
    }
})

module.exports = router