/**
 * Created by cary.gaskell on 8/7/16.
 */
angular.module('dealScanCrmApp')
    .controller('OpenAppointmentCtrl', ['$scope','$uibModalInstance', '$filter', 'Lead', 'toaster', 'appointments', 'DTOptionsBuilder',
      function ($scope, $uibModalInstance, $filter, Lead, toaster, appointments, DTOptionsBuilder) {
        var _apt = this;

        _apt.appointments = appointments;

        console.log(appointments);

        _apt.cancel = function (){
          $uibModalInstance.dismiss('cancel');
        }

        _apt.dtOptions = DTOptionsBuilder.newOptions()
            .withDOM('<"html5buttons"B>lTfgitp')
            .withOption('responsive', true)
            .withButtons([
              {extend: 'copy'},
              {extend: 'csv'},
              {extend: 'excel', title: 'Appointments'},
              {extend: 'pdf', title: 'Appointments'},
              {extend: 'print',
                customize: function (win){
                  console.log(win);
                  $(win.document.body).addClass('white-bg');
                  $(win.document.body).css('font-size', '10px');
                  $(win.document.body).find('table')
                      .addClass('compact')
                      .css('font-size', 'inherit');
                }
              }
            ]);




      }]);