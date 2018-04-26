var appModule = require('../../appModule');

appModule.service('mainService', MainService);

var _objective

MainService.$inject = ['$http', 'Configuration', '$localStorage']

function MainService($http, Configuration, $localStorage) {
  this.$http = $http;
  this.Configuration = Configuration;
}

MainService.prototype.getKeyResults = function(id) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'objective/' + id
    });
};

MainService.prototype.delete = function(objective) {
    return this.$http({
        method: 'DELETE',
        url: this.Configuration.serviceUrl + 'objective/' + objective._id
    });
};

MainService.prototype.deleteKeyResult = function(key) {
    return this.$http({
        method: 'DELETE',
        url: this.Configuration.serviceUrl + 'keyresult/' + key._id
    });
};

MainService.prototype.getObjective = function() {
    return _objective;
};

MainService.prototype.setObjective = function(objective) {
    _objective = objective;
};