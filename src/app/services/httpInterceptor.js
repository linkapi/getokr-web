var appModule = require('../appModule');

appModule.factory('httpInterceptor', httpInterceptor);

httpInterceptor.$inject = ['$injector', '$q', 'lodash', '$rootScope', '$location', 'securityService']

function httpInterceptor($injector, $q, lodash, $rootScope, $location, securityService) {
  var numLoadings = 0;
  var service = {
    request: request,
    response: response,
    responseError: responseError
  };

  return service;

  function request(request) {
    var notify = $injector.get('notify');
    request.headers['Authorization'] = 'Bearer ' + securityService.getToken();
    numLoadings++;
    $rootScope.$broadcast("loader_show");
    return request || $q.when(request);
  }

  function response(response) {
    var notify = $injector.get('notify');
    if ((--numLoadings) === 0) {
      $rootScope.$broadcast("loader_hide");
    }
    return response || $q.when(response);
  }

  function responseError(response) {
    var notify = $injector.get('notify');
    if (response.status == 401 && securityService.isLoggedOn()) {
      securityService.logout();
      $location.path('/login');
      notify({ message: 'Seu login expirou.', classes: 'alert-danger'});
      console.log(response.headers);
    }
    if (response.status == 403 && securityService.isLoggedOn()) {
      notify({ message: 'Você não possui permissão para esta operação.', classes: 'alert-danger'});
      console.log(response.headers);
    }
    if (response.status == 500) {
      notify({ message: 'Ops, ocorreu um erro inesperado.', classes: 'alert-danger'});
      console.log(response.headers);
    }
    if (!(--numLoadings)) {
      $rootScope.$broadcast("loader_hide");
    }
    return $q.reject(response);
  }

}
