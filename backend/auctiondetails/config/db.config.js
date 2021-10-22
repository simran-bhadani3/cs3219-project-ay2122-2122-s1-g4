require('dotenv').config();

const dbpassword = process.env.testdbpassword

module.exports = {
    url: 'mongodb://localhost:27017/auctiondetails',
    productionurl: `mongodb+srv://testuser:${dbpassword}@cluster0.zhbyl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
}