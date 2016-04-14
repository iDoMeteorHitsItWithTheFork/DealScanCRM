'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('messages', {
        url: '/messages',
        templateUrl: 'app/account/customer/tabs/messages/messages.html',
        controller: 'MessagesCtrl'
      });
  });
