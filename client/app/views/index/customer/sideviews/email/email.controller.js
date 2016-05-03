/**
 * Created by ludovicagodio on 4/19/16.
 */
angular.module('dealScanCrmApp')
  .controller('EmailCtrl', function ($scope, $uibModalInstance, selectedCustomer) {

    console.log("email customer controller loaded");
    console.log(selectedCustomer);

    var _email = this;
    _email.customer = selectedCustomer;

    _email.newEmail = {};

    _email.ok = function () {
      $uibModalInstance.close();
    };

    _email.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });
