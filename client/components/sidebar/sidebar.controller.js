'use strict';

angular.module('dealScanCrmApp')
  .controller('SidebarCtrl', function ($scope, Auth, appConfig, $state) {
    var _sidebar = this;
    _sidebar.$state = $state;
    _sidebar.user = Auth.getCurrentUser();
    console.log(_sidebar.user);

    _sidebar.user.menu = [{option: 'My Profile', action: null}, {
      option: 'My Calendar',
      action: null
    }, {option: 'My Messages', action: null}];



    _sidebar.logout = function () {
      $state.go('logout');
    }

    _sidebar.menuBuilder = function () {
      var menu;
      switch (_sidebar.user.role) {
        case appConfig.userRoles[0]:
          console.log(appConfig.userRoles[0]);
          menu = [{title: 'Team Management', alias: 't', state: 'home.team'},
            {title: 'Dashboard', alias: 'd', state: 'home.dashboard'},
            {title: 'Customers', alias: 'c', state: 'home.customer'},
            {title: 'Customer Search', alias: 's', state: 'home.search'},
            {title: 'Customer Landing', alias: 'cl', state: 'home.customerLanding'},
            {title: 'Tasks', alias: 't', state: 'home.tasks'},
            {title: 'Email Campaign', alias: 'e', state: 'home.ecampaign'},
            ];
          break;
        case appConfig.userRoles[1]:
          console.log(appConfig.userRoles[1]);
          menu = [{title: 'Team Management', alias: 't', state: 'home.team'},
            {title: 'Dashboard', alias: 'd', state: 'home.bdc'},
            {title: 'Customers', alias: 'c', state: 'home.customer'},
            {title: 'Customer Search', alias: 's', state: 'home.search'},
            {title: 'Customer Landing', alias: 'cl', state: 'home.customerLanding'},
            {title: 'Tasks', alias: 't', state: 'home.tasks'},
            {title: 'Email Campaign', alias: 'e', state: 'home.ecampaign'},
            ];
          break;
        case appConfig.userRoles[5]:
          console.log(appConfig.userRoles[5]);
          menu = [{title: 'Team Management', alias: 't', state: 'home.team'},
            {title: 'Lead Management', alias: 'l', state: 'home.bdc'},
            {title: 'Sales Dashboard', alias: 'd', state: 'home.dashboard'},
            {title: 'Customers', alias: 'c', state: 'home.customer'},
            {title: 'Customer Search', alias: 's', state: 'home.search'},
            {title: 'Customer Landing', alias: 'cl', state: 'home.customerLanding'},
            {title: 'Tasks', alias: 't', state: 'home.tasks'},
            {title: 'Email Campaign', alias: 'e', state: 'home.ecampaign'},
            ];
          break;
        default:
          console.log('Default');
          menu = [
            {title: 'Team Management', alias: 't', state: 'home.team'},
            {title: 'Sales Dashboard', alias: 'd', state: 'home.dashboard'},
            {title: 'Lead Management', alias: 'l', state: 'home.bdc'},
            {title: 'Customers', alias: 'c', state: 'home.customer'},
            {title: 'Customer Search', alias: 's', state: 'home.search'},
            {title: 'Customer Landing', alias: 'cl', state: 'home.customerLanding'},
            {title: 'Tasks', alias: 't', state: 'home.tasks'},
            {title: 'Email Campaign', alias: 'e', state: 'home.ecampaign'},
            ];
          break;
      }
      return menu;
    }

    _sidebar.menu = _sidebar.menuBuilder();

  });
