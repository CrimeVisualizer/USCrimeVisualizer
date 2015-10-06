var heatmap = false;

// the callback should set play to the opposite of what it was and relaunch tick function
d3.selectAll("#heatmap").on("click", function () {
  if(heatmap) {
    console.log('turning off')
    // toggle heatmap off
    var svg = d3.select("#map").selectAll("svg");
    svg.selectAll("path")
          .attr("class", 'qOff')
    // set heatmap to off
    heatmap = false;
  } else { // Toggles heatmap on
    console.log('turning on')
    renderHeatMap(dataSet);
    heatmap = true;
  }
});


// Calculates min and max of crime data set for use in quantize
var getMaxMin = function (data) {
  var resultArray = [];
  var dataMax = _.max(data, function(item) {
    return item;
  });
  var dataMin = _.min(data, function(item) {
    return item;
  });
  resultArray.push(dataMin);
  resultArray.push(dataMax);
  // console.log(resultArray);
  return resultArray;
};

// Renders Heat Map - this is rendered in place of standard map
var renderHeatMap = function (aggregate) {
  var maxMinArray = getMaxMin(aggregate);

  // Generates a range of 9 values within the provided domain.
  // Function used to generated CSS class values, 0-8.
  // Values correspond to a range of blues in CSS file (see CSS file)

  // render();

  var quantize = d3.scale.quantize()
      .domain(maxMinArray)
      .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

   var svg = d3.select("#map").selectAll("svg");

      // Render the heat map
      svg.selectAll("path")
          .attr("class", function(d) {
            return quantize(aggregate[d.id]); // Quantize by total crimes per zipcode
          });
};

// Import data
  var dataSet = { 
  '94102': 288,
  '94103': 491,
  '94104': 22,
  '94105': 65,
  '94107': 158,
  '94108': 71,
  '94109': 180,
  '94110': 278,
  '94111': 73,
  '94112': 158,
  '94114': 98,
  '94115': 112,
  '94116': 49,
  '94117': 151,
  '94118': 69,
  '94121': 53,
  '94122': 102,
  '94123': 70,
  '94124': 212,
  '94127': 36,
  '94131': 48,
  '94132': 52,
  '94133': 139,
  '94134': 71 
  }

// renderHeatMap(dataSet);


// Sum each zipcode count by each record
var getZipcodeCount = function (data) {
  return _.countBy(data, function(record) {
    return record['zipcode'];
  });
};