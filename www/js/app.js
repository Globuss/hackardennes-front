const uuid       = '7473CEE4-6202-11E5-9D70-FEFF819CDC90';
const identifier = '1z1beacons';

var nId = 0;
var nearest = null;

angular.module('starter', ['ionic',
    'starter.controllers',
    'leaflet-directive',
    'app.factories',
    'app.services',
    'app.filters',
    'app.configs',
    'restangular',
    'angularApiHydra',
    'ngCordova'
])
.run(function ($ionicPlatform, $cordovaGeolocation, geoLocation, $ionicPopup, $rootScope, Restangular, $state) {
    $ionicPlatform.ready(function () {
        if (window.cordova) {
            const beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid);
            var delegate = new cordova.plugins.locationManager.Delegate();

            delegate.didDetermineStateForRegion = function (pluginResult) {
                console.log('a');
            };

            delegate.didStartMonitoringForRegion = function (pluginResult) {
                console.log('b');
            };

            delegate.didRangeBeaconsInRegion = function (pluginResult) {
                if (0 === pluginResult.beacons.length) {
                    nearest = null;
                    $rootScope.$broadcast('beacons:changed', nearest);

                    return;
                }

                nearest = pluginResult.beacons.reduce(function (memo, beacon) {
                    if (memo && memo.accuracy < beacon.accuracy) {
                        return memo;
                    }

                    return beacon;
                });

                Restangular
                    .oneUrl('/points/major/' + nearest.major + '/minor/'+ nearest.minor).get()
                    .then(function(point) {
                        $rootScope.$broadcast('beacons:changed', point);

                        var value = {major: nearest.major, minor: nearest.minor};

                        if (
                            !window.localStorage.getItem('beacon') ||
                            !window.localStorage.getItem('beacon').major ||
                            window.localStorage.getItem('beacon') != value
                        ) {
                            window.localStorage.setItem('beacon', value);
                            cordova.plugins.notification.local.isPresent(nId, function (present) {
                                if (present) {
                                    return;
                                }

                                cordova.plugins.notification.local.schedule({
                                    id:    ++nId,
                                    title: 'Point de curiosité',
                                    text:  point.name
                                });
                            });
                        }
                    });
            };

            cordova.plugins.notification.local.on('click', function (notification) {
                Restangular
                    .oneUrl('/points/major/' + nearest.major + '/minor/'+ nearest.minor).get()
                    .then(function(point) {
                        $state.go('app.route');
                        $state.go('app.point', {id:point['@id'].substr(point['@id'].indexOf('/', 1) +  1)});
                    });

            });

            cordova.plugins.locationManager.setDelegate(delegate);
            cordova.plugins.locationManager.requestAlwaysAuthorization();
            cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
                .fail(console.error)
                .done();
        }

        $cordovaGeolocation
            .getCurrentPosition()
            .then(function (position) {
                geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude);
            }, function (err) {
                $ionicPopup.alert({
                    title: 'Ooops...',
                    template: err.message
                });

            });

        var watch = $cordovaGeolocation.watchPosition({
            frequency: 1000,
            timeout: 3000,
            enableHighAccuracy: false
        }).then(
            function () { },
            function (err) { },
            function (position) {
                geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude);
                $rootScope.$broadcast('location:change', geoLocation.getGeolocation());
            }
        );

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    })
})
.config(function ($stateProvider, $urlRouterProvider) {
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

        .state('app.routeTheme',{
            url : '/route/:theme',
            views: {
                'menuContent': {
                    templateUrl: 'templates/route.html',
                    controller: 'RouteCtrl'
                }
            },
            params : {
                theme:null
            }
        })

        .state('app.route_detail', {
            url: '/route/paths/:id',
            views: {
                'menuContent': {
                    templateUrl: 'templates/route_detail.html',
                    controller: 'RouteDetailCtrl'
                }
            }
        })

        .state('app.point', {
            url: '/points/:id',
            views: {
                'menuContent': {
                    templateUrl: 'templates/point.html',
                    controller: 'PointCtrl'
                }
            }
        })

        .state('startRoute', {
            cache: false,
            url: '/startroute/:point',
            templateUrl: 'templates/startRoute/index.html',
            controller: 'StartRouteCtrl',
            params: {
                point: null
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
        });

        $urlRouterProvider.otherwise('/app/route');
});
