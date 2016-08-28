'use strict';

angular.module('dealScanCrmApp', [
  'dealScanCrmApp.auth',          //Custom Authentication
  'dealScanCrmApp.admin',         //Admin
  'dealScanCrmApp.constants',     //app config from server
  'ngCookies',                    //cookies
  'ngResource',                   //resource API
  'ngSanitize',                   //Sanitize HMTL
  'ngAnimate',                    //Css Animations
  'ngMap',                        //Google Maps
  'btford.socket-io',             //Web Sockets for Real-Time communications
  'ui.router',                    //Router
  'ui.bootstrap',                 //Angular Bootstrap
  'oc.lazyLoad',                  // ocLazyLoad,
  'ngIdle',                       // Idle timer
  'ngAside',                      //page aside
  'ezfb',                         //Facebook API Integration
  'toaster',                       //Non-blocking Notifications
  'frapontillo.bootstrap-switch',
  'flow',
   'ngTagsInput',
  'signature'
])
  .config(function ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('login');
    $locationProvider.html5Mode(true);
  });
