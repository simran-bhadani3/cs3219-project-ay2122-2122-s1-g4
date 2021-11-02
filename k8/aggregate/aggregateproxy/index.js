const combiner = require('./combiner');
const axiosCombiner = require('./axios');
const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express Server
const app = express();

// Configuration
const PORT = process.env.port || 8085;
const HOST = "localhost";

// Configuring api gateway location for the proxy middleware
const TEST_URL = "https://jsonplaceholder.typicode.com";
const LOCAL_URL = "http://localhost"; // need http://
const DEPLOYED_URL = "http://...";
const FORWARDING_URL = LOCAL_URL;

// Logging
app.use(morgan('dev'));

// To see if this proxy is running
app.get('/agg/test', (req, res) => {
    res.send('This is an aggregation and proxy endpoint. It seems to be running.');
});

// Aggregate endpoints
app.use('/agg/userdetails', axiosCombiner);
 
// Proxy endpoints
// https://www.twilio.com/blog/node-js-proxy-server
app.use('/api', createProxyMiddleware({
    target: FORWARDING_URL,
    changeOrigin: true,
}));

 // Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
 