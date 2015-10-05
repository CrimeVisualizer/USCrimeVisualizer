var connection = require('../connection')

var summarizeCategoryMonth = function () {
  connection(function (db) {
    db.collection('allCrimes').aggregate([
      { $group: {
        _id: { Category: "$Category",
        Year: { $substr: ["$Date", 6, 4] },
        Month: { $substr: ["$Date", 0, 2] }
      }, 
        count: { $sum: 1 }
      }}, 
      { $out: "summarized_categorymonth" }
    ], function () {
      db.close();
    });
  });
};

summarizeCategoryMonth();