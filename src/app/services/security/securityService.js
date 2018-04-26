'use strict'

var appModule = require('../../appModule');

appModule.service('securityService', SecurityService);

function SecurityService($localStorage, $rootScope) {
    this.$localStorage = $localStorage
    this.$rootScope = $rootScope
}

SecurityService.prototype.getToken = function () {
    return this.$localStorage.token
}

SecurityService.prototype.isLoggedOn = function () {
    if (this.$localStorage.token && this.$localStorage.user)
        return true

    return false
}

SecurityService.prototype.logout = function () {
    this.$rootScope.$broadcast('logout')
}
