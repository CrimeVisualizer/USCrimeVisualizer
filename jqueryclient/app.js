var getData = function (callback) {
  $.get('/api/events', function (data) {
    callback(data);
  });
};

var renderPoints = function (svg, projection) {
  getData(function (data) {
      var coord;
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
      .attr("r", "2px")

      $('svg path').hover(function() {
        $("#details").text($(this).data("id") + " : " + $(this).data("name"));
      });

      // $('svg circle').hover(function() {
      //   $("#details").text($(this).data("id") + " : " + $(this).data("name"));
      // });
  });
};

var render = function () {
  var width = .8 * window.innerWidth, height = .85 * window.innerHeight;

  // Creates the map svg
  var svg = d3.select('#city').append("svg").attr("width", width).attr("height", height);

  // Map of San Francisco
  var projection = d3.geo.mercator().scale(1).translate([0, 0]).precision(0);
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

  renderPoints(svg, projection);
};


render();
