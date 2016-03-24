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
                            df.resolve(teamMates);
                        }, function(err){
                            df.reject(err.data);
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
            .state('home.team', {
                url: '/team',
                title: 'Manage Team',
                authenticate: true,
                resolve: {
                    teamMembers:function(Dashboard, $q){
                        var df = $q.defer();
                        Dashboard.getTeamMates(function(teamMates){
                            console.log(teamMates);
                            df.resolve(teamMates);
                        }, function(err){
                            df.reject(err.data);
                        });
                        return df.$promise;
                    }
                },
                views: {
                    'pageContent': {
                        templateUrl: 'app/account/team/team.html',
                        controller: 'TeamCtrl as team'
                    },
                }
            })
        ;
    });
