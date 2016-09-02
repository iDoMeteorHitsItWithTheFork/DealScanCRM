'use strict';

angular.module('dealScanCrmApp')
  .controller('CustomerMessagesCtrl', function ($scope, selectedCustomer, $filter, toaster, $window, $timeout, Messages) {
    var _customerMessages = this;
    console.log('\n\n\n\n\n\n Message controller loaded!\n\n\n\n');
    _customerMessages.thisCustomer = selectedCustomer;
    _customerMessages.loadingInbox = false;
    _customerMessages.viewingMessage = false;
    _customerMessages.displayingMessage = null;
    _customerMessages.sendingMessage =false;
    _customerMessages.lastTextMessage = null;

    _customerMessages.viewOptions = 'inbox';
    _customerMessages.displayView = function(view){
      _customerMessages.viewOptions = view;
    }


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
        Messages.inbox(_customerMessages.thisCustomer.profile.customerID).then(function (inbox) {
          console.log(inbox);
          if (inbox) {
            _customerMessages.inbox = inbox.mails;
            _customerMessages.mailCount = inbox.mailCount;
            _customerMessages.newMails = inbox.newMails;
            _customerMessages.lastTextMessage = inbox.lastTextMessage;
          } else toaster.error({
            title: 'Inbox Error',
            body: 'An error occured while attempting to load customer inbox.'
          })
          _customerMessages.loadingInbox = false;
        }).catch(function (err) {
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
      Messages.seen(mail).then(function(result){
        if (result.success)
          if (_customerMessages.newMails > 0) _customerMessages.newMails--;
        else toaster.error({title: 'Update Error', body: 'An error occured while updating the mail status'});
      }).catch(function(err){
         console.log(err);
        toaster.error({title: 'Update Error', body: 'An error occured while updating the email status.'});
      })

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

    _customerMessages.inboxMessages = function(){
      return function(value){
        return value.type == 'mail' && (value.status == 'unseen' || value.status == 'seen');
      }
    }

    _customerMessages.textMessages = function(){
      return function(value){
        return value.type == 'text';
      }
    }


    _customerMessages.sendMessage = function(form){
      if (_customerMessages.sendingMessage) return;
      if (!_customerMessages.message || _customerMessages.message.toString().trim() == '') return;
      _customerMessages.sendingMessage = true;
      Messages.send({
        id: _customerMessages.thisCustomer.profile.customerID,
        recipient: 'customer',
        message: _customerMessages.message
      }).then(function (message) {
        if (message) {
          _customerMessages.inbox.unshift(message);
          _customerMessages.lastTextMessage = moment(message.createdAt).format('ddd MMM DD YYYY - HH:mm:ss');
          form.$setPristine();
          _customerMessages.message = '';
        } else toaster.error({title: '', body: 'An error occured while attempting to send your message.'});
        _customerMessages.sendingMessage = false;
      }).catch(function (err) {
        console.log(err);
        _customerMessages.sendingMessage = false;
        toaster.error({title: 'Send Error', body: 'An error occured while attempting to send messages'});
      })

    }


  });
