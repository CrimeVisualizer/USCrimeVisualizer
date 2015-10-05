// Sets the mongo database
var mongoURI = 'mongodb://localhost/USCrime';
// Retrieve
var MongoClient = require('mongodb').MongoClient;
var db;
module.exports = function (cb) {
  if (db) {
    cb(db);
    return;
  }

  MongoClient.connect(mongoURI, function (err, connection) {
    if (err){
      console.log(err.message);
      throw new Error(err);
    } else {
      console.log("We are connected");
      db = connection; 
      cb(db);
    }
  });
}
