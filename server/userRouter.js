var User = require('../model/user');
var authenticationCtrl = require('../controllers/authentication');

module.exports = function(app, express, passport){
  //Check if user is logged in system
  var isLoggedIn = function (req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
        return next();
    }
    // if they aren't redirect them to the home page
    res.status(401).json({
        "message" : "UnauthorizedError: Unauthorized access"
    });
  };
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

  //Get logged user
  .get('/loggedUser',isLoggedIn, function(req, res){
    if (!req.user) {
      res.status(401).json({
        "message" : "UnauthorizedError: private profile"
      });
    } else {
      res.status(200).json(req.user);
    }
  })

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

  //Get user by email
  .get('/usere/:email', function(req, res, next) {
    User.findOne({"email": req.params.email}).exec(function(err, user) {
      if (err){
        return next(err);
      }
      res.json(user);
    });
  })

  //Get all users with owner_applications and assigned_applications
  .get('/user', function(req, res) {
      User.find({}).populate('owner_applications').populate('assigned_applications').exec(function(err, data, next) {
        res.json(data);
      });
  })

  //Returns true if user is logged in or false if it is not
  .get("/loggedin", function(req, res) { 
      res.json(req.isAuthenticated() ? true : false);
  })

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