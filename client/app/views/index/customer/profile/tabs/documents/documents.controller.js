'use strict';

angular.module('dealScanCrmApp')
  .controller('DocumentsCtrl', function ($scope, Auth, selectedCustomer, $filter, Customer, toaster) {

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

    // var url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf';
    // var pdfDoc = null,
    //     pageNum = 1,
    //     pageRendering = false,
    //     pageNumPending = null,
    //     scale = 0.8,
    //     canvas = document.getElementById('the-canvas'),
    //     ctx = canvas.getContext('2d');
    //
    // /**
    //  * Get page info from document, resize canvas accordingly, and render page.
    //  * @param num Page number.
    //  */
    // function renderPage(num) {
    //   pageRendering = true;
    //   pdfDoc.getPage(num).then(function(page) {
    //     var viewport = page.getViewport(scale);
    //     canvas.height = viewport.height;
    //     canvas.width = viewport.width;
    //
    //     var renderContext = {
    //       canvasContext: ctx,
    //       viewport: viewport
    //     };
    //     var renderTask = page.render(renderContext);
    //
    //     renderTask.promise.then(function () {
    //       pageRendering = false;
    //       if (pageNumPending !== null) {
    //         renderPage(pageNumPending);
    //         pageNumPending = null;
    //       }
    //     });
    //   });
    //   document.getElementById('page_num').textContent = pageNum;
    // }
    //
    // /**
    //  * If another page rendering in progress, waits until the rendering is
    //  * finised. Otherwise, executes rendering immediately.
    //  */
    // function queueRenderPage(num) {
    //   if (pageRendering) {
    //     pageNumPending = num;
    //   } else {
    //     renderPage(num);
    //   }
    // }
    //
    // /**
    //  * Displays previous page.
    //  */
    // function onPrevPage() {
    //   if (pageNum <= 1) {
    //     return;
    //   }
    //   pageNum--;
    //   queueRenderPage(pageNum);
    // }
    // document.getElementById('prev').addEventListener('click', onPrevPage);
    //
    // /**
    //  * Displays next page.
    //  */
    // function onNextPage() {
    //   if (pageNum >= pdfDoc.numPages) {
    //     return;
    //   }
    //   pageNum++;
    //   queueRenderPage(pageNum);
    // }
    // document.getElementById('next').addEventListener('click', onNextPage);
    //
    // /**
    //  * Asynchronously downloads PDF.
    //  */
    // PDFJS.getDocument(url).then(function (pdfDoc_) {
    //   pdfDoc = pdfDoc_;
    //   document.getElementById('page_count').textContent = pdfDoc.numPages;
    //   renderPage(pageNum);
    // });
  });

