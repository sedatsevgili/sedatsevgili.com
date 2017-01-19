var client = require('../modules/api/client');
var timeFilter = require('../modules/filters/post/timeFilter');

exports.getPosts = function(req, res) {
    client.getPosts([]).then(function(responseData) {
        timeFilter.filter(responseData, function(err, posts) {
            if(err) {
                return handleError(err, res);
            }
            res.json({
                'posts': posts,
                'now': new Date()
            });
        });
    }, function(err) {
        return res.err(err);
    });
};