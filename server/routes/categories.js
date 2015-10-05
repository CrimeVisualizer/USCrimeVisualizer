var express = require('express');
var router = express.Router();
var connection = require('../connection')
var fs = require('fs');

/* GET Crimes through api/events */
router.get('/', function (req, res, next) {
  // query DB for everything
  // will return you all the events in the database
  connection(function (db) {

    db.collection('summarized_categorymonth').find().toArray(function(err, results) {
      res.send(JSON.stringify(results));
    });
  });
});

module.exports = router;