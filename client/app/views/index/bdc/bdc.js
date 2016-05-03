'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.home.bdc', {
        url: '/bdc',
        title: 'BDC Dashboard',
        authenticate: true,
        resolve: {
          function(teamMembers){

          }
        },
        views: {
          'pageContent': {
            templateUrl: 'app/account/bdc/bdc.html',
            controller: 'BDCCtrl as bdc'
          },
        }
      })
  });
