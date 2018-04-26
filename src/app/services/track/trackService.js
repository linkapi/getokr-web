var appModule = require('../../appModule');

appModule.service('trackService', TrackService);

TrackService.$inject = ['$http', 'Configuration']

function TrackService($http, Configuration) {
  this.$http = $http;
  this.Configuration = Configuration;
}

TrackService.prototype.getCompanyTracks = function(query) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'track/' + query.company,
        params: query
    });
};