const pool = require('../../../database');


const db = {};

//Thêm bài hát
db.addSong = (id_account, song) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO song(id_account, name_song, link, lyrics,description, id_album) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [id_account, song.name_song, song.link, song.lyrics, song.description, song.id_album],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

//Thêm thể loại vào bài hát
db.addTypeSong = (id_song, id_type) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO song_type (id_song, id_type) VALUES ($1, $2)",
            [id_song, id_type],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            })
    })
}

//Thêm ca sĩ vào bài hát
db.addSingerSong = (id_acc, id_song) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO singer_song (id_account, id_song) VALUES ($1, $2)",
            [id_acc, id_song],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            })
    })
}

//Lấy thông tin bài hát
db.getSong = (id_song, idAccount) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT  song.id_song, song.name_song, song.link, song.listen, count(love.id_song) as qtylove, account.account_name, album.name_album, song.created, exists(select 1 from love where love.id_account = $1) as lovestatus "
            + "FROM(((song "
            + "LEFT JOIN love ON song.id_song = love.id_song) "
            + "INNER JOIN album ON song.id_album = album.id_album) "
            + "INNER JOIN account ON song.id_account = account.id_account) "
            + "WHERE song.id_song = $2 "
            + "GROUP BY song.id_song, account.account_name, album.name_album",
            [idAccount, id_song],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

//Lấy danh sách ca sĩ của bài hát
db.getSingerSong = (id_song) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT account.account_name FROM singer_song INNER JOIN account ON singer_song.id_account = account.id_account WHERE id_song = $1",
            [id_song],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows);
            })
    })
}

//Lấy danh sách thể loại của bài hát
db.getTypes = (id_song) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT type.name_type FROM type INNER JOIN song_type ON type.id_type = song_type.id_type WHERE song_type.id_song = $1",
            [id_song],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows);
            })
    })
}

//Kiểm bài hát có tồn tại không
db.hasSong = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM song WHERE id_song=$1",
            [id],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

//Xóa tất cả thể loại của bài hát
db.deleteTypeSong = (id_song) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM song_type WHERE id_song = $1",
            [id_song],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            })
    })
}

//cập nhật bài hát
db.updateSong = (id_song, song) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE song SET name_song = $1, link= $2, lyrics= $3, description= $4, id_album= $5 WHERE id_song = $6",
            [song.name_song, song.link, song.lyrics, song.description, song.id_album, id_song],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            })
    })
}

// Xóa bài hát chỉ tác giả được xóa
db.deleteSong = (id_song,idAccount) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM song WHERE id_song = $1 AND id_account = $2",
            [id_song,idAccount],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rowCount > 0);
            })
    })
}

//Lấy ds bài hát theo thể loại
db.getListSongtype = (id_type) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT song.* FROM song, song_type WHERE song.id_song = song_type.id_song AND song_type.id_type = $1",
            [id_type],
            (err, result) => {
                if (err) return reject(err);
                return resolve({ list: result.rows, exist: result.rowCount > 0 });
            })
    })
}

//Lấy danh sách 20 bài hát nhiều lượt nghe nhất
db.getBestSong = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT song.* FROM song WHERE song.listen != 0 ORDER BY song.listen DESC FETCH FIRST 20 ROWS ONLY",
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows);
            })
    })
}

//Xóa bản thân ra khỏi tác giả của bài hát
db.deleteSingerSong = (id_song, idAccount) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM singer_song WHERE id_song = $1 AND id_account = $2",
            [id_song,idAccount],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            })
    })
}

db.deleteAccountSong = (idSong, idAccount) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM song WHERE id_song = $1 AND id_account = $2",
            [idSong, idAccount],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rowCount > 0);
            })
    })
}

// Kiểm tra tài khoản có phải tác giả của bài hát hay không?
db.authorSong = (idAccount, idSong) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM song WHERE id_song = $1 AND id_account = $2 ",
            [idSong, idAccount],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rowCount > 0);
            })
    })
}

//Xóa bản thân khỏi bài hát được tag, nếu là tác giả thì không cho xóa bản thân.
db.deleteSingerSong = (idAccount, idSong) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM singer_song WHERE id_song = $1 AND id_account = $2 ",
            [idSong, idAccount],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rowCount > 0);
            })
    })
}

module.exports = db; 