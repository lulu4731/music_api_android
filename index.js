const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db = require('./src/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/swagger.json');
const port = process.env.PORT || 8000;
const apiUrl = '/api/v0';
const firebaseNotification = require('./src/firebaseConfig/firebase_config');
const sendNotification = require('./src/firebaseConfig/sendNotification');

dotenv.config();
db.connect()
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data
// app.use(upload.array());
app.use(express.static('public'));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        message: error
    })
});

//firebase cloud message

app.post(`${apiUrl}/a/add`, async (req, res) => {
    const message = {
        data: {
            "title": "Xin chào Vinh",
            "content": "Chào mừng bạn đến với Wonder Music, thế giới của âm nhạc",
            "action": 'aa'
        },
        token: "eD48pTz8RHa4YVjrH-QlSe:APA91bGAsDxTQBQWX1oTd6s9ZPsVxKKFVOPqsKLKpqdXhDg3fBEk344Nt8BG6i7Gm9TV2zbisWFcBc88-Phagrwp6tCAvy8wWqJjG1foqQIeX8v3aOxAhNXdsUJG666YA1K7mQfWxCBy"
    }
    // try {
    //     firebaseNotification.messaging().send(message)
    //         .then((response) => {
    //             res.json({
    //                 message: response
    //             })
    //         })
    //         .catch((error) => {
    //             //return error
    //         });
    // } catch (error) {
    //     res.json({
    //         message: error
    //     })
    // }
    sendNotification(message)
    //heheehe
})

//playlist
app.use(`${apiUrl}/playlist`, require('./src/api/v0/router/playList'))
app.use(`${apiUrl}/playlist_song`, require('./src/api/v0/router/playlistSong'))
// app.use(`${apiUrl}/song`, require('./src/api/v0/router/song'))
app.use(`${apiUrl}/song`, require('./src/api/v0/router/comment'))
app.use(`${apiUrl}/notification`, require('./src/api/v0/router/notification'))
app.use(`${apiUrl}/account-device`, require('./src/api/v0/router/account_device'))
app.use(`${apiUrl}/search`, require('./src/api/v0/router/search'))


app.listen(port, () => {
    console.log("server is listening on port " + port);
});