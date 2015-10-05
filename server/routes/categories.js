var express = require('express');
var router = express.Router();
var connection = require('../connection')
var fs = require('fs');

/* GET Crimes through api/events */
router.get('/date=:date', function (req, res, next) {
  // query DB for everything
  // will return you all the events in the database
  var data = req.params.date.split('-');
  var year = +data[0];
  var month = +data[1];
  var search = { Date: new RegExp('.*' + month + '\/.*\/' + year)};

  connection(function (db) {

    db.collection('summarized_categorymonth').find(search).toArray(function(err, results) {
      res.send(JSON.stringify(results));
    });
  });
});

module.exports = router;