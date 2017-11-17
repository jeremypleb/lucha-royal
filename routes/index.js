var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Fighter = mongoose.model('Fighter');

var fighters = [];

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: 'public' });
});*/

router.get('/fighters', function(req, res, next) {
  Fighter.find(function(err, fighters) {
    if (err) { return next(err); }
    else { res.json(fighters); }
  })
});

router.post('/fighters', function(req, res, next) {
    console.log(req.body);
    var fighter = new Fighter(req.body);
    fighter.save(function(err, fighter) {
      if (err) { return next(err); }
      else { res.json(fighter); }
    });
});

router.param('fighter', function(req, res, next, id) {
  var query = Fighter.findById(id);
  query.exec(function (err, fighter){
    if (err) { return next(err); }
    if (!fighter) { return next(new Error("can't find fighter")); }
    req.fighter = fighter;
    console.log(req);
    return next();
  });
});

router.put('/fighters/:fighter/upvictory', function(req, res, next) {
  req.fighter.upvictory(function(err, fighter){
    if (err) { return next(err); }
    res.json(fighter);
  });
});

/*router.put('/images', function(req,res) {
    console.log('UPDATE image');
    images[req.body.index] = req.body;
    res.end('{"success" : "Updated Successfully", "status" : 200}');
});*/

module.exports = router;
