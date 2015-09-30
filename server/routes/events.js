var express = require('express');
var router = express.Router();
var connection = require('../connection')
/* GET users listing. */
router.get('/', function (req, res, next) {
  // query DB for everything
  connection(function (db) {

    db.collection('crimes').find().toArray(function(err, results) {
      res.send(JSON.stringify(results));
    });
  });
});

router.get('/date=:date', function (req, res, next) {
  // data is an object with year and month as variables
  var data = req.params.date.split('-');
  var year = +data[0];
  var month = +data[1];
  var rollover = 0;
  if(month > 10) {
    rollover = 1;
  }
  var search = [
    { Date: new RegExp('.*' + month + '\/.*\/' + year)},
    { Date: new RegExp('.*' + (month + 1)%12 + '\/.*\/' + (+year+rollover))},
    { Date: new RegExp('.*' + (month + 2)%12 + '\/.*\/' + (+year+rollover))}
  ]

  connection(function (db) {
    db.collection('crimes').find({$or: search}).toArray(function(err, results) {
      res.send(JSON.stringify(results));
    });
  });
});

module.exports = router;