const pool = require('../../../database')

const db = {}
db.list = (id_account, page = 0) =>{
    if (page == 0) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT *
            FROM album 
            WHERE id_account=$1 order by create_date desc`,
                [id_account], (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows);
                })
        })
    } else {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT id_song
            FROM album 
            WHERE id_account=$1 order by create_date desc LIMIT 10 OFFSET $2`,
                [id_account, (page - 1) * 10], (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows);
                })
        })
    }
}

db.selectSongsOfAlbum = (id, page = 0) => {
    if (page == 0) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT id_song
            FROM song
            WHERE id_album = $1 AND song_status = 0`,
                [id],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows);
                })
        })
    } else {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT *
            FROM song
            WHERE id_album = $1 AND song_status = 0 LIMIT 10 OFFSET $2`,
                [id , (page - 1) * 10], (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows);
                })
        })
    }
}

module.exports = db;