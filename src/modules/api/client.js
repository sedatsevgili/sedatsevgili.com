var Token = require('../../models/token');
var oauth2Module = require('simple-oauth2');
var RestClient = require('node-rest-client').Client;
var Promise = require('promise');

module.exports = class Client {

    constructor(oauthCredentials, username, password) {
        this.oauthClient = oauth2Module.create(oauthCredentials);
        this.restClient = new RestClient();
        this.username = username;
        this.password = password;
    }

    getUserCredentials() {
        return {
            username: this.username,
            password: this.password
        };
    }

    loadLastToken() {
        return new Promise((resolve, reject) => {
            Token.findOne({}, (err, token) => {
                if(err) {
                    return reject(err);
                }
                return resolve(token);
            }).sort({'_id': 1});
        });
    }

    deleteLastTokenAndCreateNewOne() {
        return new Promise((resolve, reject) => {
            this.loadLastToken().then((lastToken) => {
                if (lastToken) {
                    lastToken.remove();
                }
                this.getToken().then((token) => {
                    return resolve(token);
                });
            });
        });
    }

    getToken() {
        return new Promise((resolve, reject) => {
            this.loadLastToken().then((token) => {
                if(!token) {
                    return this.createToken().then((token) => { resolve(token); });
                }

                var tokenObject = this.oauthClient.accessToken.create(token);
                if(!tokenObject.expired()) {
                    return resolve(token);
                }
                tokenObject.refresh((err, result) => {
                    if(err) {
                        console.error(err);
                        return reject(err);
                    }
                    return this.saveToken(result).then(() => { resolve(token); });
                });
            });
        });
    }

    createToken() {
        return new Promise((resolve, reject) => {
            this.oauthClient.ownerPassword.getToken(this.getUserCredentials(), (err,result) => {
                if(err) {
                    console.error('Access Token Error', err.message)
                    return reject(err);
                }
                return this.saveToken(result).then(() => { resolve(result) });
            });
        });
    }

    saveToken(result) {
        return new Promise((resolve, reject) => {
            let createdTokenObject = this.oauthClient.accessToken.create(result);
            let tokenModelToSave = new Token();
            tokenModelToSave.access_token = createdTokenObject.token.access_token;
            tokenModelToSave.refresh_token = createdTokenObject.token.refresh_token;
            tokenModelToSave.expires_in = createdTokenObject.token.expires_in;
            tokenModelToSave.save((err) => {
                if(err) {
                    console.error('Could not save token', err.message);
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }

    checkResponse(data, response) {
        return new Promise((resolve, reject) => {
            if(response.statusCode != 200) {
                console.error('we could not fetch posts');
                console.error(response.statusMessage);
                return reject(new Error(response.statusMessage));
            } else {
                return resolve(data);
            }
        });
    }

    buildRequestUri(options) {
        var uri = process.env.JAMB_API_HOST + '/posts';
        var queryOptions = [];
        if (options.skip) {
            queryOptions.skip = options.skip;
        }
        if (options.limit) {
            queryOptions.limit = options.limit;
        }
        if (Object.keys(queryOptions).length > 0) {
            uri = uri + '?';
            for(const key in queryOptions) {
                var uriPart = key + '=' + queryOptions[key];
                uri = uri + uriPart;
            }
        }
        return uri;
    }

    getPosts(options) {
        return new Promise((resolve, reject) => {
            this.getToken().then((token) => {
                let requestUri = this.buildRequestUri(options);
                this.restClient.get(requestUri, {
                    headers: {'Authorization': 'Bearer ' + token.access_token}
                }, (data, response) => {
                    return this.checkResponse(data, response).then((data) => { resolve (data);});
                });
            });
        });
    }

}