const http = require('http');
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
var router = require('./server/router');

var app = express();
var httpServer = http.createServer(app);

app.use('/', router);
app.use('/client', express.static('client'));
app.use('/lib', express.static('node_modules'));
app.get('/:room', (req, res) => res.sendFile(path.join(__dirname + '/server/view/room.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/server/view/home.html')));

app.listen(port, () => console.log(`listening on ${port}`));
