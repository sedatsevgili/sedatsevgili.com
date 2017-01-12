var Token = require('../../models/token');
var oauth2Module = require('simple-oauth2');
var RestClient = require('node-rest-client').Client;
var Promise = require('promise');

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
var restClient = new RestClient();

loadLastToken = function() {
    return new Promise(function(resolve, reject) {
        Token.findOne({}, function(err, token) {
            if(err) {
                return reject(err);
            }
            return resolve(token);
        }).sort({'_id': 1});
    });
}

deleteLastTokenAndCreateNewOne = function() {
    return new Promise(function(resolve, reject) {
        loadLastToken().then(function(token) {
            if(token) {
                token.remove(loadLastToken().then(function(token) {
                    return resolve(token);
                }));
            } else {
                loadLastToken().then(function(token) {
                    return resolve(token);
                });
            }
        }, function(err) {
            console.error(err);
            return reject(err);
        })
    });
}

// fetches last token from storage
// if there is no token, creates one.
getToken = function() {
    return new Promise(function(resolve, reject) {
        loadLastToken().then(function(token) {
            if(!token) {
                return createToken().then(function(token) { resolve(token); });
            }

            var tokenObject = oauth2.accessToken.create(token);
            if(!tokenObject.expired()) {
                return resolve(token);
            }
            tokenObject.refresh((err, result) => {
                if(err) {
                    console.error(err);
                    return reject(err);
                }
                return saveToken(result).then(function() { resolve(token); });
            });
        }, function(err) {
            console.error(err);
            return reject(err);
        });
    });
}

// creates a valid token for api
createToken = function() {
    return new Promise(function(resolve, reject) {
        oauth2.ownerPassword.getToken({
            username: process.env.JAMB_API_USERNAME,
            password: process.env.JAMB_API_PASSWORD
        }, function(err,result) {
            if(err) {
                console.error('Access Token Error', err.message)
                return reject(err);
            }
            return saveToken(result).then(function() { resolve(result) });
        });
    });
}

// 
saveToken = function(result) {
    return new Promise(function(resolve, reject) {
        createdTokenObject = oauth2.accessToken.create(result);
        tokenModelToSave = new Token();
        tokenModelToSave.access_token = createdTokenObject.token.access_token;
        tokenModelToSave.refresh_token = createdTokenObject.token.refresh_token;
        tokenModelToSave.expires_in = createdTokenObject.token.expires_in;
        tokenModelToSave.save(function(err) {
            if(err) {
                console.error('Could not save token', err.message);
                return reject(err);
            }
            return resolve(result);
        });
    });
}

afterCallApi = function(data, response) {
    return new Promise(function(resolve, reject) {
        if(response.statusCode == 401) {
            console.error('our token is invalid. so let\'s create a new one!');
            return deleteLastTokenAndCreateNewOne().then(
                function() {
                    return exports.getPosts().then(function(data) { resolve(data); });
                }
            );
        } else if(response.statusCode != 200) {
            console.error('we could not fetch posts');
            console.error(response.statusMessage);
            return reject(new Error(response.statusMessage));
        } else {
            return resolve(data);
        }
    });
}


exports.getPosts = function() {
    return new Promise(function(resolve, reject) {
        getToken().then(function(token) {
            restClient.get(process.env.JAMB_API_HOST + '/posts', {
                headers: {'Authorization': 'Bearer ' + token.access_token}
            }, function(data, response) {
                return afterCallApi(data, response).then(function(data) { resolve(data) });
            });
        }, function(err) {
            console.error(err);
            return reject(err);
        });
    });
}