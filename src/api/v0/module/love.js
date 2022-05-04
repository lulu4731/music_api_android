const pool = require('../../../database');


const db = {};

db.addLove = (idAccount, idSong) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO love(id_account,id_song) VALUES($1,$2)`,
            [idAccount, idSong],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

db.deleteLove = (idAccount, idSong) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM love WHERE id_account = $1 AND id_song = $2`,
            [idAccount, idSong],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

db.hasLove = (idAccount, idSong) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT 1 FROM love WHERE id_account = $1 AND id_song = $2`,
            [idAccount, idSong],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rowCount > 0);
            })
    })
}

// lấy danh sách bài hát mà bản thân yêu thích
db.getListSong = (idAccount) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT song.* FROM love INNER JOIN song ON love.id_song = song.id_song
                    WHERE love.id_account = $1`,
            [idAccount],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows);
            })
    })
}


module.exports = db;