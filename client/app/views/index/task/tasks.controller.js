angular.module('dealScanCrmApp')
    .controller('TasksCtrl',['$scope', '$rootScope', '$timeout', '$compile', '$state', '$window','$filter', '$uibModal', function ($scope, $rootScope, $timeout, $compile, $state, $window, $filter, $uibModal) {

        var _task = this;

        _task.viewOptions = 'list';
        _task.tasks = [
            {
                task_id: 1,
                assignee: {
                    id: 1,
                    first_name: 'Cary',
                    last_name: 'Gaskell'
                },
                creator: {
                    creator_id: 1,
                    first_name: 'Cary',
                    last_name: 'Gaskell'
                },
                title: 'Task 1',
                description: 'Lorem ipsum note note note ....... Lorem ipsum note note note ....... Lorem ipsum note note note .......',
                create_date: '19 July 2016',
                due_date: {
                    date: '18 July 2016',
                    time: '1:00pm'
                },
                status: 0,
                category: 'Call',
                customer_id: 1,
                customer_name: 'John Smith'
            },
            {
                task_id: 2,
                creator: {
                    creator_id: 1,
                    first_name: 'Cary',
                    last_name: 'Gaskell'
                },
                status: 0,
                title: 'Task 2',
                description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi',
                create_date: '19 July 2016',
                due_date: {
                    date: '18 July 2016',
                    time: '1:00pm'
                },
                category: 'Appointment',
                customer_id: 1,
                customer_name: 'John Smith'
            },
            {
                task_id: 3,
                assignee: {
                    id: 1,
                    first_name: 'Cary',
                    last_name: 'Gaskell'
                },
                creator: {
                    creator_id: 1,
                    first_name: 'Luda',
                    last_name: 'Boss'
                },
                title: 'Task 3',
                status: 1,
                description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi',
                create_date: '19 July 2016',
                due_date: {
                    date: '18 July 2016',
                    time: '1:00pm'
                },
                category: 'Text',
                customer_id: 1,
                customer_name: 'John Smith'
            },
            {
                task_id: 4,
                assignee: {
                    id: 1,
                    first_name: 'Cary',
                    last_name: 'Gaskell'
                },
                creator: {
                    creator_id: 1,
                    first_name: 'Cary',
                    last_name: 'Gaskell'
                },
                status: 2,
                title: 'Task 4',
                description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi',
                create_date: '19 July 2016',
                due_date: {
                    date: '18 July 2016',
                    time: '1:00pm'
                },
                category: 'Email',
                customer_id: 1,
                customer_name: 'John Smith'
            },
        ];

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        // Events
        _task.events = [
            {title: 'All Day Event', start: new Date(y, m, 1)},
            {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
            {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
            {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ];


        /* message on eventClick */
        _task.alertOnEventClick = function( event, allDay, jsEvent, view ){
            _task.alertMessage = (event.title + ': Clicked ');
        };
        /* message on Drop */
        _task.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
            _task.alertMessage = (event.title +': Droped to make dayDelta ' + dayDelta);
        };
        /* message on Resize */
        _task.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
            _task.alertMessage = (event.title +': Resized to make dayDelta ' + minuteDelta);
        };

        /* config object */
        _task.uiConfig = {
            calendar:{
                height: 450,
                editable: true,
                header: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                eventClick: _task.alertOnEventClick,
                eventDrop: _task.alertOnDrop,
                eventResize: _task.alertOnResize
            }
        };

        /* Event sources array */
        _task.eventSources = [_task.events];


        _task.addTask = function (lead) {
            var modalInstance = $uibModal.open({
                animation: true,
                windowClass: 'slide-up',
                templateUrl: 'app/views/index/task/assignLead.html',
                controller: 'AddTaskCtrl as addTask',
                resolve: {
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                name: 'angular-ladda',
                                files: ['.resources/plugins/ladda/spin.min.js', '.resources/plugins/ladda/ladda.min.js',
                                    '.styles/plugins/ladda/ladda-themeless.min.css','.resources/plugins/ladda/angular-ladda.min.js']
                            },
                            {
                                name: 'datePicker',
                                files: ['.styles/plugins/datapicker/angular-datapicker.css','.resources/plugins/datapicker/angular-datepicker.js']
                            },
                            {
                                serie: true,
                                files: ['.resources/plugins/daterangepicker/daterangepicker.js', '.styles/plugins/daterangepicker/daterangepicker-bs3.css']
                            },
                            {
                                name: 'daterangepicker',
                                files: ['.resources/plugins/daterangepicker/angular-daterangepicker.js']
                            },
                            {
                                name: 'ui.select',
                                files: ['.resources/plugins/ui-select/select.min.js',
                                    '.styles/plugins/ui-select/select.min.css']
                            }
                        ]);
                    }
                }
            });
        }
    }]);
