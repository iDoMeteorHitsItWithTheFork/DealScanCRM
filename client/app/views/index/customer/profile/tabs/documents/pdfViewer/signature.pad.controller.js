/**
 * Created by ludovicagodio on 8/28/16.
 */
'use strict';
angular.module('dealScanCrmApp')
  .controller('SignatureCtrl', function ($scope, $uibModalInstance, toaster) {
    var _signature = this;


    _signature.done = function () {
      var signature = _signature.accept();
      if (signature.isEmpty) {
        $uibModalInstance.dismiss();
      } else {
        $uibModalInstance.close(signature.dataUrl);
      }
    };


    _signature.cancel = function(){
      $uibModalInstance.dismiss('cancel');
    }


  })
