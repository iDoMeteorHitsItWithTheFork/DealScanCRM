'use strict';

angular.module('dealScanCrmApp')
  .factory('Customer', function (Auth, Util, $q, $filter, CustomerResource) {
    // Service logic
    // ...

    var _customers = [];
    var _searchResults = []
    var _customersInfo = [];
    var _searchResultsInfo = [];
    var _pageSize = 1000;

    /*
    * Returns a list of customers
    * */
    function getCustomers() {
      _customers.length = 0;
      return CustomerResource.get()
        .$promise.then(function (customers) {
          _customers = customers || [];
          _customersInfo = customers ? customers.rows :  [];
          _customersInfo = (_customersInfo.length > _pageSize) ? _customersInfo.slice(0, _pageSize) : _customersInfo;
          console.log(_customersInfo);
          return _customersInfo;
        }).catch(function (err) {
          console.log(err);
        })
    }


    /*
    * Returns customer with specified customerId
    * */
    function getCustomer(customerID) {
      console.log(customerID);
      return CustomerResource.get({id: customerID})
        .$promise.then(function (customer) {
           return customer;
        }).catch(function(err){
          console.log(err);
        })
    }

    /*
    * Search customer array for customer match
    *
    * */
    function filterCustomers(find, customers){
      return $filter('filter')(customers, find);
    }

    /*
    * Sort customer array
    *
    * */
    function sortCustomers(customers, criteria, reverse){
      return $filter('orderBy')(customers, criteria, reverse);
    }

    /*
    * Returns a list of customers with the associated name
    *
    * */
    function findCustomer(customerName) {
      _customers.length = 0;
      customerName = Util.slimTrim(customerName);
      return CustomerResource.get({name: customerName}).
          $promise.then(function(searchResults){
          _searchResults = searchResults || [];
          _searchResultsInfo = searchResults ? searchResults.rows :  [];
          _searchResultsInfo = (_searchResultsInfo.length > _pageSize) ? _searchResultsInfo.slice(0, _pageSize) : _searchResultsInfo;
          return _searchResultsInfo;
      }).catch(function(err){
          console.log(err);
        })
    }


    // Public API here
    return {
      get: getCustomer,
      find: findCustomer,
      getCustomers: getCustomers,
      filterCustomers: filterCustomers,
      sortCustomers: sortCustomers,
      customers: function(){
        return _customersInfo;
      },
      searchResults: function(){
        return _searchResults;
      },
      getRows: function(){
        return _customers.rows;
      },
      getCount: function(){
        return _customers.count;
      },
      getResultsCount: function(){
        return _searchResults.count;
      }
    };


  });
