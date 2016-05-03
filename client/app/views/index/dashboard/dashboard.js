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
        data: {pageTitle: 'Dashboard'},
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                serie: true,
                name: 'angular-flot',
                files: ['.resources/plugins/flot/jquery.flot.js', '.resources/plugins/flot/jquery.flot.time.js',
                  '.resources/plugins/flot/jquery.flot.tooltip.min.js', '.resources/plugins/flot/jquery.flot.spline.js',
                  '.resources/plugins/flot/jquery.flot.resize.js', '.resources/plugins/flot/jquery.flot.pie.js',
                  '.resources/plugins/flot/curvedLines.js', '.resources/plugins/flot/angular-flot.js'
                ]
              },
              {
                serie: true,
                files: ['.resources/plugins/jvectormap/jquery-jvectormap-2.0.2.min.js',
                  '.resources/plugins/jvectormap/jquery-jvectormap-2.0.2.css'
                ]
              },
              {
                serie: true,
                files: ['.resources/plugins/jvectormap/jquery-jvectormap-world-mill-en.js']
              },
              {
                name: 'ui.checkbox',
                files: ['.resources/bootstrap/angular-bootstrap-checkbox.js']
              }
            ]);
          }
        }
      })
  });
