'use strict';

angular.module('dealScanCrmApp')

  .controller('CustomerCtrl', function ($scope, $state, Auth, Util, Customer, selectedCustomer, $uibModal) {

    var _customer = this;
    _customer.user = Auth.getCurrentUser();
    console.log('customer controller loaded....');
    _customer.thisCustomer = selectedCustomer;
    console.log(_customer.thisCustomer);

    _customer.info = {
      name: _customer.thisCustomer.profile.name,
      phone: _customer.thisCustomer.profile.phone,
      email: _customer.thisCustomer.profile.email,
      address: _customer.thisCustomer.profile.address,
      streetAddress: _customer.thisCustomer.streetAddress,
      city: _customer.thisCustomer.city,
      state: _customer.thisCustomer.state,
      zipCode: _customer.thisCustomer.postalCode,
    }

    _customer.purchases = [{
      vehicle: '2011 Escape',
      trades:['1973 Pinto'],
      date:'03/02/2016',
      source: 'Walk-In',
      salePerson:{name: 'Bryan M'},
      status: 'Pending',
      financing: {
        salePrice: '20,000',
        tradeAllowance:'5,000',
        tradePayOff: '7,000',
        financed: '14,000',
        rebate:'500',
        ir: '7.5',
        terms :'60',
        payment: '500'
      }
    },{
      vehicle: '2015 Escape',
      trades:['2001 BMW 323 ci', '2007 Honda Accord'],
      date:'03/02/2016',
      source: 'Web',
      salePerson:{name: 'Eric C.'},
      status: 'Completed',
      financing:  {
        salePrice: '30,000',
        tradeAllowance:'1,000',
        tradePayOff: '2,000',
        financed: '50,000',
        rebate:'1500',
        ir: '2.5',
        terms :'72',
        payment: '1000'
      }
    },
      {
        vehicle: '2014 Escape',
        trades:['2000 Mitsubishi Lancer Evo'],
        date:'03/02/2016',
        source: 'Phone',
        salePerson:{name: 'Rick K'},
        status: 'Lost',
        financing:  {
          salePrice: '25,000',
          tradeAllowance:'1,000',
          tradePayOff: '10,000',
          financed: '14,000',
          rebate:'1000',
          ir: '5.5',
          terms :'60',
          payment: '800'
        }
      },
    ];
    _customer.purchase = _customer.purchases[0];



    _customer.tabs = [{
      id: 'overview',
      heading: 'SUMMARY',
      route: 'index.customer.profile.overview',
      icon: 'fa-file-text',
      bg_color: 'yellow-bg'
    }, {
      id: 'documents',
      heading: 'DOCUMENTS',
      route: 'index.customer.profile.documents',
      icon: 'fa-file-text',
      bg_color: 'blue-bg'
    }, {
      id: 'tasks',
      heading: 'TASKS',
      route: 'index.customer.profile.tasks',
      icon: 'fa-list',
      bg_color: 'navy-bg'
    }, {
      id: 'notes',
      heading: 'NOTES',
      route: 'index.customer.profile.notes',
      icon: 'fa-files-o',
      bg_color: 'yellow-bg'
    }, {
      id: 'messages',
      heading: 'MESSAGES',
      route: 'index.customer.profile.messages',
      icon: 'fa-envelope-o',
      bg_color: 'blue-bg'
    }];

    _customer.setActiveTab = function(tab){
      $state.go(tab.route);
    };

    //_customer.setActiveTab();

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


    _customer.emailCustomer = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/email/modal/emailModal.html',
        controller: 'EmailCustomerCtrl',
      });
    }

    // _customer.openLightboxModal = function (index) {
    //   Lightbox.openModal(_customer.photos, index);
    // };

  });
