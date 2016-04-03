'use strict';

angular.module('dealScanCrmApp')
    .factory('Dashboard', function (Auth, Util, $q) {
        // Service logic
        // ...

        var _user = Auth.getCurrentUser();
        var _teamMates = {};
        var teamMates = [];
        var safeCb = Util.safeCb;


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
            teamMates: function(){
                return teamMates;
            }
        };
    });
