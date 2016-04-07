'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home.customer', {
        url: '/customers',
        title: 'Customers',
        authenticate: true,
        views: {
          'pageContent': {
            templateUrl: 'app/account/customer/customers.html',
            controller: 'CustomersCtrl as customers'
          }
        }
      })
      .state('home.customer.profile', {
        url: '/:customerID/:customerName',
        title: 'Customer',
        authenticate: true,
        templateUrl: 'app/account/customer/customer.html',
        controller: 'CustomerCtrl as customer',
        resolve: {
          selectedCustomer: function ($q, $stateParams, Customer, SweetAlert) {
            var df = $q.defer();
            console.log($stateParams);
            Customer.get($stateParams.customerID).then(function (customer) {
              if (customer) {
                console.log(customer);
                console.log('I was resolved...');
                df.resolve(customer);
              } else {
                SweetAlert.swal(
                  'Customer Not Found',
                  'Sorry, we couldn\'t find this customer info.',
                  'error'
                );
                console.log('I was rejected...');
                df.reject('User Not Found');
              }
            }).catch(function (err) {
              SweetAlert.swal(
                'Customer Error',
                'Sorry, an error occured while attempting to retreive your customer info. Please try again later. Thanks',
                'error'
              );
              df.reject(err);
            })
            return df.promise;
          }
        },
      })
  });
