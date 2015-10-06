var categories = ["ROBBERY", "LARCENY/THEFT", "ASSAULT"];
// make buttons for every crime category
categories.forEach(function(value) {
  $("#categories").append("<button class=category>" + value + "</button>");
});
// on hover display only those crimes within that category
$(".category").mouseenter(function () {
  var category = $(this).text();
  svg.selectAll("circle")
  .each(function(d) {
    if(d.Category !== category) {
      d3.select(this).attr("r", "0px")
    }
  })
});
// restore back to a map with all crimes on louse leave
$(".category").mouseleave(function () {
  svg.selectAll("circle")
  .attr("r", "1px");
});

