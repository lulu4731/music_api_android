const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

var Account = require('../module/account');
var Song = require('../module/song');
var Love = require('../module/love')
var Album = require('../module/album');
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

async function getSong(idSong, idUser = -1){
    let song = await Song.getSong(idSong, idUser);

    let album = await Album.hasIdAlbum(song.id_album);
    let singers = await Song.getSingerSong(idSong);
    let types = await Song.getTypes(idSong);

    let singerSong = [];
    for (let i = 0; i < singers.length; i++) {
        let listSinger = await Account.selectId(singers[i].id_account);
        singerSong.push(listSinger);
    }

    album['account'] = await Account.selectId(album.id_account);
    delete album['id_account'];
            
    song['account'] = await Account.selectId(song.id_account);
    song['album'] = album;
    song['singers'] = singerSong;
    song['types'] = types;

    delete song['id_account'];
    delete song['id_album'];

    return song;
}

// Lấy danh sách bài hát mà bản thân yêu thích
router.get('/love-song', Auth.authenGTUser, async (req, res, next) => {
    try {
        //let acc = await Account.selectId(Auth.tokenData(req).id_account);
        let page = req.query.page
        if(!page || page < 1) page = 1
        let acc = Auth.getTokenData(req).id_account;


        // Tài khoản bị khóa
        // if (acc.account_status != 0) {
        //     return res.status(403).json({
        //         message: 'Tài khoản đã bị khóa'
        //     })
        // }

        let list = await Love.getListSong(acc, page);
        let data = []
        for(element of list){
            let song = await getSong(element.id_song)
            data.push(song)
        }

        return res.status(200).json({
            message: 'Lấy danh sách thành công',
            data: data
        })

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;