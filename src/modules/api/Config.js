module.exports = class Config {

    constructor() {
        this.data = {
            credentials:{
                client: {
                    id: process.env.JAMB_API_CLIENT_ID,
                    secret: process.env.JAMB_API_CLIENT_SECRET
                },
                user: {
                    username: process.env.JAMB_API_USERNAME,
                    password: process.env.JAMB_API_PASSWORD
                }
            },
            api: {
                host: process.env.JAMB_API_HOST,
                tokenPath: '/oauth2/token'
            }
        }
    }

    getClientCredentials() {
        return {
            client: this.data.credentials.client,
            auth: {
                tokenHost: this.data.api.host,
                tokenPath: this.data.api.tokenPath
            }
        };
    }

    getUserCredentials() {
        return this.data.credentials.user;
    }

    getApiHost() {
        return this.data.api.host;
    }

}