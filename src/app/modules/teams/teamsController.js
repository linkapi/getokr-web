'use strict'

var appModule = require('../../appModule'),
    _ = require('lodash'),
    templateTeamModal = require("../../modules/modal/team/team.html")

appModule.controller('teamsController', TeamsController)

TeamsController.$inject = ['userService', 'teamService', 'modalService', '$uibModal'];

function TeamsController(userService, teamService, modalService, $uibModal) {
    this.userService = userService
    this.teamService = teamService
    this.modalService = modalService

    this.$uibModal = $uibModal

    this.user = this.userService.getUserFactory()

    this.initialize()
}

TeamsController.prototype.initialize = function () {
    this.loadTeams()
}

TeamsController.prototype.loadTeams = function () {
    var that = this
    this.teamService.getTeams(this.user.company)
        .then(function (res) {
            that.teams = res.data
        })
        .catch(function (err) {
            console.log(err)
        })
}

TeamsController.prototype.getInitials = function (member) {
    var first,
        last

    first = member.firstName ? member.firstName[0].toUpperCase() : ''
    last = member.lastName ? member.lastName[0].toUpperCase() : ''

    return first + last
}

TeamsController.prototype.newTeam = function () {
    var that = this,
        modalInstance = this.$uibModal.open({
            templateUrl: templateTeamModal,
            controller: 'teamModalController as vm',
            size: 'sm',
            resolve: {
                items: function () {
                    return
                }
            }
        });

    modalInstance.result
        .then(function (res) {
            that.teams.push(res)
        })
        .catch(function (err) {
            console.log(err);
        });
}

TeamsController.prototype.editTeam = function (team) {
    var that = this,
        modalInstance = this.$uibModal.open({
            templateUrl: templateTeamModal,
            controller: 'teamModalController as vm',
            size: 'sm',
            resolve: {
                items: function () {
                    return team
                }
            }
        });

    modalInstance.result
        .then(function (res) {})
        .catch(function (err) {
            console.log(err);
        });
}

TeamsController.prototype.archivateTeam = function (team) {
    var that = this
    swal({
            title: "Você tem certeza?",
            text: "Após arquivado o time não será mais visualizado!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Sim, tenho certeza!",
            cancelButtonText: "Não, cancelar!",
            closeOnConfirm: false,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                that.teamService.archivateTeam(team)
                    .then(function (res) {
                        _.forEach(that.teams, function (t) {
                            if (t._id == team._id)
                                t.active = false
                        })
                        swal("Arquivado!", "O time foi arquivado.", "success");
                        that.loadTeams()
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        });
    this.mixpanel('Clicou no ícone para arquivar time')
}

TeamsController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);
}
