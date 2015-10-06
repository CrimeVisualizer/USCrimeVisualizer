var makeCategories = function (data) {
  data.sort(function(a,b) {
    if (a._id.Category > b._id.Category) 
      {return 1}
    else {
      return -1;
    }

  });
  var categories = [];
  data.forEach(function (d) {
    categories.push([d._id.Category, d.count]);
  });
  $(".categories").empty();

  // make buttons for every crime category
  _.each(categories, function (value) {
    $(".categories").append("<dd class=\"category\">" + value[0] + " " + value[1] + "</dd>");
  });
  // on hover display only those crimes within that category
    var svg = d3.select("#map").selectAll("svg");
  $(".category").mouseenter(function () {
    var category = $(this).text().split(" ")[0];
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
    .attr("r", "3px");
  });
};
