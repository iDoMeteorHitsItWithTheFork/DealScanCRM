angular.module('dealScanCrmApp')
  .controller('AddLeadCtrl', ['$scope','$uibModalInstance', '$filter', 'Lead', 'toaster',
    function ($scope, $uibModalInstance, $filter, Lead, toaster) {
    console.log("add lead controller loaded");

      var _newLead = this;
      _newLead.selectedSource = {};
      _newLead.saving = false;

      _newLead.prospect = {
        name:'',
        phone:'',
        email:'',
        address: '',
        interest: '',
        additionalInfo: '',
        source: '',
        appointmentDate:'',
        appointmentTime: ''
      };

      _newLead.sources = [
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

      _newLead.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      _newLead.format = _newLead.formats[0];
      _newLead.altInputFormats = ['M!/d!/yyyy'];


       _newLead.today = function () {
          _newLead.dt = new Date();
        };

        _newLead.today();
        _newLead.minDate = new Date();

        _newLead.clear = function () {
            _newLead.dt = null;
        };


        _newLead.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        _newLead.create = function () {
            if (_newLead.saving) return;
            _newLead.saving  = true;
            var details = {};
            details.name = _newLead.prospect.name;
            details.phone = _newLead.prospect.phone;
            details.email = _newLead.prospect.email;
            details.address = _newLead.prospect.address;
            details.interest = _newLead.prospect.interest;
            details.additionalInfo = _newLead.prospect.additionalInfo;
            details.source =_newLead.prospect.source;
            if (_newLead.prospect.appointmentDate.trim() != '' && _newLead.prospect.appointmentTime.trim() != '')
              details.appointment = { Date: _newLead.prospect.appointmentDate, Time: _newLead.prospect.appointmentTime};

            Lead.create(details).then(function(lead){
               console.log(lead);
               if (lead && !lead.error){
                 toaster.success({title:'New Lead', body: 'Lead ('+details.name+') was successfully created'+(details.appointment ?
                 ' and appointment was scheduled for '+details.appointment.Date.format('shortDate')+' @ '+details.appointment.Time.format('shortTime')+'!':'!')});
                 $uibModalInstance.close(lead);
               } else toaster.error({title:'New Lead Error', body: lead.error.msg});
               _newLead.saving = false;
            }).catch(function(err){
               console.log(err);
               _newLead.saving  = false;
               toaster.error({title:'New Lead Error', body: 'An error occurred while attempting to create lead'});
            })

        };

        _newLead.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);
