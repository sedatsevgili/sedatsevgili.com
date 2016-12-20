var express = require('express');
var app = express();
var router = express.Router();
var indexController = require('./controllers/index');

app.set('view engine', 'ejs');
app.use(express.static('public'));

router.route('/').get(indexController.getIndex);
app.use('/', router);

app.listen(8080);
console.log('8080 is the magic port!');