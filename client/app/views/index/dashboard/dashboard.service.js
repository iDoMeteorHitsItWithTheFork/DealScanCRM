'use strict';

angular.module('dealScanCrmApp')
    .factory('Dashboard', function (Auth, User, Util, $q) {
        // Service logic
        // ...

        var _user = Auth.getCurrentUser();
        var _teamMates = {};
        var teamMates = [];
        var safeCb = Util.safeCb;


        var _metrics = {};

        function getMetrics(){
           // var metrics = [ {
           //       Category: "Cars",
           //       Won: {
           //         percentage: 44,
           //         trend: "up",
           //         deals: '100,000'
           //       },
           //       Lost: {
           //         percentage: 44,
           //         trend: "down",
           //         deals: '30,000'
           //       }
           //     },
           //     {
           //       Category: "Trucks",
           //       Won: {
           //         percentage: 44,
           //         trend: "up",
           //         deals: '100,000'
           //       },
           //       Lost: {
           //         percentage: 44,
           //         trend: "down",
           //         deals: '20,000'
           //       }
           //     },
           //     {
           //       Category: "Total",
           //       Won: {
           //         percentage: 44,
           //         trend: "up",
           //         deals: '100,000'
           //       },
           //       Lost: {
           //         percentage: 44,
           //         trend: "down",
           //         deals: '100,000'
           //       }
           //     }
           //   ];

          

           return _metrics;
        }

        function getTeamMates(callback) {
            if (!_user) return;
            return Auth.getTeamMates(function(teammates){
                _teamMates = teammates;
                if (teamMates.length > 0) teamMates.length = 0;
                angular.forEach(_teamMates, function(teamMate){
                    teamMates.push({userID: teamMate.userID, profile: teamMate.profile});
                }); return safeCb(callback)(teamMates);
            }, function(err){
                safeCb(callback)(err);
                return err;
            }).$promise;
        }


        // Public API here
        return {
            getTeamMates: getTeamMates,
            metrics: function(){
              return getMetrics();
            },
            teamMates: function(){
                return teamMates;
            }
        };
    });
