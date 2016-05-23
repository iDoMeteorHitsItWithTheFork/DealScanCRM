/**
 * Created by ludovicagodio on 4/30/16.
 */
/**
 * MainCtrl - controller
 */
function MainCtrl($scope, $state, Auth) {
  console.log('** current State **');
  console.log($state);
  this.sidebar = false;
  this.dismissSidebar = function(){
    if (this.sidebar) this.sidebar = false;
  }

};
angular.module('dealScanCrmApp').controller('MainCtrl', MainCtrl)


