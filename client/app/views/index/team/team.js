'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home.team', {
        url: '/team',
        title: 'Manage Team',
        authenticate: true,
        resolve: {
          function(teamMembers){

          }
        },
        views: {
          'pageContent': {
            templateUrl: 'app/account/team/team.html',
            controller: 'TeamCtrl as team'
          },
        }
      })
  });
