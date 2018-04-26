var tagTemplate = require('./modules/component/templates/tag.html');
var tagsTemplate = require('./modules/component/templates/tags.html');

module.exports = angular.module('getokr', [
        'ui.router',
        'ui.bootstrap',
        'ngStorage',
        'ngLodash',
        'angularMoment',
        'sn.title',
        'ngDraggable',
        'xeditable',
        'checklist-model',
        'ngRoute',
        'angular.filter',
        'ui.select',
        'ui.utils.masks',
        'ngSanitize',
        'angular-loading-bar',
        'infinite-scroll',
        'decipher.tags',
        'ui.bootstrap.typeahead',
        'ui.bootstrap.collapse',
        'rt.popup',
        'ui.mask',
        'angular-google-analytics',
        'cgNotify',
        'ui.sortable',
        'btorfs.multiselect',
        'ngDialog',
        'ngFileUpload'
    ])
    .config(['uiSelectConfig', function (uiSelectConfig) {
        uiSelectConfig.theme = 'select2';
    }])
    .config(['$stateProvider', '$urlRouterProvider', '$compileProvider', function ($stateProvider, $urlRouterProvider, $compileProvider) {
        // Optimize load start with remove binding information inside the DOM element
        $compileProvider.debugInfoEnabled(true);
        // Set default state
        $urlRouterProvider.otherwise("/login");
    }])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])
    .run(['editableOptions', function (editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }])
    .run(['$rootScope', function ($rootScope) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.$broadcast('popover-close-all');
        });
    }])
    .run(['$rootScope', '$state', function ($rootScope, $state) {
        $rootScope.$state = $state;
    }])
    .config(['decipherTagsOptions', function (decipherTagsOptions) {
        decipherTagsOptions.templateUrl = tagsTemplate;
        decipherTagsOptions.tagTemplateUrl = tagTemplate;
    }])
    .run(['amMoment', function (amMoment) {
        amMoment.changeLocale('pt-br');
    }]);
