'use strict';

angular.module('dealScanCrmApp')
  .factory('Note', function (Auth, Util, $q, $filter, NoteResource) {
    // Service logic
    // ...

    var _notes = [];
    var _notesInfo = [];

    /**
     * get a list of notes
     * @param userID
     */
    function getNotes(customerID, userID) {
      var payload = {'customerID': customerID};
      if (userID) payload.userID = userID;
      return NoteResource.get(payload).
        $promise.then(function (notes) {
          _notes.length = 0;
          _notes = notes || [];
          _notesInfo = notes ? notes.rows : [];
          return _notesInfo;
        }).catch(function (err) {
          console.log(err);
          return err;
        })
    }

    /**
     *
     * get single note
     * @param id
     */

    function getNote(id) {

    }

    /**
     * Add a note
     * @param note
     */

    function addNote(note) {
      if (!note.content || !note.creatorID || !note.customerID) return;
      return NoteResource.save({
        content: note.content,
        creatorID: note.creatorID,
        customerID: note.customerID
      }).$promise.then(function (newNote) {
          console.log(newNote);
          if (_notes.rows) _notes.rows.push(newNote);
          return newNote;
      }).catch(function(err){
          console.log(err);
          return err;
        })
    }


    /**
     * edit a note
     * @param id
     */

    function editNote(id, note) {
      return NoteResource.update({id:id}, note).
        $promise.then(function(updatedNote){
          console.log(updatedNote);
          if (Util.indexOfObject(_notes.rows, 'noteID', id) != -1) {
            var idx = Util.indexOfObject(_notes.rows, 'noteID', id);
            _notes.rows.splice(idx, 1, updatedNote);
          }
          return updatedNote;
      }).catch(function(err){
          console.log(err);
          return err;
        })
    }

    /**
     * remove a note
     * @param id
     */

    function deleteNote(note) {
      if (Auth.getCurrentUser().userID != note.creatorID) return _notesInfo;
      return NoteResource.delete({id:note.noteID})
        .$promise.then(function(deletedNote){
          if (_notes.rows){
            var idx = Util.indexOfObject(_notes.rows, 'noteID', note.noteID);
            if (idx != -1) _notes.rows.splice(idx,1);
          }
          return _notesInfo;
      }).catch(function(err){
          console.log(err);
          return err;
        })

    }

    // Public API here
    return {
      getNotes: getNotes,
      get: getNote,
      add: addNote,
      update:editNote,
      remove: deleteNote,
      notes: function () {
        return _notesInfo;
      },
    };


  });
