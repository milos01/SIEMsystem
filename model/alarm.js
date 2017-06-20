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
});

AlarmSchema.pre('save', function(next) {
  var currentDate = new Date();
  if (!this.createdAt)
    this.createdAt = currentDate;

  // predjemo na sledecu funckiju u lancu
  next();
});
var Alarm = mongoose.model('Alarm', AlarmSchema);

// publikujemo kreirani model
module.exports = Alarm;