var moment = require('moment');
var client = require('../modules/api/client');

exports.getIndex = function(req, res) {
    client.getPosts(function(err, responseData) {
        if(err) {
            return res.err(err);
        }
        console.log(responseData);
    });

    var posts = [
       {
           'content': 'We should have AccessToken and RefreshToken mongoose schemas. Then we should have an oauth2 client such as http://lelylan.github.io/simple-oauth2/ and a rest client like https://www.npmjs.com/package/node-rest-client. We have to combined all of them in one single module.',
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
       },
       {
           'content': 'selam',
           'createdAt': moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
       }
   ];
    res.render('pages/index', {
        'posts': posts,
        'now': new Date()
    });
}