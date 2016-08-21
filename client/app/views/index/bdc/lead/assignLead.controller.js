'use strict';

angular.module('dealScanCrmApp')
  .controller('AssignLeadCtrl', function ($scope, $uibModalInstance, Dealers, Util, Lead) {

    var _assignLead = this;
    _assignLead.dealers = Dealers;
    _assignLead.retreivingLeads = false;
    _assignLead.assigningLead = false;


    _assignLead.ok = function(){
      $uibModalInstance.close();
    }


    _assignLead.cancel = function () {
      $uibModalInstance.dismiss();
    };


  });
