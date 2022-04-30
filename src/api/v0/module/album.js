const pool = require('../../../database');


const db = {};

//Tạo album
db.createAlbum = (nameAlbum, idAccount) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO album(name_album,id_account) VALUES($1,$2)`,
            [nameAlbum, idAccount],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0])
            })
    })
}

//Chỉnh sửa album
db.updateAlbum = (idAlbum, nameAlbum) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE album SET name_album = $1 WHERE id_album = $2`,
            [nameAlbum, idAlbum],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}
// Xóa Album
db.deleteAlbum = (idAlbum) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM album WHERE id_album = $1`,
            [idAlbum],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rowCount > 0)
            })
    })
}
//Chuyển bài hát sang album khác
db.moveSongToAlbum = (idAlbum, idSong) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE song SET id_album = $1 WHERE id_song = $2`,
            [idAlbum, idSong],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rowCount > 0)
            })
    })
}

// Kiểm tra có song nào trong album không
db.hasSongInAlbum = (idAlbum) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT 1 FROM album INNER JOIN song ON album.id_album = song.id_album
                    WHERE album.id_album = $1 `,
            [idAlbum],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rowCount > 0);
            })
    })
}

//kiểm tra tên album đã tồn tại chưa
db.hasNameAlbum = (nameAlbum) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT 1 FROM album WHERE name_album = $1`,
            [nameAlbum],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}
//kiểm tra id album đã tồn tại chưa
db.hasIdAlbum = (idAlbum) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM album WHERE id_album = $1`,
            [idAlbum],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}




module.exports = db;