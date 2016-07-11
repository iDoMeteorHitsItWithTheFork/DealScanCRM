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
         data: {pageTitle: 'DDC Dashboard', navbarColor: 'white-bg'},
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
                name: 'ui.event',
                files: ['.resources/plugins/uievents/event.js']
              },
              {
                files: ['.resources/plugins/moment/moment.min.js']
              },
              {
                name: 'datePicker',
                files: ['.styles/plugins/datapicker/angular-datapicker.css',
                  '.resources/plugins/datapicker/angular-datepicker.js']
              },
              {
                serie: true,
                files: ['.resources/plugins/daterangepicker/daterangepicker.js',
                  '.styles/plugins/daterangepicker/daterangepicker-bs3.css']
              },
              {
                name: 'daterangepicker',
                files: ['.resources/plugins/daterangepicker/angular-daterangepicker.js']
              },
              {
                files: ['.resources/plugins/jasny/jasny-bootstrap.min.js']
              },
              {
                name: 'ui.map',
                files: ['.resources/plugins/uimaps/ui-map.js']
              },
              {
                serie: true,
                files: ['.resources/plugins/jvectormap/jquery-jvectormap-2.0.2.min.js',
                  '.resources/plugins/jvectormap/jquery-jvectormap-2.0.2.css']
              },
              {
                serie: true,
                files: ['.resources/plugins/jvectormap/jquery-jvectormap-world-mill-en.js']
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
                files: ['.styles/plugins/summernote/summernote.css','.styles/plugins/summernote/summernote-bs3.css',
                  '.resources/plugins/summernote/summernote.min.js']
              },
              {
                name: 'summernote',
                files: ['.styles/plugins/summernote/summernote.css','.styles/plugins/summernote/summernote-bs3.css',
                  '.resources/plugins/summernote/summernote.min.js','.resources/plugins/summernote/angular-summernote.min.js']
              }
            ]);
          }
        }
      })
  });
