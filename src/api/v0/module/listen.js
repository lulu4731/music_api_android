const pool = require('../../../database');


const db = {};

db.getToDay = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT date_trunc('day', timezone('Asia/Ho_Chi_Minh'::text, now()))::date as day `,
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

// kiểm tra bài hát đã được nghe vào hôm nay chưa
db.hasSongOfDay = (idSong, day) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT 1 FROM listen WHERE id_song = $1 AND day = $2 `,
            [idSong, day],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rowCount > 0);
            })
    })
}

// get day of listen
db.getday = (idSong) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT id_song , day FROM listen WHERE id_song = $1 AND day = $2`,
            [idSong],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

//Lấy ra lượt nghe bài hát vào hôm nay
db.getListenOfDay = (idSong, day) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT listenofday FROM listen WHERE id_song = $1 AND day = $2`,
            [idSong, day],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0].listenofday);
            })
    })
}

// create listen song
db.createListen = (idSong) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO listen(id_song) VALUES ($1) `,
            [idSong],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

// Tăng lượt nghe bài hát của hôm nay
db.updateListenOfDay = (idSong, day, listenOfDay) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE listen SET listenOfDay = $2 WHERE id_song = $1 AND day = $3`,
            [idSong, listenOfDay, day],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rowCount > 0)
            })
    })
}



module.exports = db