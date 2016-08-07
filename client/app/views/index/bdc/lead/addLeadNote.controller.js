/**
 * Created by ludovicagodio on 7/24/16.
 */
angular.module('dealScanCrmApp')
    .controller('AddLeadNoteCtrl', ['$scope','$uibModalInstance', '$filter', 'Lead', 'toaster', 'lead',
      function ($scope, $uibModalInstance, $filter, Lead, toaster, lead) {
        console.log("add lead note controller loaded");
        console.log(lead);
        var _addNote = this;
        _addNote.leadName = lead.name;
        _addNote.saving = false;

        _addNote.note = {
          leadID: lead.leadID,
          content: ''
        };

        _addNote.create = function(){
          console.log('*** Add Note ****');
          if (_addNote.saving) return;
          _addNote.saving = true;
          var details = {};
          details.leadID = _addNote.note.leadID;
          details.note = _addNote.note.content;
          console.log(details);
          Lead.note(details).then(function(note){
            console.log(note);
            if (note && !note.error){
              toaster.success({title:'New Note', body: 'Note added for Lead ('+lead.name+')'});
              $uibModalInstance.close(lead);
            } else toaster.error({title:'New Note Error', body: note.error.msg});
            _addNote.saving = false;
          }).catch(function(err){
            console.log(err);
            _addNote.saving= false;
            toaster.error({title:'New Lead Error', body: 'An error occurred while attempting to schedule appointment'});
          });
        }


        _addNote.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };

      }]);
