'use strict';
angular.module('dealScanCrmApp')
  .controller('PdfViewerCtrl', function ($scope, $state, $stateParams, thisCustomer, toaster) {
    var _viewer = this;
    console.log('PDFVIewer controller loaded');
    console.log('\n\n\ State Params \n\n\n');
    console.log($stateParams);
    console.log('\n\n ==================== \n\n');

    _viewer.pdf = {
      id: $stateParams.id,
      url: $stateParams.url,
      title: $stateParams.name
    }

    PDFJS.workerSrc = 'client/bower_components/pdf.js.forms/build/pdf.combined.js';

    console.log('\n\n\ State Params \n\n\n');
    console.log(_viewer.pdf.url);
    console.log('\n\n ==================== \n\n');

    /* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
    /* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

//
// Basic AcroForms input controls rendering
//


    var formFields = {};

    function setupForm(div, content, viewport) {
      function bindInputItem(input, item) {
        if (input.name in formFields) {
          var value = formFields[input.name];
          if (input.type == 'checkbox') {
            input.checked = value;
          } else if (!input.type || input.type == 'text') {
            input.value = value;
          }
        }
        input.onchange = function pageViewSetupInputOnBlur() {
          if (input.type == 'checkbox') {
            formFields[input.name] = input.checked;
          } else if (!input.type || input.type == 'text') {
            formFields[input.name] = input.value;
          }
        };
      }

      function createElementWithStyle(tagName, item) {
        var element = document.createElement(tagName);
        var rect = PDFJS.Util.normalizeRect(
          viewport.convertToViewportRectangle(item.rect));
        element.style.left = Math.floor(rect[0]) + 'px';
        element.style.top = Math.floor(rect[1]) + 'px';
        element.style.width = Math.ceil(rect[2] - rect[0]) + 'px';
        element.style.height = Math.ceil(rect[3] - rect[1]) + 'px';
        return element;
      }

      function assignFontStyle(element, item) {
        var fontStyles = '';
        if ('fontSize' in item) {
          fontStyles += 'font-size: ' + Math.round(item.fontSize *
              viewport.fontScale) + 'px;';
        }
        switch (item.textAlignment) {
          case 0:
            fontStyles += 'text-align: left;';
            break;
          case 1:
            fontStyles += 'text-align: center;';
            break;
          case 2:
            fontStyles += 'text-align: right;';
            break;
        }
        element.setAttribute('style', element.getAttribute('style') + fontStyles);
      }

      content.getAnnotations().then(function (items) {
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          switch (item.subtype) {
            case 'Widget':
              if (item.fieldType != 'Tx' && item.fieldType != 'Btn' &&
                item.fieldType != 'Ch') {
                break;
              }
              var inputDiv = createElementWithStyle('div', item);
              inputDiv.className = 'inputHint';
              div.appendChild(inputDiv);
              var input;
              if (item.fieldType == 'Tx') {
                input = createElementWithStyle('input', item);
              }
              if (item.fieldType == 'Btn') {
                input = createElementWithStyle('input', item);
                if (item.flags & 32768) {
                  input.type = 'radio';
                  // radio button is not supported
                } else if (item.flags & 65536) {
                  input.type = 'button';
                  // pushbutton is not supported
                } else {
                  input.type = 'checkbox';
                }
              }
              if (item.fieldType == 'Ch') {
                input = createElementWithStyle('select', item);
                // select box is not supported
              }
              input.className = 'inputControl';
              input.name = item.fullName;
              input.title = item.alternativeText;
              assignFontStyle(input, item);
              bindInputItem(input, item);
              div.appendChild(input);
              break;
          }
        }
      });
    }

    function renderPage(div, pdf, pageNumber, callback) {
      pdf.getPage(pageNumber).then(function (page) {
        var scale = 1.5;
        var viewport = page.getViewport(scale);

        var pageDisplayWidth = viewport.width;
        var pageDisplayHeight = viewport.height;

        var pageDivHolder = document.createElement('div');
        pageDivHolder.className = 'pdfpage';
        pageDivHolder.style.width = pageDisplayWidth + 'px';
        pageDivHolder.style.height = pageDisplayHeight + 'px';
        div.appendChild(pageDivHolder);

        // Prepare canvas using PDF page dimensions
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = pageDisplayWidth;
        canvas.height = pageDisplayHeight;
        pageDivHolder.appendChild(canvas);

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext).promise.then(callback);

        // Prepare and populate form elements layer
        var formDiv = document.createElement('div');
        pageDivHolder.appendChild(formDiv);

        setupForm(formDiv, page, viewport);
      });
    }

    //client/app/views/index/customer/profile/tabs/documents/pdfViewer/helloworld.pdf

// Fetch the PDF document from the URL using promices

    _viewer.renderWithPDFJS = function () {
      PDFJS.getDocument('http://localhost:9000/app/users/2101/documents/1470759883236330.pdf').then(function getPdfForm(pdf) {
        // Rendering all pages starting from first
        var viewer = document.getElementById('viewer');
        var pageNumber = 1;
        console.log(pdf);
        var values = pdf.FormFunctionality.getFormValues();
        console.log(values);
        renderPage(viewer, pdf, pageNumber++, function pageRenderingComplete() {
          if (pageNumber > pdf.numPages) {
            return; // All pages rendered
          }
          // Continue rendering of the next page
          renderPage(viewer, pdf, pageNumber++, pageRenderingComplete);
        });
      });
    }

    _viewer.getPDFContent = function () {
        var pdf= document.getElementById('pdf_i').contentWindow.document;
        console.log('\n\n\n\n PDF \n\n\n\n');
        console.log(pdf);
        console.log('\n\n\n ------------------- \n\n\n');
        var blob = new Blob([pdf], { type: "application/pdf"});
        console.log(blob);
        window.open(window.URL.createObjectURL(blob), '_blank');
        //_viewer.renderWithPDFJS();
    }


  });
