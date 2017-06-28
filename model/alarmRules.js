var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// kreiramo novu shemu


var arSchema = new Schema({
  errType:{
    type: String
  },
  rules: [{type: Schema.Types.ObjectId, ref: 'Rule'}]
});

// od sheme kreiramo model koji cemo koristiti
var AlarmRules = mongoose.model('AlarmRules', arSchema);

// publikujemo kreirani model
module.exports = AlarmRules;
