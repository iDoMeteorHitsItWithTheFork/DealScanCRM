/**
 * Created by ludovicagodio on 7/24/16.
 */
angular.module('dealScanCrmApp')
  .controller('ScheduleLeadCtrl', ['$scope','$uibModalInstance', '$filter', 'Lead', 'toaster', 'lead',
    function ($scope, $uibModalInstance, $filter, Lead, toaster, lead) {
      console.log("add lead controller loaded");
      console.log(lead);
      var _scheduleLead = this;
      _scheduleLead.saving = false;

      _scheduleLead.appointment = {
        leadID: lead.leadID,
        name:lead.name,
        phone:lead.phone,
        description: '',
        category: '',
        date:'',
        time: ''
      };


      _scheduleLead.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      _scheduleLead.format = _scheduleLead.formats[0];
      _scheduleLead.altInputFormats = ['M!/d!/yyyy'];

      _scheduleLead.catogories  = [
        {
          id: 'service',
          name: 'Service Call'
        },
        {
          id: 'new_car',
          name: 'New Car'
        }
      ]


      _scheduleLead.today = function () {
        _scheduleLead.dt = new Date();
      };

      _scheduleLead.today();
      _scheduleLead.minDate = new Date();

      _scheduleLead.clear = function () {
        _scheduleLead.dt = null;
      };


      _scheduleLead.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      _scheduleLead.create = function () {
        console.log('*** Schedule Lead ****');
        if (_scheduleLead.saving) return;
        _scheduleLead.saving  = true;
        var details = {};
        details.name = _scheduleLead.appointment.name;
        details.phone = _scheduleLead.appointment.phone;
        details.description = _scheduleLead.appointment.description;
        details.appointment = moment(_scheduleLead.appointment.date).format('YYYY-MM-DD') +' '+_scheduleLead.appointment.time;
        details.leadID = lead.leadID;

        Lead.appointment(details).then(function(appointment){
          console.log(appointment);
          if (appointment && !appointment.error){
            toaster.success({title:'New Appointment', body: 'Appointment for Lead ('+details.name+') was scheduled for '+details.appointment});
            $uibModalInstance.close(appointment);
          } else toaster.error({title:'New Lead Error', body: lead.error.msg});
          _scheduleLead.saving = false;
        }).catch(function(err){
          console.log(err);
          _scheduleLead.saving  = false;
          toaster.error({title:'New Lead Error', body: 'An error occurred while attempting to schedule appointment'});
        })

      };

      _scheduleLead.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

    }]);
