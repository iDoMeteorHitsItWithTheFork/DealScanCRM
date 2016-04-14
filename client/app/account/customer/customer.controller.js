'use strict';

angular.module('dealScanCrmApp')

  .controller('CustomerCtrl', function ($scope, $state, Auth, Util, Customer, selectedCustomer, $uibModal, SweetAlert) {

    var _customer = this;
    _customer.user = Auth.getCurrentUser();
    console.log('customer controller loaded....');
    _customer.thisCustomer = selectedCustomer;
    console.log(_customer.thisCustomer);

    _customer.info = {
      name: _customer.thisCustomer.profile.name,
      phone: _customer.thisCustomer.profile.phone,
      email: _customer.thisCustomer.profile.email,
      address: _customer.thisCustomer.profile.address
    }

    _customer.tabs = [{
      id: 'overview',
      heading: 'Overview',
      route: 'home.customer.profile.summary.overview',
    }, {
      id: 'documents',
      heading: 'Documents',
      route: 'home.customer.profile.summary.documents',
    }, {
      id: 'images',
      heading: 'Images',
      route: 'home.customer.profile.summary.images',
    }, {
      id: 'tasks',
      heading: 'Tasks',
      route: 'home.customer.profile.summary.tasks',
    }, {
      id: 'notes',
      heading: 'Notes',
      route: 'home.customer.profile.summary.notes',
    }, {
      id: 'messages',
      heading: 'Messages',
      route: 'home.customer.profile.summary.messages'
    }];

    var setActiveTab = function(){
      var idx = Util.indexOfObject(_customer.tabs, 'route', $state.current.name);
      if (idx != -1) _customer.activeTab = idx;
    }; setActiveTab();

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

    _customer.documents = [
      {
        image: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/word-doc-48.png',
        name: 'Purchase Vehicle Odometer',
        applicable: true,
        checked: true,
        size: '25 Kb',
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Trade Vehicle Odometer',
        applicable: true,
        checked: true,
        size: '15 Kb',
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Rebate Incentive Approval',
        applicable: true,
        checked: true,
        size: '1.2 Mb',
      },
      {
        image: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/word-doc-48.png',
        name: 'We Owe',
        applicable: true,
        checked: true,
        size: '245 Kb',
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Lemon Law',
        applicable: true,
        checked: true,
        size: '25 Kb',
      },
      {
        image: 'http://swanseaandbrecon.churchinwales.org.uk/wp-content/themes/ciw/images/word-doc-48.png',
        name: 'Power Of Attorney',
        applicable: true,
        checked: true,
        size: '5 Kb',
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Pay Off Verification',
        applicable: true,
        checked: true,
        size: '2 Mb',
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Insurance Verification',
        applicable: true,
        checked: false,
        size: '25 Kb',
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
        checked: false,
        size: '25 Kb',
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Tittle Guarantee',
        applicable: true,
        checked: false,
        size: '25 Kb',
      },
      {
        image: 'http://www.hotel-dioklecijan.com/wp-content/themes/dioklecijan/img/press/press-icon-pdf.png',
        name: 'Used Car Warranty',
        applicable: false,
        checked: false,
        size: '25 Kb',
      }
    ]
    _customer.photos = [
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford'
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi'
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi'
      },
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford'
      },
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford'
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi'
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi'
      },
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford'
      },
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford'
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi'
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi'
      },
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford'
      },
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford'
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi'
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi'
      },
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford'
      }
    ]


    $scope.images = [
      {
        'url': 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        'thumbUrl': 'http://icons.iconarchive.com/icons/calebamesbury/classic-american-cars/48/Muscle-Car-Mustang-GT-icon.png'
      },
      {
        'url': 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        'thumbUrl': 'http://files.softicons.com/download/internet-cons/blog-icons-by-jonas-hellwig/png/48/car.png'
      },
      {
        'url': 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        'thumbUrl': 'http://icons.iconarchive.com/icons/calebamesbury/classic-american-cars/48/Muscle-Car-Mustang-GT-icon.png'
      }
    ];

    _customer.emailCustomer = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/email/modal/emailModal.html',
        controller: 'EmailCustomerCtrl',
      });
    }

    $scope.messages =
      [{
        "from": "Cary Gaskell",
        "date": "04/04/2016 at 4:36PM",
        "subject": "You're the best",
        "email": "carylgaskell@gmail.com",
        "starred": false,
        "sent": false,
        "spam": false,
        "read": false,
        "content": "<p>Hi Cary, <br>You're awesome!</p> ",
        "id": 50223456
      }, {
        "from": "Cary Gaskell",
        "date": "04/02/2016 at 4:00PM",
        "subject": "You're so cool",
        "email": "carylgaskell@gmail.com",
        "starred": false,
        "sent": false,
        "spam": false,
        "read": false,
        "content": "<p>Hi Cary, <br>Thanks for the e-mail. It is always nice to hear from people, especially from you, Luda.</p> ",
        "id": 50223456
      },
        {
          "from": "Cary Gaskell",
          "date": "04/01/2016 at 3:30PM",
          "subject": "Buy a car",
          "email": "carylgaskell@gmail.com",
          "starred": false,
          "sent": false,
          "spam": false,
          "read": false,
          "content": "<p>Hi Cary, <br>Thanks for the e-mail. It is always nice to hear from people, especially from you, Luda.</p> ",
          "id": 50223456
        },
        {
          "from": "Cary Gaskell",
          "date": "04/04/2016 at 4:36PM",
          "subject": "Buy a car",
          "email": "carylgaskell@gmail.com",
          "starred": false,
          "sent": false,
          "spam": false,
          "read": false,
          "content": "<p>Hi Cary, <br>Thanks for the e-mail. It is always nice to hear from people, especially from you, Luda.</p> ",
          "id": 50223456
        },
        {
          "from": "Cary Gaskell",
          "date": "04/04/2016 at 4:36PM",
          "subject": "Buy a car",
          "email": "carylgaskell@gmail.com",
          "starred": false,
          "sent": false,
          "spam": false,
          "read": false,
          "content": "<p>Hi Cary, <br>Thanks for the e-mail. It is always nice to hear from people, especially from you, Luda.</p> ",
          "id": 50223456
        },
        {
          "from": "Cary Gaskell",
          "date": "04/04/2016 at 4:36PM",
          "subject": "Buy a car",
          "email": "carylgaskell@gmail.com",
          "starred": false,
          "sent": false,
          "spam": false,
          "read": false,
          "content": "<p>Hi Cary, <br>Thanks for the e-mail. It is always nice to hear from people, especially from you, Luda.</p> ",
          "id": 50223456
        },
        {
          "from": "Cary Gaskell",
          "date": "04/04/2016 at 4:36PM",
          "subject": "Buy a car",
          "email": "carylgaskell@gmail.com",
          "starred": false,
          "sent": false,
          "spam": false,
          "read": false,
          "content": "<p>Hi Cary, <br>Thanks for the e-mail. It is always nice to hear from people, especially from you, Luda.</p> ",
          "id": 50223456
        },
        {
          "from": "Cary Gaskell",
          "date": "04/04/2016 at 4:36PM",
          "subject": "Buy a car",
          "email": "carylgaskell@gmail.com",
          "starred": false,
          "sent": false,
          "spam": false,
          "read": false,
          "content": "<p>Hi Cary, <br>Thanks for the e-mail. It is always nice to hear from people, especially from you, Luda.</p> ",
          "id": 50223456
        },
        {
          "from": "Cary Gaskell",
          "date": "04/04/2016 at 4:36PM",
          "subject": "Buy a car",
          "email": "carylgaskell@gmail.com",
          "starred": false,
          "sent": false,
          "spam": false,
          "read": false,
          "content": "<p>Hi Cary, <br>Thanks for the e-mail. It is always nice to hear from people, especially from you, Luda.</p> ",
          "id": 50223456
        },
        {
          "from": "Cary Gaskell",
          "date": "04/04/2016 at 4:36PM",
          "subject": "Buy a car",
          "email": "carylgaskell@gmail.com",
          "starred": false,
          "sent": false,
          "spam": false,
          "read": false,
          "content": "<p>Hi Cary, <br>Thanks for the e-mail. It is always nice to hear from people, especially from you, Luda.</p> ",
          "id": 50223456
        }];


    $scope.displayingMessage = null;
    $scope.selectEmail = function (message) {
      console.log(message);
      $scope.displayingMessage = message;
    }


    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.images, index);
    };

    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };
  });
