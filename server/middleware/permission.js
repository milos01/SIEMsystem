var UserApp = require('../../model/UserApp');
var User = require('../../model/user');

module.exports = function(roleName) {
  var middleware = function(req, res, next) {
    if(req.payload){
      var userType = UserApp;
      var userID = req.payload._id;
    }else{
      var userType = User;
      var userID = req.user._id;
    }


    userType.findOne({"_id": userID}).populate('role').exec(function(err, fuser) {
      if(fuser.role[0].role_name === roleName){
        return next();
      }else{
        var err = new Error();
        err.status = 401;
        err.message = "You don't have permissions to access this route!";
        return next(err);
      }
    });
  }
  return middleware;
};
