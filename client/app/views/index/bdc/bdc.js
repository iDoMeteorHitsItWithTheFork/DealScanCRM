'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.bdc', {
        url: '/bdc',
        title: 'BDC Dashboard',
        authenticate: true,
        templateUrl: 'app/views/index/bdc/bdc.html',
         controller: 'BDCCtrl as bdc',
         data: {pageTitle: 'BDC Dashboard', navbarColor: 'white-bg'},
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
