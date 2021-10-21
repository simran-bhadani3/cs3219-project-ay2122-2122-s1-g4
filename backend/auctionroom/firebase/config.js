const firebase = require("firebase");
const firebaseConfig = {
	apiKey: "AIzaSyBQ-vZPbNjuDCULHZWpXCTWm4hHLqJtagg",
	authDomain: "cs3219auctionroom.firebaseapp.com",
	databaseURL: "https://cs3219auctionroom-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "cs3219auctionroom",
	storageBucket: "cs3219auctionroom.appspot.com",
	messagingSenderId: "1089114826981",
	appId: "1:1089114826981:web:f12defe22c8cc37d86cc0c",
	measurementId: "G-2EJH6243JX"
};

const app = firebase.initializeApp(firebaseConfig);

module.exports = app;