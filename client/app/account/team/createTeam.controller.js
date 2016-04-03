angular.module('dealScanCrmApp')
  .controller('CreateTeamCtrl', function ($scope, $rootScope, $timeout, $state, $window, $uibModalInstance, $filter, Dashboard, dealerships, teams) {
    console.log("create team controller loaded");

    var _newTeam = this;
    _newTeam.team = {dealership:null, name:null, members:null};
    _newTeam.dealerships = dealerships;
    _newTeam.teams = teams;

    console.log(teams);

    _newTeam.addMember = function (member) {
      console.log(member);
      _newTeam.team.members.push(member);
      member.hide = true;

    };

    _newTeam.removeMember = function (member) {
      console.log(member);
      member.hide = false;
      $scope.remove(member)

    };

    $scope.remove = function (item) {
      var index = _newTeam.team.members.indexOf(item);
      _newTeam.team.members.splice(index, 1);
    }

    $scope.ok = function () {
      $uibModalInstance.close(_newTeam.team);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
