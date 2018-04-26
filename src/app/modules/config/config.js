var appModule = require('../../appModule');
var config = require('../../../config/host-config');

appModule.constant('Configuration', {
  serviceUrl: config.serviceUrl,
  oauthUrl: config.oauthUrl,
  client: {
    id: config.client.id,
    secret: config.client.secret
  }
});