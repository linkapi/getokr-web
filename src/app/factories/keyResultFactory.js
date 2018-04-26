'use strict';

var appModule = require('../appModule')

var _keyResult

KeyResult.$inject = ['$localStorage']

function KeyResult($localStorage) {
    this.$localStorage = $localStorage
}

KeyResult.prototype.getKeyResult = function() {
    return _keyResult
};

KeyResult.prototype.setKeyResult = function(keyResult) {
    _keyResult = keyResult
};

KeyResult.makeFactory = function($localStorage) {
    return new KeyResult($localStorage)
};

appModule.factory('keyResultFactory', KeyResult.makeFactory)
