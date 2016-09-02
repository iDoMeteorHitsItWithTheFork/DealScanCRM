'use strict';

angular.module('dealScanCrmApp')
  .controller('CustomersCtrl',
    function ($scope, $state, $sce, Auth, Util, Customer, Messages, $uibModal, appConfig, DTOptionsBuilder, $window, toaster, $timeout) {

    /*
     * Controllers Variables
     *
     * */
    var _customers = this; //$scope
    var filteredData = [];
    _customers.sources = Util.leadSources();

    _customers.user = Auth.getCurrentUser();
    _customers.customersInfo = [];
    _customers.searchResultsInfo = [];
    _customers.customersOnDisplay = [];
    _customers.customersContainer = [];
    _customers.processingData = _customers.searchingArchives = _customers.deletingCustomer = false;
    _customers.findCustomer = {name: null};
    _customers.filterOptions = ['Recent', 'Old', 'Name (A-z)', 'Name (z-A)'];
    _customers.filterByOption = _customers.filterOptions[0];
    _customers.loadingMessages = false;
    _customers.sendingMessages = false;
    _customers.messages = [];




    /**
     *  deals  table Data
     */
    _customers.dtOptions = DTOptionsBuilder.newOptions()
      .withDOM('<"html5buttons"B>lTfgitp')
      .withOption('responsive', true)
        .withButtons([
          {extend: 'copy'},
          {extend: 'csv'},
          {extend: 'excel', title: 'ExampleFile'},
          {extend: 'pdf', title: 'ExampleFile'},
          {extend: 'print',
            customize: function (win){
              $(win.document.body).addClass('white-bg');
              $(win.document.body).css('font-size', '10px');
              $(win.document.body).find('table')
                  .addClass('compact')
                  .css('font-size', 'inherit');
            }
          }
        ]);


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
        if (customersInfo){
          _customers.customersInfo = customersInfo.info;
          _customers.summary = customersInfo.stats;
        }
        _customers.processingData = false;
      }).catch(function (err) {
        console.log(err);
        _customers.processingData = false;
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
        if (searchResultsInfo) _customers.searchResultsInfo = searchResultsInfo;
        _customers.searchingArchives = false;
      }).catch(function (err) {
        console.log(err);
        _customers.processingData = false;
      });
    }


    /*
     *
     * Go to customer profile
     *
     * */
    _customers.goToProfile = function (customer) {
      console.log('>> going to customer page...');
      $state.go('index.customer.profile', {
        customerID: customer.profile.customerID,
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
        templateUrl: 'app/account/customer/add/addCustomer.html',
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
        templateUrl: 'app/views/index/customer/edit/updateCustomer.html',
        controller: 'UpdateCustomerCtrl as updateCustomer',
        resolve: {
          thisCustomer: function () {
            return customer;
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
        // $scope.$applyAsync(function(){
          _customers.customersInfo = Customer.customers();
        // });
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
    _customers.composeMail = function (customer) {
      if (customer.profile.email && customer.profile.email.toString().trim() != '') {
        var mailTo = 'mailto:' + customer.profile.email
        var w = $window.open(mailTo);
        var t = $timeout(function () {
          w.close();
        });
        $scope.$on('destroy', function () {
          $timeout.cancel(t);
        })
      } else  toaster.error({
        title: 'Mail Error',
        body: 'No Email address detected for customer. Please update the customer info.'
      })

    }

    /**
     *
     * text Customer
     *
     *
     */
    _customers.composeText = function (customer) {
      console.log(customer);
      if (_customers.loadingMessages) return;
       if (customer.profile.phone && customer.profile.phone.toString().trim() != '') {
        if (!_customers.openChat) _customers.openChat = true;
        _customers.chatRecipient = {recipientID: customer.profile.customerID, name:customer.profile.name, number: customer.profile.phone};
        _customers.loadingMessages = true;
         _customers.messages.length = 0;
         Messages.messages(customer.profile.customerID).then(function(messages){
           if (messages)_customers.messages = messages;
           else _customers.messages = [];
           _customers.loadingMessages = false;
         }).catch(function(err){
            console.log(err);
            _customers.loadingMessages = false;
            toaster.error({title: 'Messages Error', body: 'An error occurred while loading messages'});
         })
      } else toaster.error({
        title: 'Message Error',
        body: 'There are no phone number detected for this customer. please update the customer details.'
      })

    }


    _customers.sendMessage = function(form){
      if (_customers.sendingMessage) return;
      if (!_customers.message || _customers.message.toString().trim() == '') return;
      _customers.sendingMessage = true;
      Messages.send({
        id: _customers.chatRecipient.recipientID,
        recipient: 'customer',
        message: _customers.message
      }).then(function (message) {
        console.log(message);
        if (message) {
          _customers.messages.unshift(message);
          _customers.message = '';
          form.$setPristine();
        } else toaster.error({title: '', body: 'An error occured while attempting to send your message.'});
        _customers.sendingMessage = false;
      }).catch(function (err) {
        console.log(err);
        _customers.sendingMessage = false;
        toaster.error({title: 'Send Error', body: 'An error occured while attempting to send messages'});
      })

    }



    /*
     * Default Actions
     *
     * */
    loadCustomers();

  });
