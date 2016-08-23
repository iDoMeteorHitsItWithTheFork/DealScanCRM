'use strict';

angular.module('dealScanCrmApp')
  .factory('Messages', function (Util, MessageResource, $filter) {
    // Service logic
    // ...


    function getInbox(customerID){
      return MessageResource.query({customerID: customerID}).$promise
        .then(function(inbox){
          console.log(inbox);
          if (inbox){
            var _inbox = [];
            var newMails= 0;
            for(var i=0; i < inbox.length; i++){
              var m = inbox[i].profile;
              m.timestamp = moment(m.createdAt).format('MMM D');
              m.date = moment(m.createdAt).format('hh:mma DD MMM YYYY');
              m.timeAgo  = moment(m.createdAt).fromNow();
              if (m.type == 'text') m.textStamp = moment(createdAt).format('dddd h:mm a - MM.DD.YYYY');
              if (m.status == 'unseen') newMails++;
              if (m.to && m.to.toString().trim() != ''){
                try {
                  m.to = JSON.parse(m.to);
                } catch(ex){}
              }
              _inbox.push(m);
            }
            return {mails:_inbox, newMails: newMails};
          } else return {error:{code: '', msg: ''}};
      }).catch(function(err){
        console.log(err);
        return err;
      })
    }



    // Public API here
    return {
      inbox: getInbox
    };


  });
