'use strict';

angular.module('dealScanCrmApp')
  .controller('CustomerMessagesCtrl', function ($scope, selectedCustomer, $filter, toaster, $window, $timeout, Messages) {
    var _customerMessages = this;
    console.log('\n\n\n\n\n\n Message controller loaded!\n\n\n\n');
    _customerMessages.thisCustomer = selectedCustomer;
    _customerMessages.loadingInbox = false;
    _customerMessages.viewingMessage = false;
    _customerMessages.displayingMessage = null;


    _customerMessages.composeMail = function () {
      console.log('I was called...');
      console.log(_customerMessages.thisCustomer);
      if (_customerMessages.thisCustomer.profile.email && _customerMessages.thisCustomer.profile.email.toString().trim() != '') {
        var mailTo = 'mailto:' + _customerMessages.thisCustomer.profile.email;
        var composeWindow = $window.open(mailTo, '_blank');
        var t = $timeout(function () {
          composeWindow.close();
        });
        $scope.$on('destroy', function () {
          $timeout.cancel(t);
        });
      } else toaster.error({
        title: 'Mail Error',
        body: 'There are no email address on file for this customer. Please update the customer info'
      });
    }


    _customerMessages.loadInbox = function(){

      if (_customerMessages.thisCustomer.profile.email && _customerMessages.thisCustomer.profile.email.toString().trim() != ''){
        if (_customerMessages.loadingInbox) return;
        _customerMessages.loadingInbox = true;
        Messages.inbox(_customerMessages.thisCustomer.profile.customerID).then(function(inbox){
          console.log(inbox);
          if (inbox){
            _customerMessages.inbox = inbox.mails;
            _customerMessages.newMessages = inbox.newMessages;
          } else toaster.error({title: 'Inbox Error', body: 'An error occured while attempting to load customer inbox.'})
          _customerMessages.loadingInbox = false;
        }).catch(function(err){
          console.log(err);
          _customerMessages.loadingInbox = false;
          toaster.error({title: 'Inbox Error', body: 'An error occured while retreiving the customer inbox'});
        })
      } else toaster.error({title: 'Inbox Error',  body: 'There is no email associated with this customer. Please update the customer info'});

    }

    _customerMessages.loadInbox();

    _customerMessages.formatLastSync = function(time){
       return moment(time).format('dddd, MMM Do YYYY [at] hh:mm a');
    }



    _customerMessages.displayMessage = function(mail){
      if (!_customerMessages.viewingMessage) _customerMessages.viewingMessage = true;
      _customerMessages.displayingMessage = mail;
      mail.status = 'seen';
     if (_customerMessages.newMessages > 0) _customerMessages.newMessages--;
    }

    _customerMessages.backToInbox = function(){
      _customerMessages.viewingMessage = false;
      _customerMessages.displayingMessags = null;
    }

    _customerMessages.replyToMail = function(mail){
      var mailTo = 'mailto:' + mail.from+'?subject=Re: '+mail.subject;
      var composeWindow = $window.open(mailTo, '_blank');
      var t = $timeout(function () {
        composeWindow.close();
      });
      $scope.$on('destroy', function () {
        $timeout.cancel(t);
      });
    }

    _customerMessages.forwardMail = function(mail){
      var mailTo = 'mailto:?subject=Fwd: '+mail.subject;
      var composeWindow = $window.open(mailTo, '_blank');
      var t = $timeout(function () {
        composeWindow.close();
      });
      $scope.$on('destroy', function () {
        $timeout.cancel(t);
      });
    }

    _customerMessages.moveToTrash = function(mail){

    }


  });
