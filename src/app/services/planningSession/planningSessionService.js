var appModule = require('../../appModule');

appModule.service('planningSessionService', PlanningSessionService);

var _planning
var _planningList
var _planningType
var _planningHierarchy
var _companyPlanning


PlanningSessionService.$inject = ['$http', 'Configuration']

function PlanningSessionService($http, Configuration) {
    this.$http = $http;
    this.Configuration = Configuration;
}

PlanningSessionService.prototype.getPlannings = function () {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'planning/me'
    });
};

PlanningSessionService.prototype.getPlanningsByType = function (query) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'planning/me',
        params: query
    });
};

PlanningSessionService.prototype.getPlanningById = function (id) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'planning/' + id
    });
};

PlanningSessionService.prototype.getPlanningByIdAndHierarchy = function (id, query) {
    query.planning = id

    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'planning/' + id,
        params: query
    });
};

PlanningSessionService.prototype.newPlanning = function (planning) {
    return this.$http({
        method: 'POST',
        url: this.Configuration.serviceUrl + 'planning',
        data: planning
    });
};

PlanningSessionService.prototype.updatePlanning = function (planning, childPlanning) {
    if (childPlanning)
        return this.$http({
            method: 'PATCH',
            url: this.Configuration.serviceUrl + 'planning/' + planning._id,
            data: {
                planning: planning,
                childPlanning: childPlanning
            }
        });
    return this.$http({
        method: 'PATCH',
        url: this.Configuration.serviceUrl + 'planning/' + planning._id,
        data: planning
    });
};

PlanningSessionService.prototype.archivatePlanning = function (planning) {
    return this.$http({
        method: 'DELETE',
        url: this.Configuration.serviceUrl + 'planning/' + planning._id,
        data: planning
    });
};

PlanningSessionService.prototype.getPlanningHierarchyFactory = function () {
    return _planningHierarchy
};

PlanningSessionService.prototype.setPlanningHierarchyFactory = function (planningHierarchy) {
    _planningHierarchy = planningHierarchy
};

PlanningSessionService.prototype.getPlanningTypeFactory = function () {
    return _planningType
};

PlanningSessionService.prototype.setPlanningTypeFactory = function (planningType) {
    _planningType = planningType
};

PlanningSessionService.prototype.getPlanningListFactory = function () {
    return _planningList
};

PlanningSessionService.prototype.setPlanningListFactory = function (planningList) {
    _planningList = planningList
};

PlanningSessionService.prototype.getPlanningFactory = function () {
    return _planning
};

PlanningSessionService.prototype.setPlanningFactory = function (planning) {
    _planning = planning
};

PlanningSessionService.prototype.getCompanyPlanningFactory = function () {
    return _companyPlanning
};

PlanningSessionService.prototype.setCompanyPlanningFactory = function (companyPlanning) {
    _companyPlanning = companyPlanning
};
