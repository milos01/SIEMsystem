var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// kreiramo novu shemu


var RulesSchema = new Schema({
  n: {
    type: Number,
  },
  t: {
    type: Number,
  }
});

// od sheme kreiramo model koji cemo koristiti
var Rule = mongoose.model('Rule', RulesSchema);

// publikujemo kreirani model
module.exports = Rule;
