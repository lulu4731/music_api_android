const pool = require('../../../database');

const db = {}

db.has = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT EXISTS (SELECT account_name FROM account WHERE id_account=$1)",
            [id],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0].exists)
            })
    })
}

db.selectId = (idAccount, idUser = -1) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT A.id_account, A.account_name, A.avatar, A.email, A.create_date, A.account_status, A.role,
        (select count(*) from follow_account FA where id_follower = $1) as follower,
        (select count(*) from follow_account FA where id_following = $1) as following,
        (select exists(select * from follow_account where id_follower = $1 and id_following = $2)) as follow_status,
        (select sum(CL.count_love_song) as total_love
            from (select count(L.id_song) as count_love_song
                from love L, song S
                where L.id_song = S.id_song and S.id_account = $1
                group by S.id_song ) as CL)
        FROM account A
        WHERE A.id_account = $1`,
            [idAccount, idUser],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

db.selectIdLite = (idAccount) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT A.id_account, A.account_name, A.avatar, A.email, A.create_date, A.account_status, A.role
        FROM account A
        WHERE A.id_account = $1`,
            [idAccount],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

module.exports = db