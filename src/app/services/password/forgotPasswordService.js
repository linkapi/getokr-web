var appModule = require('../../appModule');

appModule.service('forgotPasswordService', ForgotPasswordService);

ForgotPasswordService.$inject = ['$http', 'Configuration', '$httpParamSerializer']

function ForgotPasswordService($http, Configuration, $httpParamSerializer) {
    this.$http = $http;
    this.Configuration = Configuration;
    this.$httpParamSerializer = $httpParamSerializer
    this.url = this.Configuration.oauthUrl + 'password';
}

ForgotPasswordService.prototype.sendResetLink = function (email) {
    var data = { email: email };
    return this.$http.patch(this.url + '/recovery', data);
}

ForgotPasswordService.prototype.changePassword = function (token, password) {
    var data = {
        token: token,
        password: password
    };
    return this.$http.patch(this.url, data);
}