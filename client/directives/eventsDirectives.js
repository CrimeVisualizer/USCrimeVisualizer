angular.module('crimevis.eventDirectives', ['crimevis.services'])

.directive('d3Events', ['d3Service', function(d3Service) {

  return {
    restrict: 'EA',

    scope: {
      data: '=' // sets up two way data binding
    },

    link: function (scope, element, attrs) {
      d3Service.d3().then(function (d3) {
        // var width = window.innerWidth, height = window.innerHeight;

        var svg = d3.select('svg');
        // Resize any d3 elements when the window resizes
        // window.onresize = function () {
        //   scope.$apply();
        // };

        // set up listener to watch for changes to the data
        // when data changes, we will re-render the view
        scope.$watch('data', function (newVals, oldVals) {
          return scope.render(newVals);
        }, true);

        scope.render = function (data) {
        // add circles to svg
          svg.selectAll("circle")
          .data(scope.data.events).enter()
          .append("circle")
          .attr("cx", function (d) { 
            var coord = [d.X, d.Y];
            return projection(coord)[0]; 
          })
          .attr("cy", function (d) { 
            var coord = [d.X, d.Y];
            return projection(coord)[1]; 
          })
          .attr("r", "2px")
          .attr("fill", "red")


          $('svg path').hover(function() {
            $("#details").text($(this).data("id") + " : " + $(this).data("name"));
          });

          $('svg circle').hover(function() {
            $("#details").text($(this).data("id") + " : " + $(this).data("name"));
          });
        
        };

      });
    }
  }

}])

