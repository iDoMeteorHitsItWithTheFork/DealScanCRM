'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index', {
        abstract: true,
        url: "/index",
        templateUrl: "app/views/common/content.html",
        authenticate: true,
      })
      .state('logout', {
        url: '/logout?referrer',
        template: '',
        controller: function ($state, Auth) {
          Auth.logout();
          $state.go('login');
        }
      })
  })
  .run(function ($rootScope, $state, ezfb) {
    $rootScope.$state = $state;


    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
      console.log(' ** going to state --> ['+next.name+'] From state -> ['+current.name+']');
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


    //Initialize Facebook Client
    ezfb.init({
      //App ID From Facebook App Dashboard
      appId: '126507794443463'
    });

  });
