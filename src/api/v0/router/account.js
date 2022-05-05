const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = express.Router()

const Account = require('../module/account');
const Album = require('../module/album');
const Song = require('../module/song');
const PlayList = require('../module/playList');
/**
 * Đăng nhập
 * @body   account_name, password
 * @return  200: Đăng nhập thành công
 *          400: Sai thông tin đăng nhập
 *          401: TK đã bị khóa    
 *          404: Thiếu thông tin đăng nhập
 */
router.post('/login', async (req, res, next) => {
    try {
        const email = req.body.email
        const password = req.body.password

        if (!(email && password)) {
            return res.status(404).json({
                message: 'Thiếu thông tin đăng nhập',
                email: email,
                pass: password
            })
        }
        let exist = await Account.hasEmail(email);

        if(exist) {
            let acc = await Account.selectByEmail(email);
            let match = await bcrypt.compare(password, acc.password);

            if (match) {
                var data = {
                    "id_account": acc.id_account,
                    "role": acc.role,
                    "email": acc.email,
                    "account_status": acc.account_status,
                }
                // let days_token = await Information.selectToken();
                const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: `3d` });

                return res.status(200).json({
                    message: 'đăng nhập thành công',
                    accessToken: accessToken,
                    data: data
                });
            } else {
                return res.status(400).json({
                    message: 'Mật khẩu hoặc tài khoản không đúng'
                });
            }
        } else {
            return res.status(400).json({
                message: 'Mật khẩu hoặc tài khoản không đúng',
            });
        }


    } catch (error) {
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Lấy thông tin của tài khoản
 * @permission  người đã đăng nhập
 * @returns     200: lấy dữ liệu thành công
 */
// TODO: Deprecated
router.get('/information', Auth.authenGTUser, async (req, res, next) => {
    try {
        let acc = await Account.selectId(auth.getTokenData(req).id_account);
        return res.status(200).json({
            message: "Lấy thông tin thành công",
            data: acc
        })
    } catch (err) {
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
            else result = await Account.selectIdStatus(id, idUser);

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

/**
 * Thay đổi thông tin tài khoản, chỉ có thể đổi của chính bản thân
 * 
 * @permission  phải đăng nhập thì mới được thực thi (user trở lên)
 * @return      401: Không được sửa thông tin của người khác
 *              400: Thiếu thông tin bắt buộc
 *              200: Cập nhật thành công, trả về tài khoản vừa cập nhật
 */
// TODO: Deprecated
router.put('/:id', Auth.authenGTUser, async (req, res, next) => {
    try {

        let updateId = req.params.id;
        let userId = Auth.getTokenData(req).id_account;
        let oldAccount = await Account.selectId(updateId);

        if (updateId != userId) {
            return res.status(401).json({
                message: 'Không thể sửa đổi thông tin của người khác'
            })
        }
        let {account_name} = req.body;
        if (account_name){
            let avatarPath = '';
            if(req.files && req.files.image){
                //update avt mới
                let idIMGDrive = await MyDrive.uploadIMG(image, updateId);
                //xóa avt cũ
                let oldAvatarId = MyDrive.getImageId(oldAccount.avatar);
                await MyDrive.deleteFiles(oldAvatarId);

                let imgPath = "https://drive.google.com/uc?export=view&id=" + idIMGDrive;
            }
            let result = await Account.update(updateId, account_name, imgPath);

            res.status(200).json({
            message: 'Cập nhật thông tin tài khoản thành công',
            data: result
            })
        }else{
            res.status(400).json({
                message: 'account_name ko được để trống'
            })
        }

        
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Something wrong'
        })
    }

})


/**
 * Lấy danh sách album của 1 tài khoản
 * @query       page
 * @permission  Ai cũng có thể
 * @return      200: Thành công, trả về số lượng + id các bài viết đã bookmark của tài khoản này
 *              404: Tài khoản không tồn tại
 */
 router.get('/:id/album', async (req, res, next) => {
    try {
        let id = req.params.id;
        let page = req.query.page;

        let accExists = await Account.has(id);
        if (accExists) {
            let albumId;
            if (page) albumId = await Album.list(id, page);
            else albumId = await Album.list(id);

            let data = [];
            for (let i = 0; i < albumId.length; i++) {
                let album = await Album.hasIdAlbum(albumsId[i].id_album);
                let acc = await Account.selectId(album.id_account);
                let songs = await Album.selectSongsOfAlbum(albumsId[i].id_album);
                data.push({
                    album: album,
                    author: acc,
                    songs: songs
                });
            }

            res.status(200).json({
                message: 'Lấy danh sách Album thành công',
                data: data
            })
        } else {
            res.status(404).json({
                message: 'Tài khoản không tồn tại'
            })
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})


/**
 * Lấy tất cả bài hát (public) của một tài khoản
 * @permisson   Ai cũng có thể thực thi
 * @return      200: Thành công, trả về các bài viết public, đã kiểm duyệt của tài khoản
 *              404: Tài khoản không tồn tại
 */
 router.get('/:id/songs', async (req, res, next) => {
    try {
        let idAcc = req.params.id;
        let page = req.query.page;

        let accExists = await Account.has(idAcc);
        if (accExists) {
            let acc = await Account.selectId(idAcc);



            let songsId;
            if(page) songsId = await Song.getListSongIdPublicOfAccount(idAcc, page);
            else songsId = await Song.getListSongIdPublicOfAccount(idAcc);

            let data = [];
            for (let i = 0; i < postsId.length; i++) {
                let song = await song.getSong(songsId[i].id_song, idAcc);
                data.push({
                    post: post,
                    author: acc
                });
            }
            res.status(200).json({
                message: 'Lấy danh sách các bài hát của tài khoản thành công',
                data: data
            })
        } else {
            res.status(404).json({
                message: 'Tài khoản không tồn tại'
            })
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})


/**
 * Lấy tất cả bài hát của bản thân
 * @permisson   chỉ bản thân
 * @return      200: Thành công, trả về các bài viết public, đã kiểm duyệt của tài khoản
 *              404: Tài khoản không tồn tại
 */
 router.get('/songs', Auth.authenGTUser, async (req, res, next) => {
    try {
            let acc = await Account.selectId(auth.getTokenData(req).id_account);
            let page = req.query.page;

            let songsId;
            if(page) songsId = await Song.getListSongIdOfAccount(auth.getTokenData(req).id_account, page);
            else songsId = await Song.getListSongIdOfAccount(auth.getTokenData(req).id_account);

            let data = [];
            for (let i = 0; i < postsId.length; i++) {
                let song = await song.getSong(songsId[i].id_song, acc);
                data.push({
                    post: post,
                    author: acc
                });
            }
            res.status(200).json({
                message: 'Lấy danh sách các bài hát của tài khoản thành công',
                data: data
            })
 

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})


/**
 * Lấy playlist công khai của tài khoản
 * @permisson   mọi người
 * @return      200: Thành công, trả về các bài viết public, đã kiểm duyệt của tài khoản
 *              404: Tài khoản không tồn tại
 */
 router.get('/:id/playlist', async (req, res, next) => {
    try {
        let idAcc = req.params.id;
        let page = req.query.page;

        let accExists = await Account.has(idAcc);
        if (accExists) {
            let acc = await Account.selectId(idAcc);

            let playlists;
            if(page) playlists = await PlayList.listPlaylistAccount(idAcc, page);
            else playlists = await PlayList.listPlaylistAccount(idAcc);

            // let data = [];
            // for (let i = 0; i < playListsId.length; i++) {
            //     if(playlistsId[i].playlist_status === 0){
            //         let playList = await PlayList.has(playlistsId[i].id_playlist);

            //         data.push({
            //             playList: playList
            //         });
            //     }
                
            // }

            if(playlists){
                res.status(200).json({
                    message: 'Lấy danh sách các bài hát của tài khoản thành công',
                    data: playlists
                })
            }
            
        } else {
            res.status(404).json({
                message: 'Tài khoản không tồn tại'
            })
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})


/**
 * Đổi password của cá nhân
 * @body        old_password, new_password
 * @permission  Người đang đăng nhập
 * @return      200: Đổi thành công
 *              400: Thiếu dữ liệu
 *              403: Mật khẩu cũ không chính xác
 */
 router.put('/change/password', Auth.authenGTUser, async (req, res, next) => {
    try {
        let new_password = req.body.new_password;
        let old_password = req.body.old_password;
        let id_account = Auth.getTokenData(req).id_account;

        if (old_password !== "") {
            let acc = await Account.selectId(id_account);
            acc = await Account.selectByEmail(acc.email);
            let match = await bcrypt.compare(old_password, acc.password);

            if (match) {
                if (new_password !== "") {
                    bcrypt.hash(new_password, saltRounds, async (err, hash) => {
                        new_password = hash;
                        let changePassword = await Account.updatePassword(id_account, new_password);

                        return res.status(200).json({
                            message: 'Thay đổi mật khẩu thành công',
                        })
                    });
                } else {
                    return res.status(400).json({
                        message: 'Mật khẩu mới không được bỏ trống'
                    });
                }
            } else {
                return res.status(403).json({
                    message: 'Mật khẩu cũ không chính xác!'
                })

            }

        } else {
            return res.status(400).json({
                message: 'Thiếu mật khẩu cũ!'
            })
        }

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});


/**
 * Tìm kiếm tài khoản theo từ khóa
 * @query       k
 * @permission  Xử lý theo token
 * @return      200: Trả về danh sách
 *              400: Chưa có từ khóa tìm kiếm
 *              401: Authorization header không có token
 *              403: token không chính xác hoặc đã hết hạn
 */
 router.get('/search', async (req, res, next) => {
    try {
        let { k } = req.query;
        if (!k || k.trim().length == 0) {
            return res.status(400).json({
                message: "Chưa có từ khóa tìm kiếm"
            })
        }

        k = k.toLowerCase();

        let page = req.query.page;

        const authorizationHeader = req.headers['authorization'];

        let list = [];
        let ids;
        if (page) ids = await Account.getSearch(k, page);
        else ids = await Account.getSearch(k);

        if (authorizationHeader) {
            const token = authorizationHeader.split(' ')[1];
            if (!token) return res.sendStatus(401);

            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(403);
                }
            })

            let idUser = Auth.getTokenData(req).id_account;

            for (let accId of ids) {
                let acc = await Account.selectIdStatus(accId.id_account, idUser);
                list.push(acc)
            }
        } else {
            for (let accId of ids) {
                let acc = await Account.selectId(accId.id_account);
                list.push(acc)
            }
        }
        return res.status(200).json({
            message: 'Tìm kiếm danh sách tài khoản thành công',
            data: list
        });
        // }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
});





