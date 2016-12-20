var express = require('express');
var moment = require('moment');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// index page
app.get('/', function(req, res) {
    var posts = [
       {
           'content': 'content-1',
           'tags': [
               {
                   'name': 'tag-1'
               },
               {
                   'name': 'tag-2'
               }
           ],
           'createdAt': moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
       },
       {
           'content': 'content-3',
           'tags': [
               {
                   'name': 'tag-3'
               }
           ],
           'createdAt': moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
       }
   ];
    res.render('pages/index', {
        'posts': posts,
        'now': new Date()
    });
});


app.listen(8080);
console.log('8080 is the magic port!');