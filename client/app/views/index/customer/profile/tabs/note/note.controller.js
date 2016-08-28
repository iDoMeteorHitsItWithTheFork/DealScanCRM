'use strict';

angular.module('dealScanCrmApp')
  .controller('NoteCtrl', function ($scope, Auth, $uibModal, selectedCustomer, Note, toaster) {

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
      customerID: selectedCustomer.profile.customerID
    };



    var loadCustomerNotes = function(){
      if (_note.processingNotes) return false;
      _note.processingNotes = true;
      Note.getNotes(_note.thisCustomer.profile.customerID).then(function(notes){
        console.log(notes);
        _note.customerNotes = notes;
        _note.processingNotes = false;
      }).catch(function(err){
          console.log(err);
         _note.processingNotes = false;
          toaster.error({title:'Note Error', body: 'An error occured while attempting to retreive the customer notes'})
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
        templateUrl: 'app/views/index/customer/profile/tabs/note/addNote.html',
        controller: 'AddNoteCtrl as newNote',
        resolve: {
          customerID: function () {
            return selectedCustomer.profile.customerID;
          },
          creatorID: function(){
            return _note.user.userID;
          },
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                serie: true,
                name: 'angular-ladda',
                files: ['.resources/plugins/ladda/spin.min.js', '.resources/plugins/ladda/ladda.min.js',
                  '.styles/plugins/ladda/ladda-themeless.min.css', '.resources/plugins/ladda/angular-ladda.min.js']
              },
            ])
          }
        }
      });

     /* if (_note.addingNote) return;
      _note.addingNote = true;
      Note.add(_note.newNote).then(function (newNote) {
        console.log(newNote);
        if (newNote.success) {
          _note.newNote.content = '';
          noteForm.$setPristine();
          toaster.success({title: 'New Note', body:'your note was added to the customer profile'});
        } else toaster.error({title: 'Note Error', body: 'An error occured while attempting to create note'});
        _note.addingNote = false;
      }).catch(function (err) {
        _note.addingNote = false;
        console.log(err);
      });*/
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



    _note.createdAtFormat = function(time){
      return moment(time).format('HH:mm:ss MM-DD-YYYY');
    }

    _note.timeAgoFormat = function(time){
      return moment(time).fromNow();
    }

    /**
     *  Defaults Actions
     */

    loadCustomerNotes();



  });
