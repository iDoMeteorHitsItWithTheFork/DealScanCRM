'use strict';

angular.module('dealScanCrmApp')
  .factory('Customer', function (Auth, Util, $q, CustomerResource) {
    // Service logic
    // ...

    var _customers = [];

    /*
    * Returns a list of customers
    * */
    function getCustomers() {
      return CustomerResource.query()
        .$promise.then(function (customers) {
          console.log(customers);
          _customers = customers || [];
          return _customers;
        }).catch(function (err) {
          console.log(err);
        })
    }


    /*
    * Returns customer with specified id
    * */
    function getCustomer(id) {
      return CustomerResource.get({customerID: id})
        .$promise.then(function (customer) {
           return customer;
        }).catch(function(err){
          console.log(err);
        })
    }

    /*
    * Returns a list of customers with the associated name
    *
    *
    * */
    function findCustomer(customerName) {
      return CustomerResource.query({name: Util.slimTrim(customerName)}).
          $promise.then(function(customers){
          console.log(customers);
          return customers || [];
      }).catch(function(err){
          console.log(err);
        })
    }


    // Public API here
    return {
      customers: getCustomers,
      get: getCustomer,
      find: findCustomer
    };


  });
