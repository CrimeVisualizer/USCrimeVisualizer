angular.module('crimevis.maps', [])

.controller('mapController', function($scope, Events, Maps) {
  var chooseMap = {
    'San Francisco': 'sfMap',
    'New York': 'nyMap',
    'Chicago': 'chiMap'
  }
  // controle.log(Maps.sfMap)
  $scope.data = {map: Maps.sfMap};
  // limit the number of requests to the server
  // var requests = 0;
  $scope.getEvents = function() {
    Events.fetchEvents().then(function (resp) {
      console.log(resp.data);
      $scope.data.events = resp.data;
      // requests++;
      // add data to the events array while requests are less than 10
      // if (requests <= 10) {
      //   $scope.getEvents();
      // }
    });
  };
  // $scope.getEvents();
})