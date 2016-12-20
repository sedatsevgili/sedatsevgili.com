var moment = require('moment');

exports.getIndex = function(req, res) {
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