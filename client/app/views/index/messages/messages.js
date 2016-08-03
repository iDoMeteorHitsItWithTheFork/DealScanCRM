'use strict';

angular.module('dealScanCrmApp')
    .config(function ($stateProvider) {
      $stateProvider
          .state('index.messages', {
            url: '/messages',
            title: 'Messages',
            authenticate: true,
            templateUrl: 'app/views/index/messages/messages.html',
            controller: 'MessagesCtrl as msg',
            data: {pageTitle: 'Messages', navbarColor:'gray-bg'},
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
                    insertBefore: '#loadBefore',
                    files: ['.styles/plugins/fullcalendar/fullcalendar.css','.resources/plugins/fullcalendar/fullcalendar.min.js','.resources/plugins/fullcalendar/gcal.js']
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
                    files: ['.styles/plugins/summernote/summernote.css','.styles/plugins/summernote/summernote-bs3.css','.resources/plugins/summernote/summernote.min.js']
                  },
                  {
                    name: 'summernote',
                    files: ['.styles/plugins/summernote/summernote.css','.styles/plugins/summernote/summernote-bs3.css','.resources/plugins/summernote/summernote.min.js','.resources/plugins/summernote/angular-summernote.min.js']
                  }
                ])
              }
            }
          })
    });