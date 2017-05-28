var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var event = require('./event');

// kreiramo novu shemu

var ApplicaitionSchema = new Schema({
  app_name: {
    type: String,
    required: true
  },
  owner: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  description:{
    type: String,
    required: true
  },
  version :{
    type: String
  },
  repo_link: {
    type: String
  },
  dns: {
    type: String,
    required: true,
    unique: true
  },
  events: [event.schema],
  createdAt: Date,
  updatedAt: Date,
});

ApplicaitionSchema.pre('save', function(next) {
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

ApplicaitionSchema.pre('remove', function(next) {
    // Remove all the assignment docs that reference the removed application.
    this.model('User').update(
        { },
        { "$pull": { "assigned_applications": this._id } },
        { "multi": true },
        next
    );
    // Remove all the owner docs that reference the removed application.
    this.model('User').update(
        { },
        { "$pull": { "owner_applications": this._id } },
        { "multi": true },
        next
    );
});


// publikujemo kreirani model
module.exports = mongoose.model('Application', ApplicaitionSchema);