/**
 * Created by ludovicagodio on 4/11/16.
 */
/**
 * Created by milesjohnson on 4/4/16.
 */
angular.module('dealScanCrmApp')
  .controller('AddNoteCtrl', function ($scope, creatorID, customerID, Note,$uibModalInstance, SweetAlert) {
    console.log("add note controller loaded");

    var _newNote = this;
    _newNote.note = {
      content: '',
      creatorID: creatorID,
      customerID: customerID
    };

    _newNote.addingNote = false;

    _newNote.ok = function () {
      if (_newNote.addingNote) return;
      _newNote.addingNote = true;
      Note.add(_newNote.note).then(function(newNote){
        console.log(newNote);
        $uibModalInstance.close(newNote);
      }).catch(function(err){
        _newNote.addingNote = false;
        console.log(err);
        SweetAlert.swal('Note Error!', 'Sorry, an error ocurred while attempting to add your note. Please try again later.', 'error');
      })

    };

    _newNote.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });
