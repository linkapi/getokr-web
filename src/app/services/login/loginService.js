var appModule = require('../../appModule');

appModule.service('loginService', LoginService);

var _token;

LoginService.$inject = ['$http', '$httpParamSerializer', 'Configuration', '$localStorage', '$rootScope', 'userService']

function LoginService($http, $httpParamSerializer, Configuration, $localStorage, $rootScope, userService) {
    this.$http = $http;
    this.$httpParamSerializer = $httpParamSerializer;
    this.Configuration = Configuration;
    this.$localStorage = $localStorage;
    this.$rootScope = $rootScope
    this.userService = userService

}

LoginService.prototype.login = function () {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + "user/me"
    });
};

LoginService.prototype.getIn = function (user) {
    var parameter = this.$httpParamSerializer({
        client_id: this.Configuration.client.id,
        client_secret: this.Configuration.client.secret,
        grant_type: 'password',
        username: user.username,
        password: user.password
    });

    return this.$http({
        method: 'POST',
        url: this.Configuration.oauthUrl + 'token',
        data: parameter,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'ignoreToken': true
        }
    });

};

LoginService.prototype.getTokenFactory = function () {
    if (_token)
        return _token;

    if (this.$localStorage.token)
        return this.$localStorage.token;
};

LoginService.prototype.setTokenFactory = function (token) {
    _token = token;
    this.$localStorage.token = token;
    this.$rootScope.$broadcast('logged');
};

LoginService.prototype.logoutFactory = function () {
    delete this.$localStorage.token;
    delete this.$localStorage.user;
    _token = '';
};

LoginService.prototype.isLogged = function () {
    if (_token)
        return true

    return false
};

LoginService.prototype.getUserFactory = function () {
    return this.userService.getUserFactory()
};
