'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/account/home/home.html',
        controller: 'HomeCtrl'
      })
      .state('home.dashboard', {
         url:'/dashboard',
         title: 'Dashboard',
         views : {
          'pageContent': {
            templateUrl:'app/account/dashboard/dashboard.html',
            controller: 'DashboardCtrl as Dashboard'
          },
           }			   
        })
    
    ;
  });
