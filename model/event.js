var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// kreiramo novu shemu


var EventSchema = new Schema({

  type: {
    type: String

  },
  system: {
    type: String
  },

  computerName: {
    type: String
  },
  message:{
    type: String
  },
  signature: {
    type: String
  },

  createdAt: Date
  // napomena! komentari su u ovom primeru implementirani kao reference zbog ilustracije rada sa referencama
  // u realnom sluacju bolje bi bilo implementirati ih kao poddokumente
});



/*
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
});*/

// od sheme kreiramo model koji cemo koristiti
var Event = mongoose.model('Event', EventSchema);

// publikujemo kreirani model
module.exports = Event;
