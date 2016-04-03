'use strict';

angular.module('dealScanCrmApp')
  .factory('Team', function (Auth, Util, $q, TeamResource) {

    var safeCb = Util.safeCb;
    var currentUser = Auth.getCurrentUser();


    /* Getters */
    function getMyTeams() {
      var value = (currentUser.hasOwnProperty('$promise')) ? currentUser.$promise : currentUser;
      return $q.when(value).then(function (user) {
        return TeamResource.getTeams({id: user.userID})
          .$promise.then(function (teams) {
            return teams;
          }).catch(function (err) {
            console.log(err);
            return null;
          });
      })
    }

    function getMyManagers() {
      var value = (currentUser.hasOwnProperty('$promise')) ? currentUser.$promise : currentUser;
      return $q.when(value).then(function (user) {
        return TeamResource.getManagers({id: user.userID})
          .$promise.then(function (managers) {
            return managers;
          }).catch(function (err) {
            console.log(err);
            return null;
          });
      })
    }


    // Public API here
    return {
      myTeams: getMyTeams,
      myManagers: getMyManagers
    };

  });
