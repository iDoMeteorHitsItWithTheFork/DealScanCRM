'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home.search', {
        url: '/customer-search',
        title: 'Customer Search',
        authenticate: true,
        views: {
          'pageContent': {
            templateUrl: 'app/account/search/search.html',
            controller: 'SearchCtrl as search'
          },
        }
      })
  });