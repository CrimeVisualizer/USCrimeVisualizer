var svg, projection;


var getData = function (callback, params) {
  /* Makes ajax call to database with 
     the needed params. eg the start date from where to fetch crimes
  */
  $.get('/api/events/' + params , function (data) {
    console.log(params);
    callback(data);
  });
};


var renderPoints = function (params) {
  // renders points of crime on the map created by render() function call 
  // this function gets called by an event in timeline.js
  // depending on what timeperiod the user requested, this function will get called
  // with different params 
  getData(function (data) {
      // data is a in JSON format
      // data contains the crimes in the timeperiod specified in params
      var coord;

      // tooltip element is invisible by default
      var tooltip = d3.select("body").append("div") 
          .attr("class", "tooltip")       
          .style("opacity", 0);
      
      // add dots to svg
      // this is where the magic happens 
      // 'glues' the dots to the map
      // d3 is smart enough to know where to put the dots based on lat and longitude
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

      .attr("r", "1px") 
      .attr("stroke", "red")
      .on("mouseover", function(d) {
          // render tooltip when hovering over a crime 
          tooltip.transition()    
             .duration(200)    
             .style("opacity", .9);    
          tooltip.text(d.Category)  
             .style("left", (d3.event.pageX) + "px")   
             .style("top", (d3.event.pageY - 28) + "px");
          })          
      .on("mouseout", function(d) {   
          // make tooltip invisible when user stops hovering over dot  
          tooltip.transition()    
              .duration(500)    
              .style("opacity", 0); 
          svg.selectAll('circle')
          // .attr("r", "1px");
      });
      // displays the district name on top of the map on hover 
      $('svg path').hover(function() {
        $("#details").text($(this).data("id") + " : " + $(this).data("name"));
      });
      // uncomment the below line if you want to animate the points over time
      animatePoints();
  }, params);
};

var animatePoints = function() {

  // set all the crime dots to invisible
  svg.selectAll("circle")
  .attr("r", "0px")
  .attr("stroke", "red")
  // they will take 500 ms to appear
  .transition(500)
  // but this will be delayed by the hour and minute of the crime in the database 
  .delay(function(d) {
    var time = d.Time.split(":");
    return (time[0] * 1000) + ((time[1] / 60) * 1000);
  })
  // make it look nice
  .ease("cubic-in-out")
  .attr("r", "1px")
  .attr("stroke", "red")
  // make it fade out again
  .transition()
  // every dot will be visible for 1000 ms, hence the last number in the delay function
  .delay(function(d) {
    var time = d.Time.split(":");
    return ((time[0] * 1000) + ((time[1] / 60) * 1000) + 1000);
  })
  .ease("cubic-in-out")
  .attr("r", "0px");
};


var render = function () {
  // Renders the map (districts outline) into the city div. 
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

  // shows district information on top of map when hovering over it
  svg.selectAll("path").data(gsfmap.features).enter().append("path").attr("d", path).attr('data-id', function(d) {
    return d.id;
  }).attr('data-name', function(d) {
    return d.properties.name;
  });
};