var Client = require('../modules/api/Client');
var Config = require('../modules/api/Config');
var timeFilter = require('../modules/filters/post/timeFilter');

exports.getPosts = function(req, res) {
    var options = [];
    if (req.query.skip) {
        options.skip = req.query.skip;
    }
    options.uri = '/posts';
    options.method = 'get';
    let clientConfig = new Config();
    var client = new Client(clientConfig);
    client.callApi(options).then(function(responseData) {
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