angular.module('app.services', [])


.service('loadMoreServiceRoute', function (Restangular, $q,geoLocation) {

        this.get = function (nextHref) {
            var deferred = $q.defer();
            Restangular.all(nextHref).getList()  // GET: /users
            .then(function (data) {
                // returns a list of users
                deferred.resolve(data);
            });

            return deferred.promise;
        };

})

;
