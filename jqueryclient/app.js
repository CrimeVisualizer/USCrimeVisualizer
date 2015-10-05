window.data = {};

var arr = [];
var projection, now;
// have a global variable for current time
// that variable is set to where the clock is currently at
var currentTime = "00:00";
var day = "Wednesday,09/09/2015,";
var playbackSpeed = 200;
// another global variable play is set to false initially
// when true, the animation will play
var play = false;


var getData = function (callback, params) {
  /* Makes ajax call to database with 
     the needed params. eg the start date from where to fetch crimes
  */
  params = params || '';
  $.get('/api/events/' + params , function (data) {
    callback(data);
  });
};

var renderPoints = function (data, callback) {
      // renders points of crime on the map created by render() function call 
      // this function gets called by an event in timeline.js
      // depending on what timeperiod the user requested, this function will get called
      // with different params 
      var coord;
      // add circles to svg
      var svg = d3.select("#city").selectAll("svg");
      // tooltip element is invisible by default
      var tooltip = d3.select("body").append("div") 
          .attr("class", "tooltip")       
          .style("opacity", 0);
      // add dots to svg
      // this is where the magic happens 
      // 'glues' the dots to the map
      // d3 is smart enough to know where to put the dots based on lat and longitude
      svg.selectAll("circle")
      // .remove()
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

      .attr("r", "3px")
      // .transition()
      // .delay(1500)
      // .ease("cubic-in-out")
      // .style("fill", "#eeeeee")
      // .attr("r", "0px");

      .on("mouseover", function(d) {
          // render tooltip when hovering over a crime 
          tooltip.transition()    
             .duration(200)    
             .style("opacity", .9);    
          tooltip.html("<p>"+d.Category+"</p>" + "<p>"+ d.Address+"</p>")

            .style("left", (d3.event.pageX) + "px")   
            .style("top", (d3.event.pageY - 28) + "px");
          })          
      .on("mouseout", function(d) {   
          // make tooltip invisible when user stops hovering over dot  
          tooltip.transition()    
              .duration(500)    
              .style("opacity", 0); 
          svg.selectAll('circle')
          .attr("r", "3px");
      });
      // displays the district name on top of the map on hover 
      $('svg path').hover(function() {
        $("#district").text($(this).data("name"));
      });
      callback();
};

var animatePoints = function(svg) {
  // set all the crime dots to invisible
  svg.selectAll("circle")
  // .attr("r", "0px")
  // they will take 500 ms to appear

  .transition(500)
  // but this will be delayed by the hour and minute of the crime in the database 
  .delay(function(d) {
    var time = d.Time.split(":");
    return (time[0] * 1000) + ((time[1] / 60) * 1000);
  })
  // make it look nice
  .ease("cubic-in-out")
  .attr("r", "2px")

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
  var width = .9 * window.innerWidth, height = .9 * window.innerHeight;
  var zoom = d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoomed);
  // Creates the map svg
  var svg = d3.select('#city').append("svg").attr("width", width).attr("height", height)
    .append("g")
    .call(zoom)
    .append("g");
     

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

  function zoomed () {
      svg.attr("transform",
          "translate(" + zoom.translate() + ")" +
          "scale(" + zoom.scale() + ")"
      );
  }

  function interpolateZoom (translate, scale) {
      return d3.transition().duration(350).tween("zoom", function () {
          var iTranslate = d3.interpolate(zoom.translate(), translate),
              iScale = d3.interpolate(zoom.scale(), scale);
          return function (t) {
              zoom
                  .scale(iScale(t))
                  .translate(iTranslate(t));
              zoomed();
          };
      });
  }

  function zoomClick () {
      var clicked = d3.event.target,
          direction = 1,
          factor = 0.2,
          target_zoom = 1,
          center = [width / 2, height / 2],
          extent = zoom.scaleExtent(),
          translate = zoom.translate(),
          translate0 = [],
          l = [],
          view = {x: translate[0], y: translate[1], k: zoom.scale()};

      d3.event.preventDefault();
      direction = (this.id === 'zoom_in') ? 1 : -1;
      target_zoom = zoom.scale() * (1 + factor * direction);

      if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

      translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
      view.k = target_zoom;
      l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

      view.x += center[0] - l[0];
      view.y += center[1] - l[1];

      interpolateZoom([view.x, view.y], view.k);
  }

  // set up listener for clicking on zoom buttons
  d3.selectAll(".zoom").on('click', zoomClick);
  // renderPoints(svg, projection);
};

// Set up clock on the screen
var svgOverlay = d3.select("#clockBoard");
var svg = d3.selectAll("#clock");


svgOverlay.attr("id", "overlay");

var digit = svg.selectAll(".digit");
var separator = svg.selectAll(".separator circle");

var digitPattern = [
  [1,0,1,1,0,1,1,1,1,1],
  [1,0,0,0,1,1,1,0,1,1],
  [1,1,1,1,1,0,0,1,1,1],
  [0,0,1,1,1,1,1,0,1,1],
  [1,0,1,0,0,0,1,0,1,0],
  [1,1,0,1,1,1,1,1,1,1],
  [1,0,1,1,0,1,1,0,1,1]
];

function tick (dtg) {
    now = new Date(dtg),
        hours = now.getHours(),
        minutes = now.getMinutes(),
        seconds = now.getSeconds();
    

    digit = digit.data([hours / 10 | 0, hours % 10, minutes / 10 | 0, minutes % 10, seconds / 10 | 0, seconds % 10]);
    digit.select("path:nth-child(1)").classed("lit", function(d) { return digitPattern[0][d]; });
    digit.select("path:nth-child(2)").classed("lit", function(d) { return digitPattern[1][d]; });
    digit.select("path:nth-child(3)").classed("lit", function(d) { return digitPattern[2][d]; });
    digit.select("path:nth-child(4)").classed("lit", function(d) { return digitPattern[3][d]; });
    digit.select("path:nth-child(5)").classed("lit", function(d) { return digitPattern[4][d]; });
    digit.select("path:nth-child(6)").classed("lit", function(d) { return digitPattern[5][d]; });
    digit.select("path:nth-child(7)").classed("lit", function(d) { return digitPattern[6][d]; });
    separator.classed("lit", minutes);

  if (play) {
    // if current date matches an event, render that event on screen
    if (window.data[now]) {
      // arr.concat(window.data[now]);
      renderPoints(window.data[now], function () {
        setTimeout(function() {
          tick(now.getTime() + 60000)
        }, playbackSpeed); // animate the clock at speed of playbackSpeed
      });

    } else {
      setTimeout(function() {
        tick(now.getTime() + 60000)
      }, playbackSpeed);
    }
  }
}


getData(function (data) {
  // save results of data in window for fast lookup by date time group
  data = JSON.parse(data);
  for (var i = 0; i < data.length; i++) {
    var dtg = new Date(day + data[i].Time);
    if (window.data[dtg]) {
      window.data[dtg].push(data[i]);
    } else { // in case there are multiple events at the same time, we will store them in an array
      window.data[dtg] = [data[i]];
    }
  }
  render();
  tick(day + currentTime);
});

// play button will also have an on click event
// the callback should set play to the opposite of what it was and relaunch tick function
d3.selectAll("#play, #pause").on("click", function () {
  // switch from showing play or pause button
  $("#play").toggle();
  $("#pause").toggle();
  // if play is false, pressing play will set it to true, and vice versa
  play = !play;
  tick(now);
});

