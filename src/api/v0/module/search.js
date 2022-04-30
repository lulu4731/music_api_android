const pool = require('../../../database')

const db = {}

<<<<<<< HEAD
db.getSearchSong = (keyword, page = 0) => {
    if (page === 0) {
        return new Promise((resolve, reject) => {
            pool.query(`select *, TO_CHAR(created:: date, 'dd/mm/yyyy') AS day, TO_CHAR(created:: time, 'hh24:mi') AS time
            from song
            where song_status=0 and (lower(name_song) like $1 or lower(description) like $1 or lower(lyrics) like $1)`,
                ['%' + keyword + '%'],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows)
=======
db.getSearch = (search, page = 0) => {
    if (page === 0) {
        return new Promise((resolve, reject) => {
            pool.query(`select *
            from song
            where song_status=0 and (lower(name_song) like '%$1%' or lower(description) like '%$1%' or lower(lyrics) like '%$1%')`,
                [search],
                (err, postResult) => {
                    if (err) return reject(err);
                    return resolve(postResult.rows)
>>>>>>> main/phuc
                });

        })
    } else {
        return new Promise((resolve, reject) => {
<<<<<<< HEAD
            pool.query(`select *, TO_CHAR(created:: date, 'dd/mm/yyyy') AS day, TO_CHAR(created:: time, 'hh24:mi') AS time
            from song
            where song_status=0 and (lower(name_song) like $1 or lower(description) like $1 or lower(lyrics) like $1)
            LIMIT 10 OFFSET $2`,
                ['%' + keyword + '%', (page - 1) * 10],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows)
=======
            pool.query(`select *
            from song
            where song_status=0 and (lower(name_song) like '%$1%' or lower(description) like '%$1%' or lower(lyrics) like '%$1%')
            LIMIT 10 OFFSET $2`,
                [search, (page - 1) * 10],
                (err, postResult) => {
                    if (err) return reject(err);
                    return resolve(postResult.rows)
>>>>>>> main/phuc
                });

        })
    }
<<<<<<< HEAD
}

db.getSearchNamePlaylist = (keyword, id_account, page = 0) => {
    if (page === 0) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT id_playlist, name_playlist, playlist_status
            from playlist
            where playlist_status=0 and id_account = $1 and (lower(name_playlist) like $2)`,
                [id_account, '%' + keyword + '%'],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows)
                });

        })
    } else {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT id_playlist, name_playlist, playlist_status
            from playlist
            where playlist_status=0 and id_account = $1 and (lower(name_playlist) like $2)
            LIMIT 10 OFFSET $3`,
                [id_account, '%' + keyword + '%', (page - 1) * 10],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows)
                });

        })
    }
}

db.getSearchNameAccount = (keyword, page = 0) => {
    if (page === 0) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT id_account, account_name,  email, avatar, create_date
            from account
            where account_status=0 and (lower(account_name) like $1)`,
                ['%' + keyword + '%'],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows)
                });

        })
    } else {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT id_account, account_name,  email, avatar, create_date
            from account
            where account_status=0 and (lower(account_name) like $1)
            LIMIT 10 OFFSET $2`,
                ['%' + keyword + '%', (page - 1) * 10],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows)
                });

        })
    }
}
=======

}

>>>>>>> main/phuc
module.exports = db