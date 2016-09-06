'use strict';

angular.module('dealScanCrmApp')
  .factory('Lead', function (Auth, LeadResource, Util, $filter) {
    // Service logic
    // ...

    var user = Auth.getCurrentUser();
    var _leads = [];
    var _scheduledLeads = [];

    function getScheduledLeads(){
      return _scheduledLeads;
    }

      /**
       * Create New Lead
       * @param options
       */
    function createLead(details){
        if (!details) throw new Error('Lead Details are required');
        if (!details.firstName) throw new Error('Lead FirstName is required');
        if (!details.lastName) throw new Error('Lead LastName is required');
        if (!details.phone) throw new Error('Lead phone is required');
        if (!details.source) throw new Error('Lead Source is required');
        return LeadResource.save(details)
          .$promise.then(function (lead) {
            if (lead && !lead.error) {
              lead.interest = JSON.parse(JSON.stringify(lead.interest));
               if (lead.appointments.length > 0) _scheduledLeads.unshift(lead);
              _leads.unshift(lead);
            } return _leads;
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
        if (!details.firstName) throw new Error('Lead FirstName is required');
        if (!details.lastName) throw new Error('Lead LastName is required');
        if (!details.phone) throw new Error('Lead phone is required');
        if (!details.source) throw new Error('Lead Source is required');
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
          if (idx != -1) {
            _leads[idx].appointments.unshift(appointment);
            _leads[idx].status = 'working';
            _scheduledLeads.unshift(_leads[idx]);
          }
          return appointment;
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
           if (idx != -1) {
             _leads[idx].notes.unshift(note);
             _leads[idx].status = 'working';
           }
           return note;
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
                 leads[i].agents = $filter('orderBy')(leads[i].agents, "createdAt", true);
                 if (leads[i].interest && leads[i].interest.trim() != ''){
                   try {
                     var js = JSON.parse(leads[i].interest);
                     var parseInterest = '';
                     if (js.type) parseInterest += js.type;
                     if (js.year) parseInterest += ' '+js.year;
                     if (js.make) parseInterest += ' '+js.make;
                     if (js.model) parseInterest += ' '+js.model;
                     if (js.hasOwnProperty('trim') || js.trimlevel || js.trimLevel) parseInterest += ' '+ (js['trim'] || js.trimlevel || js.trimLevel);
                     if (js.vin || js.VIN || js.vinnumber || js.vinNumber) parseInterest += ' '+(js.vin || js.VIN || js.vinnumber || js.vinNumber);
                     if (js.stocknumber || js.stockNumber) parseInterest += ' '+(js.stocknumber || js.stockNumber);
                     leads[i].interest = Util.slimTrim(parseInterest);
                   } catch(ex){}
                 }
                // leads[i].interest = JSON.parse(JSON.stringify(_leads[i].interest));
                _leads.push(leads[i]);
              } return _leads;
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
    function assignLead(lead){
      console.log('\n\n\n LeadID  \n\n');
      console.log(lead);
      console.log('\n\n ---------- \n\n');
      if (!lead) throw Error('Lead is required!');
      return LeadResource.assignLead({id: lead.leadID})
        .$promise.then(function(res){
          if (res.success === true) {
            if(!lead.agents) lead.agents = [];
            lead.agents.unshift(res.agent);
            lead.status = 'working';
            return true;
          } else return {error: {code:'', msg: ''}};
      }).catch(function(err){
           console.log(err);
           return err;
        });
    }

      /**
       * Convert Lead to Customer
       */
    function convertLead(){



    }

      /**
       *  Retreive Scheduled Leads
       */
    function scheduledLeads(){
       return LeadResource.scheduledLeads().$promise
         .then(function(leads){
           console.log(leads);
           if (leads && !leads.error){
             for (var i = 0; i < leads.length; i++) {
               leads[i].notes = $filter('orderBy')(leads[i].notes, "createdAt", true);
               leads[i].appointments = $filter('orderBy')(leads[i].appointments, "createdAt", true);
               leads[i].agents = $filter('orderBy')(leads[i].agents, "createdAt", true);
               if (leads[i].interest && leads[i].interest.trim() != ''){
                 try {
                   var js = JSON.parse(leads[i].interest);
                   var parseInterest = '';
                   if (js.type) parseInterest += js.type;
                   if (js.year) parseInterest += ' '+js.year;
                   if (js.make) parseInterest += ' '+js.make;
                   if (js.model) parseInterest += ' '+js.model;
                   if (js.hasOwnProperty('trim') || js.trimlevel || js.trimLevel) parseInterest += ' '+ (js['trim'] || js.trimlevel || js.trimLevel);
                   if (js.vin || js.VIN || js.vinnumber || js.vinNumber) parseInterest += ' '+(js.vin || js.VIN || js.vinnumber || js.vinNumber);
                   if (js.stocknumber || js.stockNumber) parseInterest += ' '+(js.stocknumber || js.stockNumber);
                   leads[i].interest = Util.slimTrim(parseInterest);
                 } catch(ex){}
               }
             }
             _scheduledLeads = leads;
             return _scheduledLeads;
           } else return {error: {msg:leads.error.msg}};
       })
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
      convert: convertLead,
      scheduledLeads: scheduledLeads,
      unassignedLeads: getScheduledLeads,
    };
  });
