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
            var newMessages = 0;
            for(var i=0; i < inbox.length; i++){
              var m = inbox[i].profile;
              m.timestamp = moment(m.createdAt).format('MMM D');
              m.date = moment(m.createdAt).format('hh:mma DD MMM YYYY');
              if (m.status == 'unseen') newMessages++;
              if (m.to && m.to.toString().trim() != ''){
                try {
                  m.to = JSON.parse(m.to);
                } catch(ex){}
              }
              _inbox.push(m);
            }
            return {mails:_inbox, newMessages: newMessages};
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
