angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http) {

    $scope.myWidth = window.innerWidth;
    var req = $http.get('http://un-zero-un-api.herokuapp.com/paths/themes/all');
       req.success(function(data,status,headers,config){
          console.log(data);
          $scope.themes = data;

       });
       req.error(function(data,status,headers,config){
          alert('bug');
       });
})

.controller('RouteCtrl', function($scope,Path, geoLocation, leafletData, loadMoreServiceRoute,$ionicScrollDelegate,$stateParams, $rootScope) {

    $scope.nearest = null;
    $rootScope.$on('beacons:changed', function(event, nearest) {
        $scope.nearest = nearest;
    });

    $scope.doRefresh = function() {
        $scope.loadMore(true);

    };
        Path.getList({lat:geoLocation.getGeolocation().lat, long:geoLocation.getGeolocation().lng}).then(function (paths) {

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

            var markers = [];
            var markersBounds = [];
             var i = 0;
            angular.forEach(paths, function(value, key) {
                if (i < 5) {
                markersBounds.push([value[0].points[0].latitude,value[0].points[0].longitude]);
                }
                markers.push(["23",value[0].points[0].latitude,value[0].points[0].longitude]);
                i += 1;
            });
            markersBounds.push([geoLocation.getGeolocation().lat, geoLocation.getGeolocation().lng]);

            var position =
                ["", geoLocation.getGeolocation().lat, geoLocation.getGeolocation().lng];

            angular.extend($scope, {
                maxbounds: {}
            });

            leafletData.getMap().then(function (map) {

                position = new L.marker([position[1], position[2]], {icon: positionMarker})
                .bindPopup(position[0])
                .addTo(map);

                for (var i = 0; i < markers.length; i++) {
                    marker = new L.marker([markers[i][1], markers[i][2]], {icon: redMarker})
                    .bindPopup(markers[i][0])
                    .addTo(map);

                }
                var bbox = L.latLngBounds(markersBounds);
                //$scope.maxbounds.southWest = bbox.getSouthWest();
                //$scope.maxbounds.northEast = bbox.getNorthEast();
                map.fitBounds(bbox);
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '',
                }).addTo(map);
        });

        $scope.paths = [];
        $scope.noMoreItemsAvailable = false;

            /*L.Routing.control({
             waypoints: [
             L.latLng(57.74, 11.94),
             L.latLng(57.6792, 11.949)
             ]
             }).addTo(map);*/

        });


    $scope.loadMore = function (refresh) {

        if (refresh){
            $scope.nextPage = null;
            $scope.paths =[];
        }
            var theme = '';
              if($stateParams.theme != null){
                  theme = '&theme='+$stateParams.theme;
              }
            if ($scope.nextPage == null){

                $scope.nextPage = '/paths?page=1&lat='+geoLocation.getGeolocation().lat+'&long='+geoLocation.getGeolocation().lng+theme;
            }
        loadMoreServiceRoute.get($scope.nextPage).then(function (paths) {
            $scope.paths = $scope.paths.concat(
                paths

        );
            $scope.nextPage = paths.metadata.nextPage;

            if (!paths.metadata.nextPage) {
                $scope.noMoreItemsAvailable = true;
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');
            $ionicScrollDelegate.resize();
            $scope.$broadcast('scroll.refreshComplete');

        });

    };
    $scope.doRefresh(false);

})

.controller('RouteDetailCtrl', function($scope, Restangular, $stateParams) {
    Restangular.oneUrl('/paths/' + $stateParams.id).get().then(function(path) {
        $scope.path = path;
    });
})

.controller('PointCtrl', function($scope, Restangular, $stateParams) {
    Restangular.oneUrl('/points/' + $stateParams.id).get().then(function(point) {
        $scope.point = point;
        Restangular.oneUrl(point.path).get().then(function(path) {
            $scope.path = path;
        });
    });
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


.controller('StartRouteCtrl', function ($scope){

    $scope.minor = $stateParams.minor;
    $scope.major = $stateParams.major;
})


.controller('RouteMapCtrl', function (geoLocation, leafletData, $stateParams, Restangular){

    var pathUrl = '/paths/' + $stateParams.id;
    var markersArray = [];
    //  les coord des points + champ popup
    Restangular.oneUrl(pathUrl).get().then(function(path) {
        angular.forEach(path.points, function(point, key) {
            markersArray.push([point.latitude,point.longitude])
        });


        //Affiche marqueurs avec itineraire
        leafletData.getMap().then(function (map) {

          L.Routing.control({
                waypoints : markersArray
            }).addTo(map);
        });
    });
})
;


