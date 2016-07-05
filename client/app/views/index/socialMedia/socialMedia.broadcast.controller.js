'use strict';

angular.module('dealScanCrmApp')
  .controller('SocialMediaBroadcastCtrl', function ($scope, Auth, Util, $filter, $uibModalInstance, SocialMedia) {

    var _smBroadcast =this;
    _smBroadcast.user = Auth.getCurrentUser();
    
    _smBroadcast.ok = function () {
      $uibModalInstance.close();
    };

    _smBroadcast.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    _smBroadcast.broadcastObj = {text: '', fb: false, twt: true};

    /**
     * Twitter status update
     * @param message
     */
    _smBroadcast.tweet = function(){
      if (!_smBroadcast.broadcastObj.text.length < 1) return;
      SocialMedia.tweet(_smBroadcast.broadcastObj.text).then(function(res){
        if (res && res.success){
          toaster.success({title:'Twitter Status Update', body: res.message});
          _smBroadcast.ok();
        } else toaster.error({title: 'Twitter Status Update', body: 'Unable to post status update'});
      }).catch(function(err){
        console.log(err);
        toaster.error({title: 'Twiiter Status Update', body: err});
      });
    }
    

  });

