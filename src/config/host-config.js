'use strict'

var serviceUrl,
    oauthUrl

if (DEBUG) {
    serviceUrl = 'http://localhost:3000/api/';
    oauthUrl = 'http://localhost:3000/oauth/';
} else {
    serviceUrl = process.env.SERVICE_URL || 'http://54.208.140.150:3000/api/';
    oauthUrl = process.env.OAUTH || 'http://54.208.140.150:3000/oauth/';
}

// HOMOLOG
// serviceUrl = 'http://34.224.30.218:3000/api/';
// oauthUrl = 'http://34.224.30.218:3000/oauth/token ';


var client = {
    id: process.env.CLIENT_ID_CONFIG || 'site',
    secret: process.env.CLIENT_SECRET_CONFIG || 'site@password'
};

module.exports = {
    serviceUrl: serviceUrl,
    oauthUrl: oauthUrl,
    client: client
};
