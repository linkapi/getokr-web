'use strict'

var appModule = require('../../appModule')

appModule.controller('userController', UserController);

UserController.$inject = [
    '$rootScope',
    '$stateParams',
    'userService',
    'companyService',
    '$location'
]

function UserController($rootScope, $stateParams, userService, companyService, $location) {
    this.$rootScope = $rootScope
    this.$stateParams = $stateParams;
    this.userService = userService
    this.companyService = companyService
    this.searchText = ''
    this.users = []
    this.$location = $location
    this.loadView = false

    var that = this

    this.$rootScope.$on('cfpLoadingBar:completed', function (event, args) {
        that.loadView = true
    })

    this.$rootScope.$on('cfpLoadingBar:started', function (event, args) {
        that.loadView = false
    })

    this.$rootScope.$on('cfpLoadingBar:loading', function (event, args) {
        that.loadView = false
    })

    this.initialize()
}

UserController.prototype.initialize = function () {
    this.loadUsers()

}

UserController.prototype.loadUsers = function () {
    var that = this

    this.companyService.getCompanyUsers()
        .then(function (res) {
            that.users = _.forEach(res.data, function (user) {
                user.customName = user.firstName + ' ' + user.lastName
            })
            that.userService.setUsersListFactory(that.users)
        })
        .catch(function (err) {
            console.log(err)
        })
}

UserController.prototype.changeIsActive = function (user) {
    user.isActive = !user.isActive

    this.userService.editUser(user)
        .then(function (res) {

        })
        .catch(function (err) {
            console.log(err)
        })
    this.mixpanel('Clicou no botão para mudar status (Ativo / Inativo) de um usuário')
}

UserController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);

}
