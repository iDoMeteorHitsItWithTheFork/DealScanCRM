'use strict';


angular.module('dealScanCrmApp')
  .controller('NavbarController', function($scope, Auth){

      var _nav = this;
      _nav.isLoggedIn = Auth.isLoggedIn;
      _nav.isAdmin = Auth.isAdmin;
      _nav.getCurrentUser = Auth.getCurrentUser;





    });
