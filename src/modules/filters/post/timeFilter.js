var moment = require('moment');

exports.filter = function(posts, callback) {
    var processedPostCount = 0;
    var sentPostCount = posts.length;
    if(sentPostCount == 0) {
        return callback(false, posts);
    }

    posts.forEach(function(post) {
        post.createdAt = moment(post.createdAt).format('YYYY-MM-DD HH:mm:ss');
        processedPostCount++;   
        if(sentPostCount == processedPostCount) {
            return callback(false, posts);
        }
    });
}