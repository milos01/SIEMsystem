var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;
// kreiramo novu shemu


var UserAppSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: [{type: Schema.Types.ObjectId, ref: 'Role'}],
  hash: String,
  salt: String,
  createdAt: Date,
  updatedAt: Date,
  // owner_applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }],
  // assigned_applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }]
});


UserAppSchema.methods.setPassword = function(password){
  this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, this.salt);
};

UserAppSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.hash);
};

UserAppSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};
// prilikom snimanja se postavi datum
UserAppSchema.pre('save', function(next) {
  // preuzmemo trenutni datum
  var currentDate = new Date();

  // postavimo trenutni datum poslednju izmenu
  this.updatedAt = currentDate;

  // ako nije postavljena vrednost za createdAt, postavimo je
  if (!this.createdAt)
    this.createdAt = currentDate;

  // predjemo na sledecu funckiju u lancu
  next();
});

// od sheme kreiramo model koji cemo koristiti
// var User = mongoose.model('User', UsersSchema);

// publikujemo kreirani model
module.exports = mongoose.model('UserApp', UserAppSchema);