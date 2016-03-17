angular.module('dealScanCrmApp')
.controller('BDCCtrl',['$scope', '$rootScope', '$timeout', '$compile', '$state', '$window', '$uibModal','$filter', function ($scope, $rootScope, $timeout, $compile, $state, $window, $uibModal, $filter) {
	
	var _bdc = this;
	console.log("BDC controller loaded");
	 $scope.itemArray = [
        {id: 1, name: 'first'},
        {id: 2, name: 'second'},
        {id: 3, name: 'third'},
        {id: 4, name: 'fourth'},
        {id: 5, name: 'fifth'},
    ];

    $scope.person = {};
    $scope.people = [
      { name: 'JOHN S.'},
      { name: 'RYAN H.'},
      { name: 'TEX M.'},
      { name: 'BRITIN M.'},
    ];
	
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

$scope.clickChart = function(points, evt){
	console.log(points, evt);
	$scope.showTable = true;
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
      templateUrl: 'app/account/task/addTask.html',
      controller: 'AddTaskCtrl',
    });
	}
}]);


