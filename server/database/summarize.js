var connection = require('../connection')

var summarizeCategoryMonth = function () {
  connection(function (db) {
    db.collection('allCrimes').aggregate([
      { $group: {
        _id: { Date: { $concat: [ {$substr: ["$Date", 6, 4] }, '-', { $substr: ["$Date", 0, 2]} ]
      }}, 
        count: { $sum: 1 }
      }},
      { $out: "summarized_categorymonth" }
    ], function () {
      db.close();
    });
  });
}();

var summarizeMonth = function () {
  connection(function (db) {
    db.collection('allCrimes').aggregate([
      { $group: {
        _id: { Date: { $concat: [ {$substr: ["$Date", 6, 4] }, '-', { $substr: ["$Date", 0, 2]} ]
      }},
        count: { $sum: 1 }
      }},
      { $out: "summarized_month" }
    ], function () {
      db.close();
    });
  });
}();