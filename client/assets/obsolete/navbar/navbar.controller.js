'use strict';


angular.module('dealScanCrmApp')
  .controller('NavbarController', function($scope, Auth, $state){

      var _nav = this;
      _nav.isLoggedIn = Auth.isLoggedIn;
      _nav.isAdmin = Auth.isAdmin;
      _nav.getCurrentUser = Auth.getCurrentUser;



        _nav.logout = function(){
            $state.go('logout');
        }


    });
