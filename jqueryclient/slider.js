var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var makeYears = function() {
  for(var i = 2003; i < 2016; i++) {
    $("#timeline").append("<button class='year' id=" + i + ">"+ i +"</button>");
  }
}

var makeMonths = function() {
  months.forEach(function(value, index) {
    var monthNumber = index + 1;
    $("#months").append("<button class='month' id=" + monthNumber + 1 + ">"+ value +"</button>");
  });
}
makeYears();
makeMonths();

var getMonth = function() {
  console.log('getting data');
  var year = $('.active.year').val();
  var month = $('.active.month').val();
  console.log(year, month);
  // $.get('/slider', function (data) {
  //   callback(data);
  // });

}

$(".year").on("click", function(e) {
  $(this).attr("class", "active");
  getData();
});
$(".month").on("click", function(e) {
  $(this).attr("class", "active");
  getData();
});



