(function () {
//Service for authentication 
  app.service('authentication', function($http, $window){
    var saveToken = function (token) {
      $window.localStorage['mean-token'] = token;
    };

    var getToken = function () {
      return $window.localStorage['mean-token'];
    };

    var logout = function() {
      $window.localStorage.removeItem('mean-token');
    };

    var register = function(user) {
      return $http.post('/api/register', user).success(function(data){
        saveToken(data.token);
      });
    };

    var login = function(user) {
      return $http.post('/api/login', user).then(function(data) {
        saveToken(data.data.token);
      });
    };

    var isLoggedIn = function() {
      var token = getToken();
      var payload;

      if(token){
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
          email : payload.email
        };
      }
    };

    return {
      saveToken : saveToken,
      getToken : getToken,
      logout : logout,
      register: register,
      login: login,
      isLoggedIn : isLoggedIn,
      currentUser : currentUser
    };
  });
//Servise for getting logged user
  app.service('meanData', function($http, authentication){
     var getLoggedUser = function () {
        return $http.get('/api/loggedUser', {
          headers: {
            Authorization: 'Bearer '+ authentication.getToken()
          }
        });
      };

      return {
        getLoggedUser : getLoggedUser
      };
  });
})();