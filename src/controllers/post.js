var Client = require('../modules/api/Client');
var timeFilter = require('../modules/filters/post/timeFilter');

exports.getPosts = function(req, res) {
    var options = [];
    if (req.query.skip) {
        options.skip = req.query.skip;
    }
    var client = new Client();
    client.getPosts(options).then(function(responseData) {
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