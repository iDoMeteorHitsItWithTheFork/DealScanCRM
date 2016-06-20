'use strict';

angular.module('dealScanCrmApp', [
  'dealScanCrmApp.auth',
  'dealScanCrmApp.admin',
  'dealScanCrmApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'oc.lazyLoad',                  // ocLazyLoad,
  'ngIdle',                       // Idle timer
  'ngAside'
])
  .config(function ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('login');
    $locationProvider.html5Mode(true);
  });
