// Sets the mongo database
var mongoURI = 'mongodb://localhost/USCrime';
// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect(mongoURI, function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
  module.exports = db
});