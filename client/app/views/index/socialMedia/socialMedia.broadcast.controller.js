'use strict';

angular.module('dealScanCrmApp')
  .controller('SocialMediaBroadcastCtrl', function ($scope, Auth, Util, $filter, $uibModalInstance) {

    var _smBroadcast =this;
    _smBroadcast.user = Auth.getCurrentUser();
    
    _smBroadcast.ok = function () {
      $uibModalInstance.close();
    };

    _smBroadcast.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    _smBroadcast.broadcastObj = {text: '', fb: false, twt: true};
    
    

  });
/**
 * Created by ludovicagodio on 6/18/16.
 */
