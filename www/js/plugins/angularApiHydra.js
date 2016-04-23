/**
 * Created by juliencolinet on 24/11/2015.
 */
'use strict';

angular.module('angularApiHydra',[])

.config(['RestangularProvider', function (RestangularProvider) {

  
  // The URL of the API endpoint
  RestangularProvider.setDefaultHttpFields({cache: false});
  RestangularProvider.setBaseUrl('https://un-zero-un-api.herokuapp.com/');
  // JSON-LD @id support


  RestangularProvider.setRestangularFields({
    id: '@id',
    nextHref: 'hydra:nextPage'
  });

  RestangularProvider.setSelfLinkAbsoluteUrl(false);


  // Hydra collections support
  RestangularProvider.addResponseInterceptor(function (data, operation) {
    // Remove trailing slash to make Restangular working
    function populateHref(data) {
      if (data['@id']) {
        data.href = data['@id'].substring(1);
        data.nextPage = data['hydra:nextPage'];

      }
      if (data['trend']){
        data.tendance = data['trend'];
      }

    }

    // Populate href property for the collection
    populateHref(data);

    if ('getList' === operation) {
      var collectionResponse = data['hydra:member'];
      collectionResponse.metadata = {};

      // Put metadata in a property of the collection
      angular.forEach(data, function (value, key) {
        if ('hydra:member' !== key) {
          collectionResponse.metadata[key] = value;
        }
      });

      // Populate href property for all elements of the collection
      angular.forEach(collectionResponse, function (value) {
        populateHref(value);
      });

      return collectionResponse;
    }

    return data;
  });
}])
;