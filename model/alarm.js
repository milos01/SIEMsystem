var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlarmSchema = new Schema({

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

  createdAt: Date
  // napomena! komentari su u ovom primeru implementirani kao reference zbog ilustracije rada sa referencama
  // u realnom sluacju bolje bi bilo implementirati ih kao poddokumente
});


var Alarm = mongoose.model('Alarm', AlarmSchema);

// publikujemo kreirani model
module.exports = Alarm;