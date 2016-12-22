var Token = require('../../models/token');
var oauth2Module = require('simple-oauth2');

const credentials = {
    client: {
        id: '123', //process.env.JAMB_API_CLIENT_ID,
        secret: '456', //process.env.JAMB_API_CLIENT_SECRET
    },
    auth: {
        tokenHost: 'http://localhost:3000', //process.env.JAMB_API_HOST,
        tokenPath: '/oauth2/token'
    }
};

var oauth2 = oauth2Module.create(credentials);

// fetches last token from storage
// if there is no token, creates one.
getToken = function(callback) {
    Token.findOne({}, function(err, token) {
        if(err) {
            return callback(err);
        }
        if(!token) {
            return createToken(callback);
        }
        var tokenObject = oauth2.accessToken.create(token);
        if(token.expired()) {
            token.refresh((err, result) => {
                if(err) {
                    return callback(err);
                }
                saveToken(false, result, callback);
            });
        }
        return callback(false, token);
    }).sort({'_id': 1});
}

// creates a valid token for api
createToken = function(callback) {
    oauth2.ownerPassword.getToken({
        username: process.env.JAMB_API_USERNAME,
        password: process.env.JAMB_API_PASSWORD
    }, saveToken);
}

// 
saveToken = function(err, result, callback) {
    if(err) {
        return callback(err);
    }
    createdTokenObject = oauth2.accessToken.create(result);
    tokenModelToSave = new Token();
    tokenModelToSave.access_token = createdTokenObject.token.access_token;
    tokenModelToSave.refresh_token = createdTokenObject.token.refresh_token;
    tokenModelToSave.expires_in = createdTokenObject.token.expires_in;
    tokenModelToSave.save(function(err) {
        if(err) {
            return callback(err);
        }
        callback(false, tokenModelToSave);
    });
}

exports.getPosts = function(callback) {
    getToken(function(err, token) {
        if(err) {
            return callback(err);
        }
        if(!token) {
            return callback('auth error!');
        }
        // todo use token to get resources
    });
}