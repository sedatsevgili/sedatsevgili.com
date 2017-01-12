
var client = require('../modules/api/client');
var timeFilter = require('../modules/filters/post/timeFilter');

exports.getIndex = function(req, res) {
    client.getPosts().then(function(responseData) {
        timeFilter.filter(responseData, function(err, posts) {
            if(err) {
                return handleError(err, res);
            }
            res.render('pages/index', {
                'posts': posts,
                'now': new Date()
            });
        });
    }, function(err) {
        return handleError(err, res);
    });
}

function handleError(err, res) {
    return res.render('pages/error', {
        'errorMessage': err,
        'now': new Date()
    });
}

