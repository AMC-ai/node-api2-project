const express = require('express');

const postsRouter = require("../data/posts-router"); // **** 1

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`
    <h2>Lambda Posts API</h>
    <p>Welcome to the Lambda Posts API</p>
  `);
});

server.use('/api/posts', postsRouter); // **** 2

//export default server; // ES6 Modules
module.exports = server;