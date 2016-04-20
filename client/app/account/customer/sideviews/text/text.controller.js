angular.module('dealScanCrmApp')
  .controller('TextCtrl', function ($scope, $uibModalInstance, selectedCustomer) {

    console.log("text customer controller loaded");
    console.log(selectedCustomer);

    var _text = this;
    _text.customer = selectedCustomer;

    _text.newText = {};

    _text.ok = function () {
      $uibModalInstance.close();
    };

    _text.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });
