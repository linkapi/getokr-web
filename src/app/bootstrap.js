'use strict';

require('./vendor')();

var appModule = require('./appModule');
require('./injectables')();

angular.element(document).ready(function () {
    angular.bootstrap(document, [appModule.name], {});
});
