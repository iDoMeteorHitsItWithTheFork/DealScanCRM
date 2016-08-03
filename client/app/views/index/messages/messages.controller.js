angular.module('dealScanCrmApp')
    .controller('MessagesCtrl',['$scope', '$rootScope', '$timeout', '$compile', '$state', '$window','$filter', function ($scope, $rootScope, $timeout, $compile, $state, $window, $filter) {
      var _msg = this;

      _msg.composeMessage = false;
      _msg.displayingMessage = null;

      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();

      _msg.emails = [
        {
          id: 1,
          subject: 'Aldus PageMaker including versions of Lorem Ipsum',
          from: {email: 'buyer@gmail.com', name: 'Jack Nowack'},
          to: 'carylgaskell@gmail.com',
          cc: 'luda@gmail.com',
          bcc: 'someoneelse@gmail.com',
          message: 'when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries',
          attachment: false,
          label: null,
          date: "9:56 am",
          selected: false,
          read: false
        },
        {
          id: 2,
          subject: 'Sending in a form - see attachment',
          from: {email: 'buyer@gmail.com', name: 'Jack Nowack'},
          to: 'carylgaskell@gmail.com',
          cc: 'luda@gmail.com',
          bcc: 'someoneelse@gmail.com',
          message: 'when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries',
          attachment: true,
          label: null,
          date: '01 Aug 2016',
          selected: false,
          read: true
        },
        {
          id: 3,
          subject: 'Sending in a form - see attachment',
          from: {email: 'buyer@gmail.com', name: 'Jack Nowack'},
          to: 'carylgaskell@gmail.com',
          cc: 'luda@gmail.com',
          bcc: 'someoneelse@gmail.com',
          message: 'when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries',
          attachment: true,
          label: 'Client',
          date: '01 Aug 2016',
          selected: false,
          read: true
        }
          
      ]

      _msg.viewInbox = function () {
        _msg.closeMessageView();

      }

      _msg.openComposeMessage = function () {
        _msg.closeMessageView();
        _msg.composeMessage = true;

      }

      _msg.closeComposeMessage = function () {
        _msg.composeMessage = false;

      }

      _msg.openMessageView = function (message) {
        _msg.displayingMessage = message;
        _msg.openMessage = true;

      }

      _msg.closeMessageView = function () {
        _msg.openMessage = false;
        _msg.displayingMessage = null;
      }

    }]);



