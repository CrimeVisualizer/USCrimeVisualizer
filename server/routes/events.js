var express = require('express');
var router = express.Router();
var connection = require('../connection')
var fs = require('fs');

/* GET users listing. */
router.get('/', function (req, res, next) {
  // query DB for everything
  connection(function (db) {

// Temporarily commented out - this code block only used to generate zip code data. Only needs to be run once. 
    db.collection('crimes').find({}, {X:1, Y:1, Time:1, Category:1, Descript:1, Address:1}).toArray(function(err, results) {

      var data = JSON.stringify(results);

      // Write file to local filesystem to be used to append zipcode data to dataset
      fs.writeFile( __dirname + "/../utilities/data.json", data, function(err) {

          if(err) {
              return console.log(err);
          }

          console.log("The file was saved!");
          res.send(JSON.stringify(results));
      }); 
    });
  })
});



//     db.collection('crimes').find().toArray(function(err, results) {
//       res.send(JSON.stringify(results));
//     });
//   });
// });

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
    db.collection('allCrimes').find({$or: search}).toArray(function(err, results) {
      res.send(JSON.stringify(results));
    });
  });
});

module.exports = router;