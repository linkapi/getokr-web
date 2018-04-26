'use strict';

var appModule = require('../appModule');

var _token;

LoginFactory.$inject = ['$localStorage', '$rootScope']

function LoginFactory($localStorage, $rootScope) {
    this.$localStorage = $localStorage;
    this.$rootScope = $rootScope;
}

LoginFactory.prototype.getToken = function () {
    if (_token)
        return _token;

    if (this.$localStorage.token)
        return this.$localStorage.token;
};

LoginFactory.prototype.setToken = function (token) {
    _token = token;
    this.$localStorage.token = token;
    this.$rootScope.$broadcast('logged');
};


LoginFactory.prototype.logout = function () {
    delete this.$localStorage.token;
    _token = '';
    this.$rootScope.$broadcast('logout');
};

LoginFactory.prototype.getUser = function () {
    if (this.$localStorage.user)
        return this.$localStorage.user;

    return;
};

LoginFactory.makeFactory = function ($localStorage, $rootScope) {
    return new LoginFactory($localStorage, $rootScope);
};

appModule.factory('loginFactory', LoginFactory.makeFactory);
