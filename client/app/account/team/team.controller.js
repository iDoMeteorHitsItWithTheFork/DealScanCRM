angular.module('dealScanCrmApp')
  .controller('TeamCtrl', function ($scope, $state, $uibModal, $anchorScroll, Auth, Util, Dashboard, appConfig) {
    console.log("team controller loaded");
  
   var _team = this;
    _team.user = Auth.getCurrentUser();
    _team.isAdmin = Auth.isAdmin;
    _team.isManager = false;
    _team.isGM = false;
    Auth.hasRole(appConfig.userRoles[2], function(ans){
     _team.isManager = ans;
    });

    Auth.hasRole(appConfig.userRoles[7], function(ans){
      _team.isGM = ans;
    })

    _team.dealerships = [{name: 'Hagerstown Ford'},
                               {name: 'King Kia'},
                              {name: 'King Hyndai'}];
  
   _team.selectedDealership = _team.dealerships[0].name;
   _team.teamMates = Dashboard.teamMates();
   _team.teamMate = {};
   _team.dealership = {};

   _team.teams = [{id: 1, name: "Sales Team", dealership: 'Hagerstown Ford', description: "This team sells stuff", 
                   members: [
                     {profile: {name:"Cary Gaskell", role: "Administrator", email: "carylgaskell@gmail.com"}},
                     {profile: {name:"Eric Carper", role: "General Manager", email: "ecarper@hagerstownford.com"}},
                     {profile: {name:"Lenna Paprocki", role: "Sales Manager", email: "lpaprocki@hotmail.com"}},
                     {profile: {name:"Abel Maclead", role: "Sales Manager", email: "amaclead@gmail.com"}},
                   ]}];
  console.log(_team.teams);
   
  _team.createTeam = function () {
    console.log("create new team");
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/team/createTeam.html',
        controller: 'CreateTeamCtrl as newTeam',
        resolve: {
          dealership: function () {
            console.log(_team.selectedDealership);
            return _team.selectedDealership;
          },
          team: function () {
            console.log(_team.selectedDealership);
            return _team.selectedDealership;
          }
        }
      });
    
      modalInstance.result.then(function (newTeam) {
        console.log(newTeam);
        _team.teams.push(newTeam);
      });
   }
  
    $scope.editTeam = function (team) {
    console.log("edit team");
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/team/createTeam.html',
        controller: 'CreateTeamCtrl as newTeam',
        resolve: {
          dealership: function () {
            console.log(_team.selectedDealership);
            return _team.selectedDealership;
          },
          team: function () {
            console.log(team);
            return team;
          }
        }
      });
    
      modalInstance.result.then(function (newTeam) {
        console.log(newTeam);
        _team.teams.push(newTeam);
      });
   }
    });