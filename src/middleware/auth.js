const jwt = require('jsonwebtoken')

const auth = {}

auth.getTokenData = (req) => {
    const authorizationHeader = req.headers['authorization']
    if (!authorizationHeader) return null

    const token = authorizationHeader.split(' ')[1]
    let result = null

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            result = data
        }
    })

    return result
}

auth.authenAdmin = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    // Beaer [token]
    if (!authorizationHeader) return res.sendStatus(401);

    const token = authorizationHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }

        if (data.role != 1) return res.sendStatus(403);
        next();
    })
}


auth.authenGTUser = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    // Beaer [token]
    if (!authorizationHeader) return res.sendStatus(401);

    const token = authorizationHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        next();
    })
}

module.exports = auth;
