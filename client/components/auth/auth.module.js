'use strict';

angular.module('dealScanCrmApp.auth', [
  'dealScanCrmApp.constants',
  'dealScanCrmApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
