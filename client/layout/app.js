angular.module('crimevis', [
  'crimevis.services',
  'crimevis.maps',
  'ngRoute'
  ])

.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/about', {
      templateUrl: '/welcome/about.html'
    })
    // home page will automatically point to the map
    .when('/', {
      templateUrl: '/maps/mapView.html',
      controller: 'mapController'
    })
    .otherwise('/');
})