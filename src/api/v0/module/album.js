const pool = require('../../../database');


const db = {};

//Tạo album
db.createAlbum = (nameAlbum) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO album(name_album) VALUES($1)`,
            [nameAlbum],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0])
            })
    })
}

//kiểm tra tên album đã tồn tại chưa
db.hasNameAlbum = (nameAlbum) => {
    return new Promise((resolve,reject)=> {
        pool.query(`SELECT 1 FROM album WHERE name_album = $1`,
        [nameAlbum],
        (err,result) => {
            if(err) return reject(err);
            return resolve(result.rowCount > 0);
        })
    })
}
//kiểm tra id album đã tồn tại chưa
db.hasIdAlbum = (idAlbum) => {
    return new Promise((resolve,reject)=> {
        pool.query(`SELECT 1 FROM album WHERE id_album = $1`,
        [idAlbum],
        (err,result) => {
            if(err) return reject(err);
            return resolve(result.rowCount > 0);
        })
    })
}




module.exports = db;