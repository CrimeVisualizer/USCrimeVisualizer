
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CrimeSchema = new Schema({
  IncidntNum: Number,  
  Category: String,
  Descript: String,
  DayOfWeek: String, 
  Date: String,
  Time: String,
  PdDistrict: String,
  Resolution: String,
  Address: String, 
  X: Number,
  Y: Number,
  Location: Number,
  PdId: Number
});
var Crimes = mongoose.model('crimes', CrimeSchema);
module.exports = Crimes;