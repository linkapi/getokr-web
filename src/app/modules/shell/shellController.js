'use strict'

var appModule = require('../../appModule')
var templateHeader = require('./header.html')

ShellController.$inject = ['$rootScope', '$scope', '$state', '$location', 'userService', 'modalService', 'planningSessionService', 'objectiveService', 'loginService', '$localStorage']

function ShellController($rootScope, $scope, $state, $location, userService, modalService, planningSessionService, objectiveService, loginService, $localStorage) {
    this.$rootScope = $rootScope
    this.$scope = $scope
    this.$state = $state
    this.$location = $location
    this.userService = userService
    this.templateHeader = require('./header.html')
    this.user = userService.getUserFactory()
    this.modalService = modalService
    this.planningSessionService = planningSessionService
    this.objectiveService = objectiveService
    this.loginService = loginService
    this.$localStorage = $localStorage

    var that = this

    $rootScope.$on('logout', function (evn) {
        that.userService.logoutFactory()
        that.loginService.logoutFactory()
        that.$location.path('/login');
    })
}

ShellController.prototype.logOut = function () {
    delete this.$localStorage.planning
    delete this.$localStorage.selectedCompanyPlanning
    delete this.$localStorage.selectedPlanning
    delete this.$localStorage.users
    delete this.$localStorage.tab
    delete this.$localStorage.filterTab
    delete this.$localStorage.filter
    this.planningSessionService.setPlanningFactory()
    this.$rootScope.$broadcast('logout')
};

ShellController.prototype.isCurrentState = function (state) {
    return this.$state.includes(state)
}

ShellController.prototype.goToProfile = function () {
    this.mixpanel('Clicou na tab Meu perfil')

    this.$location.path('/profile/' + this.user._id);
}

ShellController.prototype.isIntoProfile = function () {
    if (this.$location.path() == '/profile/' + this.user._id)
        return true

    return false
}

ShellController.prototype.isLoggedOn = function () {
    var user = this.userService.getUserFactory()
    return user ? true : false
};

ShellController.prototype.getLocationPath = function () {
    return this.$location.path();
};

ShellController.prototype.addSession = function () {
    this.modalService.searchModal('addPlanning');
}

ShellController.prototype.addObjective = function () {
    this.planningSessionService.setPlanningFactory(this.selectedPlanning)
    this.objectiveService.setObjectiveFactory()
    this.modalService.searchModal('addObjective');
}

ShellController.prototype.changePassword = function () {
    this.modalService.searchModal('changePassword');
}

ShellController.prototype.customizeGetokr = function () {
    this.modalService.searchModal('customizeGetokr');
}

ShellController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);
}

appModule.controller('shellController', ShellController)
