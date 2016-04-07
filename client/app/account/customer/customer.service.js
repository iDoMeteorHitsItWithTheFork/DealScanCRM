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
      _customers.length = 0;
      return CustomerResource.get()
        .$promise.then(function (customers) {
          console.log(customers);
          _customers = customers || [];
          console.log(_customers);
          return _customers;
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
           console.log('getCustomer -> ');
           console.log(customer);
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
      get: getCustomer,
      getCustomers: getCustomers,
      find: findCustomer,
      customers: function(){
        return _customers;
      },
    };


  });
