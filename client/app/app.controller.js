/**
 * Created by ludovicagodio on 4/30/16.
 */
/**
 * MainCtrl - controller
 */
function MainCtrl($scope, $state) {
  console.log('** current State **');
  console.log($state);

};
angular.module('dealScanCrmApp').controller('MainCtrl', MainCtrl)
