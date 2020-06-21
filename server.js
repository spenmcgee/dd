const http = require('http');
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const router = require('./server/router');
const nunjucks = require('nunjucks');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

var app = express();
var httpServer = http.createServer(app);
app.use(fileUpload());
app.use(bodyParser.json({limit: "5mb"}));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: false }));

nunjucks.configure('./server/view', { express: app, noCache: true });
app.set('view engine', 'html');
app.use('/', router);
app.use('/client', express.static('client'));
app.use('/lib', express.static('node_modules'));

app.listen(port, () => console.log(`listening on ${port}`));
