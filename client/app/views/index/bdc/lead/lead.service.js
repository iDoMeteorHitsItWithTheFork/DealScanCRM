'use strict';

angular.module('dealScanCrmApp')
  .factory('Lead', function (Auth, LeadResource, Util) {
    // Service logic
    // ...

    var user = Auth.getCurrentUser();
    var _leads = [];

      /**
       * Create New Lead
       * @param options
       */
    function createLead(details){
        if (!details) throw new Error('Lead Details are required');
        if (!details.name) throw new Error('Lead Name is required');
        if (!details.phone) throw new Error('Lead phone is required');
        if (!details.source) throw new Error('Lead Source is required');
        return LeadResource.save(details)
          .$promise.then(function (lead) {
            if (lead && !lead.error) {
              _leads.unshift(lead.profile);
            }
            return lead;
          }).catch(function (err) {
            console.log(err);
            return {error: {msg: err.data, code: err.status}};
          });
    }

      /**
       * Update Exisiting Lead
       */
    function editLead(leadID, details){
        if (!leadID) throw new Error('LeadID is required');
        if (!details) throw new Error('Lead Details are required');
        if (!details.name) throw new Error('Lead Name is required');
        if (!details.phone) throw new Error('Lead phone is required');
        return LeadResource.update({id: leadID}, details)
          .$promise.then(function(lead){
            if (lead){
              var idx = Util.indexOfObject(_leads, 'leadID', leadID);
              if (idx != -1) _leads.splice(idx, 1, lead.profile);
              return lead.profile;
            }
          }).catch(function(err){
            console.log(err);
            return err;
          });
    }

    /**
     * Schedule lead Appointment
     * @param details
       */
    function scheduleAppointment(details){
      if (!details) throw new Error('Appointment Details are needed');
      return LeadResource.scheduleLead(details)
        .$promise.then(function(appointment){
        console.log(appointment);
        if (appointment){
          return appointment;
        } else return {error: {msg: '', code:''}};
      }).catch(function(err){
         console.log(err);
         return err;
      });
    }

      /**
       * Delete Lead
       */
      function deleteLead(leadID){


    }

      /**
       * Get List of leads
       */
    function getLeads(){
      return LeadResource.query().$promise
        .then(function(leads){
           console.log(leads);
           if (leads && !leads.error){
              _leads.length = 0;
              for (var i = 0; i < leads.length; i++)
                _leads.push(leads[i].profile);
              return _leads;
           } else return {error: {msg:leads.error.msg}};
        })
        .catch(function(err){
          console.log(err);
          return err;
      });
    }

      /**
       * assign lead to User
       */
    function assignLead(){


    }

      /**
       * Convert Lead to Customer
       */
    function convertLead(){



    }


    // Public API here
    return {
      create: createLead,
      update: editLead,
      remove: deleteLead,
      leads: getLeads,
      appointment: scheduleAppointment,
      assign: assignLead,
      convert: convertLead
    };
  });
