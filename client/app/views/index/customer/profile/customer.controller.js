'use strict';

angular.module('dealScanCrmApp')

  .controller('CustomerCtrl', function ($scope, $state, Auth, Util, Customer, selectedCustomer, $uibModal) {

    var _customer = this;
    _customer.user = Auth.getCurrentUser();
    console.log('customer controller loaded....');
    _customer.thisCustomer = selectedCustomer;
    console.log(selectedCustomer);

    _customer.info = {
      name: _customer.thisCustomer.profile.name,
      phone: _customer.thisCustomer.profile.phone,
      email: _customer.thisCustomer.profile.email,
      address: _customer.thisCustomer.profile.address,
      streetAddress: _customer.thisCustomer.profile.streetAddress,
      city: _customer.thisCustomer.profile.city,
      state: _customer.thisCustomer.profile.state,
      zipCode: _customer.thisCustomer.profile.postalCode,
      driverLicense: _customer.thisCustomer.profile.driverLicense
    }

    _customer.purchases = _customer.thisCustomer.purchases;
    var generateTradeDetails = function(purchases){
      for(var i=0; i < purchases.length; i++){
        if (purchases[i].Trades.length > 0){
          var tradePayOff = 0;
          var tradeAllowance = 0;
          var verbiage = _customer.thisCustomer.firstName+' traded '+purchases[i].Trades.length+' for this deal, ';
          for(var j =0; j < purchases[i].Trades.length; j++){
             tradePayOff += parseFloat(purchases[i].Trades[j].payOffAmount).toFixed(2);
             tradeAllowance += parseFloat(purchases[i].Trades[j].tradeAllowance).toFixed(2);
             if (j > 0) verbiage += ", ";
             if (j == purchases[i].Trades.length) verbiage += " and ";
             verbiage += "a <a>"+purchases[i].Trades[j].profile.year+"  "+purchases[i].Trades[j].profile.make+"  "+purchases[i].Trades[j].profile.model+"</a>";
          } purchases[i].tradeVerbiage = verbiage;
          purchases[i].tradePayOff = tradePayOff;
          purchases[i].tradeAllowance = tradeAllowance;
        }
      }
      //customer.thisCustomer.firstName traded 2 cars in for this deal, a <a>2015 Ford Mustang</a>, and a <a>2011 Honda Civic SE</a>.
    }


    _customer.timeAgo = function(time){
       return moment(time).fromNow();
    }

    _customer.dealTime  = function(time){
      //Thrusday 4:21 pm - 12.06.2016
      return moment(time).format('dddd H:mm a - MM.DD.YYYY');
    }

    _customer.displayClassification = function(classification){
      var cl = '';
       switch(classification.toLowerCase()){
         case 'car':
         case 'cars':
           cl =  'car';
           break;
         case 'truck':
         case 'trucks':
           cl = 'truck';
           break;
         case 'van':
         case 'vans':
           cl =  'van';
           break;
         case 'utility':
         case 'utilities':
           cl = 'SUV';
           break;
         case 'other':
         case 'others':
           cl =  'vehicle';
           break;
         default:
            cl = 'vehicle';
            break;
       }
       return cl;
    }

    if (_customer.purchases.length > 0) generateTradeDetails(_customer.purchases);
    _customer.purchase = _customer.purchases[0];


    _customer.tabs = [
      {
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
      },
      {
        id: 'documents',
        heading: 'DOCUMENTS',
        route: 'index.customer.profile.documents',
        icon: 'fa-file-text',
        bg_color: 'blue-bg'
      },
      {
        id: 'overview',
        heading: 'SUMMARY',
        route: 'index.customer.profile',
        icon: 'fa-file-text',
        bg_color: 'yellow-bg'
      }];

    _customer.setActiveTab = function(tab){
      $state.go(tab.route);
    };

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

  });
