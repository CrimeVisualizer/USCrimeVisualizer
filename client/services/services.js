angular.module('crimevis.services', [])

.factory('Events', function ($http) {
  var fetchEvents = function () {
    // the call to get our data
    return $http.get('/api/events');
  }
  
  return {
    fetchEvents: fetchEvents
  };
})