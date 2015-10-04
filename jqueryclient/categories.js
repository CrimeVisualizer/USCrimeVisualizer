var categories = ["ROBBERY", "LARCENY/THEFT", "ASSAULT"];

categories.forEach(function(value) {
  $("#categories").append("<button class=category>" + value + "</button>");
});

$(".category").mouseenter(function () {
  var category = $(this).text();
  svg.selectAll("circle")
  .each(function(d) {
    if(d.Category !== category) {
      d3.select(this).attr("r", "0px")
    }
  })
});


$(".category").mouseleave(function () {
  svg.selectAll("circle")
  .attr("r", "1px");
});

