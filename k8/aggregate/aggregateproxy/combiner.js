const http = require('http');
const express = require('express');
const router = express.Router();
const axios = require("axios");
const hostUrl = "http://google.com"; 

if (process.env.NODE_ENV === "production")
    axios.defaults.baseURL = hostUrl;

router.get("/:userId", async (req, res) => {
    const res1 = await callApi1(req.params.userId)
        .then(r => res.json(r))
        .catch(err => res.status(500).send(err));
    // res.send(res1);
})

async function callApi1(userId) {
    // return "hello"
    console.log(userId);
    var options = {
        // host: "localhost",
        // port: 8099,
        path: `http://localhost/api/currency/${userId}`,
        headers: {
          Host: "http://localhost"
        }
      };
    http.get(options, function(res) {
        console.log(res); // res.pipe(process.stdout);
        console.log("done");
        return res;
    });
}

async function callGateway(path) {
    await axios({
        url: path, 
        method: "get",

    })
}

// async function 

// https://stackoverflow.com/questions/49967779/axios-handling-errors
function axiosSpecificError(error, res) {
    if (error.response) {
        // Request made and server responded (with a non-2xx code)
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        res.status(error.response.status).send(error.response)

    } else if (error.request) {        
        // The request was made but no response was received
        console.log(error.request);
        res.status(500).json(error.toJson);
        // res.status(500).json("something went wrong!"); // in prod

    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        res.status(500).send(error.message);
    }
    
}

module.exports = router