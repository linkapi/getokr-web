'use strict'

var appModule = require('../appModule');

var _planning
var _planningList
var _planningType
var _planningHierarchy

PlanningSessionFactory.$inject = ['$localStorage']

function PlanningSessionFactory($localStorage) {
    this.$localStorage = $localStorage
}

PlanningSessionFactory.prototype.getPlanningHierarchy = function() {
    return _planningHierarchy
};

PlanningSessionFactory.prototype.setPlanningHierarchy = function(planningHierarchy) {
    _planningHierarchy = planningHierarchy
};

PlanningSessionFactory.prototype.getPlanningType = function() {
    return _planningType
};

PlanningSessionFactory.prototype.setPlanningType = function(planningType) {
    _planningType = planningType
};

PlanningSessionFactory.prototype.getPlanningList = function() {
    return _planningList
};

PlanningSessionFactory.prototype.setPlanningList = function(planningList) {
    _planningList = planningList
};

PlanningSessionFactory.prototype.getPlanning = function() {
    return _planning
};

PlanningSessionFactory.prototype.setPlanning = function(planning) {
    _planning = planning
};

PlanningSessionFactory.makeFactory = function($localStorage) {
    return new PlanningSessionFactory($localStorage)
};

appModule.factory('planningSessionFactory', PlanningSessionFactory.makeFactory);
