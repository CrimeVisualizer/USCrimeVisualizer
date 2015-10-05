var graphs = function (data) {
  var margin = {top: 30, right: 100, bottom: 30, left: 60},
  width = window.innerWidth - 100 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom;

  // Parse the date / time
  var parseDate = d3.time.format("%Y-%m");
  var parseFullDate = d3.time.format("%B of %Y")

//   // Set the ranges
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
  .orient("bottom").ticks(10);

  var yAxis = d3.svg.axis().scale(y)
  .orient("left").ticks(5);

  // Define the line
  var valueline = d3.svg.line()
  .interpolate("cardinal")
  .x(function(d) { return x(d.Date); })
  .y(function(d) { return y(d.count); });
  
  // Adds the svg canvas
  var svg = d3.select("#graph")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
    "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  data.forEach(function (d) {
  d.Date = parseDate.parse(d._id.Date);
  d.count = +d.count
  });

  data.sort(function (a, b) {
  return a.Date-b.Date;
  });
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.Date; }));
  y.domain([d3.min(data, function(d) { return d.count; }), d3.max(data, function(d) { return d.count; })]);

  // Add the valueline path.
  svg.append("path")
  .attr("class", "line")
  .attr("d", valueline(data));

  // Add the X Axis
  svg.append("g")
  .attr("class", "x axis")
  .attr("fill", "#8A9194")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

  // Add the Y Axis
  svg.append("g")
  .attr("fill", "#8A9194")
  .attr("class", "y axis")
  .call(yAxis);


  var bisectDate = d3.bisector(function(d) { return d.Date; }).left;

  var focus = svg.append("g")
    .attr("class", "focus")
    .style("display", "none");

  focus.append("circle")
    .attr("r", 4.5);

  focus.append("text")
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("fill", "#8A9194")

  var mousemove = function () {
    var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0 > d1 - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.Date) + "," + y(d.count) + ")");
    focus.select("text").text( d.count + ' crimes committed in '+ parseFullDate(d.Date));
  };

  var click = function () {
    var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0 > d1 - x0 ? d1 : d0;
    getData(function (data) {
      data = JSON.parse(data);
      var date = new Date(d.Date);
      storeData(data);
      tick(date);
    }, 'date=' + parseDate(d.Date));
  };
  svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() { focus.style("display", null); })
    .on("mouseout", function() { focus.style("display", "none"); })
    .on("mousemove", mousemove)
    .on("click", click);
}

$.get('/api/graphs', function (data) {
  graphs(JSON.parse(data));
});
