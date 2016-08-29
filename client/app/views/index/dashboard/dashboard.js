'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider) {


    // Configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(120); // in seconds

    $ocLazyLoadProvider.config({
      // Set to true if you want to see what and when is dynamically loaded
      debug: true
    });

    $stateProvider
      .state('index.dashboard', {
        url: '/dashboard',
        title: 'Dashboard',
        authenticate: true,
        templateUrl: 'app/views/index/dashboard/dashboard.html',
        controller: 'DashboardCtrl as dashboard',
        data: {pageTitle: 'Dashboard', navbarColor: 'white-bg'},
        // specialClass:'fixed-nav fixed-nav-basic fixed-sidebar'
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                serie: true,
                name: 'angular-flot',
                files: [ '.resources/plugins/flot/jquery.flot.js', '.resources/plugins/flot/jquery.flot.time.js',
                  '.resources/plugins/flot/jquery.flot.tooltip.min.js', '.resources/plugins/flot/jquery.flot.spline.js',
                  '.resources/plugins/flot/jquery.flot.resize.js', '.resources/plugins/flot/jquery.flot.pie.js',
                  '.resources/plugins/flot/curvedLines.js', '.resources/plugins/flot/angular-flot.js', ]
              },
              {
                files: ['.resources/plugins/chartJs/Chart.min.js']
              },
              {
                name: 'angles',
                files: ['.resources/plugins/chartJs/angles.js']
              },
              {
                files: ['.resources/plugins/moment/moment.min.js']
              },
              {
                files: ['.resources/plugins/jasny/jasny-bootstrap.min.js']
              },
              {
                name: 'ui.checkbox',
                files: ['.resources/bootstrap/angular-bootstrap-checkbox.js']
              },
              {
                files: ['.styles/plugins/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css']
              },
              {
                files: ['.styles/plugins/iCheck/custom.css','.resources/plugins/iCheck/icheck.min.js']
              },
              {
                name: 'ui.sortable',
                files: ['.resources/plugins/ui-sortable/sortable.js']
              },
              {
                name: 'ui.select',
                files: ['.resources/plugins/ui-select/select.min.js',
                        '.styles/plugins/ui-select/select.min.css']
              },
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
                serie: true,
                files: ['.resources/plugins/daterangepicker/daterangepicker.js', '.styles/plugins/daterangepicker/daterangepicker-bs3.css']
              },
              {
                name: 'daterangepicker',
                files: ['.resources/plugins/daterangepicker/angular-daterangepicker.js']
              }
            ]);
          }
        }
      })
  });
