'use strict';

angular.module('dealScanCrmApp')
  .controller('CustomerLandingCtrl', function ($scope, Auth, appConfig, $state, $uibModal) {
    var _landing = this;
      _landing.emailCustomer = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/email/modal/emailModal.html',
        controller: 'EmailCustomerCtrl as landing',
      });
    }
  
    });