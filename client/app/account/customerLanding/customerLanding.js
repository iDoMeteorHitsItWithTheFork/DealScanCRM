'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home.customerLanding', {
        url: '/customer-landing',
        title: 'Customer Landing',
        authenticate: true,
        views: {
          'pageContent': {
            templateUrl: 'app/account/customerLanding/customerLanding.html',
            controller: 'CustomerLandingCtrl as landing'
          }
        }
      });
  });
