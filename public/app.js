(function (angular) {

  app = angular.module('EventLoggerApp', ['ui.router', 'restangular', 'ui.bootstrap', 'hSweetAlert', 'toastr']);

  app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $qProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('land', {
        url: "/",
        views: {
            'mainView@': {
                templateUrl: "/views/login.html",
                controller: 'loginCtrl',
                controllerAs: 'vm',
                resolve: {
                    logincheck : checkNotLoggedin
                }
            }
        }

    })
    .state('home', {

        url: "/home",
        views: {
            'mainView@': {
                templateUrl: "/views/home.html",
                controller: 'homeCtrl',
                controllerAs: 'vm',
                // resolve: {
                //     logincheck: checkLoggedin
                // }
            }
        }
    })
    .state('homelanding', {
        parent: 'home',
        views: {
            'profileView@home': {
                templateUrl: "/views/homeLanding.html",
                controller: "applicaitonCtrl",
                controllerAs: 'vm'
            }
        }
    })
    .state('somepage', {
        parent: 'home',
        views: {
            'profileView@home': {
                templateUrl: "/views/event.html",
                controller: "someCtrl"
            }
        }
    })
    .state('applicationProf', {
        parent: 'home',
        params : { appId: null },
        views: {
            'profileView@home': {
                url: "applicationProf/:appId",
                templateUrl: "/views/aplication.html",
                controller: "eventlCtrl",
                controllerAs: 'vm'

            }
        }
    })
    .state('eventPage', {
        parent: 'home',
        params : { appId: null, eventId: null },
        views: {
            'profileView@home': {
                url: "applicationProf/:appId/event/:eventId",
                templateUrl: "/views/event.html",
                controller: "eventInfoCtrl",
                controllerAs: 'vm'

            }
        }
    })


})
  .run(function(Restangular, $log, authentication) {
    // Restangular.setDefaultHeaders({Authorization: 'Bearer '+ authentication.getToken()});
    Restangular.setBaseUrl("api");
    Restangular.setErrorInterceptor(function(response) {
        if (response.status === 500) {
            $log.info("internal server error");
            return true;
        }
            return true; // greska nije obradjena
        });
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope, authentication) {
    var deferred = $q.defer();
    
    $http.get('/api/loggedin').then(function(user) {
      $rootScope.errorMessage = null;
        //User is Authenticated
        if (user.data !== false) {
          $rootScope.currentUser = user;
          deferred.resolve();
        } else { //User is not Authenticated
          deferred.reject();
        }
      });
    return deferred.promise;
  }

var checkNotLoggedin = function($q, $timeout, $http, $location, $rootScope, authentication) {
    var deferred = $q.defer();
    
    $http.get('/api/loggedin').then(function(user) {
      $rootScope.errorMessage = null;
        //User is Authenticated
        if (user.data !== false) {
          deferred.reject();
          // $location.url('/home');
        } else { 
          //   console.log(authentication.isLoggedIn());//User is not Authenticated
          if(authentication.isLoggedIn()){
            console.log('aaa');
            deferred.reject();
          }
          $rootScope.currentUser = user;
          deferred.resolve();
        }
      });
    return deferred.promise;
  }

})(angular);