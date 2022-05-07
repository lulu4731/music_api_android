const pool = require('../../../database');

const db = {}

db.getAll = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM type",
            [], (err, result) => {
                if (err) return reject(err);
                return resolve(result.rows);
            })
    })
}

module.exports = db