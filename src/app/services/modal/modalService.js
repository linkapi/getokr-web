var appModule = require('../../appModule'),
    templateObjective = require("../../modules/modal/objective/objective.html"),
    templatePlanning = require("../../modules/modal/planningSession/planningSession.html"),
    templateKeyResult = require("../../modules/modal/keyResult/keyResult.html"),
    templateChangePassword = require("../../modules/modal/resetPassword/resetPassword.html"),
    templateCustomizeGetokr = require("../../modules/modal/customizeGetokr/customizeGetokr.html"),
    templateCheckIn = require("../../modules/modal/checkIn/checkIn.html"),
    templateKeyResultList = require("../../modules/modal/keyResultList/keyResultList.html"),
    templateCheckInGraphs = require("../../modules/modal/checkInGraph/checkIngraph.html"),
    templateTeamModal = require("../../modules/modal/team/team.html"),
    templateCompanies = require("../../modules/modal/companies/companies.html")

appModule.service('modalService', ModalService);

ModalService.$inject = ['$uibModal']

function ModalService($uibModal) {
    this.$uibModal = $uibModal;
}

ModalService.prototype.searchModal = function (type, obj) {
    var template,
        controller;

    if (type === 'addPlanning' || type === 'updatePlanning') {
        template = templatePlanning
        controller = 'planningSessionController as vm'
        size = 'md'
        this.openModal(template, controller, size, obj)

    } else if (type === 'addObjective' || type === 'editObjective') {
        template = templateObjective
        controller = 'objectiveController as vm'
        size = 'md'
        this.openModal(template, controller, size, obj)

    } else if (type === 'addKeyResult' || type === 'updateKeyResult') {
        template = templateKeyResult;
        controller = 'keyResultController as vm';
        size = 'sm'
        this.openModal(template, controller, size, obj)
    } else if (type === 'changePassword') {
        template = templateChangePassword;
        controller = 'resetPasswordController as vm';
        size = 'md'
        this.openModal(template, controller, size)
    } else if (type === 'customizeGetokr') {
        template = templateCustomizeGetokr;
        controller = 'customizeGetokrController as vm';
        size = 'md'
        this.openModal(template, controller, size)
    } else if (type === 'checkInGraph') {
        template = templateCheckInGraphs;
        controller = 'checkInGraphController as vm';
        size = 'lg'
        this.openModal(template, controller, size)
    } else if (type === 'addCheckIn') {
        template = templateCheckIn;
        controller = 'checkInController as vm';
        size = 'lg'
        this.openModal(template, controller, size, obj)
    } else if (type === 'keyResultList') {
        template = templateKeyResultList;
        controller = 'keyResultListController as vm';
        size = 'lg'
        this.openModal(template, controller, size, obj)
    } else if (type === 'addTeam' || type === 'editTeam') {
        template = templateTeamModal;
        controller = 'teamModalController as vm';
        size = 'sm'
        this.openModal(template, controller, size, obj)
    } else if (type === 'selectCompanies') {
        template = templateCompanies;
        controller = 'companiesController as vm';
        size = 'lg'
        this.openModal(template, controller, size, obj)
    }
}

ModalService.prototype.openModal = function (template, controller, sz, obj) {
    if (obj && !obj.name && !obj.firstName && !obj.companyPlanning && !obj.tacticalCiclesToKeep) {
        this.$uibModal.open({
            templateUrl: template,
            controller: controller,
            size: sz,
            resolve: {
                items: function () {
                    return obj._id
                }
            }
        });
    } else if (obj && obj.firstName) {
        this.$uibModal.open({
            templateUrl: template,
            controller: controller,
            size: sz,
            resolve: {
                items: function () {
                    return obj
                }
            }
        });
    } else if (obj && obj.name) {
        this.$uibModal.open({
            templateUrl: template,
            controller: controller,
            size: sz,
            resolve: {
                items: function () {
                    return obj
                }
            }
        });
    } else if (obj && obj.companyPlanning) {
        this.$uibModal.open({
            templateUrl: template,
            controller: controller,
            size: sz,
            resolve: {
                items: function () {
                    return obj
                }
            }
        });
    } else if (obj && obj.tacticalCiclesToKeep.length) {
        this.$uibModal.open({
            templateUrl: template,
            controller: controller,
            size: sz,
            resolve: {
                items: function () {
                    return obj
                }
            }
        });
    } else {
        this.$uibModal.open({
            templateUrl: template,
            controller: controller,
            size: sz,
            resolve: {
                items: function () {
                    return
                }
            }
        });
    }


};
