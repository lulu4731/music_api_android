const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

var Auth = require('../../../middleware/auth');
var Type = require('../module/type');
var Song = require('../module/song');
var Album = require('../module/album');
const e = require('express');
const res = require('express/lib/response');

/**
 * Thêm bài hát mới
 * @body        Tên bài hát, Link, Lyrics, Giới thiệu bài hát, Ngày đăng, ID TK đăng bài, ID album có thể null, Trạng thái, Số lượt nghe
 * @permisson   Chỉ User trở lên mới được thực thi
 *              Tài khoản bị khóa không thể đăng bài hát
 * @return      201: Tạo bài viết thành công, trả về bài viết vừa tạo
 *              400: Thiếu dữ liệu
 *              403: Tài khoản bị khóa, không thể tạo bài viết
 *              404: Thẻ thuộc bài viết không hợp lệ
 */
//router.post('/', Auth.authenGTUser, async (req, res, next) => {
router.post('/', async (req, res, next) => {
    try {
        let { name_song, link, lyrics, description, id_album, types, accounts } = req.body;
        //let acc = await Account.selectId(Auth.tokenData(req).id_account);
        let acc = 1;

        // Tài khoản bị khóa
        // if (acc.account_status != 0) {
        //     return res.status(403).json({
        //         message: 'Tài khoản đã bị khóa, không thể thêm bài'
        //     })
        // }

        if (name_song && link && id_album && types) { //&&idaccount
            // Loại bỏ các thể loại trùng lặp (nếu có)
            types = [...new Set(types)];

            //Loại bỏ các tài khoản bị trùng
            accounts = [...new Set(accounts)]; // danh sach các singer

            // if (types.length < 1 || types.length > 5) {
            //     return res.status(400).json({
            //         message: 'Số lượng thể  chỉ từ 1 đến 5'
            //     })
            // }

            // Kiểm tra type có hợp lệ hay không
            // for (let id_type of types) {
            //     let tagExists = await Type.has(id_type);
            //     if (!tagExists) {
            //         return res.status(404).json({
            //             message: 'Thẻ không hợp lệ'
            //         })
            //     }
            // }

            let existAlbum = await Album.hasIdAlbum(req.body.id_album);
            if (!existAlbum) {
                res.status(400).json({
                    message: 'Album không tồn tại'
                })
            }
            else {
                // Thêm bài hát
                //let songResult = await Song.addSong(acc.id_account, req.body);
                let songResult = await Song.addSong(acc, req.body);
                let idSongInsert = songResult.id_song;

                //Thêm các liên kết type-song
                for (let id_type of types) {
                    await Song.addTypeSong(idSongInsert, id_type);
                }
                // Thêm các liên kết singer-song
                for (let id_account of accounts) {
                    await Song.addSingerSong(id_account, idSongInsert);
                }

                res.status(201).json({
                    message: 'Tạo bài viết thành công',
                    data: {
                        song: songResult,
                        types: types,
                        accounts: accounts
                    }
                })
            }
        } else {
            res.status(400).json({
                message: 'Thiếu dữ liệu'
            })
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

/**
 * Lấy bài hát theo thể loại
 * @params      id thể loại
 * @permisson   Tất cả các user
 * @return      200: Lấy danh sach theo thể loại thành công
 *              404: Không có bài nào thuộc thể loại
 */
router.get('/type/:id', async (req, res, next) => {
    try {

        let idType = req.params.id;
        let listExits = await Song.getListSongtype(idType);
        if (listExits.exist) {
            res.status(200).json({
                data: listExits.list,
                message: 'Lấy thành công',
            })
        }
        else {
            res.status(404).json({
                message: 'Không có bài hát nào thuộc thể loại'
            })
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

//Lấy danh sách xem nhiều nhất , 20 bài
/**
 * Lấy 20 bài hát nghe nhiều nhất
 * @permisson   Tất cả user
 * @return      200: Lấy danh sách bài hát thành công
 *              404: Thẻ thuộc bài viết không hợp lệ
 */
router.get('/best-list', async (req, res, next) => {
    try {
        let listBestSong = await Song.getBestSong();
        res.status(200).json({
            data: listBestSong,
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

/**
 * Lấy thông tin bài hát theo id_song
 * @params      id
 * @permisson   Any User
 * @return      200: Lấy bài hát thành công và trả về thông tin bài hát & các ca sĩ được tag
 *              404: Thiếu dữ liệu
 *              
 */
router.get('/:id', async (req, res, next) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        //let acc = await Account.selectId(Auth.tokenData(req).id_account);

        let idSong = req.params.id;
        let songExits = await Song.hasSong(idSong);

        if (songExits) {
            let song = await Song.getSong(idSong, '1');
            let singers = await Song.getSingerSong(idSong);
            let types = await Song.getTypes(idSong);
            res.status(200).json({
                message: 'Lấy thông tin bài hát thành công',
                data: song,
                singers: singers,
                types: types
            })
        }
        else {
            res.status(404).json({
                message: 'Bài hát không tồn tại',
            })
        }


    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

/**
 * Chỉnh sửa bài hát
 * @body        Tên bài hát, Link, Lyrics, Giới thiệu bài hát, Ngày đăng, ID TK đăng bài, ID album có thể null, Trạng thái, Số lượt nghe
 * @permisson   Chỉ User trở lên mới được thực thi
 *              Tài khoản bị khóa không thể đăng bài hát
 * @return      201: Chỉnh sửa bài viết thành công, trả về bài viết vừa tạo
 *              400: Thiếu dữ liệu
 *              403: Tài khoản không phải là chủ sở hữu, không thể chỉnh sửa bài viết
 *              404: Thẻ thuộc bài viết không hợp lệ
 */
//  router.post('/', Auth.authenGTUser, async (req, res, next) => {
router.put('/:id', async (req, res, next) => {
    try {
        let idSong = req.params.id;

        //let acc = await Account.selectId(Auth.tokenData(req).id_account);
        let acc = 1; // idAcc của tài khoản đang đăng nhập

        // Tài khoản bị khóa
        // if (acc.account_status != 0) {
        //     return res.status(403).json({
        //         message: 'Tài khoản đã bị khóa, không thể thêm bài'
        //     })
        // }

        let songExits = await Song.hasSong(idSong);
        if (songExits) { //&& acc === songExits.id_account
            let song = await Song.getSong(idSong);
            if (song.id_account === acc) {
                let { name_song, link, lyrics, description, id_album, types, accounts } = req.body;
                //accounts.push(acc);
                if (name_song && link && types && accounts) {
                    types = [...new Set(types)]; // loại bỏ các type trùng nhau
                    accounts = [...new Set(accounts)]; // loại bỏ các account trùng nhau
                    // Kiểm tra tag có hợp lệ hay không
                    // for (let id_type of types) {
                    //     let typeExists = await Type.has(id_type);
                    //     if (!typeExists) {
                    //         return res.status(404).json({
                    //             message: 'Thẻ không hợp lệ'
                    //         })
                    //     }
                    // }

                    // Thêm lại những tag mới
                    await Song.deleteTypeSong(idSong);
                    for (let id_type of types) {
                        await Song.addTypeSong(idSong, id_type);
                    }


                    // Thêm lại những account mới
                    await Song.deleteSingerSong(idSong);
                    for (let id_account of accounts) {
                        await Song.addSingerSong(id_account, idSong);
                    }
                    // Cập nhật lại bài viết
                    let result = await Song.updateSong(idSong, req.body);

                    res.status(201).json({
                        song: result,
                        message: 'Cập nhật bài viết thành công'
                    })
                }
                else {
                    res.status(400).json({
                        message: 'Thiếu dữ liệu'
                    })
                }
            }
            else {
                res.status(403).json({
                    message: 'Không thể sửa bài viết của người khác'
                })
            }
        }
        else {
            res.status(404).json({
                message: 'Bài hát không tồn tại'
            })
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

/**
 * xóa bài hát
 * @permisson   Chỉ User trở lên mới được thực thi
 *
 * @return      201: Chỉnh sửa bài viết thành công, trả về bài viết vừa tạo
 *              400: Thiếu dữ liệu
 *              403: Tài khoản không phải là chủ sở hữu, không thể chỉnh sửa bài viết
 *              404: Thẻ thuộc bài viết không hợp lệ
 */
router.delete('/deleteSong/:id', async (req, res, next) => {
    try {
        //let acc = await Account.selectId(Auth.tokenData(req).id_account);
        var idAccount = 2;

        // Tài khoản bị khóa
        // if (acc.account_status != 0) {
        //     return res.status(403).json({
        //         message: 'Tài khoản đã bị khóa, không thể thêm bài'
        //     })
        // }
        let idSong = req.params.id;
        let songExits = await Song.hasSong(idSong);
        if (songExits) {
            let author = await Song.authorSong(idAccount, idSong);
            if (!author) {
                res.status(400).json({
                    message: 'Chỉ tác giả mới được xóa bài hát!'
                })
            }
            else {
                await Song.deleteSong(idSong, idAccount);
                res.status(200).json({
                    message: 'Xóa thành công'
                })
            }
        }
        else
            res.status(404).json({
                message: 'Bài hát không tồn tại'
            })

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})


/**
 * xóa bản thân khỏi bài hát được tag
 * @permisson   Chỉ User trở lên mới được thực thi
 *
 * @return      201: Chỉnh sửa bài viết thành công, trả về bài viết vừa tạo
 *              400: Thiếu dữ liệu
 *              403: Tài khoản không phải là chủ sở hữu, không thể chỉnh sửa bài viết
 *              404: Thẻ thuộc bài viết không hợp lệ
 */
router.delete('/deleteSinger/:id', async (req, res, next) => {
    try {

        //let acc = await Account.selectId(Auth.tokenData(req).id_account);

        // Tài khoản bị khóa
        // if (acc.account_status != 0) {
        //     return res.status(403).json({
        //         message: 'Tài khoản đã bị khóa, không thể thêm bài'
        //     })
        // }

        //let author = await Song.authorSong(acc,idSong));
        let idSong = req.params.id;
        let author = await Song.authorSong(2, idSong);
        if (!author) {
            //await Song.deleteSingerSong(acc,idSong);
            await Song.deleteSingerSong(2, idSong);
            res.status(200).json({
                message: 'Xóa thành công'
            })
        }
        else {
            res.status(400).json({
                message: 'Tác giả không thể xóa bản thân ra khỏi bài hát'
            })
        }
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

})


module.exports = router;