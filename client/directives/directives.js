angular.module('crimevis.directives', ['crimevis.services'])

.directive('d3Events', ['d3Service', function(d3Service) {

  return {
    restrict: 'EA',

    scope: {
      data: '=' // sets up two way data binding
    },

    link: function (scope, element, attrs) {
      d3Service.d3().then(function(d3) {
        var width = 0.85 * window.innerWidth, height = 0.85 * window.innerHeight;

        var svg = d3.select(element[0]).append("svg").attr("width", width).attr("height", height);
        // Resize any d3 elements when the window resizes
        window.onresize = function () {
          scope.$apply();
        };

        // set up listener to watch for changes to the data
        // when data changes, we will re-render the view
        scope.$watch('data', function (newVals, oldVals) {
          return scope.render(newVals);
        }, true);

        scope.render = function (data) {
          // remove all previous data before render
          // console.log('Data is equal to: ', data);

          svg.selectAll('*').remove();

          // Map of San Francisco

          // if no data gets passed in, return
          // if (!scope.data) {
          //   return;
          // }



          var projection = d3.geo.mercator().scale(1).translate([0, 0]).precision(0);
          var path = d3.geo.path().projection(projection);
          var bounds = path.bounds(data.map);

          xScale = width / Math.abs(bounds[1][0] - bounds[0][0]);
          yScale = height / Math.abs(bounds[1][1] - bounds[0][1]);
          scale = xScale < yScale ? xScale : yScale;

          var transl = [(width - scale * (bounds[1][0] + bounds[0][0])) / 2, (height - scale * (bounds[1][1] + bounds[0][1])) / 2];
          projection.scale(scale).translate(transl);

          svg.selectAll("path").data(data.map.features).enter().append("path").attr("d", path).attr('data-id', function(d) {
            return d.id;
          }).attr('data-name', function(d) {
            return d.properties.name;
          });
          // .style("fill", "#ffffff").style("stroke", "#111111");

          // points
          // aa = [-122.490402, 37.786453];
          // bb = [-122.389809, 37.72728];
          // console.log(scope.data);
          // console.log('location', scope.data.location);
          var coord;
        // add circles to svg
          svg.selectAll("circle")
          .data(data.events).enter()
          .append("circle")
          .attr("cx", function (d) { 
            coord = [d.X, d.Y];
            // console.log(projection(d)); 
            // d.Location = JSON.parse(d.Location.replace('(', '[').replace(')',']'));
            // d.Location.reverse();
            return projection(coord)[0]; 
          })
          .attr("cy", function (d) { 
            // d.Location = JSON.parse(d.Location.replace('(', '[').replace(')',']'));
            coord = [d.X, d.Y];
            // console.log("d is :",d);
            return projection(coord)[1]; 
          })
          .attr("r", "2px")
          // .attr("fill", "red")


          $('svg path').hover(function() {
            $("#details").text($(this).data("id") + " : " + $(this).data("name"));
          });

          $('svg circle').hover(function() {
            $("#details").text($(this).data("id") + " : " + $(this).data("name"));
          });
        
        };
      })
    }
  };

}])



