'use strict';

angular.module('dealScanCrmApp')
  .controller('SocialMediaBroadcastCtrl', function ($scope, Auth, Util, $filter, $uibModalInstance, SocialMedia, toaster) {

    var _smBroadcast =this;
    _smBroadcast.user = Auth.getCurrentUser();
    _smBroadcast.error = false;
    _smBroadcast.errorMessage = null;
    _smBroadcast.ok = function () {
      $uibModalInstance.close();
    };

    _smBroadcast.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    _smBroadcast.broadcastObj = {text: '', fb: false, twt: true};
    var fbProfile = {
      name: 'My timeline',
      id: 1
    }

    _smBroadcast.selectedPages = [];

    _smBroadcast.getFbPages = function (){
      SocialMedia.getFbPages().then(function(res){
        if (res.errorCode) {
          console.log(res);
          //display error cod
        } else {
          _smBroadcast.pages = res.data;
          _smBroadcast.pages.push(fbProfile);
        }
      });
    }

    _smBroadcast.broadcastSocial = function (){
      _smBroadcast.broadcasting = true;
      SocialMedia.broadcastSocial(_smBroadcast.broadcastObj, _smBroadcast.selectedPages).then(function(res){
        console.log(res);
        _smBroadcast.broadcasting = false;
      });
    }

    _smBroadcast.getFbPages();


  });

