var express = require('express');
var router = express.Router();
var connection = require('../connection')
/* GET users listing. */
router.get('/', function (req, res, next) {
  // query DB for everything
  connection(function (db) {

    db.collection('crimes').find({}, {X:1, Y:1, Time:1, Category:1, Descript:1, Address:1}).toArray(function(err, results) {
      res.send(JSON.stringify(results));
    });

    // db.collection('crimes').aggregate([ 
    //   { $group: { 
    //     _id: { District: "$PdDistrict", Date: "Date$"}, 
    //     count: { $sum: 1 }
    //   }}, 
    //   { $out: "summarized_district" }
    // ], function(results) {
    // })
    
    // db.collection('summarized_district').find({}).toArray(function(err, results) {
    //   res.send(JSON.stringify(results));
    // })
  })
});
module.exports = router;