import * as firebase from 'firebase';

const firebaseConfig = {
        apiKey: "AIzaSyDY004IxJCKsT-NQlY5I-VaEUbJx7o7Zs4",
        authDomain: "captionaire-39842.firebaseapp.com",
        databaseURL: "https://captionaire-39842.firebaseio.com",
        projectId: "captionaire-39842",
        storageBucket: "captionaire-39842.appspot.com",
        messagingSenderId: "512702859954",
        appId: "1:512702859954:web:277a65545bd66cba92d7ab",
        measurementId: "G-KRY8N6ZSMS"
}

firebase.initializeApp(firebaseConfig);

export default firebase;