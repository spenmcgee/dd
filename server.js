const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use('/client', express.static('client'));
app.use('/lib', express.static('node_modules'));
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

app.listen(port, () => console.log(`listening on ${port}`));
