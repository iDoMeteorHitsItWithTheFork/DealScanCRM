'use strict';

angular.module('dealScanCrmApp')
  .controller('CustomersCtrl', function ($scope, $state, Auth, Util, Customer, $uibModal, SweetAlert, appConfig) {

    var _customers = this; //$scope
    var filteredData = [];

    _customers.user = Auth.getCurrentUser();
    _customers.customersInfo = [];
    _customers.customersOnDisplay = [];
    _customers.processingData = false;
    _customers.findCustomer = {name: ''};


    $scope.$watch(function () {
      return _customers.findCustomer.name;
    }, function (newValue, oldValue) {
      console.log('nV: '+newValue);
      if (angular.isDefined(newValue)) {
        filteredData = newValue.length > 0 ? Customer.filterCustomers(newValue, _customers.customersInfo) : _customers.customersInfo;
        _customers.displayCustomers(filteredData, filteredData.length);
      }
    })

    /*
     * Pagination Defaults
     *
     * */
    _customers.currentPage = 1;
    _customers.numOfPages = null;
    _customers.records = null;
    _customers.itemsPerPage = appConfig.paginationItemsPerPage;
    _customers.maxSize = appConfig.paginationMaxSize;

    _customers.setPage = function (pageNo) {
      _customers.currentPage = pageNo;
    }


    _customers.displayCustomers = function (customers, records) {
      _customers.customersOnDisplay.length = 0;
      var start = (_customers.currentPage - 1) * _customers.itemsPerPage;
      var end = start + _customers.itemsPerPage;
      _customers.records = angular.isDefined(records) ? records : Customer.getCount();
      _customers.customersOnDisplay = customers ? customers.slice(start, end) : _customers.customersInfo.slice(start, end);
    }

    _customers.pageChanged = function () {
      _customers.findCustomer.name.length > 0 ? _customers.displayCustomers(filteredData, filteredData.length) : _customers.displayCustomers();
    };


    var loadCustomers = function () {
      if (_customers.processingData) return;
      _customers.processingData = true;
      Customer.getCustomers().then(function (customersInfo) {
        if (customersInfo) {
          _customers.customersInfo = customersInfo;
          _customers.setPage(1);
          _customers.displayCustomers();
        }
        _customers.processingData = false;
      }).catch(function (err) {
        console.log(err);
        _customers.processingData = false;
        SweetAlert.swal("Customer Loading Error ", "Sorry, an error occurred while attempting to retrieve your customer info.", "error");
      });
    }




    _customers.find = function (name) {
      if (_customers.processingData) return;
      _customers.processingData = true;
      Customer.find(name).then(function (customersInfo) {
        console.log(customersInfo);
        if (customersInfo){
          _customers.customersInfo = customersInfo;
          _customers.setPage(1);
          _customers.displayCustomers();
        }
        _customers.processingData = false;
      }).catch(function (err) {
        console.log(err);
        _customers.processingData = false;
        SweetAlert.swal("Customer Search Error ", "Sorry, an error occurred while attempting to retrieve your customer info.", "error");
      });
    }

    _customers.goToProfile = function (customer) {
      console.log('>> going to customer page...');
      $state.go('home.customer.profile', {
        customerID: customer.customerID,
        customerName: customer.profile.name.replace(/\ /g, '_')
      });
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
