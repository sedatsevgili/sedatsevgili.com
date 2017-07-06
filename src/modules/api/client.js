var Token = require('../../models/token');
var oauth2Module = require('simple-oauth2');
var RestClient = require('node-rest-client').Client;
var Promise = require('promise');

module.exports = class Client {

    constructor(config) {
        this.oauthClient = oauth2Module.create(config.getClientCredentials());
        this.userCredentials = config.getUserCredentials();
        this.restClient = new RestClient();
        this.apiHost = config.getApiHost();
        this.isDebugEnabled = config.isDebugEnabled();
    }

    loadLastToken() {
        this.debug('loading last token');
        return new Promise((resolve, reject) => {
            Token.findOne({}, (err, token) => {
                if(err) {
                    this.debug('we have an error in loadLastToken');
                    this.debug(err);
                    return reject(err);
                }
                this.debug('token is loaded!');
                this.debug(token);
                return resolve(token);
            }).sort({'_id': 1});
        });
    }

    getToken() {
        this.debug('getting token');
        return new Promise((resolve, reject) => {
            this.loadLastToken().then((token) => {
                if(!token) {
                    this.debug('last token does not exist. so we are creating a new one.');
                    return this.createToken().then((token) => { resolve(token); });
                }

                this.debug('creating tokenObject via token document fetched from db');
                var tokenObject = this.oauthClient.accessToken.create(token);
                if(!tokenObject.expired()) {
                    this.debug('created tokenObject is not expired!. so, it is useful!');
                    return resolve(token);
                }
                
                this.debug('refreshing tokenObject.');
                tokenObject.refresh((err, result) => {
                    this.debug('refreshed tokenObject');
                    if(err) {
                        this.debug('we have an error when refreshing tokenObject.');
                        console.error(err);
                        return reject(err);
                    }
                    this.debug('saving refreshed token');
                    return this.saveToken(result).then(() => { resolve(token); });
                });
            });
        });
    }

    createToken() {
        this.debug('creating token');
        return new Promise((resolve, reject) => {
            this.oauthClient.ownerPassword.getToken(this.userCredentials, (err,result) => {
                this.debug('got new token from ownerpassword authentication');
                this.debug(result);
                if(err) {
                    console.error('Access Token Error', err.message)
                    return reject(err);
                }
                this.debug('saving new token fetched from authentication');
                return this.saveToken(result).then(() => { resolve(result) });
            });
        });
    }

    saveToken(result) {
        this.debug('saving token');
        return new Promise((resolve, reject) => {
            let createdTokenObject = this.oauthClient.accessToken.create(result);
            let tokenModelToSave = new Token();
            tokenModelToSave.access_token = createdTokenObject.token.access_token;
            tokenModelToSave.refresh_token = createdTokenObject.token.refresh_token;
            tokenModelToSave.expires_in = createdTokenObject.token.expires_in;
            tokenModelToSave.save((err) => {
                this.debug('token saved');
                if(err) {
                    console.error('Could not save token', err.message);
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }

    checkResponse(data, response) {
        this.debug('checking response');
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
        this.debug('building request uri');
        this.debug(options);
        var uri = this.apiHost + options.uri;
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

    buildAuthorizationHeader(token) {
        this.debug('building authorization header');
        return {
            headers: {'Authorization': 'Bearer ' + token.access_token}
        };
    }

    callApi(options) {
        this.debug('calling api');
        this.debug(options);
        return new Promise((resolve, reject) => {
            this.getToken().then((token) => {
                let requestUri = this.buildRequestUri(options);
                let apiMethod = options.method;
                let headers = this.buildAuthorizationHeader(token);
                this.restClient[apiMethod](requestUri, headers, (data, response) => {
                    return this.checkResponse(data, response).then((data) => { resolve (data);});
                });
            });
        });
    }

    debug(message) {
        if (!this.isDebugEnabled) {
            return;
        }
        console.log(message);
    }
    

}
