var Token = require('../../models/token');
var oauth2Module = require('simple-oauth2');
var restClient = require('node-rest-client').Client;

const credentials = {
    client: {
        id: process.env.JAMB_API_CLIENT_ID,
        secret: process.env.JAMB_API_CLIENT_SECRET
    },
    auth: {
        tokenHost: process.env.JAMB_API_HOST,
        tokenPath: '/oauth2/token'
    }
};

var oauth2 = oauth2Module.create(credentials);

loadLastToken = function(callback) {
    Token.findOne({}, function(err, token) {
        if(err) {
            return callback(err);
        }
        return callback(false, token);
    }).sort({'_id': 1});
}

deleteLastTokenAndCreateNewOne = function(callback) {
    loadLastToken(function(err, token) {
        if(err) {
            console.error(err);
            return callback(err);
        }
        if(token) {
            token.remove(loadLastToken(callback));
        } else {
            loadLastToken(callback);
        }
    });
}

// fetches last token from storage
// if there is no token, creates one.
getToken = function(callback) {
    loadLastToken(function(err, token) {
        if(err) {
            console.error(err);
            return callback(err);
        }
        if(!token) {
            return createToken(callback);
        }
        var tokenObject = oauth2.accessToken.create(token);
        if(tokenObject.expired()) {
            tokenObject.refresh((err, result) => {
                if(err) {
                    console.error(err);
                    return callback(err);
                }
                saveToken(false, result);
            });
        } else {
            return callback(false, token);
        }
    });
}

// creates a valid token for api
createToken = function(callback) {
    oauth2.ownerPassword.getToken({
        username: process.env.JAMB_API_USERNAME,
        password: process.env.JAMB_API_PASSWORD
    }, function(err,result) {
        return saveToken(err, result, callback);
    });
}

// 
saveToken = function(err, result, callback) {
    if(err) {
        return console.error('Access Token Error', err.message);
    }
    createdTokenObject = oauth2.accessToken.create(result);
    tokenModelToSave = new Token();
    tokenModelToSave.access_token = createdTokenObject.token.access_token;
    tokenModelToSave.refresh_token = createdTokenObject.token.refresh_token;
    tokenModelToSave.expires_in = createdTokenObject.token.expires_in;
    tokenModelToSave.save(function(err) {
        if(err) {
            console.error('Could not save token', err.message);
            return callback(err);
        }
        return callback(false, result);
    });
}

exports.getPosts = function(callback) {
    getToken(function(err, token) {
        if(err) {
            console.error('there is an error in callback of getToken');
            console.error(err);
            return callback(err);
        }
        if(!token) {
            console.error('token not found in callback of getToken');
            return callback('auth error!');
        }
        var client = new restClient();
        client.get(process.env.JAMB_API_HOST + '/posts', {
            headers: {'Authorization': 'Bearer ' + token.access_token}
        }, function(data, response) {
            if(response.statusCode == 401) {
                console.error('our token is invalid. so let\'s create a new one!');
                deleteLastTokenAndCreateNewOne(
                    function() {
                        exports.getPosts(callback)
                    });
            } else if(response.statusCode != 200) {
                console.error('we could not fetch posts');
                console.error(response.statusMessage);
                callback(response.statusMessage);
            } else {
                callback(false, data);
            }
        });
    });
}