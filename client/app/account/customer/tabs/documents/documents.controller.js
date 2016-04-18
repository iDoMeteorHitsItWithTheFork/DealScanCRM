'use strict';

angular.module('dealScanCrmApp')
  .controller('DocumentsCtrl', function ($scope) {

      var _documents = this;

    _documents.docs = [{
      ID:'',
      name: 'Purchase Vehicle Odometer',
      uploadedOn: new Date('2016/03/30'),
      uploadedBy: 'Luda Agodio',
      ext: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/pdf-doc-48.png',
      size: '25kb',
      url: ''
    },{
      ID:'',
      name: 'Trade Vehicle Odometer',
      uploadedOn: new Date('2016/03/30'),
      uploadedBy: 'Luda Agodio',
      ext: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/word-doc-48.png',
      size: '25kb',
      url: ''
    },{
      ID:'',
      name: 'Rebate Incentive Approval',
      uploadedOn: new Date('2016/03/30'),
      uploadedBy: 'Luda Agodio',
      ext: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/ppt-doc-48.png',
      size: '25kb',
      url: ''
    },{
      ID:'',
      name: 'We Owe',
      uploadedOn: new Date('2016/03/30'),
      uploadedBy: 'Luda Agodio',
      ext: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/pdf-doc-48.png',
      size: '25kb',
      url: ''
    },{
      ID:'',
      name: 'Lemon Law',
      uploadedOn: new Date('2016/03/30'),
      uploadedBy: 'Luda Agodio',
      ext: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/excel-doc-48.png',
      size: '25kb',
      url: ''
    },{
      ID:'',
      name: 'Power Of Attorney',
      uploadedOn: new Date('2016/03/30'),
      uploadedBy: 'Luda Agodio',
      ext: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/word-doc-48.png',
      size: '25kb',
      url: ''
    },
    ];

    $scope.rowCollection = [
      {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
      {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
      {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'}
    ];

    _documents.data = [
      {
        image: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/word-doc-48.png',
        name: 'Purchase Vehicle Odometer',
        applicable: true,
        checked: true
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Trade Vehicle Odometer',
        applicable: true,
        checked: true
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Rebate Incentive Approval',
        applicable: true,
        checked: true
      },
      {
        image: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/word-doc-48.png',
        name: 'We Owe',
        applicable: true,
        checked: true
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Lemon Law',
        applicable: true,
        checked: true
      },
      {
        image: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/word-doc-48.png',
        name: 'Power Of Attorney',
        applicable: true,
        checked: true
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Pay Off Verification',
        applicable: true,
        checked: true
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Insurance Verification',
        applicable: true,
        checked: false
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'First Free Oil Change Certificate',
        applicable: true,
        checked: false
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Pay Off Authorization',
        applicable: true,
        checked: false
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Tittle Guarantee',
        applicable: true,
        checked: false
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Used Car Warranty',
        applicable: false,
        checked: false
      }
    ];


  });
