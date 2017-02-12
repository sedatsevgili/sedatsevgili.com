var express = require('express');
var mongoose = require('mongoose');
var app = express();
var router = express.Router();
var indexController = require('./controllers/index');
var postController = require('./controllers/post');

app.set('view engine', 'ejs');
app.use(express.static('public'));

router.route('/').get(indexController.getIndex);
router.route('/skip/:skip').get(indexController.getIndex);
router.route('/posts').get(postController.getPosts);
app.use('/', router);

mongoose.connect(process.env.SS_MONGODB_URI || 'mongodb://localhost:27017/ss');


app.listen(8080);
console.log('8080 is the magic port!');