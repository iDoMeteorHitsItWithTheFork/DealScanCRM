'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/account/home/home.html',
        controller: 'HomeCtrl',
        authenticate: true,
        resolve: {
          teamMembers: function (Dashboard, $q) {
            var df = $q.defer();
            Dashboard.getTeamMates(function (teamMates) {
              console.log(teamMates);
              df.resolve(teamMates);
            }, function (err) {
              df.reject(err.data);
            });
            return df.$promise;
          }
        }
      })
  });
