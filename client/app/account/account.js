'use strict';

angular.module('dealScanCrmApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('logout', {
                url: '/logout?referrer',
                template: '',
                controller: function ($state, Auth) {
                    Auth.logout();
                    $state.go('login');
                }
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'app/account/settings/settings.html',
                controller: 'SettingsController',
                controllerAs: 'vm',
                authenticate: true
            });

    })
    .run(function ($rootScope) {
        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
            if (next.name === 'logout' && current && current.name && !current.authenticate) {
                next.referrer = current.name;
            }
        });
    });
