var appModule = require('../../appModule');

appModule.service('checkInService', CheckInService);

CheckInService.$inject = ['$http', 'Configuration']

function CheckInService($http, Configuration) {
  this.$http = $http;
  this.Configuration = Configuration;
}

CheckInService.prototype.getCompanyCheckIns = function(query) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'checkin/company/' + query.company,
        params: query
    });
};