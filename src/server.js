var express = require('express');
var mongoose = require('mongoose');
var app = express();
var router = express.Router();
var indexController = require('./controllers/index');

app.set('view engine', 'ejs');
app.use(express.static('public'));

router.route('/').get(indexController.getIndex);
app.use('/', router);

mongoose.connect(process.env.SS_MONGODB_URI || 'mongodb://localhost:27017/ss');


app.listen(8080);
console.log('8080 is the magic port!');