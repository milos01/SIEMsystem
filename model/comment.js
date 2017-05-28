var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// kreiramo novu shemu


var CommentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  owner: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  createdAt: Date,
  updatedAt: Date,
  // napomena! komentari su u ovom primeru implementirani kao reference zbog ilustracije rada sa referencama
  // u realnom sluacju bolje bi bilo implementirati ih kao poddokumente
  
});

CommentSchema.add({comments:[CommentSchema]});


// prilikom snimanja se postavi datum
CommentSchema.pre('save', function(next) {
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
var Comment = mongoose.model('Comment', CommentSchema);

// publikujemo kreirani model
module.exports = Comment;
