// make buttons for months and years
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var makeYears = function() {
  for(var i = 2003; i < 2016; i++) {
    $("#timeline").append("<button class='year' id=" + i + ">"+ i +"</button>");
  }
}
var makeMonths = function() {
  months.forEach(function(value, index) {
    var monthNumber = index + 1;
    $("#months").append("<button class='month' id=" + monthNumber + ">"+ value +"</button>");
  });
}
makeYears();
makeMonths();
// IMPORTANT: below function will fire renderpoints() (in app.js) with certain params
var getMonth = function() {
  console.log('getting data');
  var year = $('.active.year').attr("id");
  var month = $('.active.month').attr("id");
  console.log(year, month);
  renderPoints('date=' + year + '-' + month);
}
// click events for year and month
$(".year").on("click", function(e) {
  $(".year").removeAttr("class", "active");
  $(this).attr("class", "active year");
  console.log(this);
});
// clicking the month will fire getMonth() function
$(".month").on("click", function(e) {
  $(".month").removeAttr("class", "active");
  $(this).attr("class", "active month");
  getMonth();
});



