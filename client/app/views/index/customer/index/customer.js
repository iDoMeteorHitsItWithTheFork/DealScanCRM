'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.customer', {
        url: '/customers',
        title: 'Customers',
        authenticate: true,
        templateUrl: 'app/views/index/customer/index/customers.html',
        controller: 'CustomersCtrl as customers',
        data: {pageTitle: 'Customers', navbarColor:'gray-bg'},
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                serie: true,
                files: ['.resources/plugins/dataTables/datatables.min.js',
                  '.styles/plugins/dataTables/datatables.min.css']
              },
              {
                serie: true,
                name: 'datatables',
                files: ['.resources/plugins/dataTables/angular-datatables.min.js']
              },
              {
                serie: true,
                name: 'datatables.buttons',
                files: ['.resources/plugins/dataTables/angular-datatables.buttons.min.js']
              },
            ])
          },
        }
      })
      .state('index.customer.profile', {
        url: '/:customerID/:customerName',
        title: 'Customer',
        authenticate: true,
        templateUrl: 'app/views/index/customer/profile/customer.html',
        controller: 'CustomerCtrl as customer',
        data: {pageTitle: 'Customer Profile'},
        resolve: {
          selectedCustomer: function ($q, $stateParams, Customer) {
            var df = $q.defer();
            console.log($stateParams);
            Customer.get($stateParams.customerID).then(function (customer) {
              if (customer) {
                console.log(customer);
                console.log('I was resolved...');
                df.resolve(customer);
              } else {
                console.log('I was rejected...');
                df.reject('User Not Found');
              }
            }).catch(function (err) {
              df.reject(err);
            })
            return df.promise;
          }
        },
      })
      .state('index.customer.profile.summary', {
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
            templateUrl: 'app/views/index/customer/profile/tabs/summary.html',
            controller: 'CustomerCtrl as customer',
          }
        }
      })
      .state('index.customer.profile.summary.overview', {
        url: '/overview',
        title: 'Overview',
        authenticate: true,
        templateUrl: 'app/views/index/customer/profile/tabs/overview/overview.html',
        controller: 'CustomerCtrl as customer',
        resolve: {
          thisCustomer: function (selectedCustomer) {
            return selectedCustomer;
          }
        },
        data: {pageTitle: 'Customer Overview'},
      })
      .state('index.customer.profile.summary.documents', {
        url: '/documents',
        title: 'Documents',
        authenticate: true,
        templateUrl: 'app/views/index/customer/profile/tabs/documents/documents.html',
        controller: 'DocumentsCtrl as documents',
        resolve: {
          thisCustomer: function (selectedCustomer) {
            return selectedCustomer;
          }
        },
        data: {pageTitle: 'Customer Documents'},
      })
      .state('index.customer.profile.summary.images', {
        url: '/images',
        title: 'Images',
        authenticate: true,
        templateUrl: 'app/views/index/customer/profile/tabs/images/images.html',
        controller: 'ImagesCtrl as images',
        resolve: {
          thisCustomer: function (selectedCustomer) {
            return selectedCustomer;
          }
        },
        data: {pageTitle: 'Customer Images'},
      })
      .state('index.customer.profile.summary.tasks', {
        url: '/tasks',
        title: 'Tasks',
        authenticate: true,
        templateUrl: 'app/views/index/customer/profile/tabs/task/task.html',
        controller: 'TaskCtrl as task',
        resolve: {
          thisCustomer: function (selectedCustomer) {
            return selectedCustomer;
          }
        },
        data: {pageTitle: 'Customer Tasks'},
      })
      .state('index.customer.profile.summary.notes', {
        url: '/notes',
        title: 'Notes',
        authenticate: true,
        templateUrl: 'app/views/index/customer/profile/tabs/note/note.html',
        controller: 'NoteCtrl as note',
        resolve: {
          thisCustomer: function (selectedCustomer) {
            return selectedCustomer;
          }
        },
        data: {pageTitle: 'Customer Notes'},
      })
      .state('index.customer.profile.summary.messages', {
        url: '/messages',
        title: 'Messages',
        authenticate: true,
        templateUrl: 'app/views/index/customer/profile/tabs/messages/messages.html',
        controller: 'MessagesCtrl as messages',
        resolve: {
          thisCustomer: function (selectedCustomer) {
            return selectedCustomer;
          }
        },
        data: {pageTitle: 'Customer Messages'},
      })
  });
