var svg, projection;

var getData = function (callback) {
  console.log('got in ajax request');
  $.get('/api/events/', function (data) {
    callback(data);
  });
};

// Get Google Reverse Geocode API data - passes latLong for Google API lookup
//https://developers.google.com/maps/documentation/geocoding/intro?csw=1#ReverseGeocoding
var getZipcode = function (latLong, callback) {

  // Build URL string for query
  var googleURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' 
                  + latLong
                  + '&key=AIzaSyDOKSY3LtWFhxGqEAcX7pLNfndGjkNVy-I';

  $.get(googleURL , function (data) {
    var zipcode = data['results'][0]['address_components'][7]['long_name'];
    callback(zipcode);
  });
};


// Calculates min and max of crime data set for use in quantize
/*var getMaxMin = function (data) {
  var resultArray = [];
  var dataMax = _.max(data, function(item) {
    return item['count'];
  });
  var dataMin = _.min(data, function(item) {
    return item['count'];
  });
  resultArray.push(dataMin);
  resultArray.push(dataMax);
  return resultArray;
};
*/


// Generates a range of 9 values within the provided domain.
// Function used to generated CSS class values, 0-8.
// Values correspond to a range of blues in CSS file (see CSS file)
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHANGE THE DOMAIN HARDCODE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var quantize = d3.scale.quantize()
    .domain([162, 622])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
    

// Append zipcode to each record
// Uses Google API
var appendZipcode = function(data, callbackA) {
  data = JSON.parse(data);
  var newData = [];

// var callback = function (record) {
//   console.log('callback called');
//   newData.push(record);
// };

  // Iterate over each record in the data
  async.forEachOf(data, function(record, key, callback) {
    // Get lat & long from data
    var yCoord = record.Y;
    var xCoord = record.X;
    var latLong = yCoord + ',' + xCoord;

    // Call Google API with record's lat and long
    getZipcode(latLong, function (zipcode) {
      record['zipcode'] = zipcode;
      newData.push(record);
      callback();
    })

  }, function(err) {

    if (err) {
      console.log(err.message);
    }
    callbackA(newData);
    console.log('1', newData);
  });
};

// Sum each zipcode count by each record
var getZipcodeCount = function (data) {
  return _.countBy(data, function(record) {
    return record['zipcode'];
  });
};

var renderPoints = function (params) {
  getData(function (data) {
      var coord;
      // console.log(svg);
      // console.log(projection);
      // add circles to svg
      data = JSON.parse(data);
      svg.selectAll("circle")
      .data(data).enter()
      .append("circle")
      .attr("cx", function (d) {
        coord = [d.X, d.Y];
        return projection(coord)[0]; 
      })
      .attr("cy", function (d) { 
        coord = [d.X, d.Y];
        return projection(coord)[1]; 
      })
      // .attr("r", "2px")

      $('svg path').hover(function() {
        $("#details").text($(this).data("id") + " : " + $(this).data("name"));
      });
      animatePoints();
  }, params);
};

var animatePoints = function() {
  // console.log(svg);
  // console.log(projection);
  svg.selectAll("circle")
  .attr("r", "0px")
  .attr("stroke", "red")
  .transition(500)
  .delay(function(d) {
    var time = d.Time.split(":");
    return (time[0] * 1000) + ((time[1] / 60) * 1000);
  })
  .ease("cubic-in-out")
  .attr("r", "1px")
  .attr("stroke", "red")
  .transition()
  .delay(function(d) {
    var time = d.Time.split(":");
    return ((time[0] * 1000) + ((time[1] / 60) * 1000) + 1000);
  })
  .ease("cubic-in-out")
  .attr("r", "0px");
};

// // Renders Heat Map - this is rendered in place of standard map
var renderHeatMap = function (params) {

  // Create the D3 map
  var width = .8 * window.innerWidth, height = .85 * window.innerHeight;

  // Creates the map svg
  svg = d3.select('#city').append("svg").attr("width", width).attr("height", height);

  // Map of San Francisco
  projection = d3.geo.mercator().scale(1).translate([0, 0]).precision(0);
  var path = d3.geo.path().projection(projection);

  // gsfmap is a global variable from map/map.js
  var bounds = path.bounds(gsfmap);

  xScale = width / Math.abs(bounds[1][0] - bounds[0][0]);
  yScale = height / Math.abs(bounds[1][1] - bounds[0][1]);
  scale = xScale < yScale ? xScale : yScale;

  var transl = [(width - scale * (bounds[1][0] + bounds[0][0])) / 2, (height - scale * (bounds[1][1] + bounds[0][1])) / 2];
  projection.scale(scale).translate(transl);


  // Renders the Heat Map graphics
  getData(function(data) {
    // Get zipcode for each entry and append to dataset
    var newData = appendZipcode(data, function (data) {
      console.log("data!", data);
      // Run summing function on zipcode data
      var zipcodeCount = getZipcodeCount(data);
      console.log('zipcodeCount', zipcodeCount);        
    });

    // Render the heat map
    svg.selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("d", path)
        .attr('data-id', function(d) {
          return d.id;
        }).attr('data-name', function(d) {
          return d.properties.name;
        })
        // .style("fill", "#ffffff").style("stroke", "#111111")   REMOVE ME AFTER TESTING!
        .attr("class", function(d) {
          return quantize(districtData[d.properties.name]); // Quantize by total crimes per zipcode
        });

  });
};

// Renders standard map
/*var render = function () {
  var width = .8 * window.innerWidth, height = .85 * window.innerHeight;

  // Creates the map svg
  svg = d3.select('#city').append("svg").attr("width", width).attr("height", height);

  // Map of San Francisco
  projection = d3.geo.mercator().scale(1).translate([0, 0]).precision(0);
  var path = d3.geo.path().projection(projection);

  // gsfmap is a global variable from map/map.js
  var bounds = path.bounds(gsfmap);

  xScale = width / Math.abs(bounds[1][0] - bounds[0][0]);
  yScale = height / Math.abs(bounds[1][1] - bounds[0][1]);
  scale = xScale < yScale ? xScale : yScale;

  var transl = [(width - scale * (bounds[1][0] + bounds[0][0])) / 2, (height - scale * (bounds[1][1] + bounds[0][1])) / 2];
  projection.scale(scale).translate(transl);

  svg.selectAll("path").data(gsfmap.features).enter().append("path").attr("d", path).attr('data-id', function(d) {
    return d.id;
  }).attr('data-name', function(d) {
    return d.properties.name;
  });
};*/


renderHeatMap();
// render();
renderPoints();
