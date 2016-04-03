angular.module('dealScanCrmApp')
  .controller('TeamCtrl', function ($scope, $state, $uibModal, $anchorScroll, Auth, Dashboard, Team, appConfig) {
    console.log("team controller loaded");

    var _team = this;
    _team.user = Auth.getCurrentUser();
    _team.isAdmin = Auth.isAdmin;
    _team.isManager = false;
    _team.isGM = false;
    Auth.hasRole(appConfig.userRoles[2], function (ans) {
      _team.isManager = ans;
    });

    Auth.hasRole(appConfig.userRoles[7], function (ans) {
      _team.isGM = ans;
    })

    _team.selectedView = "myteam";
    _team.selectedTeam = "team1";



    var getMyTeams = function () {
      Team.myTeams().then(function (teams) {
        _team.teams = teams;
        _team.members = [];
        angular.forEach(teams, function(team){
            console.log(team);
           _team.members =  _team.members.concat(team.TeamMembers);
        })
        _team.teams.teamMembers = _team.members;
        console.log('>> Printing teams');
        console.log(teams);
        console.log('>> EOP');
      }).catch(function (err) {
        console.log(err);
      });
    }

    getMyTeams();




    var getDealerships = function () {
      Team.myManagers().then(function (managers) {
        console.log('>> Printing Dealerships');
        console.log(managers);
        console.log('>> EOP');
        _team.dealerships = managers;
      }).catch(function (err) {
        console.log(err);
      });
    }

    getDealerships();




    _team.teamMate = {};
    _team.dealership = {};


    _team.createTeam = function () {
      console.log("create new team");
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/team/createTeam.html',
        controller: 'CreateTeamCtrl as newTeam',
        resolve: {
          dealerships: function(){
            return _team.dealerships;
          },
          teams: function(){
            return _team.teams;
          }
        }
      });

      modalInstance.result.then(function (newTeam) {

      });
    }

    $scope.editTeam = function (team) {
      console.log("edit team");
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/team/createTeam.html',
        controller: 'CreateTeamCtrl as newTeam',

      });

      modalInstance.result.then(function (newTeam) {

      });
    }
  });
