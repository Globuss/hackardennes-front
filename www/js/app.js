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
        'app.filters',
        'restangular',
        'angularApiHydra',
        'ngCordova'

    ])

    .run(function ($ionicPlatform, $cordovaGeolocation, geoLocation, $ionicPopup, $rootScope) {
        $ionicPlatform.ready(function () {
            if (window.cordova) {
                const uuid         = '7473CEE4-6202-11E5-9D70-FEFF819CDC90';
                const identifier   = '1z1-beacons';
                const beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid);

                var delegate = new cordova.plugins.locationManager.Delegate();

                delegate.didDetermineStateForRegion = function (pluginResult) {
                    console.log("a");
                };

                delegate.didStartMonitoringForRegion = function (pluginResult) {
                    console.log("b");
                };

                delegate.didRangeBeaconsInRegion = function (pluginResult) {
                    if (pluginResult.beacons.length > 0) {
                        var index = 0;
                        var proxMax = pluginResult.beacons[index].proximity;

                        if (pluginResult.beacons.length > 1) {
                            for (var i = 1; i < pluginResult.beacons.length; i++) {
                                if (pluginResult.beacons[i].proximity > pluginResult.beacons[index].proximity) {
                                    index = i;
                                    proxMax = pluginResult.beacons[i].proximity;
                                }
                            }
                        }

                        var minor = pluginResult.beacons[index].minor;
                        var major = pluginResult.beacons[index].major;
                        var value = '{"major":' + major + ',"minor":' + minor + '}';

                        console.log("Minor : " + minor);
                        console.log("Major : " + major);
                        console.log("Proximity : " + pluginResult.beacons[index].proximity);
                        console.log(window.localStorage.getItem("beacon"));
                        console.log(window.localStorage.getItem("beacon") == 'undefined');
                        console.log(window.localStorage.getItem("beacon") != value);

                        if (
                            window.localStorage.getItem("beacon") != value ||
                            window.localStorage.getItem("beacon") == 'undefined'
                        ) {
                            cordova.plugins.notification.local.schedule({
                                id: 10,
                                title: "Tourisme Ardennes",
                                text: "La Place Ducal"
                            });

                            window.localStorage.setItem("beacon", value);
                        }
                    }
                };

                cordova.plugins.notification.local.on("click", function (notification) {
                    alert("clicked: " + notification.id);
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
                        title: 'Géolocalisation non disponible',
                        template: err.message
                    });
                });

            var watch = $cordovaGeolocation.watchPosition({
                frequency: 1000,
                timeout: 3000,
                enableHighAccuracy: false
            }).then(function () {
                }, function (err) {

                }, function (position) {
                    geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude);
                    $rootScope.$broadcast('location:change', geoLocation.getGeolocation());
                }
            );

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

            .state('startRoute', {
                cache: false,
                url: '/startroute/:point',
                templateUrl: "templates/startRoute/index.html",
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
            })

        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/route');
    });
