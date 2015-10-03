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

// console.log(aggregate)

var store = [];
_.each(data.crimeData, function (record) {
  if (record['zipcode'] === undefined ) {
    store.push(record['Address']);
  }
});

console.log(store)

// // 94103
// var array = [[-122.398941, 37.783785], [-122.405629, 37.778502], [-122.399425, 37.773612], [-122.403723, 37.770182], [-122.404003, 37.77018], [-122.403477, 37.769842], [-122.402105, 37.769912], [-122.402091, 37.769716], [-122.401685, 37.769721], [-122.401768, 37.769145], [-122.402021, 37.768998], [-122.401851, 37.767416], [-122.400881, 37.767518], [-122.400915, 37.768096], [-122.40001, 37.767614], [-122.400422, 37.767291], [-122.3998, 37.766807], [-122.399688, 37.765005], [-122.407431, 37.764497], [-122.407553, 37.765798], [-122.419459, 37.765089], [-122.421248, 37.764947], [-122.421031, 37.76335], [-122.42173, 37.763304], [-122.421885, 37.764908], [-122.426453, 37.764634], [-122.426897, 37.769107], [-122.42245, 37.772761], [-122.403427, 37.787676], [-122.40333, 37.787336], [-122.401497, 37.785824], [-122.39999, 37.787004], [-122.399523, 37.786631], [-122.400955, 37.785389], [-122.398941, 37.783785]]
// var testLatLong = [-122.415308388816, 37.765316135635];
// var test = inside(testLatLong, array)
// console.log(test);

// var array2 = [[-122.405115, 37.764635], [-122.405212, 37.763469], [-122.405832, 37.762199], [-122.405859, 37.761815], [-122.40604, 37.761865], [-122.406365, 37.761199], [-122.40645, 37.760114], [-122.406167, 37.759315], [-122.406015, 37.759409], [-122.405604, 37.758851], [-122.40405, 37.757619], [-122.403428, 37.756871], [-122.403585, 37.756818], [-122.403328, 37.756082], [-122.40315, 37.754488], [-122.403524, 37.754463], [-122.403437, 37.753199], [-122.403364, 37.752366], [-122.403022, 37.752336], [-122.403052, 37.752048], [-122.405091, 37.745281], [-122.405614, 37.7442], [-122.405493, 37.744084], [-122.404865, 37.744385], [-122.404524, 37.744285], [-122.406652, 37.741241], [-122.406936, 37.740554], [-122.407045, 37.739587], [-122.408136, 37.73964], [-122.408009, 37.737734], [-122.408218, 37.73765], [-122.408284, 37.736846], [-122.408613, 37.736074], [-122.409287, 37.735258], [-122.410052, 37.734675], [-122.411978, 37.733732], [-122.412695, 37.733197], [-122.414554, 37.732371], [-122.416255, 37.732034], [-122.419881, 37.732016], [-122.423718, 37.73155], [-122.425944, 37.731698], [-122.425256, 37.732125], [-122.422274, 37.732383], [-122.421889, 37.732533], [-122.421787, 37.732774], [-122.422472, 37.733967], [-122.422901, 37.734388], [-122.422243, 37.734846], [-122.422133, 37.735162], [-122.426983, 37.735455], [-122.427849, 37.734718], [-122.428578, 37.735082], [-122.42801, 37.735441], [-122.428454, 37.735882], [-122.42551, 37.737774], [-122.42452, 37.739868], [-122.42427, 37.739867], [-122.424394, 37.740405], [-122.424168, 37.740805], [-122.426453, 37.764634], [-122.421885, 37.764908], [-122.42173, 37.763304], [-122.421031, 37.76335], [-122.421248, 37.764947], [-122.407553, 37.765798], [-122.407431, 37.764497], [-122.405115, 37.764635]]
// var test2 = inside(testLatLong, array2);
// console.log(test2);


