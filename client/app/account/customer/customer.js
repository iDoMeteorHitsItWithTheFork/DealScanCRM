'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home.customer', {
        url: '/customer',
        title: 'Customers',
        authenticate: true,
        views: {
          'pageContent': {
            templateUrl: 'app/account/customer/customer.html',
            controller: 'CustomerCtrl as customer'
          }
        }
      });
  });
