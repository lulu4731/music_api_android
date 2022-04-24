const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db = require('./src/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/swagger.json');
const port = process.env.PORT || 8000;
const apiUrl = '/api/v0';
// const writeData = require('./src/firebaseConfig/writeData');
// const readData = require('./src/firebaseConfig/readData');
// const database = require('./src/firebaseConfig/firebase_config');
// const { ref, set, get, onValue, remove, child, update } = require('firebase/database');

// const messaging = require('./src/firebaseConfig/firebase_config')
// const { onMessage, getMessaging } = require('firebase/messaging')
// const FCM = require('fcm-node')
// const SERVER_KEY = "AAAAa__pCSY:APA91bHw8s4l4TtFhkYaMmkpe4wBFwGEKXGLwETFH2iJXhMcDIha0ExPeyddFlEEqh9w9KiYh7SfCjDKZ2VeU7-6Zy3ZTVoGAyP-SgWqasRDKrb6ZHTPHvYKOG3eDTPa_lAonzbUHoMR"
const firebaseNotification = require('./src/firebaseConfig/firebase_config')


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

// const data = {
//     content: "Bài hát mới nek nghe đi nha",
//     action: "Chia sẻ cho thầy đi",
//     id_account: 2
// }

// app.get(`${apiUrl}/a`, async (req, res) => {
//     const starCountRef = ref(database, "notification");
//     onValue(starCountRef, (snapshot) => {
//         let data = []
//         snapshot.forEach(child => {
//             data.push(child.val())
//         });
//         return res.json({
//             message: "Thêm thành công",
//             data: data
//         })
//     })

//     // res.json({
//     //     message: "Thêm thành công"
//     // })
// })

// app.get(`${apiUrl}/a/:id`, async (req, res) => {

//     const id = req.params.id
//     const starCountRef = ref(database, "notification/" + id);
//     onValue(starCountRef, (snapshot) => {
//         const data = snapshot.val()
//         return res.json({
//             message: "Thêm thành công",
//             data: data
//         })
//     })


// })

// app.delete(`${apiUrl}/a/:id`, async (req, res) => {

//     const id = req.params.id
//     // console.log(id)

//     const starCountRef = ref(database, "notification" + id);
//     await remove(starCountRef)

//     res.json({
//         message: "Xoa than cong "
//     })
// })
// app.post(`${apiUrl}/a/add`, async (req, res) => {
//     const data = req.body

//     set(ref(database, 'notification/' + data.id_account), {
//         content: data.content,
//         action: data.action,
//         id_account: data.id_account
//     });

//     res.json({
//         message: "Thêm thành công"
//     })
// })

// app.put(`${apiUrl}/a/:id`, async (req, res) => {
//     const id = req.params.id
//     const data = req.body

//     await update(ref(database, 'notification/' + id), {
//         content: data.content,
//         action: data.action,
//         id_account: data.id_account
//     });

//     res.json({
//         message: "sua thành công"
//     })
// })

//firebase cloud message

app.post(`${apiUrl}/a/add`, async (req, res) => {
    const message = {
        data: {
            "title": "Xin chào Vinh",
            "content": "Chào mừng bạn đến với Wonder Music, thế giới của âm nhạc",
            "action": 'aa'
        },
        token: "dOHCIj0lR8m_AxZl5SbpK1:APA91bFeDs6VdwFPSPpkp_yj2S9FKCZbpTqaGbK7fG9McvhyFI495YAvEgqnesey9TMqvlA14dws81lRR4FdMHC3r-sGmkIUI7m0YuObskJ0mjBHbmID3kqt4dCMUlUW8qg-90aFMsTG"
    }

    // let android = {
    //     priority: "High", //mức độ ưu tiên khi push notification
    //     ttl: '360000',// hết hạn trong 1h
    //     data: {
    //         title: '',
    //         content: ''
    //     }
    // }

    // let message = {
    //     android: android,
    //     token: tokenDevice // token của thiết bị muốn push notification
    // }

    try {
        firebaseNotification.messaging().send(message)
            .then((response) => {
                res.json({
                    message: response
                })
            })
            .catch((error) => {
                //return error
            });
    } catch (error) {
        res.json({
            message: error
        })
    }
})

// // const messaging = getMessaging();
// getToken(messaging, { vapidKey: 'AAAAa__pCSY:APA91bFtAP_9SK7eLOdfa4Kw94WdBR88TCrSfJJy4RFPeb-CinMCu_N6k-lv3VnAc2eghVBTmcUxBoA352bvRT4TLtp450eML4uSYPO7JWC8yGbvvDm6ddaXohZf4HFJDexvXmtJrVpV' }).then((currentToken) => {
//   if (currentToken) {
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });




//playlist
app.use(`${apiUrl}/playlist`, require('./src/api/v0/router/playList'))
app.use(`${apiUrl}/playlist_song`, require('./src/api/v0/router/playlistSong'))
app.use(`${apiUrl}/song`, require('./src/api/v0/router/song'))
app.use(`${apiUrl}/song`, require('./src/api/v0/router/comment'))
app.use(`${apiUrl}/notification`, require('./src/api/v0/router/notification'))
app.use(`${apiUrl}/account-device`, require('./src/api/v0/router/account_device'))


app.listen(port, () => {
    console.log("server is listening on port " + port);
});