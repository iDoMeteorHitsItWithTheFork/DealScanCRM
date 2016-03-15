'use strict';

angular.module('dealScanCrmApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('logout', {
                url: '/logout?referrer',
                referrer: 'login',
                template: '',
                controller: function ($state, Auth) {
                    var referrer = $state.params.referrer ||
                        $state.current.referrer ||
                        'login';
                    Auth.logout();
                    $state.go(referrer);
                }
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'app/account/settings/settings.html',
                controller: 'SettingsController',
                controllerAs: 'vm',
                authenticate: true
            })

        
        
        
        ;
  
            /* Overall router will go here!*/

    })
    .run(function ($rootScope) {
        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
            if (next.name === 'logout' && current && current.name && !current.authenticate) {
                next.referrer = current.name;
            }
        });
    });
