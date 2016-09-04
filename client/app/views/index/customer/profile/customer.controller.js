'use strict';

angular.module('dealScanCrmApp')

  .controller('CustomerCtrl', function ($scope, $state, Auth, Util, Customer, selectedCustomer, $uibModal, toaster, $compile) {

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
      zipCode: _customer.thisCustomer.profile.zipCode,
      driverLicense: _customer.thisCustomer.profile.driverLicenseID
    }

    _customer.purchases = _customer.thisCustomer.purchases;
    _customer.purchase = _customer.purchases[0];

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


    _customer.editCustomer = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/views/index/customer/edit/updateCustomer.html',
        controller: 'UpdateCustomerCtrl as updateCustomer',
        resolve: {
          thisCustomer: function () {
            return _customer.thisCustomer;
          },
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                name: 'ui.select',
                files: ['.resources/plugins/ui-select/select.min.js',
                  '.styles/plugins/ui-select/select.min.css']
              },
            ])
          }
        }
      });

      modalInstance.result.then(function (updatedCustomer) {
        _customer.info = {
          name: updatedCustomer.profile.name,
          phone: updatedCustomer.profile.phone,
          email: updatedCustomer.profile.email,
          address: updatedCustomer.profile.address,
          streetAddress: updatedCustomer.profile.streetAddress,
          city: updatedCustomer.profile.city,
          state: updatedCustomer.profile.state,
          zipCode: updatedCustomer.profile.zipCode,
          driverLicense: updatedCustomer.profile.driverLicenseID
        }
        _customer.thisCustomer = updatedCustomer;
      })
    }


    _customer.vehicleDetails = function (deal, display) {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        size:' lg',
        templateUrl: 'app/views/index/customer/profile/vehicleDetails.html',
        controller: 'VehicleDetailCtrl as vehicle',
        resolve: {
          vehicle: function () {
            return {deal: deal, display: display};
          },
          customer: function(){
            return _customer.thisCustomer;
          },
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                files: ['.styles/plugins/slick/slick.css','.styles/plugins/slick/slick-theme.css','.resources/plugins/slick/slick.min.js']
              },
              {
                name: 'slick',
                files: ['.resources/plugins/slick/angular-slick.min.js']
              }
            ])
          }
        }
      });

      modalInstance.result.then(function () {

      })
    }



  });
