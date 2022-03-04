const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = express.Router()


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