'use strict';

angular.module('dealScanCrmApp')
    .controller('SidebarCtrl', function ($scope, Auth, $state) {
        var _sidebar = this;
        _sidebar.$state = $state;
        _sidebar.user = Auth.getCurrentUser();

        _sidebar.user.menu = [{option: 'My Profile', action: null}, {
            option: 'My Calendar',
            action: null
        }, {option: 'My Messages', action: null}];

        _sidebar.menu = [{title: 'Dashboard', alias: 'd', state: 'home.dashboard'},
            {title: 'Profile', alias: 'p', state: 'home.profile'},
            {title: 'Tasks', alias: 't', state: 'home.tasks'},
            {title: 'Lead Management', alias: 'l', state: 'home.bdc'},
            {title: 'Email Campaign', alias: 'e', state: 'home.ecampaign'}];


        _sidebar.logout = function(){
            $state.go('logout');
        }

    });
