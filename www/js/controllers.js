angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {


})

.controller('RouteCtrl', function($scope) {

})

.controller('MapCtrl', function($scope, geoLocation) {
    console.log(geoLocation.getGeolocation());
    angular.extend($scope, {
        london: {
            lat: 51.505,
            lng: -0.09,
            zoom: 4
        }
    });
})
;


