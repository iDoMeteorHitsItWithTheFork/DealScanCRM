/**
 * Created by ludovicagodio on 7/22/16.
 */
'use strict';

(function () {

  function LeadResource($resource) {
    return $resource('/api/leads/:id/:controller/:status', {
        id: '@leadID'
      },
      {
        update: {
          method:'PUT',
        },
        totalLeads :{
          method: 'GET',
          params: {
            id:'stats',
            controller:'leads',
          }
        },
        totalAppointments :{
          method: 'GET',
          params: {
            id:'stats',
            controller:'appointments',
          }
        },
        scheduledLeads: {
          method: 'GET',
          isArray: true,
          params: {
            id:'scheduled',
            controller:'appointments',
          }
        },
        keptAppointments :{
          method: 'GET',
          params: {
            id:'stats',
            controller:'appointments',
            status:'kept'
          }
        },
        missedAppointments :{
          method: 'GET',
          params: {
            id:'stats',
            controller:'appointments',
            status: 'missed'
          }
        },
        soldAppointments :{
          method: 'GET',
          params: {
            id:'stats',
            controller:'appointments',
            status: 'sold'
          }
        },
        scheduleLead :{
          method: 'PUT',
          params: {
            id:'schedule',
            controller:'appointment',
          }
        },
        assignLead: {
          method: 'PUT',
          params: {
            id: 'assign',
            controller: 'agent'
          }
        },
        note :{
          method: 'PUT',
          params: {
            id:'add',
            controller: 'note'
          }
        }
      });
  }

  angular.module('dealScanCrmApp')
    .factory('LeadResource', LeadResource);

})();
