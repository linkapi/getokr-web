var appModule = require('../../appModule');

appModule.service('keyResultService', KeyResultService);

var _keyResult,
    _keyResults

KeyResultService.$inject = ['$http', 'Configuration']

function KeyResultService($http, Configuration) {
    this.$http = $http;
    this.Configuration = Configuration;
}

KeyResultService.prototype.getCompanyUsers = function () {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'keyresult'
    });
}

KeyResultService.prototype.newKeyResult = function (keyResult) {
    return this.$http({
        method: 'POST',
        url: this.Configuration.serviceUrl + 'keyresult',
        data: keyResult
    });
}

KeyResultService.prototype.updateKeyResult = function (keyResult) {
    return this.$http({
        method: 'PATCH',
        url: this.Configuration.serviceUrl + 'keyresult/' + keyResult._id,
        data: keyResult
    });
};

KeyResultService.prototype.getKeyResultFactory = function () {
    return _keyResult
};

KeyResultService.prototype.setKeyResultFactory = function (keyResult) {
    _keyResult = keyResult
};

KeyResultService.prototype.getKeyResultListFactory = function () {
    return _keyResults
};

KeyResultService.prototype.setKeyResultListFactory = function (keyResults) {
    _keyResults = keyResults
};
