var makeCategories = function (data) {
  var categories = {};
  console.log(data)
  data.forEach(function (d) {
    d.category = d._id.Category;
    categories[d.category] = d.category;
    d.date = d._id.Date;
  });


  // make buttons for every crime category
  _.each(categories, function (value) {
    $("#categories").append("<dd class=\"category\">" + value + "</dd>");
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
};
$.get('api/categories', function (data) {
  makeCategories(JSON.parse(data));
})