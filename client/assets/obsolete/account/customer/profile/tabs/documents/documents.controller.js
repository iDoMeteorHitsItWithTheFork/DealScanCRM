'use strict';

angular.module('dealScanCrmApp')
  .controller('DocumentsCtrl', function ($scope, Auth, selectedCustomer, $filter) {

    var _documents = this;
    _documents.user = Auth.getCurrentUser();
    _documents.thisCustomer = selectedCustomer;
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
      query: {'userID': _documents.user.userID, 'customerID': _documents.thisCustomer.customerID},
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


    _documents.docs = [{
      name: 'Purchase Vehicle Odometer',
      ext: 'pdf',
      img: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/pdf-doc-48.png',
      size: '25kb',
      status: true,
      requested: true,
      url: ''
    }, {
      name: 'Trade Vehicle Odometer',
      ext: 'pdf',
      img: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/pdf-doc-48.png',
      size: '25kb',
      status: true,
      requested: true,
      url: ''
    }, {
      name: 'Rebate Incentive Approval',
      ext: 'doc',
      img: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/word-doc-48.png',
      size: '25kb',
      status: false,
      requested: true,
      url: ''
    }, {
      name: 'We Owe',
      ext: 'xls',
      img: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/excel-doc-48.png',
      size: '25kb',
      status: true,
      requested: true,
      url: ''
    }, {
      name: 'Lemon Law',
      ext: 'ppt',
      img: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/ppt-doc-48.png',
      size: '25kb',
      status: false,
      requested: true,
      url: ''
    }, {
      name: 'Power Of Attorney',
      ext: 'pdf',
      img: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/pdf-doc-48.png',
      status: false,
      requested: true,
      size: '25kb',
      url: ''
    }
    ];

    _documents.getRequestedDocs = function(){
      _documents.requestedDocs = $filter('filter')(_documents.docs, function(val, index, arr){
        return val.requested;
      });
    }

    _documents.getRequestedDocs();



  });

