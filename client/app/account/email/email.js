'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home.ecampaign', {
        url: '/email',
        title: 'Email',
        authenticate: true,
        views: {
          'pageContent': {
            templateUrl: 'app/account/email/email.html',
            controller: 'EmailCtrl as email'
          },
        }
      })
  });