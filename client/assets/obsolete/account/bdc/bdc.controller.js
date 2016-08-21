angular.module('dealScanCrmApp')
  .controller('BDCCtrl', function ($scope, $state, $uibModal, $anchorScroll, Auth, Util,NgMap, appConfig, Dashboard) {

    var _bdc = this;
    _bdc.user = Auth.getCurrentUser();
    _bdc.isAdmin = Auth.isAdmin;
    _bdc.isManager = false;
    _bdc.isGM = false;
    Auth.hasRole(appConfig.userRoles[2], function(has){
      _bdc.isManager = has;
    });

    Auth.hasRole(appConfig.userRoles[7], function(ans){
      _bdc.isGM = ans;
    })

    _bdc.dealerships = [{name: 'Hagerstown Ford'},
      {name: 'King Kia'},
      {name: 'King Hyndai'}];

    _bdc.teamMates = Dashboard.teamMates();
    _bdc.teamMate = {};
    _bdc.dealership = {};

    _bdc.dataView = 'charts';

    /* Initialize Map Object */
    NgMap.getMap().then(function (map) {
      _bdc.map = map;
      console.log(console.log(_bdc.map.center));
    }).catch(function (err) {
      console.log(err);
    });




    $scope.labels = ['Walk-In', 'Phone', 'Email', 'DealScan', 'Social Media', 'Something'];
    $scope.data = [300, 50, 100, 75, 12, 55];
    $scope.colors = ['#315777', '#F5888D', '#8BC33E', '#5B9BD1', '#9A89B5', '#F18636'];

    $scope.options = {
      responsive: false,
      maintainAspectRatio: true,
      segmentShowStroke: false,
      segmentStrokeColor: '#fff',
      segmentStrokeWidth: 1,
      percentageInnerCutout: 0, // This is 0 for Pie charts
      animationSteps: 40,
      animationEasing: 'easeOutBounce',
      animateRotate: true,
      animateScale: false

    };

    $scope.clickChart = function (points, evt) {
      console.log(points, evt);
      $scope.showTable = true;
      $location.hash('scrollToPoint');
      $anchorScroll();
    }

    $scope.addLead = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/dashboard/addLead.html',
        controller: 'AddLeadCtrl',
      });
    }
    $scope.addTask = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/task/assignLead.html',
        controller: 'AddTaskCtrl',
      });
    }
  });



