var inside = require('point-in-polygon');
var map = require('./serverMap.js');
var _ = require('underscore');
var data = require('./data.js');

// console.log(map['gsfmap'])

// Parse the map for polygons + zipcode - Array of objects
var polygonsZips = {};

_.each(map['gsfmap']['features'], function (item) {
  var zipcode = item['id'];
  var coordinates = item['geometry']['geometries'][0]['coordinates'];
  // If a multipolygon, push all coordinates
  if (coordinates.length > 1) {
    polygonsZips[zipcode] = [];
    _.each(coordinates, function (array) {
      polygonsZips[zipcode].push(array[0]);
    });
  } else if (coordinates.length === 1) {
    polygonsZips[zipcode] = coordinates[0]
  }
});

var res = _.find(polygonsZips, function (val, key) {
  return key === '94110'
})
// console.log(res);




// Adds Zipcode coding to each entry in the crime dataset
// iterate through each Lat Long point in the crime data
_.each(data.crimeData, function (record) {
  var latLong = [];
  latLong.push(record['X']);
  latLong.push(record['Y']);

  // check if inside each polygon
  _.each(polygonsZips, function (polygon, key) {
    // if a multi polygon
    if(polygon.length === 2 || polygon.length === 3) {
      _.each(polygon, function (array) {
        if(inside(latLong, array)) {
          // append the zipcode to the crime data
          record['zipcode'] = key;
        }
      });
    } else {
      if(inside(latLong, polygon)) {
        // append the zipcode to the crime data
        record['zipcode'] = key;
      }
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
console.log(aggregate)


// Lists out the lat/longs that were not successfully classified
var store = [];
_.each(data.crimeData, function (record) {
  if (record['zipcode'] === undefined ) {
    store.push(record['Address']);
  }
});

// console.log(store)



