'use strict';

angular.module('dealScanCrmApp')
  .controller('CustomersCtrl', function ($scope, $state, $sce, Auth, Util, Customer, $uibModal, $aside, SweetAlert, appConfig) {

    /*
     * Controllers Variables
     *
     * */
    var _customers = this; //$scope
    var filteredData = [];
    _customers.sources = ['walkIn', 'Web', 'Phone', 'Happy Tag', 'Other'];

    _customers.user = Auth.getCurrentUser();
    _customers.customersInfo = [];
    _customers.searchResultsInfo = [];
    _customers.customersOnDisplay = [];
    _customers.customersContainer = [];
    _customers.processingData = _customers.searchingArchives = _customers.deletingCustomer = false;
    _customers.findCustomer = {name: null};
    _customers.filterOptions = ['Recent', 'Old', 'Name (A-z)', 'Name (z-A)'];
    _customers.filterByOption = _customers.filterOptions[0];



    /*
     * Pagination Defaults
     *
     * */
    _customers.itemsPerPage = appConfig.paginationItemsPerPage;
    _customers.maxSize = appConfig.paginationMaxSize;

    /*
     * load Customers
     * */
    var loadCustomers = function () {
      if (_customers.processingData) return;
      _customers.processingData = true;
      Customer.getCustomers().then(function (customersInfo) {
        if (customersInfo) {
          _customers.customersInfo = customersInfo;
          //_customers.setPage(1);
          //_customers.setDisplayContainer(_customers.customersInfo);
          //_customers.displayCustomers();
        }
        _customers.processingData = false;
      }).catch(function (err) {
        console.log(err);
        _customers.processingData = false;
        SweetAlert.swal("Customer Loading Error ",
          "Sorry, an error occurred while attempting to retrieve your customer info.",
          "error");
      });
    }


    /*
     *
     * Find Customer
     *
     * */
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
        SweetAlert.swal("Customer Search Error ",
          "Sorry, an error occurred while attempting to retrieve your customer info.",
          "error");
      });
    }


    /*
     *
     * Go to customer profile
     *
     * */
    _customers.goToProfile = function (customer) {
      console.log('>> going to customer page...');
      $state.go('home.customer.profile.summary.overview', {
        customerID: customer.customerID,
        customerName: customer.profile.name.replace(/\ /g, '_')
      });
    }


    /*
     * Customer Controls
     *
     *
     * */


    /*
     * add a customer
     *
     * */
    _customers.addCustomer = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/customer/addCustomer.html',
        controller: 'AddCustomerCtrl as newCustomer'
      });

      modalInstance.result.then(function (newCustomer) {
        _customers.customersInfo = Customer.customers();
      })
    };


    /**
     * Update an existing customer
     *
     *
     */
    _customers.editCustomer = function (customer) {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/customer/updateCustomer.html',
        controller: 'UpdateCustomerCtrl as updateCustomer',
        resolve: {
          selectedCustomer: function () {
            return customer;
          }
        }
      });

      modalInstance.result.then(function (updatedCustomer) {
        _customers.customersInfo = Customer.customers();
      })

    };


    /*
     * Delete a customer
     *
     *
     * */
    _customers.deleteCustomer = function (customer) {
      if (_customers.deletingCustomer) return;
      _customers.deletingCustomer = true;
      Customer.remove(customer.customerID).then(function (customersInfo) {
        _customers.customersInfo = customersInfo;
        _customers.deletingCustomer = false;
      }).catch(function (err) {
        _customers.deletingCustomer = false;
        console.log(err);
      })
    }


    /*
     * Email a customer
     *
     * */
    _customers.emailCustomer = function (customer) {
      var emailCustomer = $aside.open({
        templateUrl: 'app/account/customer/sideviews/email/email.html',
        controller: 'EmailCtrl as email',
        placement: 'right',
        windowClass: 'slide-up',
        size: 'md',
        resolve: {
          selectedCustomer: function(){
            return customer;
          }
        }
      });
    }

    /**
     *
     * text Customer
     *
     *
     */
    _customers.textCustomer = function (customer) {
      var textCustomer = $aside.open({
        templateUrl: 'app/account/customer/sideviews/text/text.html',
        controller: 'TextCtrl as text',
        placement: 'right',
        windowClass: 'slide-up',
        size: 'sm',
        resolve: {
          selectedCustomer: function(){
            return customer;
          }
        }
      });
    }

    /*
     * Default Actions
     *
     * */
    loadCustomers();

  });
