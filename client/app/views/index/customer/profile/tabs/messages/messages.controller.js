'use strict';

angular.module('dealScanCrmApp')
  .controller('CustomerMessagesCtrl', function ($scope, selectedCustomer, $filter, toaster, $window, $timeout) {
    var _customerMessages = this;
    console.log('\n\n\n\n\n\n Message controller loaded!\n\n\n\n');
    _customerMessages.thisCustomer = selectedCustomer;


    _customerMessages.composeMail = function () {
      console.log('I was called...');
      console.log(_customerMessages.thisCustomer);
      if (_customerMessages.thisCustomer.profile.email && _customerMessages.thisCustomer.profile.email.toString().trim() != '') {
        var mailTo = 'mailto:' + _customerMessages.thisCustomer.profile.email;
        var composeWindow = $window.open(mailTo, '_blank');
        var t = $timeout(function () {
          composeWindow.close();
        });
        $scope.on('destroy', function () {
          $timeout.cancel(t);
        });
      } else toaster.error({
        title: 'Mail Error',
        body: 'There are no email address on file for this customer. Please update the customer info'
      });
    }

  });
