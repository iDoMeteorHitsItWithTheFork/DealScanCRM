angular.module('dealScanCrmApp')
    .controller('CreateTeamCtrl', function ($scope, $rootScope, $timeout, $state, $window, $uibModalInstance, $filter, dealership, Dashboard, team) {
        console.log("create team controller loaded");
        
        console.log(dealership);
  console.log(team);
       var _newTeam = this;
       _newTeam.team = {dealership: dealership, name: null, members: []};
       _newTeam.teamMates = Dashboard.teamMates();
      console.log(_newTeam.teamMates);
     
      _newTeam.dealerships = [{name: 'Hagerstown Ford'},
                               {name: 'King Kia'},
                              {name: 'King Hyndai'}];
  
  
        _newTeam.addMember = function (member){
          console.log(member);
          _newTeam.team.members.push(member);
          member.hide = true;
          
        };
  
         _newTeam.removeMember = function (member){
          console.log(member);
           member.hide = false;
           $scope.remove(member)
          
        };
  
         $scope.remove = function(item) { 
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