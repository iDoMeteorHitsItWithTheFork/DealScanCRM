'use strict';

angular.module('dealScanCrmApp')
  .controller('DocumentsCtrl', function ($scope, Auth, selectedCustomer, $filter, Customer, toaster, $state, $window) {

    var _documents = this;
    _documents.user = Auth.getCurrentUser();
    console.log(selectedCustomer);
    _documents.thisCustomer = selectedCustomer;
    _documents.retreivingDocs = false;
    _documents.searchTerm = '';


    _documents.uploadOptions = {
      target: '/api/uploads',
      permanentErrors: [500, 501],
      maxChunkRetries: 1,
      chunkRetryInterval: 5000,
      simultaneousUploads: 4,
      progressCallbacksInterval: 1,
      withCredentials: true,
      fileParameterName: 'customerDocs',
      query: {'userID': _documents.user.userID, 'customerID': _documents.thisCustomer.profile.customerID},
      headers: {Authorization: 'Bearer ' + Auth.getToken()}
    };


    _documents.remove = function (row) {
      console.log(row);
      var idx = _documents.docs.indexOf(row);
      console.log(idx);
      if (idx != -1) {
        _documents.docs.splice(idx, 1);
        _documents.getRequestedDocs();
      }
    }

    _documents.updateDocLibrary = function(file){
      console.log('>> Uploaded Documents');
      console.log(file)
      var ext = file.getExtension();
      var name = file.name.split('.')[file.name.split('.').length-2];
      var size = file.size;
      var img = '';
      switch(ext.toLowerCase()){
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'jpeg':
          img = 'assets/images/image.png';
          break;
        case 'txt':
          img = 'assets/images/text-file.png';
          break;
        case 'doc':
        case 'docx':
          img = 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/word-doc-48.png';
          break;
        case 'xls':
        case 'xlsx':
          img = 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/excel-doc-48.png';
          break;
        case 'ppt':
        case 'pptx':
          img = 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/ppt-doc-48.png';
          break;
        case 'pdf':
          img = 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/pdf-doc-48.png';
          break;
      }

      var doc = {
        name: name,
        ext: ext,
        img: img,
        size: size,
        status: true,
        url: ''
      };
      var idx =  _documents.docs.indexOf(doc);
      if (idx == -1) {
        _documents.docs.unshift(doc);
        _documents.getRequestedDocs();
      }
    }

    _documents.docs = [];

    _documents.getRequestedDocs = function(){
      _documents.requestedDocs = $filter('filter')(_documents.docs, function(val, index, arr){
        return val.requested;
      });
    }

    _documents.getDocuments = function(){
      console.log('\n\n\n>> This Customer  \n\n\n');
      console.log(_documents.thisCustomer);
      console.log('\n\n ------------------------\n\n\n');
      if (_documents.retreivingDocs) return;
      _documents.retreivingDocs = true;
      Customer.documents(_documents.thisCustomer.profile.customerID)
        .then(function(documents){
          if (documents){
            console.log(documents);
            _documents.docs = documents;
          }
          _documents.retreivingDocs = false;
        }).catch(function(err){
        console.log(err);
        _documents.retreivingDocs = false;
        toaster.error({title: 'Document Error', body:'An error occured while retreiving documents'});
      })
    }


    _documents.getRequestedDocs();
    _documents.getDocuments();

    _documents.displayDocSet = function(id){
      Customer.viewDoc(id).then(function(){

      }).catch(function(err){
         console.log(err);
         toaster.error({title: 'PDF Error', body: 'An error occured while attempting to display the document'});
      })
    }

    _documents.openPDFViewer = function (doc) {
      console.log(doc);
      $state.go('index.customer.profile.documents.pdfViewer', {id: doc.id, url: doc.url, name: doc.name});
    }

  });

