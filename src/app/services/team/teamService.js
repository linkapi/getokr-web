var appModule = require('../../appModule');

appModule.service('teamService', TeamService);

TeamService.$inject = ['$http', 'Configuration']

function TeamService($http, Configuration) {
    this.$http = $http;
    this.Configuration = Configuration;
}

TeamService.prototype.getTeams = function (company) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'team/' + company
    });
};

TeamService.prototype.newTeam = function (team) {
    return this.$http({
        method: 'POST',
        url: this.Configuration.serviceUrl + 'team',
        data: team
    });
};

TeamService.prototype.updateTeam = function (team) {
    return this.$http({
        method: 'PATCH',
        url: this.Configuration.serviceUrl + 'team/' + team._id,
        data: team
    });
};

TeamService.prototype.archivateTeam = function (team) {
    return this.$http({
        method: 'DELETE',
        url: this.Configuration.serviceUrl + 'team/' + team._id,
        data: team
    });
};