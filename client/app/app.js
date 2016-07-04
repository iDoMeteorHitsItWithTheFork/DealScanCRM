'use strict';

angular.module('dealScanCrmApp', [
  'dealScanCrmApp.auth',
  'dealScanCrmApp.admin',
  'dealScanCrmApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ngMap',
  'btford.socket-io',
  'ngTagsInput',
  'ui.router',
  'ui.bootstrap',
  'oc.lazyLoad',                  // ocLazyLoad,
  'ngIdle',                       // Idle timer
  'ngAside',                      //page aside
  'ezfb'
])
  .config(function ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('login');
    $locationProvider.html5Mode(true);
  });
