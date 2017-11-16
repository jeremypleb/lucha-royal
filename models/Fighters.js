var mongoose = require('mongoose');

console.log('in fighter schema');

var FighterSchema = new mongoose.Schema({
  name: String,
  head: {
    ext: String
  },
  body: {
    ext: String
  },
  weapon: {
    ext: String
  },
  hp: Number,
  agility: Number,
  strength: Number,
  magic: Number
});

/*FighterSchema.methods.victories = function(cb) {
  this.victories += 1;
  this.save(cb);
};*/

mongoose.model('Fighter', FighterSchema);