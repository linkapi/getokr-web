'use strict'

var appModule = require('../../../appModule');

appModule.controller('customizeGetokrController', CustomizeGetokrController);

CustomizeGetokrController.$inject = ['$uibModalInstance', 'userService', 'companyService']

function CustomizeGetokrController($uibModalInstance, userService, companyService) {
    this.$uibModalInstance = $uibModalInstance;
    this.userService = userService
    this.companyService = companyService
    this.stepColors = [
        'green',
        'yellow',
        'red',
        'blue',
        'teal',
        'gray'
    ];
    this.intervals = [
        0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
    ]
    this.begin = 0
    this.end = 100
    this.progressBar = []
    this.lastColor

    this.initialize()
}

CustomizeGetokrController.prototype.initialize = function() {
    var that = this

    that.user = that.userService.getUserFactory()
    that.companyService.findCompanyById(that.user.company)
        .then(function(res){
            that.company = res.data            
        })
        .catch(function(err){
            console.log(err)
        })
};

CustomizeGetokrController.prototype.closeModal = function() {
    var that = this
    that.$uibModalInstance.close();
};

CustomizeGetokrController.prototype.validateIntervals = function() {
    var that = this

    if (that.progressBarColors.firstIntervalEnd == 100 || that.progressBarColors.secondIntervalEnd)
        return false

    return true
};

CustomizeGetokrController.prototype.save = function() {
    var that = this

    that.progressBar[0].begin = that.begin

    if (that.progressBar[0].end < 100) {
        that.progressBar[1].begin = that.progressBar[0].end

        if (that.progressBar[1].end < 100) {
            that.progressBar[2] = {}
            that.progressBar[2].begin = that.progressBar[1].end
            that.progressBar[2].end = that.end
            that.progressBar[2].color = that.lastColor
        }
    }

    if (!this.company.customize)
        this.company.customize = {
            progressBar: that.progressBar
        }
    else
        this.company.customize.progressBar = that.progressBar

    that.companyService.editCompany(this.company)
        .then(function(res) {
            that.companyService.setCompanyFactory(that.company)
            that.$uibModalInstance.close();
        })
        .catch(function(err) {
            console.log(err)
        })

};

CustomizeGetokrController.prototype.validateCustomize = function() {
    var that = this
    if (!that.progressBar[0])
        return true

    if (!that.progressBar[1] && that.progressBar[0].end != 100)
        return true

    if (!that.lastColor && that.progressBar[0].end != 100) {
        if (that.progressBar[1].end != 100)
            return true
    }

    if (that.progressBar[0]) {
        if (!that.progressBar[0].color)
            return true
    }

    if (that.progressBar[1]) {
        if (!that.progressBar[1].color)
            return true
    }

    return false

}

CustomizeGetokrController.prototype.mixpanel = function(msg) {
    mixpanel.track(msg);

}