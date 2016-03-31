'use strict';

angular.module('dealScanCrmApp')
  .controller('CustomerCtrl', function ($scope, Auth) {
    var _customer = this; //$scope
    _customer.user = Auth.getCurrentUser();

    _customer.info = {
      name: 'Cary Gaskall*',
      phone: '222-444-MMMM'
    }

    _customer.navButtons = [
      {
        text: 'Add Appointment',
        icon: 'glyphicon-calendar'
      },
      {
        text: 'Assign Task',
        icon: 'glyphicon-tasks'
      },
      {
        text: 'Assign Lead',
        icon: 'glyphicon-bullhorn'
      }
    ]
    _customer.activity = [
      {
        time: '11:18 AM',
        description: 'John S. assigned some tasks to Ryan H.'
      },
      {
        time: 'Thur, 12 Jan',
        description: 'description Ryan H. sent text message'
      },
      {
        time: 'Tue, 10 Jun',
        description: 'Cary Gaskell bought 2001 Escape'
      },
      {
        time: 'Sun, 11 Apr',
        description: 'Ryan H. uploaded Credit Application'
      },
      {
        time: 'Wed, 25 Mar',
        description: 'Appointment with Ryan H.'
      }
    ]

    _customer.documents =[
      {
        image: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/word-doc-48.png',
        name: 'Document0'
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Document1'
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Document2'
      },
      {
        image: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/word-doc-48.png',
        name: 'Document3'
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Document4'
      }
    ]
    _customer.photos = [
      {
        url0: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt0: 'Ford',
        url1: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt1: 'Audi',
        url2: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt2: 'Audi'
      },
      {
        url0: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt0: 'Audi',
        url1: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt1: 'Ford',
        url2: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt2: 'Audi'
      },
      {
        url0: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt0: 'Audi',
        url1: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt1: 'Audi',
        url2: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt2: 'Ford'
      },
    ]
    _customer.menuItems = [
      {
        name: 'Overview',
        state: 'active'
      },
      {
        name: 'Documents',
        state: 'disabled'
      },
      {
        name: 'Images',
        state: 'disabled'
      },
      {
        name: 'Task Log',
        state: 'disabled'
      },
      {
        name: 'Customer Notations',
        state: 'disabled'
      }
    ]

    $scope.images = [
      {
        'url': 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        'caption': 'Optional caption',
        'thumbUrl': 'thumb1.jpg' // used only for this example
      },
      {
        'url': 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        'thumbUrl': 'thumb2.jpg'
      },
      {
        'url': 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        'thumbUrl': 'thumb3.png'
      }
    ];

    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.images, index);
    };
  });
