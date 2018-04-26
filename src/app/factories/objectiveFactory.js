'use strict'

var appModule = require('../appModule');

var _objective
var _objectiveList

ObjectiveFactory.$inject = ['$localStorage']

function ObjectiveFactory($localStorage) {
    this.$localStorage = $localStorage
}

ObjectiveFactory.prototype.getObjectiveList = function() {
    return _objectiveList
};

ObjectiveFactory.prototype.setObjectiveList = function(objectiveList) {
    _objectiveList = objectiveList
};

ObjectiveFactory.prototype.getObjective = function() {
    return _objective
};

ObjectiveFactory.prototype.setObjective = function(objective) {
    _objective = objective
};

ObjectiveFactory.makeFactory = function($localStorage) {
    return new ObjectiveFactory($localStorage)
};

appModule.factory('objectiveFactory', ObjectiveFactory.makeFactory);
