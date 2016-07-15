'use strict';
angular.module('dealScanCrmApp')
    .factory('BDCService', Service);

  function Service($http, $cookies, $q, appConfig, User) {
    function getBDCData () {
      return $http.get('/api/bdc').then(function(results){
        console.log(results);
        if (results.status === 200){
          return results.data;
        }

      })
    };

    return {
      getBDCData: getBDCData
    };
  }



