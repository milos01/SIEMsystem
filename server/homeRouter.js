var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

var homeRouter = express.Router();

homeRouter
 .get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/public/index.html'));
  })

 module.exports = homeRouter;