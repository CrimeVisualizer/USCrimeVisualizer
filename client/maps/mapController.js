angular.module('crimevis.maps', [])

.controller('mapController', function($scope, Events) {
  $scope.data = {};
  $scope.data.events = [];
  // limit the number of requests to the server
  var requests = 0;
  $scope.getEvents = function() {
    Events.fetchEvents().then(function (resp) {
      $scope.data.events.push(resp.data);
      requests++;
      // add data to the events array while requests are less than 10
      if (requests <= 10) {
        $scope.getEvents();
      }
    });
  };
  $scope.getEvents();
})