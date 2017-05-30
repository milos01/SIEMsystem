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
});
//Servise for getting logged user
app.service('meanData', function($http, authentication){
 var getLoggedUser = function () {
  return $http.get('/api/loggedUser');
};

return {
  getLoggedUser : getLoggedUser
};
});
})();