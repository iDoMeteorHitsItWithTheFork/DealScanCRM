'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('logout', {
        url: '/logout?referrer',
        template: '',
        controller: function ($state, Auth) {
          Auth.logout();
          $state.go('login');
        }
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        authenticate: true
      });

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
