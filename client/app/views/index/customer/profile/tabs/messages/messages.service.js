'use strict';

angular.module('dealScanCrmApp')
  .factory('Messages', function (Util, MessageResource, $filter) {
    // Service logic
    // ...


    function getInbox(customerID){
      return MessageResource.query({recipientID: customerID, recipient: 'customer'}).$promise
        .then(function(inbox){
          console.log(inbox);
          if (inbox){
            var _inbox = [];
            var newMails= 0;
            var mailCount = 0;
            var found = false;
            var lastTextMessage = null;
            for(var i=0; i < inbox.length; i++){
              var m = inbox[i].profile;
              m.timestamp = moment(m.createdAt).format('MMM D');
              m.date = moment(m.createdAt).format('hh:mma DD MMM YYYY');
              m.timeAgo  = moment(m.createdAt).fromNow();
              if (m.type == 'text') {
                m.textStamp = moment(m.createdAt).format('dddd h:mm a - MM.DD.YYYY');
                if (!found) {
                  lastTextMessage = moment(m.createdAt).format('ddd MMM DD YYYY - HH:mm:ss');
                  found = true;
                }
              }
              if (m.type == 'mail') mailCount++;
              if (m.status == 'unseen') newMails++;
              if (m.to && m.to.toString().trim() != ''){
                try {
                  m.to = JSON.parse(m.to);
                } catch(ex){}
              }
              _inbox.push(m);
            }

            return {mails:_inbox, mailCount: mailCount, newMails: newMails, lastTextMessage: lastTextMessage};
          } else return {error:{code: '', msg: ''}};
      }).catch(function(err){
        console.log(err);
        return err;
      })
    }


    function getMessages(customerID){
      return MessageResource.query({recipientID: customerID, recipient: 'customer', type: 'text'}).$promise
        .then(function (messages) {
          console.log(messages);
          if (messages) {
            var _messages = [];
            for (var i = 0; i < messages.length; i++) {
              var m = messages[i].profile;
              m.timestamp = moment(m.createdAt).format('MMM D');
              m.date = moment(m.createdAt).format('hh:mma DD MMM YYYY');
              m.timeAgo = moment(m.createdAt).fromNow();
              m.textStamp = moment(m.createdAt).format('dddd h:mm a - MM.DD.YYYY');
              m.time = moment(m.createdAt).format('h:mm a');
              _messages.push(m);
            }
            return _messages;
          } else return {error: {code: '', msg: ''}};
        }).catch(function (err) {
          console.log(err);
          return err;
        })
    }

    function sendMessage(details){
      if (!details) throw new Error('Message details are missing!');
      if (!details.id) throw new Error('CustomerID is required');
      if (!details.recipient) throw new Error('Recipient is required!');
      if (!details.message) throw new Error('Message is required!');
      return MessageResource.save(details).$promise.then(function(message){
        if (message){
          var m = message.profile;
          m.timeAgo  = moment(m.createdAt).fromNow();
          m.textStamp = moment(m.createdAt).format('dddd h:mm a - MM.DD.YYYY');
          return m;
        } else return {error:{code: '', msg: ''}};
      }).catch(function(err){
        console.log(err);
        return err;
      })
    }

    function seen(mail){
      if (!mail) throw new Error('Message is required');
      return MessageResource.update({id: mail.messageID}, {status: 'seen'})
        .$promise.then(function(message){
          if (message) {
             mail.status ='seen';
             return {success: true, msg: 'Status updated'};
          } else return {success: false, error: {code: '', msg: 'An error occured while attempting the message status'}};
      }).catch(function(err){
          console.log(err);
          return err;
      })
    }





    // Public API here
    return {
      inbox: getInbox,
      send: sendMessage,
      seen: seen,
      messages: getMessages
    };


  });
