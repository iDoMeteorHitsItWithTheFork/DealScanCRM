/**
 * Created by ludovicagodio on 4/11/16.
 */

angular.module('dealScanCrmApp')
  .controller('UpdateNoteCtrl', function ($scope, thisNote, Note, $uibModalInstance, SweetAlert) {
    console.log("update note controller loaded");

    var _updateNote = this;
    _updateNote.note = {
      content: thisNote.content,
      creatorID: thisNote.creatorID,
      customerID: thisNote.customerID
    };

    _updateNote.updatingNote = false;

    _updateNote.ok = function () {
      if (_updateNote.addingNote) return;
      _updateNote.updatingNote = true;
      Note.update(thisNote.noteID, _updateNote.note).then(function(updatedNote){
        console.log(updatedNote);
        $uibModalInstance.close(updatedNote);
      }).catch(function(err){
        _updateNote.updatingNote = false;
        console.log(err);
        SweetAlert.swal('Note Error!', 'Sorry, an error ocurred while attempting to updated your note. Please try again later.', 'error');
      })

    };

    _updateNote.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });
