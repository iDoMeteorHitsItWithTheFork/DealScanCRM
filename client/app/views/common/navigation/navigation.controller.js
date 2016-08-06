'use strict';

angular.module('dealScanCrmApp')
  .controller('NavigationCtrl', function ($scope, $state, Auth, appConfig) {
    
    var _navigation = this;
    _navigation.user = Auth.getCurrentUser();
    console.log(_navigation.user);

    _navigation.user.menu = [
      {
        option: 'My Profile',
        action: null
      },
      {
        option: 'My Calendar',
        action: null
      },
      {
        option: 'My Messages',
        action: null
      }
    ];


    _navigation.logout = function () {
      $state.go('logout');
    }

    _navigation.menuBuilder = function (debug) {
      var menu;
      if (debug) return menu = [
        {title: 'Dashboard', alias: 'D', state: 'index.dashboard', icon: 'fa fa-th-large'},
        {title: 'Leads', alias: 'L', state: 'index.bdc', icon: 'fa fa-th-list'},
        {title: 'Customers', alias: 'C', state: 'index.customer', icon: 'fa fa-users'},
        {title: 'Social Media', alias: 'S', state: 'index.socialMedia', icon: 'fa fa-globe'},
        {title: 'Tasks', alias: 'T', state: 'index.tasks', icon: 'fa fa-tasks'},
        {title: 'Messages', alias: 'M', state: 'index.messages', icon: 'fa fa-envelope'},
      ];
      switch (_navigation.user.role) {
        case appConfig.userRoles[0]:
          console.log(appConfig.userRoles[0]);
          menu = [
            {title: 'Team Management', alias: 't', state: 'home.team', icon: ''},
            {title: 'Dashboard', alias: 'd', state: 'home.dashboard', icon: ''},
            {title: 'Customers', alias: 'c', state: 'home.customer', icon: ''},
            {title: 'Tasks', alias: 't', state: 'home.tasks', icon: ''},
            {title: 'Social Media', alias: 'e', state: 'home.socialMedia', icon: ''},
          ];
          break;
        case appConfig.userRoles[1]:
          console.log(appConfig.userRoles[1]);
          menu = [
            {title: 'Team Management', alias: 't', state: 'home.team', icon: ''},
            {title: 'Dashboard', alias: 'd', state: 'home.bdc', icon: ''},
            {title: 'Customers', alias: 'c', state: 'home.customer', icon: ''},
            {title: 'Tasks', alias: 't', state: 'home.tasks', icon: ''},
            {title: 'Social Media', alias: 'e', state: 'home.socialMedia', icon: ''},
          ];
          break;
        case appConfig.userRoles[5]:
          console.log(appConfig.userRoles[5]);
          menu = [
            {title: 'Team Management', alias: 't', state: 'home.team', icon: ''},
            {title: 'Lead Management', alias: 'l', state: 'home.bdc', icon: ''},
            {title: 'Sales Dashboard', alias: 'd', state: 'home.dashboard', icon: ''},
            {title: 'Customers', alias: 'c', state: 'home.customer', icon: ''},
            {title: 'Tasks', alias: 't', state: 'home.tasks', icon: ''},
            {title: 'Social Media', alias: 'e', state: 'home.socialMedia', icon: ''},
          ];
          break;
        default:
          console.log('Default');
          menu = [
            {title: 'Team Management', alias: 't', state: 'home.team', icon: ''},
            {title: 'Sales Dashboard', alias: 'd', state: 'home.dashboard', icon: ''},
            {title: 'Lead Management', alias: 'l', state: 'home.bdc', icon: ''},
            {title: 'Customers', alias: 'c', state: 'home.customer', icon: ''},
            {title: 'Tasks', alias: 't', state: 'home.tasks', icon: ''},
            {title: 'Social Media', alias: 'e', state: 'home.socialMedia', icon: ''},
          ];
          break;
      }
      return menu;
    }

    _navigation.menu = _navigation.menuBuilder(true);


  });


