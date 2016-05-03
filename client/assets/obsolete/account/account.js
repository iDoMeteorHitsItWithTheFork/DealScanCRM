'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {

    $stateProvider
      .state('index', {
        abstract: true,
        url: "/index",
        templateUrl: "views/common/content.html",
      })
     /* .state('index.main', {
        url: "/main",
        templateUrl: "views/main.html",
        data: { pageTitle: 'Example view' }
      })
      .state('index.minor', {
        url: "/minor",
        templateUrl: "views/minor.html",
        data: { pageTitle: 'Example view' }
      }) */
      .state('logout', {
        url: '/logout?referrer',
        template: '',
        controller: function ($state, Auth) {
          Auth.logout();
          $state.go('login');
        }
      })

  })
  .run(function ($rootScope, $state) {
    $rootScope.$state = $state;
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, next, nextParams, prev, prevParams) {
      console.log(' --- state change success ---> Current State: '+next.name);
      console.log(next);
      console.log(prev);
    });

    $rootScope.$on('$stateChangeError', function (event, next, nextParams, prev, prevParams, error) {
      event.preventDefault();
      console.log('State Change Error');
      console.log(error);
      console.log('___ToState___');
      console.log(next);
      console.log('___FromState___');
      console.log(prev)
    });
  });
