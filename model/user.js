var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
// var jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;
// kreiramo novu shemu


var UsersSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hash: String,
  salt: String,
  provider: String,
  role: [{type: Schema.Types.ObjectId, ref: 'Role'}],
  createdAt: Date,
  updatedAt: Date,
  // owner_applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }],
  // assigned_applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }]
});

UsersSchema.methods.setPassword = function(password){
  this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, this.salt);
};

UsersSchema.methods.hasRole = function(roleName){
  console.log(roleName);
  return true;
}

UsersSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.hash);
};
// prilikom snimanja se postavi datum
UsersSchema.pre('save', function(next) {
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
module.exports = mongoose.model('User', UsersSchema);
