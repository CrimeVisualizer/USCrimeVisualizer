angular.module('crimevis.mapDirectives', ['crimevis.services'])

.directive('d3Map', ['d3Service', function(scope, d3Service) {
  return {
    restrict: 'EA',

    scope: {
      data: '=' // sets up two way data binding
    },

    link: function (scope, element, attrs) {
      d3Service.d3().then(function(d3) {
        var width = window.innerWidth, height = window.innerHeight;

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
          svg.selectAll('*').remove();

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
          }).style("fill", "#ffffff").style("stroke", "#111111");
        }
      })
    }
  }

}])
