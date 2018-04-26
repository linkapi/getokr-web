'use strict'

var appModule = require('../../appModule')

var _user
var _usersList

appModule.service('userService', UserService)

function UserService($http, Configuration, $localStorage) {
    this.urlBase = Configuration.serviceUrl
    this.oauthUrlBase = Configuration.oauthUrl
    this.$http = $http
    this.$localStorage = $localStorage
}

UserService.prototype.addUser = function (user) {
    var newUser;

    newUser = {
        username: user.username,
        insertDate: new Date(),
        updateDate: new Date(),
        isActive: true,
        company: this.getUserFactory().company,
        isAdministrator: user.isAdministrator ? user.isAdministrator : false,
        canCreate: user.canCreate ? user.canCreate : false,
        oauthClients: this.getUserFactory().oauthClients,
        companies: this.getUserFactory().company,
    }

    return this.$http({
        method: 'POST',
        url: this.urlBase + 'user',
        data: newUser
    });

}

UserService.prototype.changePassword = function (data) {

    return this.$http.patch(this.urlBase + 'user/' + data.user + '/password', data);
}

UserService.prototype.getUserHash = function (hash) {
    return this.$http.get(this.oauthUrlBase + 'hash/' + hash);
}

UserService.prototype.getUserById = function (id) {
    return this.$http.get(this.urlBase + 'user/' + id, {
        id: id
    });
}

UserService.prototype.editUser = function (user) {
    return this.$http({
        method: 'PATCH',
        url: this.urlBase + 'user/' + user._id,
        data: user
    });
}

UserService.prototype.updateUserByHash = function (newUser) {
    return this.$http({
        method: 'PATCH',
        url: this.oauthUrlBase + 'enableUser/' + newUser.hash,
        data: newUser
    });
}

UserService.prototype.logoutFactory = function () {
    delete this.$localStorage.token;
    delete this.$localStorage.user;
    _user = '';
};

UserService.prototype.getUserFactory = function () {
    if (_user)
        return _user;

    if (this.$localStorage.user)
        return this.$localStorage.user;

    return;
};

UserService.prototype.setUserFactory = function (user) {
    if (user.companies.length > 0)
        user.company = user.company._id

    this.$localStorage.user = user;
    _user = user;
};

UserService.prototype.getUsersListFactory = function () {
    return _usersList;
};

UserService.prototype.isLogged = function () {
    if (_user)
        return true

    return false
};

UserService.prototype.setUsersListFactory = function (usersList) {
    _usersList = usersList;
};
