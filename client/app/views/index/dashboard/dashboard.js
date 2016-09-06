'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider) {

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
            ]);
          }
        }
      })
  });
