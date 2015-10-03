window.data = {};

var projection;

var getData = function (callback) {
  $.get('/api/events', function (data) {
    callback(data);
  });
};

// var renderPoints = function (svg, projection) {
//   // getData();
//   function (data) {
//       var coord;
//       // add circles to svg
//       data = JSON.parse(data);
//       svg.selectAll("circle")
//       .data(data).enter()
//       .append("circle")
//       .attr("cx", function (d) {
//         coord = [d.X, d.Y];
//         return projection(coord)[0]; 
//       })
//       .attr("cy", function (d) { 
//         coord = [d.X, d.Y];
//         return projection(coord)[1]; 
//       })
//       .attr("r", "2px");

//       $('svg path').hover(function() {
//         $("#details").text($(this).data("id") + " : " + $(this).data("name"));
//       });
//       // animatePoints(svg);
//   }
// };

var renderPoints = function (data, callback) {
        var coord;
      // add circles to svg
      // debugger;
      // data = JSON.parse(data);
      var svg = d3.select("#city").selectAll("svg");
      svg.selectAll("circle").remove()
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
      .attr("r", "2px");

      $('svg path').hover(function() {
        $("#details").text($(this).data("id") + " : " + $(this).data("name"));
      });
      callback();
}

var animatePoints = function(svg) {
  svg.selectAll("circle")
  .attr("r", "0px")
  .transition(500)
  .delay(function(d) {
    var time = d.Time.split(":");
    return (time[0] * 1000) + ((time[1] / 60) * 1000);
  })
  .ease("cubic-in-out")
  .attr("r", "2px")

  .transition()
  .delay(function(d) {
    var time = d.Time.split(":");
    return ((time[0] * 1000) + ((time[1] / 60) * 1000) + 1000);
  })
  .ease("cubic-in-out")
  .attr("r", "0px");
};


var render = function () {
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
  var now = new Date(dtg),
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
  // if current date matches an event, render that event on screen
  // debugger;
  if (window.data[now]) {
    debugger;
    renderPoints(window.data[now], function () {
      setTimeout(function() {
        tick(now.getTime() + 60000)
      }, 800);
    });

  } else {
    setTimeout(function() {
      tick(now.getTime() + 60000)
    }, 800);
    // tick(now.getTime() + 60000);
  }
  // animate the clock so that every 800 ms is a minute
}

var day = "Wednesday,09/09/2015,";

getData(function (data) {
  // save results of data in window for fast lookup by date time group
  data = JSON.parse(data);
  // debugger;
  for (var i = 0; i < data.length; i++) {
    // debugger;
    var dtg = new Date(day + data[i].Time);
    if (window.data[dtg]) {
      window.data[dtg].push(data[i]);
    } else { // in case there are multiple events at the same time, we will store them in an array
      window.data[dtg] = [data[i]];
    }
  }
  render();
  tick(day + "00:00");
});