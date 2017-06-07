var mongoose = require('mongoose');
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
  password: String,
  createdAt: Date,
  updatedAt: Date,
  // napomena! komentari su u ovom primeru implementirani kao reference zbog ilustracije rada sa referencama
  // u realnom sluacju bolje bi bilo implementirati ih kao poddokumente
  // owner_applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }],
  // assigned_applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }]
});
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
