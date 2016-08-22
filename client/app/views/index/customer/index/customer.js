'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("/customers/:customerID/:customerName", "/customers/:customerID/:customerName/overview");
    $stateProvider
      .state('index.customer', {
        url: '/customers',
        title: 'Customers',
        authenticate: true,
        templateUrl: 'app/views/index/customer/index/customers.html',
        controller: 'CustomersCtrl as customers',
        data: {pageTitle: 'Customers', navbarColor: 'gray-bg'},
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
              {
                files: ['.styles/plugins/iCheck/custom.css','.resources/plugins/iCheck/icheck.min.js']
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
          selectedCustomer: function (loadPlugin, $q, $stateParams, Customer) {
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
      .state('index.customer.profile.overview', {
        url: '/overview',
        title: 'Overview',
        authenticate: true,
        templateUrl: 'app/views/index/customer/profile/tabs/overview/overview.html',
        controller: 'CustomerCtrl as customer',
        resolve: {
          thisCustomer: function (loadPlugin, selectedCustomer) {
            return selectedCustomer;
          }
        },
        data: {pageTitle: 'Customer Overview'},
      })
      .state('index.customer.profile.documents', {
        url: '/documents',
        title: 'Documents',
        authenticate: true,
        templateUrl: 'app/views/index/customer/profile/tabs/documents/documents.html',
        controller: 'DocumentsCtrl as documents',
        resolve: {
          thisCustomer: function (loadPlugin, selectedCustomer) {
            return selectedCustomer;
          }
        },
        data: {pageTitle: 'Customer Documents'},
      })
      .state('index.customer.profile.documents.pdfViewer', {
        url: '/:id/:url',
        title: 'PDF Viewer',
        authenticate: true,
        templateUrl: 'app/views/index/customer/profile/tabs/documents/pdfViewer/pdfViewer.html',
        controller: 'PdfViewerCtrl as viewer',
        resolve: {
          thisCustomer: function (loadPlugin, selectedCustomer) {
            return selectedCustomer;
          }
        },
        data: {pageTitle: 'PDF Viewer'},
      })
      .state('index.customer.profile.tasks', {
        url: '/tasks',
        title: 'Tasks',
        authenticate: true,
        templateUrl: 'app/views/index/customer/profile/tabs/task/task.html',
        controller: 'TaskCtrl as task',
        resolve: {
          thisCustomer: function (loadPlugin, selectedCustomer) {
            return selectedCustomer;
          }
        },
        data: {pageTitle: 'Customer Tasks'},
      })
      .state('index.customer.profile.notes', {
        url: '/notes',
        title: 'Notes',
        authenticate: true,
        templateUrl: 'app/views/index/customer/profile/tabs/note/note.html',
        controller: 'NoteCtrl as note',
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                serie: true,
                name: 'angular-ladda',
                files: ['.resources/plugins/ladda/spin.min.js', '.resources/plugins/ladda/ladda.min.js',
                  '.styles/plugins/ladda/ladda-themeless.min.css', '.resources/plugins/ladda/angular-ladda.min.js']
              }
            ])
          },
          thisCustomer: function (selectedCustomer) {
            return selectedCustomer;
          },

        },
        data: {pageTitle: 'Customer Notes'},
      })
      .state('index.customer.profile.messages', {
        url: '/messages',
        title: 'Messages',
        authenticate: true,
        templateUrl: 'app/views/index/customer/profile/tabs/messages/messages.html',
        controller: 'CustomerMessagesCtrl as customerMessages',
        resolve: {
          thisCustomer: function (loadPlugin, selectedCustomer) {
            return selectedCustomer;
          }
        },
        data: {pageTitle: 'Customer Messages'},
      })
  });
