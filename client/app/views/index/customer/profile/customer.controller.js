'use strict';

angular.module('dealScanCrmApp')

  .controller('CustomerCtrl', function ($scope, $state, Auth, Util, Customer, selectedCustomer, $uibModal, toaster) {

    var _customer = this;
    _customer.user = Auth.getCurrentUser();
    console.log('customer controller loaded....');
    _customer.thisCustomer = selectedCustomer;
    _customer.retreivingDocs = false;
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
          var verbiage = _customer.thisCustomer.profile.name.split(' ')[0]+' traded '+purchases[i].Trades.length+' for this deal, ';
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
        bg_color: 'danger-bg'
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
        bg_color: 'bg-sq'
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

    _customer.emailCustomer = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/email/modal/emailModal.html',
        controller: 'EmailCustomerCtrl',
      });
    }

  });
