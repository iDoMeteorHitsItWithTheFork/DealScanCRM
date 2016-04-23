'use strict';

angular.module('dealScanCrmApp')
  .controller('NoteCtrl', function ($scope, Auth, $uibModal, selectedCustomer, Note, SweetAlert) {

    console.log('Note Controller loaded....');
    var _note = this;

    _note.user = Auth.getCurrentUser();
    _note.thisCustomer = selectedCustomer;
    _note.customerNotes  =[];
    _note.processingNotes = _note.deletingNotes = false;
    _note.typing = false;


    _note.saveButtonDisplay = function(){
       console.log('typing...');
      _note.typing = _note.newNote && _note.newNote.length > 0;
      console.log(_note.typing);
    }


    var loadCustomerNotes = function(){
      if (_note.processingNotes) return false;
      _note.processingNotes = true;
      Note.getNotes(_note.thisCustomer.customerID).then(function(notes){
        console.log(notes);
        _note.customerNotes = notes;
        _note.processingNotes = false;
      }).catch(function(err){
          console.log(err);
         _note.processingNotes = false;
          SweetAlert.swal('Notes Error!', 'Sorry, an error occurred while attempting to retreive the customer notes', 'error');
      })
    }


    /*
     * add a note
     *
     * */
    _note.addNote = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/customer/tabs/note/addNote.html',
        controller: 'AddNoteCtrl as newNote',
        resolve: {
          creatorID: function(){
            return _note.user.userID;
          },
          customerID: function(){
            return _note.thisCustomer.customerID;
          }
        }
      });

      modalInstance.result.then(function (newNote) {
        _note.customerNotes = Note.notes();
      })
    };


    /**
     * Update an existing customer
     *
     *
     */
    _note.editNote = function (note) {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/customer/tabs/note/updateNote.html',
        controller: 'UpdateNoteCtrl as updateNote',
        resolve: {
          thisNote: function () {
            return note;
          }
        }
      });

      modalInstance.result.then(function (updatedNote) {
        _note.customerNotes = Note.notes();
      })

    };


    /*
     * Delete a customer
     *
     *
     * */
    _note.deleteNote = function (note) {
      if (_note.deletingNotes) return;
      _note.deletingNotes = true;
      Note.remove(note).then(function () {
        _note.customerNotes = Note.notes();
        _note.deletingNotes = false;
      }).catch(function (err) {
        _note.deletingNotes = false;
        console.log(err);
      })
    }


    /**
     *  Defaults Actions
     */

    loadCustomerNotes();



  });
