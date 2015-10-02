var inside = require('point-in-polygon');
var map = require('./serverMap.js');
var _ = require('underscore');

// Parse the map for polygons + zipcode - Array of objects
var polygonsZips = {};

_.each(map['gsfmap']['features'], function (item) {
  var zipcode = item['id'];
  var coordinates = item['geometry']['geometries'][0]['coordinates'][0];
  polygonsZips[zipcode] = coordinates
});

// Test lat/long for crime data
var crimeData = [[-122.433521628095,37.7702797662699], [-122.406481972743,37.7827317884887]];

// Adds Zipcode coding to each entry in the crime dataset

// iterate through each Lat Long point in the crime data
_.each()

  // check if inside each polygon

    // if inside a polygon, then increment that corresponding zipcode, store back into crime data  (underscore)


// Query the dataset for zipcode aggregate by certain timeframe





