'use strict';

angular.module('dealScanCrmApp')
    .config(function ($stateProvider) {
      $stateProvider
          .state('index.tasks', {
            url: '/tasks',
            title: 'Tasks',
            authenticate: true,
            templateUrl: 'app/views/index/task/tasks.html',
            controller: 'TasksCtrl as task',
            data: {pageTitle: 'Tasks', navbarColor:'gray-bg'},
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
                    name: 'ui.calendar',
                    files: ['.resources/plugins/fullcalendar/calendar.js']
                  }
                ])
              }
            }
          })
    });