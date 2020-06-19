const express = require('express');
var router = express.Router();

router.get('/tiles', function (req, res) {
  res.send('Birds home page')
})

module.exports = router;
