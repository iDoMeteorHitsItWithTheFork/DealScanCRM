'use strict';

angular.module('dealScanCrmApp')
  .controller('CustomersCtrl', function ($scope, $state, Auth, Util, Customer, $uibModal, SweetAlert, appConfig) {

    var _customers = this; //$scope

    _customers.user = Auth.getCurrentUser();
    _customers.customersInfo = [];
    _customers.customersOnDisplay = [];
    _customers.processingData = false;

    /*
    * Pagination Defaults
    *
    * */
    _customers.currentPage = 1;
    _customers.numOfPages = null;
    _customers.itemsPerPage = appConfig.paginationItemsPerPage;
    _customers.maxSize = appConfig.paginationMaxSize;

    _customers.setPage = function(pageNo){
      _customers.currentPage = pageNo;
    }


    _customers.displayCustomers = function(){
      _customers.customersOnDisplay.length = 0;
      var start = (_customers.currentPage - 1) * _customers.itemsPerPage;
      var end = start + _customers.itemsPerPage;
      _customers.customersOnDisplay = _customers.customersInfo.splice(start, end);
    }

    _customers.pageChanged = function() {
      console.log('Page changed to: ' + _customers.currentPage);
      _customers.displayCustomers();
    };



    var loadCustomers = function(){
        if (_customers.processingData) return;
        _customers.processingData = true;
        Customer.getCustomers().then(function(customersInfo){
          if (customersInfo) {
            _customers.customersInfo = customersInfo;
            _customers.infoCount = Customer.getCount();
            _customers.setPage(1);
            _customers.displayCustomers();
            console.log('InfoCount: '+_customers.infoCount);
          } _customers.processingData = false;
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

    _customers.addCustomer = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/customer/addCustomer.html',
        controller: 'AddCustomerCtrl'
      });
    };

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
