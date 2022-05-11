const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

var Auth = require('../../../middleware/auth');
var Type = require('../module/type');
var Song = require('../module/song');
var Album = require('../module/album');
var Account = require('../module/account')
var Listen = require('../module/listen')
const e = require('express');
const res = require('express/lib/response');


//Lấy danh sách bài hát có lượt nghe nhiều nhất 10 ngày gần đây
router.get('/best-new-10day', async (req, res, next) => {
    try {
        //let acc = (await Account.selectId((await Auth.getTokenData(req)).id_account)).id_account;
        let idAccount = Auth.getUserID(req).id_account;
        let data = await Listen.getListenOf10Day();

        let listSong = [];
        for (let i = 0; i < data.length; i++) {
            let idSong = data[i].id_song;
            let song = await Song.getSong(idSong, idAccount);
            let album = await Album.hasIdAlbum(song.id_album);
            let singers = await Song.getSingerSong(idSong);
            let types = await Song.getTypes(idSong);

            delete song['id_account'];
            delete song['id_album'];


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


            data[i].song = song;
            delete data[i].id_song;
        }

        res.status(200).json({
            message: 'Lấy danh sách thành công',
            data: data
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

//Lấy top3 trong 10 day
//Lấy danh sách bài hát có lượt nghe nhiều nhất 10 ngày gần đây
router.get('/best-new-3day', async (req, res, next) => {
    try {
        //let acc = (await Account.selectId((await Auth.getTokenData(req)).id_account)).id_account;
        let idAccount = Auth.getUserID(req).id_account;
        let top3 = await Listen.getListenOf3Day();


        for (let i = 0; i < top3.length; i++) {
            let idSong = top3[i].id_song;
            let listentop3 = await Listen.getListen(idSong)

            for (let j = 0; j < listentop3.length; j++ ) {
                delete listentop3[j].id_song
            }
            
            top3[i].listen = listentop3
        }

        res.status(200).json({
            message: 'Lấy danh sách thành công',
            data: top3
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})




module.exports = router;