'use strict'

var appModule = require('../../../appModule');

appModule.controller('teamModalController', TeamModalController);

TeamModalController.$inject = ['$uibModalInstance', '$localStorage', 'userService', 'teamService', 'items', '$window']

function TeamModalController($uibModalInstance, $localStorage, userService, teamService, items, $window) {
    this.$uibModalInstance = $uibModalInstance
    this.$localStorage = $localStorage
    this.$window = $window
    this.userService = userService
    this.teamService = teamService

    this.team = {}
    this.user = this.userService.getUserFactory()
    this.items = items

    this.initialize()
}

TeamModalController.prototype.initialize = function () {
    if (this.items) {
        this.team = angular.copy(this.items)
    }

    this.loadUsers();

}

TeamModalController.prototype.checkModalInputs = function () {
    if (!this.team.name || !this.team.members)
        return true

    if (this.team.leader != '' && this.team.leader != undefined) {
        if (this.team.members.length == 1 && this.team.members[0]._id == this.team.leader)
            return true
    } else {
        if (this.team.members.length == 1 && this.team.members[0]._id == this.user._id)
            return true
    }

    return false
}

TeamModalController.prototype.save = function () {
    this.mixpanel('Salvou o time')

    if (this.items)
        return this.editTeam()

    return this.newTeam()
}

TeamModalController.prototype.editTeam = function () {
    var that = this

    this.teamService.updateTeam(this.team)
        .then(function (res) {
            that.team = res.data
            that.$window.location.reload();
        })
        .catch(function (err) {
            console.log(err)
        })
}

TeamModalController.prototype.newTeam = function () {
    var that = this
    if (!this.team.leader)
        this.team.leader = this.user._id

    this.team.company = this.user.company

    this.teamService.newTeam(this.team)
        .then(function (res) {
            that.team = res.data
            that.mixpanel('Criou o time com sucesso')
            that.closeModal()
        })
        .catch(function (err) {
            console.log(err)
        })
}

TeamModalController.prototype.loadUsers = function () {
    if (this.userService.getUsersListFactory()) {
        this.users = this.userService.getUsersListFactory()
        this.$localStorage.users = this.users
    } else
        this.users = this.$localStorage.users
}

TeamModalController.prototype.closeModal = function () {
    this.$uibModalInstance.close(this.team)
};

TeamModalController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);
}
