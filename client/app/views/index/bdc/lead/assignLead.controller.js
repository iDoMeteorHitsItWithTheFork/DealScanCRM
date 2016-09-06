'use strict';

angular.module('dealScanCrmApp')
  .controller('AssignLeadCtrl', function ($scope, $uibModalInstance, $filter, Dealers, selectedLead, Util, Lead, toaster) {

    var _assignLead = this;
    _assignLead.dealers = Dealers;
    _assignLead.loadingLeads = false;
    _assignLead.assigningLead = false;
    _assignLead.leads = [];

    _assignLead.assignmentDetails = {
      saleRep: '',
      lead: '',
    }

    /*console.log('\n\n\n DEALERS \n\n\n');
    console.log(_assignLead.dealers);
    console.log('\n\n _________________ \n\n');*/

    _assignLead.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    _assignLead.format = _assignLead.formats[0];
    _assignLead.altInputFormats = ['M!/d!/yyyy'];


    _assignLead.today = function () {
      _assignLead.dt = new Date();
    };

    //_newLead.today();
    _assignLead.minDate = new Date();

    _assignLead.clear = function () {
      _assignLead.dt = null;
    };

    _assignLead.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    _assignLead.loadScheduledLeads = function(){
      if (_assignLead.loadingLeads) return;
      _assignLead.loadingLeads = true;
      Lead.scheduledLeads().then(function(leads){
        if (leads){
          _assignLead.leads = leads;
          if (selectedLead) _assignLead.assignmentDetails.lead = selectedLead;
        } else {
          toaster.error({title: '', body: ''});
        }
        _assignLead.loadingLeads = false;
      }).catch(function(err){
         _assignLead.loadingLeads = false;
         console.log(err);
         toaster.error({title: 'Lead Load Error', body: 'An error occurred while attempting to retreive leads.'})
      })
    }

    _assignLead.loadScheduledLeads();

    _assignLead.reps = $filter('filter')(_assignLead.dealers[0].Employees, function(value, index, arr){
      return value.role != 'admin' && value.role != 'gen_mgr'
        && value.role != 'owner' && value.firstName != 'DealScan' && value.firstName != 'EMAIL';
    });


    _assignLead.groupByRole = function (employee){
      return employee.profile.role;
    };

    _assignLead.ok = function(){
      $uibModalInstance.close();
    }

    _assignLead.cancel = function () {
      $uibModalInstance.dismiss();
    };


  });
