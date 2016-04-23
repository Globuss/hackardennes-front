// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
    'starter.controllers',
    'leaflet-directive',
    'app.factories',
    'app.services',
    'ngCordova'

])

.run(function($ionicPlatform, $cordovaGeolocation, geoLocation, $ionicPopup, $rootScope) {
  $ionicPlatform.ready(function () {

    $cordovaGeolocation
    .getCurrentPosition()
    .then(function (position) {
      geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude);
    }, function (err) {
      // you need to enhance that point
      $ionicPopup.alert({
        title: 'Ooops...',
        template: err.message
      });

      geoLocation.setGeolocation(defaultLocalisation.latitude, defaultLocalisation.longitude)
    });

    var watch = $cordovaGeolocation.watchPosition({
      frequency: 1000,
      timeout: 3000,
      enableHighAccuracy: false
    }).then(function () {
        }, function (err) {
          // you need to enhance that point
          geoLocation.setGeolocation(defaultLocalisation.latitude, defaultLocalisation.longitude);
        }, function (position) {
          geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude);
          // broadcast this event on the rootScope
          $rootScope.$broadcast('location:change', geoLocation.getGeolocation());
        }
    );

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  })
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.route', {
    url: '/route',
    views: {
      'menuContent': {
        templateUrl: 'templates/route.html',
        controller: 'RouteCtrl'
      }
    }
  })

  .state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map/index.html',
        controller: 'MapCtrl'
      }
    }
  })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/route');
});
