const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db = require('./src/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/swagger.json');
const port = 8000;
const apiUrl = '/api/v0';

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


// My API




app.listen(port, () => {
    console.log(`Start website http://localhost:${port}`)
});