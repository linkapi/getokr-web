'use strict';

var appModule = require('../appModule');

var _user;
var _usersList;
var progressBarColors;

UserFactory.$inject = ['$localStorage']

function UserFactory($localStorage) {
    this.$localStorage = $localStorage;
}

UserFactory.prototype.logout = function () {
    delete this.$localStorage.token;
    delete this.$localStorage.user;
    _user = '';
};

UserFactory.prototype.getUser = function () {
    if (_user)
        return _user;

    if (this.$localStorage.user)
        return this.$localStorage.user;

    return;
};

UserFactory.prototype.setUser = function (user) {
    this.$localStorage.user = user;
    _user = user;
};

UserFactory.prototype.getUsersList = function () {
    return _usersList;
};

UserFactory.prototype.setUsersList = function (usersList) {
    _usersList = usersList;
};

UserFactory.prototype.getProgressBarColors = function() {
    return this.progressBarColors
};

UserFactory.prototype.setProgressBarColors = function(progressBarColors) {
    this.progressBarColors = progressBarColors
};

UserFactory.makeFactory = function ($localStorage) {
    return new UserFactory($localStorage);
};

appModule.factory('userFactory', UserFactory.makeFactory);
