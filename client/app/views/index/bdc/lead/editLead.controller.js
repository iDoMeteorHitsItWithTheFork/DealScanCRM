/**
 * Created by ludovicagodio on 7/23/16.
 */
angular.module('dealScanCrmApp')
  .controller('EditLeadCtrl', ['$scope','$uibModalInstance', '$filter', 'Lead', 'toaster', 'lead', 'Util',
    function ($scope, $uibModalInstance, $filter, Lead, toaster, lead, Util) {
      console.log("add lead controller loaded");

      var _editLead = this;
      _editLead.selectedSource = {};
      _editLead.saving = false;
      _editLead.prospect = {
        name:lead.name,
        phone:lead.phone,
        email:lead.email,
        address: lead.address,
        interest: lead.interest,
        additionalInfo: lead.additionalInfo,
      };


      _editLead.sources = [
        {
          id: 'phone',
          name: 'Phone',
          type: 'Phone'
        },
        {
          id: 'social',
          name: 'Social Media',
          type: 'Internet'
        },
        {
          id: 'website',
          name: 'Website',
          type: 'Internet'
        },
        {
          id: 'thirdParty',
          name: 'Third Party',
          type: 'Internet'
        },
        {
          id: 'Other',
          name: 'Other',
          type: 'Other'
        }
      ];

      var idx = Util.indexOfObject(_editLead.sources, 'name', lead.sourceName);
      if (idx != -1) _editLead.prospect.source = _editLead.sources[idx];



      _editLead.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      _editLead.format = _editLead.formats[0];
      _editLead.altInputFormats = ['M!/d!/yyyy'];


      _editLead.today = function () {
        _editLead.dt = new Date();
      };

      _editLead.today();
      _editLead.minDate = new Date();

      _editLead.clear = function () {
        _editLead.dt = null;
      };


      _editLead.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      _editLead.update = function () {
        if (_editLead.saving) return;
        _editLead.saving  = true;
        var details = {};
        details.name = _editLead.prospect.name;
        details.phone = _editLead.prospect.phone;
        details.email = _editLead.prospect.email;
        details.address = _editLead.prospect.address;
        details.interest = _editLead.prospect.interest;
        details.additonalInfo = _editLead.prospect.additionalInfo;
        details.source =_editLead.prospect.source;

        Lead.update(lead.leadID,details).then(function(lead){
          console.log(lead);
          if (lead && !lead.error){
            toaster.success({title:'Edit Lead', body: 'Lead ('+details.name+') was successfully updated'});
            $uibModalInstance.close(lead);
          } else toaster.error({title:'Edit Lead Error', body: lead.error.msg});
          _editLead.saving = false;
        }).catch(function(err){
          console.log(err);
          _editLead.saving  = false;
          toaster.error({title:'Edit Lead Error', body: 'An error occurred while attempting to create lead'});
        })

      };

      _editLead.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

    }]);
