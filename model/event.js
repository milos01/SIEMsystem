var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var comment = require('./comment');
// kreiramo novu shemu


var EventSchema = new Schema({
  event_type: {
    type: String,
    required: true
  },
  app_version: {
    type: String
  },
  stack: {
    type: String,
    required: true
  },
  data:{
    type: String,
    required: true
  },
  fragment: {
    type: String,
    required: true
  },
  comments: [comment.schema],

  createdAt: Date,
  updatedAt: Date,
  // napomena! komentari su u ovom primeru implementirani kao reference zbog ilustracije rada sa referencama
  // u realnom sluacju bolje bi bilo implementirati ih kao poddokumente
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
