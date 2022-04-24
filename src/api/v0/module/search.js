const pool = require('../../../database')

const db = {}

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
                });

        })
    } else {
        return new Promise((resolve, reject) => {
            pool.query(`select *
            from song
            where song_status=0 and (lower(name_song) like '%$1%' or lower(description) like '%$1%' or lower(lyrics) like '%$1%')
            LIMIT 10 OFFSET $2`,
                [search, (page - 1) * 10],
                (err, postResult) => {
                    if (err) return reject(err);
                    return resolve(postResult.rows)
                });

        })
    }

}

module.exports = db