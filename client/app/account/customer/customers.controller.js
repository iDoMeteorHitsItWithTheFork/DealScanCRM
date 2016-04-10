'use strict';

angular.module('dealScanCrmApp')
  .controller('CustomersCtrl', function ($scope, $state, Auth, Util, Customer, $uibModal, SweetAlert, appConfig) {

    var _customers = this; //$scope
    var filteredData = [];

    _customers.user = Auth.getCurrentUser();
    _customers.customersInfo = [];
    _customers.searchResultsInfo = [];
    _customers.customersOnDisplay = [];
    _customers.customersContainer = [];
    _customers.processingData = _customers.searchingArchives = false;
    _customers.findCustomer = {name: null};
    _customers.sortOptions = ['Recent', 'Old', 'Ascending (A-z)', 'Descending (z-A)'];
    _customers.orderCustomerByOption = _customers.sortOptions[0];


    $scope.$watch(function () {
      return _customers.findCustomer.name;
    }, function (newValue, oldValue) {
      console.log('nV: ' + newValue);
      if (angular.isDefined(newValue) && newValue !== null) {
        if (_customers.customersContainer.length == 0) _customers.customersContainer = _customers.customersInfo; //if container is empty , load all customers info by default.
        filteredData = newValue.length > 0 ? Customer.filterCustomers(newValue, _customers.customersContainer) : _customers.customersContainer;
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


    _customers.sortCustomers = function (option, forceStop) {
      var data = _customers.customersContainer.length > 0 ? _customers.customersContainer : _customers.customersInfo;
      switch (option) {
        default:
        case _customers.sortOptions[0]:
          _customers.orderCustomerByOption = _customers.sortOptions[0];
          _customers.customersContainer = Customer.sortCustomers(data, 'customerID', true);
          break;
        case _customers.sortOptions[1]:
          _customers.orderCustomerByOption = _customers.sortOptions[1];
          _customers.customersContainer = Customer.sortCustomers(data, 'customerID', false);
          break;
        case _customers.sortOptions[2]:
          _customers.orderCustomerByOption = _customers.sortOptions[2];
          _customers.customersContainer = Customer.sortCustomers(data, 'profile.name', false);
          break;
        case _customers.sortOptions[3]:
          _customers.orderCustomerByOption = _customers.sortOptions[3];
          _customers.customersContainer = Customer.sortCustomers(data, 'profile.name', true);
          break;

      }
      _customers.displayCustomers();
    }

    _customers.setPage = function (pageNo) {
      _customers.currentPage = pageNo;
    }

    _customers.setDisplayContainer = function (customersToDisplay) {
      _customers.customersContainer = customersToDisplay;
    }


    _customers.displayCustomers = function (customers, records, archives) {
      _customers.customersOnDisplay.length = 0;
      var start = (_customers.currentPage - 1) * _customers.itemsPerPage;
      var end = start + _customers.itemsPerPage;
      _customers.records = angular.isDefined(records) ? records : _customers.findCustomer.name && _customers.findCustomer.name.length > 0 ? Customer.getResultsCount() : Customer.getCount();
      _customers.customersOnDisplay = customers ? customers.slice(start, end) : _customers.customersContainer.slice(start, end);
      var msg = archives ? ' archives either. Please check your spelling and try again.'
        : ' active records. Click below to search in your archives as well.';
      _customers.searchResultsDesc = msg;
    }

    _customers.pageChanged = function () {
      _customers.findCustomer.name && _customers.findCustomer.name.length > 0 ? _customers.displayCustomers(filteredData, filteredData.length) : _customers.displayCustomers();
    };


    var loadCustomers = function () {
      if (_customers.processingData) return;
      _customers.processingData = true;
      Customer.getCustomers().then(function (customersInfo) {
        if (customersInfo) {
          _customers.customersInfo = customersInfo;
          _customers.setPage(1);
          _customers.setDisplayContainer(_customers.customersInfo);
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
      if (_customers.processingData || _customers.searchingArchives) return;
      _customers.searchingArchives = true;
      Customer.find(name).then(function (searchResultsInfo) {
        console.log(searchResultsInfo);
        if (searchResultsInfo) {
          _customers.searchResultsInfo = searchResultsInfo;
          _customers.setPage(1);
          _customers.setDisplayContainer(_customers.searchResultsInfo);
          _customers.displayCustomers(_customers.searchResultsInfo, Customer.getResultsCount(), true);
        }
        _customers.searchingArchives = false;
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
