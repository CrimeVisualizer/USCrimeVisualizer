var express = require('express');
var router = express.Router();
var connection = require('../connection')
/* GET Crimes through api/events */
router.get('/', function (req, res, next) {
  // query DB for everything
  // will return you all the events in the database
  connection(function (db) {

    db.collection('crimes').find().toArray(function(err, results) {
      res.send(JSON.stringify(results));
    });
  });
});

router.get('/date=:date', function (req, res, next) {
  // data is an object with year and month as variables
  // will return three months of crime starting from the year month combination specified in url
  var data = req.params.date.split('-');
  var year = +data[0];
  var month = +data[1];
  var rollover = 0;
  if(month > 10) {
    rollover = 1;
  }
  var search = [
    // cray regex stuff
    { Date: new RegExp('.*' + month + '\/.*\/' + year)},
    { Date: new RegExp('.*' + (month + 1)%12 + '\/.*\/' + (+year+rollover))},
    { Date: new RegExp('.*' + (month + 2)%12 + '\/.*\/' + (+year+rollover))}
  ];

  connection(function (db) {
    // here we use search varable to correctly query db for 3 mon
    db.collection('crimes').find({$or: search}).toArray(function(err, results) {
      res.send(JSON.stringify(results));
    });
  });
});

module.exports = router;