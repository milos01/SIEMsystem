var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// kreiramo novu shemu


var tsSchema = new Schema({
  logID:{
    type: String
  },
  n: {
    type: Number
  },
  t: {
    type: Number
  },
  errType:{
    type: String
  },
  eventTimes: [{type: Date}]
});

// od sheme kreiramo model koji cemo koristiti
var TimeSchedule = mongoose.model('TimeSchedule', tsSchema);

// publikujemo kreirani model
module.exports = TimeSchedule;
