/**
 * Created by ludovicagodio on 4/11/16.
 */
angular.module('dealScanCrmApp')
  .controller('AddNoteCtrl', function ($scope, creatorID, customerID, Note, $uibModalInstance, toaster) {
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
      Note.add(_newNote.note).then(function (newNote) {
        console.log(newNote);
        if (newNote.success) {
          _newNote.note.content = '';
          toaster.success({title: 'New Note', body:'your note was added to the customer profile'});
          $uibModalInstance.close(newNote);
        } else toaster.error({title: 'Note Error', body: 'An error occured while attempting to create note'});
        _newNote.addingNote = false;
      }).catch(function (err) {
        _newNote.addingNote = false;
        console.log(err);
      });

    };

    _newNote.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });
