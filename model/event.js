var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var comment = require('./comment');
// kreiramo novu shemu


var EventSchema = new Schema({
  event_type: {
    type: String,
  },
  app_version: {
    type: String
  },
  stack: {
    type: String,
  },
  data:{
    type: String,
  },
  fragment: {
    type: String,
  },

  createdAt: Date,
  updatedAt: Date,
});




// prilikom snimanja se postavi datum
EventSchema.pre('save', function(next) {
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
var Event = mongoose.model('Event', EventSchema);

// publikujemo kreirani model
module.exports = Event;
