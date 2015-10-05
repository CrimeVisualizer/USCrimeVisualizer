
var getData = function (callback) {
  $.get('/api/events/' , function (data) {
    // console.log(params);
    // callback(data);
  });
};

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


// // Sum each zipcode count by each record
// var getZipcodeCount = function (data) {
//   return _.countBy(data, function(record) {
//     return record['zipcode'];
//   });
// };

// // Renders Heat Map - this is rendered in place of standard map
// var renderHeatMap = function () {

<<<<<<< HEAD
  // getData(function (data) {
  //     var coord;

  //     data = JSON.parse(data);
  //     svg.selectAll("path")
  //     .data(data).enter()
      

  //     });
  // }, params);

  // Import data
  var aggregate = { '94102': 288,
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

//     var maxMinArray = getMaxMin(aggregate);

//   // Generates a range of 9 values within the provided domain.
//   // Function used to generated CSS class values, 0-8.
//   // Values correspond to a range of blues in CSS file (see CSS file)
//   var quantize = d3.scale.quantize()
//       .domain(maxMinArray)
//       .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
        

      // Render the heat map
      svg.selectAll("path")
          .attr("class", function(d) {
            return quantize(aggregate[d.id]); // Quantize by total crimes per zipcode
          });
};



// Animate by month
// Animate by day of the week

//key constants 
var anim_start_day = ?
var end_day = ?
var start_delay = 1000;
var time_conversion;

// Function that iterates through the crime data per day per zip code
var year = anim_start_day;

var update_map = function (trans, day) {
  day++;
  if (day <= end_day) { 
    trans.transition()
      .duration( ? )
      .delay(start_delay + (year - anim_start_year) * time_conversion) 
      .attr('fill',function()  { return polygon_color(this,year); }) 
      .ease('linear')
    .call(update_map, year);
  }
};

// Animate by day 
var animateHeatMap = function() {
  svg.selectAll("path")
  .transition(500)
  .delay(function(d) {


    d.Date.split("/")
    return (date[0] );

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

renderHeatMap();
