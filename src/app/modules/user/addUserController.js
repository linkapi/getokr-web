'use strict'

var appModule = require('../../appModule')

appModule.controller('addUserController', AddUserController);

AddUserController.$inject = [
    '$stateParams',
    'userService',
    'companyService',
    '$location'
]

function AddUserController($stateParams, userService, companyService, $location) {
    this.$stateParams = $stateParams;
    this.userService = userService
    this.companyService = companyService
    this.searchText = ''
    this.user = []
    this.currentUser = {}
    this.userEdit = {}
    this.addUserAdministrator = true
    this.addUserManager = true
    this.editUserAdministrator = true
    this.editUserManager = true
    this.$location = $location

    this.initialize()
}

AddUserController.prototype.initialize = function () {
    document.getElementById("Normal").checked = true;

    if (this.$stateParams.id)
        this.findUserToEdit()
}

AddUserController.prototype.validateNewUser = function () {
    var that = this
    if (!that.user.username)
        return true

    return false
}

AddUserController.prototype.validateEditUser = function () {
    var that = this
    if (!that.userEdit.firstName)
        return true

    return false
}

AddUserController.prototype.addUser = function () {
    var that = this

    if (!that.addUserAdministrator) {
        that.user.isAdministrator = true;
        that.user.canCreate = true;
    } else if (!that.addUserManager) {
        that.user.isAdministrator = false;
        that.user.canCreate = true;
    } else {
        that.user.isAdministrator = false;
        that.user.canCreate = false;
    }

    that.userService.addUser(that.user)
        .then(function (res) {
            that.$location.path('/users')
            swal(
                "Usuário criado!",
                "Um e-mail de confirmação foi enviado para o novo usuário.",
                "success"
            );
        })
        .catch(function (err) {
            console.log(err)
        })
    this.mixpanel('Criou um Usuário')
}

AddUserController.prototype.findUserToEdit = function () {
    var that = this

    that.userService.getUserById(that.$stateParams.id)
        .then(function (res) {
            that.userEdit = res.data
        })
        .catch(function (err) {
            console.log(err)
        })
}

AddUserController.prototype.editUser = function () {
    var that = this

    if (!that.editUserAdministrator) {
        that.userEdit.isAdministrator = true;
        that.userEdit.canCreate = true;
    } else if (!that.editUserManager) {
        that.userEdit.isAdministrator = false;
        that.userEdit.canCreate = true;
    } else {
        that.userEdit.isAdministrator = false;
        that.userEdit.canCreate = false;
    }

    that.userService.editUser(that.userEdit)
        .then(function (res) {
            that.$location.path('/users')
            swal(
                "Usuário editado!",
                "O usuário foi alterado com sucesso.",
                "success"
            );
        })
        .catch(function (err) {
            console.log(err)
        })
    this.mixpanel('Editou um usuário')
}

AddUserController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);

}
