angular.module('dealScanCrmApp')
    .controller('TasksCtrl',['$scope', '$rootScope', '$timeout', '$compile', '$state', '$window','$filter', function ($scope, $rootScope, $timeout, $compile, $state, $window, $filter) {

        var _task = this;
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
        
    }]);