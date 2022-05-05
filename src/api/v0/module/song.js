const pool = require('../../../database')

const db = {}
db.getListSongIdOfAccount = (id, page = 0) => {
    if (page == 0) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT *
            FROM Song
            WHERE id_account = $1`,
                [id],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows);
                })
        })
    } else {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT *
            FROM Song
            WHERE id_account = $1 LIMIT 10 OFFSET $2`,
                [id_account, (page - 1) * 10], (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows);
                })
        })
    }
}

db.getListSongIdPublicOfAccount = (id, page = 0) => {
    if (page == 0) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT *
            FROM Song
            WHERE id_account = $1 AND song_status = 0`,
                [id],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows);
                })
        })
    } else {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT *
            FROM Song
            WHERE id_account = $1 AND song_status = 0 LIMIT 10 OFFSET $2`,
                [id_account, (page - 1) * 10], (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows);
                })
        })
    }
}

module.exports = db;