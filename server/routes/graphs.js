var express = require('express');
var router = express.Router();
var connection = require('../connection')
/* GET users listing. */
router.get('/', function (req, res, next) {
  // query DB for everything
  connection(function (db) {
    db.collection('summarized_month').find({}).toArray(function (err, results) {
      res.send(JSON.stringify(results));
    });
  });
});


module.exports = router;