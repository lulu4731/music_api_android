const pool = require('../../../database')

const db = {}

db.selectPasswordByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT password FROM account WHERE email = $1',
            [email],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0].password);
            })
    })
}

db.selectByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM account WHERE email = $1',
            [email],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

// db.hasByUsername = (account_name) => {
//     return new Promise((resolve, reject) => {
//         pool.query("SELECT * FROM account WHERE account_name = $1",
//             [account_name],
//             (err, result) => {
//                 if (err) return reject(err);
//                 return resolve(result.rowCount > 0);
//             })
//     })
// }

db.hasEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM account WHERE email = $1",
            [email],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rowCount > 0);
            })
    })
}

db.selectAllId = (page = 0) => {
    if (page === 0) {
        return new Promise((resolve, reject) => {
            pool.query(`select id_account from account order by id_account desc`,
                [],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows);
                })
        });
    } else {
        return new Promise((resolve, reject) => {
            pool.query(`select id_account from account order by id_account desc LIMIT 10 OFFSET $1`,
                [(page - 1) * 10],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows);
                })
        });
    }

}


db.selectAllByAccount = (id_account) => {
    return new Promise((resolve, reject) => {
        pool.query(`select a.id_account, a.account_name, a.email, a.avatar, a.account_status,a.role
                (select count(*) from follow_account fa where fa.id_follower=a.id_account) as num_followers, 
                (select count(*) from song s where s.id_account = a.id_account and p.status=0) as num_posts,
                (select count(*) from love l inner join song s on l.id_song = s.id_song where a.id_account = s.id_account  ) as num_loves,
                (select count(*) > 0 from follow_account fa where fa.id_follower=a.id_account and fa.id_following = $1) as status
            from account a 
            order by a.id_account asc`,
            [id_account],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows);
            })
    });
}

db.getSearch = (search, page = 0) => {
    if (page === 0) {
        return new Promise((resolve, reject) => {
            pool.query(`select id_account
                from account
                where lower(account_name) like $1`,
                ['%' + search + '%'],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows);
                })
        });
    } else {
        return new Promise((resolve, reject) => {
            pool.query(`select id_account
                from account
                where lower(account_name) like $1 LIMIT 10 OFFSET $2`,
                ['%' + search + '%', (page - 1) * 10],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.rows);
                })
        });
    }
}

db.selectAvatar = (id_account) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT avatar FROM account WHERE id_account = $1`,
            [id_account],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0].avatar);
            })
    });
}

// db.updateVerification = (id, verification) => {
//     return new Promise((resolve, reject) => {
//         pool.query('UPDATE account SET verification = $1 WHERE id_account = $2',
//             [verification, id],
//             (err, result) => {
//                 if (err) return reject(err);
//                 return resolve(result.rowCount);
//             })
//     })
// }

db.has = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT EXISTS (SELECT email FROM account WHERE id_account=$1)",
            [id],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0].exists)
            })
    })
}

db.checkPassword = (id_account, pass) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT email FROM account WHERE id_account=$1 and password=$2",
            [id_account, pass],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rowCount > 0)
            })
    })
}

db.selectId = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT A.id_account, A.role, A.account_name, A.email, A.avatar,
        TO_CHAR(A.create_date:: date, 'dd/mm/yyyy') AS create_date,
        (select count(*) from song S where A.id_account=S.id_account and S.status=0) AS total_song,
        (select count(*) from follow_account FA where A.id_account=FA.id_follower) as total_follower,
		(select count(*) from follow_account FA where A.id_account=FA.id_following) as total_following,
		(select sum(listen) from song S where S.id_account=A.id_account) as total_listen,
        (select sum(count_love) from (select count(L.id_song) as count_love from song S, love L
            where S.id_account=$1 and L.id_song=S.id_song 
            group by S.id_song) as CL) as total_love,
        FROM account A
        WHERE A.id_account=$1`,
            [id],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

db.selectIdStatus = (idAccount, idUser) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT A.id_account, A.role, A.account_name, A.email, A.avatar,
        TO_CHAR(A.create_date:: date, 'dd/mm/yyyy') AS create_date,
        (select exists(select * from follow_account where id_follower=$1 and id_following=$2)) as status,
		(select count(*) from song S where A.id_account=S.id_account and S.status=0) AS total_song,
        (select count(*) from follow_account FA where A.id_account=FA.id_follower) as total_follower,
		(select count(*) from follow_account FA where A.id_account=FA.id_following) as total_following,
		(select sum(listen) from song S where S.id_account=A.id_account) as total_listen,
        (select sum(count_love) from (select count(L.id_song) as count_love from song S, love L
            where S.id_account=$1 and L.id_song=S.id_song 
            group by S.id_song) as CL) as total_love,
        FROM account A
        WHERE A.id_account=$1`,
            [idAccount, idUser],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

db.selectRole = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`select A.role from 
            account as A
            where A.id_account=$1`,
            [id],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

db.selectName = (id_account) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT account_name FROM account WHERE id_account = $1',
            [id_account],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0].real_name);
            })
    })
}

db.add = (account) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO account (account_name, email, password, role, avatar) VALUES ($1,$2,$3,$4,$5, $6) RETURNING id_account",
            [account.account_name, account.email, account.password, account.role, account.avatar],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0].id_account);
            });
    });
}

db.update = (id, account_name, avatar) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE account SET account_name=$1, avatar=$2 WHERE id_account=$3 RETURNING *",
            [account_name, avatar, id],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            });
    })
}

db.updateAvatar = (id, avatar) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE account SET avatar=$1 WHERE id_account=$2 ",
            [avatar, id],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

db.updateAvatarDefault = (old_image, new_image) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE account SET avatar=$1 WHERE avatar=$2 ",
            [new_image, old_image],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

db.updateRole = (id, id_chucvu) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE account SET role=$1 WHERE id_account=$2 RETURNING *",
            [id_chucvu, id],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

db.updateStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE account SET account_status=$1 WHERE id_account=$2 RETURNING *",
            [status, id],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

db.updatePassword = (id, password) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE account SET password=$1 WHERE id_account=$2",
            [password, id],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows[0]);
            })
    })
}

db.countAdmin = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT id_account FROM account WHERE role = 0',
            (err, result) => {
                if (err) return reject(err);
                return resolve(result.rowCount);
            });
    })
}




//khóa tài khoản


module.exports = db;