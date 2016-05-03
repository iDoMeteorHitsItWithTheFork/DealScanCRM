'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.bdc', {
        url: '/bdc',
        title: 'BDC Dashboard',
        authenticate: true,
        templateUrl: 'app/views/index/bdc/bdc.html',
         controller: 'BDCCtrl as bdc'
      })
  });
