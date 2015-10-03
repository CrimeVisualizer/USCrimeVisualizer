var inside = require('point-in-polygon');
var map = require('./serverMap.js');
var _ = require('underscore');
var data = require('./data.js');

// Parse the map for polygons + zipcode - Array of objects
var polygonsZips = {};

_.each(map['gsfmap']['features'], function (item) {
  var zipcode = item['id'];
  var coordinates = item['geometry']['geometries'][0]['coordinates'][0];
  polygonsZips[zipcode] = coordinates
});

// Adds Zipcode coding to each entry in the crime dataset
// iterate through each Lat Long point in the crime data
_.each(data.crimeData, function (record) {
  var latLong = [];
  latLong.push(record['X']);
  latLong.push(record['Y']);
  // check if inside each polygon
  _.each(polygonsZips, function (polygon, key) {
    if(inside(latLong, polygon)) {
      // append the zipcode to the crime data
      record['zipcode'] = key;
    }
  });
});

// Query the dataset for zipcode aggregate by certain timeframe

// Sum each zipcode count by each record
var getZipcodeCount = function (data) {
  return _.countBy(data, function(record) {
    return record['zipcode'];
  });
};

var aggregate = getZipcodeCount(data.crimeData);







