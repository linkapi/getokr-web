var appModule = require('../appModule');

appModule
  .directive('pageTitle', pageTitle)
  .directive('sideNavigation', sideNavigation)
  .directive('minimalizaMenu', minimalizaMenu)
  .directive('sparkline', sparkline)
  .directive('icheck', icheck)
  .directive('panelTools', panelTools)
  .directive('panelToolsFullscreen', panelToolsFullscreen)
  .directive('smallHeader', smallHeader)
  .directive('animatePanel', animatePanel)
  .directive('landingScrollspy', landingScrollspy);

/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
  return {
    link: function(scope, element) {
      var listener = function(event, toState, toParams, fromState, fromParams) {
        // Default title
        var title = 'HOMER | AngularJS Responsive WebApp';
        // Create your own title pattern
        if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle + ' - GetOkr';
        $timeout(function() {
          element.text(title);
        });
      };
      $rootScope.$on('$stateChangeStart', listener);
    }
  };
}

pageTitle.$inject = ['$rootScope', '$timeout'];

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element) {
      // Call the metsiMenu plugin and plug it to sidebar navigation
      //element.metisMenu();

      // Colapse menu in mobile mode after click on element
      var menuElement = $('#side-menu a:not([href$="\\#"])');
      menuElement.click(function() {

        if ($(window).width() < 769) {
          $("body").toggleClass("show-sidebar");
        }
      });


    }
  };
}

sideNavigation.$inject = ['$timeout'];
/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizaMenu($rootScope) {
  return {
    restrict: 'EA',
    template: '<div class="header-link hide-menu" ng-click="minimalize()"><i class="pe-7s-filter"></i></div>',
    controller: ['$scope', '$element', function($scope, $element) {

      $scope.minimalize = function() {
        if ($(window).width() < 769) {
          $("body").toggleClass("show-sidebar");
        } else {
          $("body").toggleClass("hide-sidebar");
        }
      };
    }]
  };
}

minimalizaMenu.$inject = ['$rootScope'];

/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
  return {
    restrict: 'A',
    scope: {
      sparkData: '=',
      sparkOptions: '=',
    },
    link: function(scope, element, attrs) {
      scope.$watch(scope.sparkData, function() {
        render();
      });
      scope.$watch(scope.sparkOptions, function() {
        render();
      });
      var render = function() {
        $(element).sparkline(scope.sparkData, scope.sparkOptions);
      };
    }
  };
}

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function($scope, element, $attrs, ngModel) {
      return $timeout(function() {
        var value;
        value = $attrs['value'];

        $scope.$watch($attrs['ngModel'], function(newValue) {
          $(element).icheck('update');
        });

        return $(element).icheck({
          checkboxClass: 'icheckbox_square-green',
          radioClass: 'iradio_square-green'

        }).on('ifChanged', function(event) {
          if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
            $scope.$apply(function() {
              return ngModel.$setViewValue(event.target.checked);
            });
          }
          if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
            return $scope.$apply(function() {
              return ngModel.$setViewValue(value);
            });
          }
        });
      });
    }
  };
}

icheck.$inject = ["$timeout"];

/**
 * panelTools - Directive for panel tools elements in right corner of panel
 */
var templatePanel_tools = require('./templates/panel_tools.html');

function panelTools($timeout) {
  return {
    restrict: 'A',
    scope: true,
    templateUrl: templatePanel_tools,
    controller: ['$scope', '$element', function($scope, $element) {
      // Function for collapse ibox
      $scope.showhide = function() {
        var hpanel = $element.closest('div.hpanel');
        var icon = $element.find('i:first');
        var body = hpanel.find('div.panel-body');
        var footer = hpanel.find('div.panel-footer');
        body.slideToggle(300);
        footer.slideToggle(200);
        // Toggle icon from up to down
        icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        hpanel.toggleClass('').toggleClass('panel-collapse');
        $timeout(function() {
          hpanel.resize();
          hpanel.find('[id^=map-]').resize();
        }, 50);
      };

      // Function for close ibox
      $scope.closebox = function() {
        var hpanel = $element.closest('div.hpanel');
        hpanel.remove();
      };

    }]
  };
}

panelTools.$inject = ["$timeout"];

/**
 * panelToolsFullscreen - Directive for panel tools elements in right corner of panel with fullscreen option
 */
function panelToolsFullscreen($timeout) {
  return {
    restrict: 'A',
    scope: true,
    templateUrl: 'views/common/panel_tools_fullscreen.html',
    controller: ['$scope', '$element', function($scope, $element) {
      // Function for collapse ibox
      $scope.showhide = function() {
        var hpanel = $element.closest('div.hpanel');
        var icon = $element.find('i:first');
        var body = hpanel.find('div.panel-body');
        var footer = hpanel.find('div.panel-footer');
        body.slideToggle(300);
        footer.slideToggle(200);
        // Toggle icon from up to down
        icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        hpanel.toggleClass('').toggleClass('panel-collapse');
        $timeout(function() {
          hpanel.resize();
          hpanel.find('[id^=map-]').resize();
        }, 50);
      };

      // Function for close ibox
      $scope.closebox = function() {
        var hpanel = $element.closest('div.hpanel');
        hpanel.remove();
      };

      // Function for fullscreen
      $scope.fullscreen = function() {
        var hpanel = $element.closest('div.hpanel');
        var icon = $element.find('i:first');
        $('body').toggleClass('fullscreen-panel-mode');
        icon.toggleClass('fa-expand').toggleClass('fa-compress');
        hpanel.toggleClass('fullscreen');
        setTimeout(function() {
          $(window).trigger('resize');
        }, 100);
      };

    }]
  };
}

panelToolsFullscreen.$inject = ["$timeout"];
/**
 * smallHeader - Directive for page title panel
 */
function smallHeader() {
  return {
    restrict: 'A',
    scope: true,
    controller: ['$scope', '$element', function($scope, $element) {
      $scope.small = function() {
        var icon = $element.find('i:first');
        var breadcrumb = $element.find('#hbreadcrumb');
        $element.toggleClass('small-header');
        breadcrumb.toggleClass('m-t-lg');
        icon.toggleClass('fa-arrow-up').toggleClass('fa-arrow-down');
      };
    }]
  };
}

function animatePanel($timeout, $state) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      //Set defaul values for start animation and delay
      var startAnimation = 0;
      var delay = 0.06; // secunds
      var start = Math.abs(delay) + startAnimation;

      // Store current state where directive was start
      var currentState = $state.current.name;

      // Set default values for attrs
      if (!attrs.effect) {
        attrs.effect = 'zoomIn';
      }
      if (attrs.delay) {
        delay = attrs.delay / 10;
      } else {
        delay = 0.06;
      }
      if (!attrs.child) {
        attrs.child = '.row > div';
      } else {
        attrs.child = "." + attrs.child;
      }

      // Get all visible element and set opactiy to 0
      var panel = element.find(attrs.child);
      panel.addClass('opacity-0');

      // Count render time
      var renderTime = panel.length * delay * 1000 + 700;

      // Wrap to $timeout to execute after ng-repeat
      $timeout(function() {

        // Get all elements and add effect class
        panel = element.find(attrs.child);
        panel.addClass('stagger').addClass('animated-panel').addClass(attrs.effect);

        var panelsCount = panel.length + 10;
        var animateTime = (panelsCount * delay * 10000) / 10;

        // Add delay for each child elements
        angular.forEach(panel, function(elm, i) {
          start += delay;
          var rounded = Math.round(start * 10) / 10;
          $(elm).css('animation-delay', rounded + 's');
          // Remove opacity 0 after finish
          $(elm).removeClass('opacity-0');
        });

        // Clear animation after finish
        $timeout(function() {
          $('.stagger').css('animation', '');
          $('.stagger').removeClass(attrs.effect).removeClass('animated-panel').removeClass('stagger');
        }, animateTime);

      });



    }
  };
}

animatePanel.$inject = ["$timeout", "$state"];

function landingScrollspy() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.scrollspy({
        target: '.navbar-fixed-top',
        offset: 80
      });
    }
  };
}
