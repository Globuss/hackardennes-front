angular.module('app.services', [])

.service('Path', function (Restangular) {

    return Restangular.service('paths');

})

.service('Point', function (Restangular) {

    return Restangular.service('points');

})

;
