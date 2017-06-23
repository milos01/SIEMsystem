var UserApp = require('../model/UserApp');
var authenticationCtrl = require('../controllers/authentication');


module.exports = function(app, express, passport, auth){
  var userRouter = express.Router();
  userRouter

  //Get user by Id with owner_applications and assigned_applications
  .get('/user/:id', function(req, res, next) {
    User.findOne({"_id": req.params.id})
    .populate('owner_applications').populate('assigned_applications').exec(function(err, user) {
      if (err){
        return next(err);
      }
      res.json(user);
    });
  })


  //Returns true if user is logged in or false if it is not
  .get("/loggedin", function(req, res) { 
      res.json(req.isAuthenticated() ? true : false);
  })

  //User password update 
  

  //Register user
  .post('/register', authenticationCtrl.register)

  //Logi user
  .post('/login', authenticationCtrl.login)

  //Facebook login
  .get('/login/facebook', passport.authenticate('facebook',{ scope: 'email'}))
  
  //Facebook return route
  .get('/login/facebook/return', function(req, res, next){var authenticator = passport.authenticate('facebook', { 
    successRedirect: '/#!/home',
    failureRedirect: '/' });

    authenticator (req, res, next);
  })

  //Logout user
  .get('/logout', function(req, res) {
        req.logout();
        res.status(200).json("ok");
  });

  return userRouter;
}