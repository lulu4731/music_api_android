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

