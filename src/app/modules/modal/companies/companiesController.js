'use strict'

var appModule = require('../../../appModule');

appModule.controller('companiesController', CompaniesController);

CompaniesController.$inject = ['$uibModalInstance', 'userService', '$window', 'items', '$location', 'companyService', '$localStorage']

function CompaniesController($uibModalInstance, userService, $window, items, $location, companyService, $localStorage) {
    this.$uibModalInstance = $uibModalInstance
    this.userService = userService
    this.$window = $window
    this.items = items
    this.$location = $location
    this.companyService = companyService
    this.$localStorage = $localStorage
    this.data = []
    this.loaded = false

    this.initialize()

}

CompaniesController.prototype.initialize = function () {}

CompaniesController.prototype.selectCompanies = function (company) {
    var that = this
    this.items.company = company
    this.items.companySelected = true
    this.userService.editUser(this.items)
        .then(function (res) {
            that.closeModal()
        })

        .catch(function (err) {
            console.log(err);
        });

}

CompaniesController.prototype.closeModal = function () {
    this.$uibModalInstance.close()
};
