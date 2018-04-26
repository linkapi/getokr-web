'use strict';

var appModule = require('../appModule');

var _objective

MainFactory.$inject = ['$localStorage']

function MainFactory($localStorage) {
    this.$localStorage = $localStorage;
}

MainFactory.prototype.getObjective = function() {
    return _objective;
};

MainFactory.prototype.setObjective = function(objective) {
    _objective = objective;
};

MainFactory.makeFactory = function($localStorage) {
    return new MainFactory($localStorage);
};

appModule.factory('mainFactory', MainFactory.makeFactory);
