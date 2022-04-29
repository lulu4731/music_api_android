// Import the functions you need from the SDKs you need
// const { initializeApp } = require("firebase/app")
// const { ref, set, getDatabase, onValue,  } = require('firebase/database')
// const { getMessaging } = require("firebase/messaging/sw")


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCTv73-dB9IGcujhaDK5QC-mMk-ANNHMis",
//     authDomain: "musicapiandroid.firebaseapp.com",
//     projectId: "musicapiandroid",
//     storageBucket: "musicapiandroid.appspot.com",
//     messagingSenderId: "463854962982",
//     appId: "1:463854962982:web:65887d7344e9b59c5719e7",
//     measurementId: "G-MSR8Q20KT4"
//   };


// Initialize Firebase
// const app = initializeApp(firebaseConfig)
// // const database = getDatabase(app)
// const messaging = getMessaging(app);

// module.exports = messaging


// //Ghi dữ liệu
// const writeData = (data) => {
//     console.log(data)
//     const db = getDatabase()
//     set(ref(db, 'notification' + data.id_account), {
//         content: data.content,
//         action: data.action,
//         id_account: data.id_account
//     });
// }
// module.exports = writeData
// //Đọc dữ liệu
// const readData = () => {
//     const db = getDatabase();
//     let data
//     const starCountRef = ref(db, 'notification1');
//     onValue(starCountRef, (snapshot) => {
//         data = snapshot.val();
//     })

//     return data
// }
// module.exports = readData



var firebase = require("firebase-admin")
var configJsonFirebase = require('./key/key.json')

var defaultAppConfig = {
    credential: firebase.credential.cert(configJsonFirebase)
}
// Initialize the default app
const firebaseNotification = firebase.initializeApp(defaultAppConfig)

module.exports = firebaseNotification