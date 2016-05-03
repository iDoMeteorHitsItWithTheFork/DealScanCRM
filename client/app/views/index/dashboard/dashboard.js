'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.home.dashboard', {
        url: '/dashboard',
        title: 'Dashboard',
        authenticate: true,
        resolve: {
          function(teamMembers){

          }
        },
        views: {
          'pageContent': {
            templateUrl: 'app/account/dashboard/dashboard.html',
            controller: 'DashboardCtrl as dashboard'
          },
        }
      })
  });
