'use strict'

var appModule = require('../../appModule')

appModule.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});

PlanningController.$inject = ['$rootScope', 'modalService', 'planningSessionService', 'userService'];

function PlanningController($rootScope, modalService, planningSessionService, userService) {
    this.$rootScope = $rootScope
    this.modalService = modalService
    this.planningSessionService = planningSessionService
    this.userService = userService
    this.plannings = []
    this.showEditButtons = false

    this.initialize()
}

PlanningController.prototype.initialize = function () {
    this.user = this.userService.getUserFactory()
    this.loadPlannings()
}

PlanningController.prototype.loadPlannings = function () {
    var that = this

    var query = {
        type: 'company'
    }

    that.planningSessionService.getPlannings()
        .then(function (res) {
            that.plannings = res.data
            that.planningSessionService.setPlanningListFactory(that.plannings)

            that.planningSessionService.setPlanningFactory(that.selectedPlanning)
        })
        .catch(function (err) {
            console.log(err)
        })
}

PlanningController.prototype.addPlanningSession = function () {
    this.modalService.searchModal('addPlanning');
}

PlanningController.prototype.getDate = function (date) {

    return moment(date).format('L')
}

PlanningController.prototype.getInitials = function (ownerObj) {
    var first,
        last

    first = ownerObj.firstName ? ownerObj.firstName[0].toUpperCase() : ''
    last = ownerObj.lastName ? ownerObj.lastName[0].toUpperCase() : ''

    return first + last
}

PlanningController.prototype.editPlanning = function (planning) {
    this.planningSessionService.setPlanningFactory(planning)
    this.modalService.searchModal('updatePlanning');
}

PlanningController.prototype.viewChanges = function (planning) {}

appModule.controller('planningController', PlanningController)
