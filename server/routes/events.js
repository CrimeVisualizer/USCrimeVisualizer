var express = require('express');
var router = express.Router();
var db = require('../db')
/* GET users listing. */
router.get('/', function (req, res, next) {
  // query DB for everything
  Crimes.find({PdDistrict: "MISSION"}, function (err, result) {
    res.send(result);
    console.log('done');
  });

});
module.exports = router;