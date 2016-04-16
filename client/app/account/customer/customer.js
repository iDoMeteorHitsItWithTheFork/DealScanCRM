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
                'Sorry, an error occurred while attempting to retrieve your customer info. Please try again later. Thanks',
                'error'
              );
              df.reject(err);
            })
            return df.promise;
          }
        },
      })
      .state('home.customer.profile.summary', {
        url: '/summary',
        abstract: true,
        authenticate: true,
        resolve: {
          thisCustomer: function (selectedCustomer) {
            return selectedCustomer;
          }
        },
        views: {
          tabs: {
            templateUrl: 'app/account/customer/tabs/summary.html',
            controller: 'CustomerCtrl as customer',
          }
        }
      })
      .state('home.customer.profile.summary.overview', {
        url: '/overview',
        title: 'Overview',
        authenticate: true,
        templateUrl: 'app/account/customer/tabs/overview/overview.html',
        controller: 'CustomerCtrl as customer',
        resolve: {
          thisCustomer: function (selectedCustomer) {
            return selectedCustomer;
          }
        }
      })
      .state('home.customer.profile.summary.documents', {
        url: '/documents',
        title: 'Documents',
        authenticate: true,
        templateUrl: 'app/account/customer/tabs/documents/documents.html',
        controller: 'DocumentsCtrl as documents',
        resolve: {
          thisCustomer: function (selectedCustomer) {
            return selectedCustomer;
          }
        }
      })
      .state('home.customer.profile.summary.images', {
        url: '/images',
        title: 'Images',
        authenticate: true,
        templateUrl: 'app/account/customer/tabs/images/images.html',
        controller: 'ImagesCtrl as images',
        resolve: {
          thisCustomer: function (selectedCustomer) {
            return selectedCustomer;
          }
        }
      })
      .state('home.customer.profile.summary.tasks', {
        url: '/tasks',
        title: 'Tasks',
        authenticate: true,
        templateUrl: 'app/account/customer/tabs/task/task.html',
        controller: 'TaskCtrl as task',
        resolve: {
          thisCustomer: function (selectedCustomer) {
            return selectedCustomer;
          }
        }
      })
      .state('home.customer.profile.summary.notes', {
        url: '/notes',
        title: 'Notes',
        authenticate: true,
        templateUrl: 'app/account/customer/tabs/note/note.html',
        controller: 'NoteCtrl as note',
        resolve: {
          thisCustomer: function (selectedCustomer) {
            return selectedCustomer;
          }
        }
      })
      .state('home.customer.profile.summary.messages', {
        url: '/messages',
        title: 'Messages',
        authenticate: true,
        templateUrl: 'app/account/customer/tabs/messages/messages.html',
        controller: 'MessagesCtrl as messages',
        resolve: {
          thisCustomer: function (selectedCustomer) {
            return selectedCustomer;
          }
        }
      })
  });
