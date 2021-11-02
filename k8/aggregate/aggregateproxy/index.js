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

// Configuration for the proxy middleware
const TEST_URL = "https://jsonplaceholder.typicode.com";
const LOCAL_URL = "http://localhost"; // need http://
const DEPLOYED_URL = "http://...";
const FORWARDING_URL = LOCAL_URL;

// Logging
app.use(morgan('dev'));

// To see if this proxy is running
app.get('/agg/test', (req, res) => {
    res.send('This is an aggregation and proxy service.');
});

// app.use('/agg/userdetails', combiner);
app.use('/agg/userdetails', axiosCombiner);
 
// Proxy endpoints
app.use('/json_placeholder', createProxyMiddleware({
    target: TEST_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/json_placeholder`]: '',
    },
}));

// https://www.twilio.com/blog/node-js-proxy-server
app.use('/api', createProxyMiddleware({
    target: FORWARDING_URL,
    changeOrigin: true,
}));

 // Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
 