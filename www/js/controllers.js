angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    $scope.myWidth = window.innerWidth;

})

.controller('RouteCtrl', function($scope,Path, geoLocation, leafletData, loadMoreServiceRoute) {

    $scope.doRefresh = function() {

        $scope.paths = [];
        console.log(geoLocation.getGeolocation().lat);

        var mainMarker = {
            lat: geoLocation.getGeolocation().lat,
            lng: geoLocation.getGeolocation().lng
        };

        var redMarker = L.AwesomeMarkers.icon({
            icon: 'coffee',
            prefix: 'fa',
            markerColor: 'red'
        });

        var positionMarker = L.AwesomeMarkers.icon({
            icon: 'user',
            prefix: 'fa',
            markerColor: 'blue'
        });

        var position =
            ["", geoLocation.getGeolocation().lat, geoLocation.getGeolocation().lng];

        var markers = [
            ["", 49.761689, 4.717770],
            ["", 49.752374, 4.720516],
            ["", 49.703549, 4.938526]
        ];

        angular.extend($scope, {
            maxbounds: {}
        });

        var markerArray = [];
        markerArray.push([49.761689, 4.717770]);
        markerArray.push([49.752374, 4.720516]);
        markerArray.push([49.703549, 4.938526]);
        markerArray.push([geoLocation.getGeolocation().lat, geoLocation.getGeolocation().lng]);

        leafletData.getMap().then(function (map) {

            position = new L.marker([position[1], position[2]], {icon: positionMarker})
            .bindPopup(position[0])
            .addTo(map);

            for (var i = 0; i < markers.length; i++) {
                marker = new L.marker([markers[i][1], markers[i][2]], {icon: redMarker})
                .bindPopup(markers[i][0])
                .addTo(map);

            }

            var bbox = L.latLngBounds(markerArray);
            //$scope.maxbounds.southWest = bbox.getSouthWest();
            //$scope.maxbounds.northEast = bbox.getNorthEast();
            map.fitBounds(bbox);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '',
            }).addTo(map);


            /*L.Routing.control({
             waypoints: [
             L.latLng(57.74, 11.94),
             L.latLng(57.6792, 11.949)
             ]
             }).addTo(map);*/

        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function () {

        if ($scope.nextPage == null){
            $scope.nextPage = '/paths?page=1&lat='+geoLocation.getGeolocation().lat+'&long='+geoLocation.getGeolocation().lng;
        }
        loadMoreServiceRoute.get($scope.nextPage).then(function (paths) {
            $scope.paths = $scope.paths.concat(
                paths

        );
            $scope.nextPage = paths.metadata.nextPage;
            console.log($scope.nextPage);
            if (!paths.metadata.nextPage) {
                $scope.noMoreItemsAvailable = true;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

        });

    };
    $scope.doRefresh();

})

.controller('MapCtrl', function($scope, geoLocation, leafletData) {

    console.log(geoLocation.getGeolocation().lat);

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


.controller('ItemCtrl', function ($scope){
    $scope.minor = $stateParams.minor;
    $scope.major = $stateParams.major;



})
;


