const pool = require('../../../database');


const db = {};

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
        pool.query(`SELECT CONCAT(date_part('day', day) ,'/', date_part('month', day) ,'/', date_part('year', day)) as day FROM listen WHERE id_song = $1`,
            [idSong],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
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



module.exports = db