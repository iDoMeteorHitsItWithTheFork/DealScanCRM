'use strict';

angular.module('dealScanCrmApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/account/home/home.html',
                controller: 'HomeCtrl',
                authenticate: true
            })
            .state('home.dashboard', {
                url: '/dashboard',
                title: 'Dashboard',
                authenticate: true,
                resolve: {
                    teamMembers:function(Dashboard, $q){
                        var df = $q.defer();
                        Dashboard.getTeamMates(function(teamMates){
                            console.log(teamMates);
                            df.resolve();
                        }, function(err){
                            df.reject(err);
                        });
                        return df.$promise;
                    }
                },
                views: {
                    'pageContent': {
                        templateUrl: 'app/account/dashboard/dashboard.html',
                        controller: 'DashboardCtrl as dashboard'
                    },
                }
            })
            .state('home.bdc', {
                url: '/bdc',
                title: 'BDC Dashboard',
                authenticate: true,
                views: {
                    'pageContent': {
                        templateUrl: 'app/account/bdc/bdc.html',
                        controller: 'BDCCtrl as bdc'
                    },
                }
            })
        ;
    });