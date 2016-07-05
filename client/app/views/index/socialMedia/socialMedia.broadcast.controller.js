'use strict';

angular.module('dealScanCrmApp')
  .controller('SocialMediaBroadcastCtrl', function ($scope, Auth, Util, $filter, $uibModalInstance, SocialMedia, toaster) {

    var _smBroadcast =this;
    _smBroadcast.user = Auth.getCurrentUser();
    console.log(_smBroadcast.user);
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
    /**
     * Twitter status update
     * @param message
     */
    _smBroadcast.tweet = function(){
      console.log(_smBroadcast.broadcastObj);
      if (_smBroadcast.broadcastObj.text.length < 1) return;
      _smBroadcast.broadcasting = true;
      SocialMedia.tweet(_smBroadcast.broadcastObj.text).then(function(res){
        if (res && res.success){
          toaster.success({title:'Twitter Status Update', body: res.message});
          _smBroadcast.broadcasting = false;
          _smBroadcast.ok();
        } else toaster.error({title: 'Twitter Status Update', body: 'Unable to post status update'});
      }).catch(function(err){
        _smBroadcast.broadcasting = false;
        console.log(err);
        toaster.error({title: 'Twiiter Status Update', body: err});
      });
    }


    _smBroadcast.getFbPages = function (){
      SocialMedia.getFbPages().then(function(res){
        if (res.errorCode) {
          console.log(res);
          //display error cod
        } else {
          _smBroadcast.pages = res.data;
          _smBroadcast.pages.push(fbProfile);
          console.log(_smBroadcast.pages);
        }
      });
    }
    _smBroadcast.getFbPages();

    _smBroadcast.postToFb = function (){
      SocialMedia.postToFb(_smBroadcast.broadcastObj, _smBroadcast.selectedPage).then(function(res){
        if (res.errorCode) {
          console.log(res);
          //display error cod
        } else {
          console.log(res);
        }
      });
    }


  });

