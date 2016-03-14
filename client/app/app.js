'use strict';

angular.module('dealScanCrmApp', [
    'dealScanCrmApp.auth',
    'dealScanCrmApp.admin',
    'dealScanCrmApp.constants',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngAside',
    'btford.socket-io',
    'ui.router',
    'ui.bootstrap',
    'validation.match'
])
    .config(function ($urlRouterProvider, $locationProvider) {
        $urlRouterProvider
            .otherwise('/');
        $urlRouterProvider.when('/', '/login');
        $locationProvider.html5Mode(true);
    });
