/*! angular-title - v0.1.2 - 2015-10-09 */
"use strict";
/**
 * Angular Title dyamically updates the document title when navigating views
 * defined in `ngRoute`'s `$routeProvider`. Simply define the title of the
 * page in your `$routeProvider` config using the `title` key.
 *
 * If you place the name of the site inside the `title` element the directive
 * will append this string to the end of the title on each page e.g.
 * `<title>My Site Name</title>` would become `pageone - My Site Name`. The
 * original string is also used as a fallback if the title attribute for a
 * route has not been defined. In that case the title for that route would be
 * `My Site Name`.
 *
 * @example
    $routeProvider
        .when("/pageone", {
            controller: "pageoneCtrl"
            title: "pageone",
            templateUrl: "partials/pageone.html"
        })
        .when("/pagetwo", {
            controller: "pagetwoCtrl"
            title: "pagetwo",
            templateUrl: "partials/pagetwo.html"
        })
 * @main   sn.title
 * @module sn.title
 * @author SOON_
 */
angular.module("sn.title", [])
/**
 * Title text to display when $routeChangeError
 * event occurs.
 * @constant
 * @property ROUTE_CHANGE_ERROR_TITLE
 * @type {String}
 */
.constant("ROUTE_CHANGE_ERROR_TITLE", "Page Error")
/**
 * @constant
 * @property EVENTS
 * @type {Object}
 */
.constant("EVENTS", {
    SET_TITLE: "sn.title:setTitle",
    ROUTE_CHANGE_SUCCESS: "$routeChangeSuccess",
    ROUTE_CHANGE_ERROR: "$routeChangeError",
})
/**
 * Title element directive which updates it's content to
 * update the page title. Place the name of you site inside
 * the directive and it will be appended to the end of every
 * page title. eg. Page Title - My Site Name
 * @example
     <title>My Site Name</title>
 * @class  title
 * @module sn.title
 * @author SOON_
 */
.directive("title", [
    "$rootScope",
    "snTitle",
    "EVENTS",
    "ROUTE_CHANGE_ERROR_TITLE",
    /**
     * @constructor
     * @param {Service} $rootScope
     * @param {Service} snTitle
     * @param {String}  EVENTS
     * @param {String}  ROUTE_CHANGE_ERROR_TITLE
     */
    function ($rootScope, snTitle, EVENTS, ROUTE_CHANGE_ERROR_TITLE) {
        return {
            restrict: "E",
            scope: {
                updateOnPageChange: "="
            },
            link: function ($scope, $element) {

                /**
                 * The name of the site. We use this to append to all page titles.
                 * We use various sources to get the site title, here is the list
                 * in order of priority:
                 *   1. First attempt to get the site title from snTitle service
                 *   2. Fallback to text inside <title> element for site title
                 *   3. Set title as undefined
                 * @property siteTitle
                 * @type {String}
                 * @example
                    "My Site Name"
                 */
                var siteTitle =
                    (snTitle.getSiteTitle() && snTitle.getSiteTitle().length > 0) ?
                    snTitle.getSiteTitle() :
                    ($element.html().length > 0 ? $element.html() : undefined) ;

                /**
                 * If true will update the page title on every route change.
                 * This is useful if updating the page title manually to disable
                 * updates on route change.
                 * @property updateOnPageChange
                 * @type     {Boolean}
                 * @default  true
                 */
                var updateOnPageChange = ($scope.updateOnPageChange === false) ? false : true;

                /**
                 * Update the content of the title element to the value
                 * of the title key in the object of the current route
                 * @method setTitle
                 * @param  {Event}  $event    Angular event object
                 * @param  {String} pageTitle Value to set the document title to
                 */
                var setTitle = function setTitle($event, pageTitle){

                    // route title & site title
                    if (pageTitle && siteTitle){
                        $element.html(pageTitle + " - " + siteTitle);

                    // route title only
                    } else if (pageTitle){
                        $element.html(pageTitle);

                    // site title only
                    } else if (siteTitle){
                        $element.html(siteTitle);
                    }
                };

                /**
                 * Update the content of the title element to the value
                 * of the title key in the object of the current route
                 * @method onRouteChangeSuccess
                 * @param {event}  $event  '$routeChangeSuccess' event from ngRoute service
                 * @param {Object} current The requested route object
                 */
                var onRouteChangeSuccess = function onRouteChangeSuccess($event, current){

                    if ( updateOnPageChange ) {

                        var pageTitle = null;

                        if (current && current.$$route && current.$$route.title){
                            pageTitle = current.$$route.title;
                        }

                        setTitle($event, pageTitle);
                    }
                };

                /**
                 * Update the content of the title element to the value
                 * of ROUTE_CHANGE_ERROR_TITLE constant when $routeChangeError
                 * event is triggered.
                 * @method onRouteChangeError
                 */
                var onRouteChangeError = function onRouteChangeError(){

                    if ( updateOnPageChange ) {

                        if (siteTitle){
                            $element.html(ROUTE_CHANGE_ERROR_TITLE + " - " + siteTitle);
                        } else {
                            $element.html(ROUTE_CHANGE_ERROR_TITLE);
                        }

                    }

                };

                $rootScope.$on(EVENTS.SET_TITLE, setTitle);

                $rootScope.$on(EVENTS.ROUTE_CHANGE_SUCCESS, onRouteChangeSuccess);
                $rootScope.$on(EVENTS.ROUTE_CHANGE_ERROR, onRouteChangeError);

            }
        };
    }
])
/**
 * Service that sets the title of the document by specifying
 * the page title and the site title.
 * @example
     angular.module("myApp", ["sn.title"])
       .config([
         "snTitleProvider",
         function(snTitleProvider){
           snTitleProvider.setSiteTitle("My Site Name");
         }
       ])
       .controller("myCtrl",[
         "snTitle",
         function (snTitle){
           snTitle.setPageTitle("My Page");
         }
       ])
 * @class  snTitle
 * @module sn.title
 * @author SOON_
 */
.provider("snTitle", function() {
    /**
     * @property siteTitle
     * @type {String}
     */
    var siteTitle = null;
    /**
     * @method setSiteTitle
     * @param {String} value Value to set the site title to
     */
    this.setSiteTitle = function setSiteTitle(value) {
        siteTitle = value;
    };
    /**
     * @property $get
     * @param {Array}
     */
    this.$get = [
        "$rootScope",
        "EVENTS",
        function ($rootScope, EVENTS) {
            return {
                /**
                 * @method getSiteTitle
                 * @return {String} Value of the site title
                 */
                getSiteTitle: function getSiteTitle(){
                    return siteTitle;
                },
                /**
                 * Set the page title of title directive.
                 * Broadcasts an event which is being listen
                 * to by title directive
                 * @method setPageTitle
                 * @param {String} value Value to set the current page title to
                 */
                setPageTitle: function setPageTitle(value){
                    $rootScope.$broadcast(EVENTS.SET_TITLE, value);
                }
            };
        }
    ];
});
