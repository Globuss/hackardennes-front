angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {


})

.controller('RouteCtrl', function($scope) {

})

.controller('MapCtrl', function($scope, geoLocation, leafletData) {

    console.log(geoLocation.getGeolocation().lat);
    console.log
    var mainMarker = {
        lat: geoLocation.getGeolocation().lat,
        lng: geoLocation.getGeolocation().lng
    };

    var redMarker = L.AwesomeMarkers.icon({
        icon: 'coffee',
        prefix: 'fa',
        markerColor: 'red'
    });

    var markers = [
        ["",49.761689,4.717770],
        ["",49.752374,4.720516],
        ["",49.703549,4.938526]
    ];

    angular.extend($scope, {

        markers: {
            mainMarker: angular.copy(mainMarker)
        },
        maxbounds: {}
    });

    var markerArray = [];
    markerArray.push([49.761689, 4.717770]);
    markerArray.push([49.752374, 4.720516]);
    markerArray.push([49.703549, 4.938526]);
    markerArray.push([geoLocation.getGeolocation().lat, geoLocation.getGeolocation().lng]);

    leafletData.getMap().then(function (map) {

        for (var i = 0; i < markers.length; i++) {
            marker = new L.marker([markers[i][1],markers[i][2]], {icon: redMarker})
            .bindPopup(markers[i][0])
            .addTo(map);
        }

        var bbox = L.latLngBounds(markerArray);
        //$scope.maxbounds.southWest = bbox.getSouthWest();
        //$scope.maxbounds.northEast = bbox.getNorthEast();
        map.fitBounds(bbox);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '',
        }) .addTo(map);


        /*L.Routing.control({
            waypoints: [
                L.latLng(57.74, 11.94),
                L.latLng(57.6792, 11.949)
            ]
        }).addTo(map);*/

    });


})
;


