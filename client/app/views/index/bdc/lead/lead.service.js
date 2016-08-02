'use strict';

angular.module('dealScanCrmApp')
  .factory('Lead', function (Auth, LeadResource, Util, $filter) {
    // Service logic
    // ...

    var user = Auth.getCurrentUser();
    var _leads = [];
    var _newLeads = [];
    var _workingLeads = [];
    var _followUpLeads = [];

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
              lead.interest = JSON.parse(JSON.stringify(lead.interest));
              _leads.unshift(lead);
            } return categorizeLeads(_leads);
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
              if (idx != -1) _leads.splice(idx, 1, lead);
              return lead;
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
      if (!details.leadID) throw new Error('Lead Details is required');
      return LeadResource.scheduleLead(details)
        .$promise.then(function(appointment){
        console.log(appointment);
        if (appointment){
          var idx = Util.indexOfObject(_leads, 'leadID', details.leadID);
          if (idx != -1) _leads[idx].appointments.unshift(appointment);
          return categorizeLeads(_leads);;
        } else return {error: {msg: '', code:''}};
      }).catch(function(err){
         console.log(err);
         return err;
      });
    }

    /**
     * Add note to lead
     * @param details
     * @returns {*}
       */
    function addNote(details){
      if (!details) throw new Error('Note Details are needed');
      if (!details.leadID) throw new Error('Lead Details is required');
      if (!details.note) throw new Error('Note content is required');
      return LeadResource.note(details)
        .$promise.then(function(note){
          console.log(note);
        if (note){
           var idx = Util.indexOfObject(_leads, 'leadID', details.leadID);
           if (idx != -1) _leads[idx].notes.unshift(note);
           return categorizeLeads(_leads);
        } else return {error: {msg: '', code: ''}};
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

    function categorizeLeads(leads){
      _newLeads = $filter('filter')(leads, function(value, index, arr){
        return value.status == 'new' && moment(value.createdAt).unix() >= moment().startOf('day').unix() && moment(value.createdAt).unix() <= moment().endOf('day').unix();
      })
      _workingLeads = $filter('filter')(leads, function(value, index, arr){
        return value.status == 'working' && value.appointments && value.appointments.length > 0;
      });
      _followUpLeads = $filter('filter')(leads, function(value, index, arr){
        return (value.status == 'working' || value.status == 'new') && ( value.appointments && value.appointments.length == 0) && moment(value.createdAt).unix() <  moment().startOf('day').unix();
      });
      return {new_leads: _newLeads, working_leads: _workingLeads, follow_up_leads: _followUpLeads};
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
              for (var i = 0; i < leads.length; i++) {
                 leads[i].notes = $filter('orderBy')(leads[i].notes, "createdAt", true);
                 leads[i].appointments = $filter('orderBy')(leads[i].appointments, "createdAt", true);
                // leads[i].interest = JSON.parse(JSON.stringify(_leads[i].interest));
                _leads.push(leads[i]);
              } return categorizeLeads(_leads);
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
      note: addNote,
      assign: assignLead,
      convert: convertLead
    };
  });
