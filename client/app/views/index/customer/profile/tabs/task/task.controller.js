'use strict';

angular.module('dealScanCrmApp')
  .controller('TaskCtrl', function ($scope) {

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

    console.log(_task.tasks);
    _task.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };

    _task.eventSources = {};

    // $scope.eventSource = {
    //   url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
    //   className: 'gcal-event',           // an option!
    //   currentTimezone: 'America/Chicago' // an option!
    // };
    // /* event source that contains custom events on the scope */
    // $scope.events = [
    //   {title: 'All Day Event',start: new Date(y, m, 1)},
    //   {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
    //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
    //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
    //   {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
    //   {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    // ];
    // /* event source that calls a function on every view switch */
    // $scope.eventsF = function (start, end, timezone, callback) {
    //   var s = new Date(start).getTime() / 1000;
    //   var e = new Date(end).getTime() / 1000;
    //   var m = new Date(start).getMonth();
    //   var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
    //   callback(events);
    // };
    // $scope.calEventsExt = {
    //   color: '#f00',
    //   textColor: 'yellow',
    //   events: [
    //     {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
    //     {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
    //     {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    //   ]
    // };


    /* event sources array*/
    //$scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
  });
