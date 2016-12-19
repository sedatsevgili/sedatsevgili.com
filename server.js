var express = require('express');
var app = express();

app.set('view engine', 'ejs');

// index page
app.get('/', function(req, res) {
    res.render('pages/index', {
        'now': new Date()
    });
});

app.listen(8080);
console.log('8080 is the magic port!');