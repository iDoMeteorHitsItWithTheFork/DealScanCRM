'use strict';

angular.module('dealScanCrmApp')
  .controller('CustomersCtrl', function ($scope, $state, Auth, Util, Customer, $uibModal, SweetAlert) {

    var _customers = this; //$scope
    _customers.user = Auth.getCurrentUser();
    _customers.customers = [];
    _customers.processingData = false;

    var loadCustomers = function(){
        if (_customers.processingData) return;
        _customers.processingData = true;
        Customer.getCustomers().then(function(customers){
          if (customers) _customers.customers = customers;
          _customers.processingData = false;
        }).catch(function(err){
          _customers.processingData = false;
          SweetAlert.swal("Customer Loading Error ", "Sorry, an error occured while attempting to retreive your customer info.", "error");
        });
    }

    _customers.find = function(name){
        Customer.find(name).then(function(customers){
           console.log(customers);
           return customers;
        }).catch(function(err){
          console.log(err);
        });
    }

    _customers.goToProfile = function(customer){
      console.log('>> going to customer page...');
      $state.go('home.customer.profile', {customerID: customer.customerID, customerName: customer.profile.name.replace(/\ /g, '_')});
    }

    /*
    * Default Actions
    *
    * */

    loadCustomers();

   _customers.emailCustomer = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/email/modal/emailModal.html',
        controller: 'EmailCustomerCtrl as landing',
      });
    }

    _customers.textCustomer = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/email/modal/emailModal.html',
        controller: 'EmailCustomerCtrl as landing',
      });
    }

  });
