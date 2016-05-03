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
    _note.addingNote = false;
    _note.newNote = {
      content: '',
      creatorID: _note.user.userID,
      customerID: selectedCustomer.customerID
    };



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
      if (_note.addingNote) return;
      _note.addingNote = true;
      Note.add(_note.newNote).then(function (newNote) {
        console.log(newNote);
        _note.newNote.content = '';
        _note.newNoteForm.$setPristine();
        _note.customerNotes = Note.notes();
        _note.addingNote = false;
      }).catch(function (err) {
        _note.addingNote = false;
        console.log(err);
        SweetAlert.swal('Note Error!', 'Sorry, an error ocurred while attempting to add your note. Please try again later.', 'error');
      });
    }

    /**
     * Update an existing customer
     *
     *
     */
    _note.editNote = function (note, content) {
      if (note.editingNote) return;
      note.editingNote = true;
      note.content = content;
      Note.update(note.noteID, note).then(function(updatedNote){
        console.log(updatedNote);
        _note.customerNotes = Note.notes();
        note.editingNote  = false;
        note.editMode = false;
      }).catch(function(err){
          note.editingNote  = false;
          console.log(err);
          SweetAlert.swal('Note Error!', 'Sorry, an error ocurred while attempting to updated your note. Please try again later.', 'error');
      })
    };


    /*
     * Delete a customer
     *
     *
     * */
    _note.deleteNote = function (note) {
      console.log('deleting note...');
      if (note.deletingNote) return;
      note.deletingNote = true;
      Note.remove(note).then(function () {
        _note.customerNotes = Note.notes();
        note.deletingNote = false;
      }).catch(function (err) {
        note.deletingNote = false;
        console.log(err);
      })
    }


    /**
     *  Defaults Actions
     */

    loadCustomerNotes();



  });
