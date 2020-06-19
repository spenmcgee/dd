const http = require('http');
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;

var app = express();
var httpServer = http.createServer(app);

app.use('/client', express.static('client'));
app.use('/lib', express.static('node_modules'));
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

app.listen(port, () => console.log(`listening on ${port}`));
