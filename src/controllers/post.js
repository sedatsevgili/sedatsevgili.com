var Client = require('../modules/api/Client');
var timeFilter = require('../modules/filters/post/timeFilter');

exports.getPosts = function(req, res) {
    var options = [];
    if (req.query.skip) {
        options.skip = req.query.skip;
    }
    var oauthCredentials = {
        client: {
            id: process.env.JAMB_API_CLIENT_ID,
            secret: process.env.JAMB_API_CLIENT_SECRET
        },
        auth: {
            tokenHost: process.env.JAMB_API_HOST,
            tokenPath: '/oauth2/token'
        }
    };
    var client = new Client(oauthCredentials, process.env.JAMB_API_USERNAME, process.env.JAMB_API_PASSWORD);
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