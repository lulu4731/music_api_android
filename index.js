const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const db = require('./src/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/swagger.json');
const port = process.env.PORT || 8000;
const apiUrl = '/api/v0';
const fileUpload = require('express-fileupload');


dotenv.config();
db.connect()
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(fileUpload());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data
// app.use(upload.array());
app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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

// Song
app.use(`${apiUrl}/song`, require('./src/api/v0/router/song'));
//Album
app.use(`${apiUrl}/album`, require('./src/api/v0/router/album'));
//Love
app.use(`${apiUrl}/love`, require('./src/api/v0/router/love'));

//playlist
app.use(`${apiUrl}/playlist`, require('./src/api/v0/router/playList'))
app.use(`${apiUrl}/playlist_song`, require('./src/api/v0/router/playlistSong'))
app.use(`${apiUrl}/song`, require('./src/api/v0/router/comment'))
app.use(`${apiUrl}/notification`, require('./src/api/v0/router/notification'))
app.use(`${apiUrl}/account-device`, require('./src/api/v0/router/account_device'))


app.listen(port, () => {
    console.log(`Start website http://localhost:${port}`)
});