var appModule = require('../../appModule');

var _myOkr
var _objective
var _objectiveList

appModule.service('objectiveService', ObjectiveService);

ObjectiveService.$inject = ['$http', 'Configuration']

function ObjectiveService($http, Configuration) {
    this.$http = $http;
    this.Configuration = Configuration;
}

ObjectiveService.prototype.getObjectives = function (filter) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'objective/me',
        params: filter
    });
};

ObjectiveService.prototype.getObjectiveById = function (id) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'objective/' + id
    });
};

ObjectiveService.prototype.getObjectivesByUser = function (id, query) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'objective/user/' + id,
        params: query
    });
};

ObjectiveService.prototype.getObjectivesByPlanning = function (query) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'objective/planning/' + query.planning,
        params: query
    });
};

ObjectiveService.prototype.getObjectivesByMainObjectives = function (id) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'objective/mainobjective/' + id
    });
};

ObjectiveService.prototype.getDiagramObjectives = function (id) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'objective/diagram'
    });
};

ObjectiveService.prototype.newObjective = function (objective) {
    return this.$http({
        method: 'POST',
        url: this.Configuration.serviceUrl + 'objective',
        data: objective
    });
};

ObjectiveService.prototype.newObjectivesToKeep = function (objectives) {
    return this.$http({
        method: 'POST',
        url: this.Configuration.serviceUrl + 'objective/objectives',
        data: objectives
    });
}

ObjectiveService.prototype.updateObjective = function (objective) {
    return this.$http({
        method: 'PATCH',
        url: this.Configuration.serviceUrl + 'objective/' + objective._id,
        data: objective
    });
};

ObjectiveService.prototype.getObjectiveListFactory = function () {
    return _objectiveList
};

ObjectiveService.prototype.setObjectiveListFactory = function (objectiveList) {
    _objectiveList = objectiveList
};

ObjectiveService.prototype.getObjectiveFactory = function () {
    return _objective
};

ObjectiveService.prototype.setObjectiveFactory = function (objective) {
    _objective = objective
};

ObjectiveService.prototype.getMyOkrFactory = function () {
    return _myOkr
};

ObjectiveService.prototype.setMyOkrFactory = function (myOkr) {
    _myOkr = myOkr
};
