
angular.module('dealScanCrmApp').controller('DashboardCtrl',

  function ($scope, $state, $uibModal, $anchorScroll, Auth, Util, Dashboard, appConfig, DTOptionsBuilder, $filter) {


    console.log("dashboard controller loaded");

    var _dashboard = this;

    _dashboard.user = Auth.getCurrentUser();
    _dashboard.isAdmin = Auth.isAdmin;
    _dashboard.isManager = false;
    _dashboard.isGM = false;
    _dashboard.showTable = false;
    _dashboard.sidebar = false;
    _dashboard.openChat = false;

    Auth.hasRole(appConfig.userRoles[2], function (ans) {
      _dashboard.isManager = ans;
    });

    Auth.hasRole(appConfig.userRoles[7], function (ans) {
      _dashboard.isGM = ans;
    })


    _dashboard.teamMates = Dashboard.teamMates();
    _dashboard.teamMate = {};
    _dashboard.dealership = {};

    // _dashboard.sources = ['Walk-In', 'Phone', 'Internet', 'HappyTags', 'Social Media', 'DirectMail'];
    // _dashboard.colors = ['#315777', '#F5888D', '#8BC33E', '#5B9BD1', '#9A89B5', '#F18636'];

    _dashboard.showBarChart = false;
    _dashboard.selectedPie = null;


    /**
     * Pie Chart Data
     */
    _dashboard.wonDeals = Dashboard.won();
    _dashboard.lostDeals = Dashboard.lost();
    _dashboard.totalDeals = Dashboard.total();

    /**
     * Pie Chart Options
     */
    _dashboard.pieOptions = {
      series: {
        pie: {
          show: true
        }
      },
      grid: {
        hoverable: true,
        clickable: true
      },
      tooltip: true,
      tooltipOpts: {
        content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
        shifts: {
          x: 20,
          y: 0
        },
        defaultTheme: false
      }
    };


    _dashboard.sales = [];
    _dashboard.models = [];
    _dashboard.color = '#1ab394';


    _dashboard.showDetails = function($event, pos, item, chart){
      console.log(item);
      console.log(chart);
      _dashboard.selectedPie = chart;
      _dashboard.color = item.series.color;

      var barData;
      switch(chart){
        case 'won':
          barData = _dashboard.wonDeals.bar[item.seriesIndex];
          break;
        case 'lost':
          barData = _dashboard.lostDeals.bar[item.seriesIndex];
          break;
        case 'total':
          barData = _dashboard.totalDeals.bar[item.seriesIndex];
          break;
      }

      //set section title
      _dashboard.displayingCategory = barData.category;

      //set labels
      _dashboard.models.length = 0;
      angular.forEach(barData.models, function(value, key){
        _dashboard.models.push([key, value]);
      });

      //set sales
      _dashboard.sales.length = 0;
      angular.forEach(barData.sales, function(value,key){
        _dashboard.sales.push([key, value]);
      });

      if (!_dashboard.showBarChart) _dashboard.showBarChart = true;


      console.log('WonDeals');
      console.log(_dashboard.wonDeals);
      console.log("*****************************");

      console.log('LostDeals');
      console.log(_dashboard.lostDeals);
      console.log("*****************************");

      console.log('TotalDeals');
      console.log(_dashboard.totalDeals);
      console.log("*****************************");


      console.log('*** DEBUG Data Generated ***');
      console.log("*****************************");

      console.log(' Bar Color ');
      console.log(_dashboard.color);
      console.log("*****************************");

      console.log(' Models Data');
      console.log(_dashboard.models);
      console.log("*****************************");
      console.log(' Sales Data ');
      console.log(_dashboard.sales);
      console.log("*****************************");
    }

    _dashboard.barChartData = [
      {
        label: "Sales",
        grow:{stepMode:"linear"},
        data: _dashboard.sales,
        color: _dashboard.color,
        bars: {
          show: true,
          align: "center",
          barWidth: .62,  //24 * 60 *60 * 600
          lineWidth: 1
        }
      },
    ];


    _dashboard.barChartOptions = {
      grid: {
        hoverable: true,
        clickable: true,
        tickColor: "#d5d5d5",
        borderWidth: 1,
        color: '#d5d5d5'
      },
      colors: ["#1ab394", "#464f88"],
      tooltip: true,
      xaxis: {
        ticks: _dashboard.models,
        tickLength: 1,
        axisLabel: "Models",
        axisLabelUseCanvas: true,
        axisLabelFontSizePixels: 12,
        axisLabelFontFamily: 'Arial',
        axisLabelPadding: 10,
        color: "#d5d5d5"
      },
      yaxes: [
        {
          position: "left",
          color: "#d5d5d5",
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 12,
          axisLabelFontFamily: 'Arial',
          axisLabelPadding: 3,
        }
      ],
      legend: {
        noColumns: 1,
        labelBoxBorderColor: "#d5d5d5",
        position: "ne"
      }
    };



    var getDealsData = function(status){
      var deals;
      switch(status){
        case 'won':
          deals = _dashboard.wonDeals;
          break;
        case 'lost':
          deals = _dashboard.lostDeals;
          break;
        case 'total':
          deals = _dashboard.totalDeals;
          break;
      }
      return deals;
    }

    /**
     *
     * @type {{category: string, status: string}}
     */

    _dashboard.sectionTitle = {category: '', status: ''};
    _dashboard.setTableData = function(chart, status, category){
      console.log(chart);
      console.log(status);
      if (status){
        _dashboard.sectionTitle.status = status;
        _dashboard.sectionTitle.category = chart ? chart.series.label: '';
      } else {
        var barData = getDealsData(_dashboard.sectionTitle.status).bar;
        for(var i= 0; i < barData.length; i++){
          if (barData[i].category == category){
             _dashboard.sectionTitle.category = barData[i].models[chart.dataIndex];
            break;
          }
        }
      }

      var tableData = getDealsData(_dashboard.sectionTitle.status).tableData;
      console.log(tableData);
      console.log(_dashboard.sectionTitle.category);
      var data = $filter('filter')(tableData, {$: _dashboard.sectionTitle.category});
      console.log(data);
      _dashboard.dealsTableData = data;
    }

      /**
       *  Display Details Table
       * @param $event
       * @param pos
       * @param item
       */
    _dashboard.displayTable = function($event, pos, item, status, category){
       if (!_dashboard.showTable) _dashboard.showTable = true;
      _dashboard.setTableData(item, status, category);
    }


      /**
       *  deals  table Data
       */
      _dashboard.dealsTableData = [];
      _dashboard.dtOptions = DTOptionsBuilder.newOptions()
          .withDOM('<"html5buttons"B>lTfgitp')
          .withButtons([
              {extend: 'copy'},
              {extend: 'csv'},
              {extend: 'excel', title: 'ExampleFile'},
              {extend: 'pdf', title: 'ExampleFile'},
              {extend: 'print',
              customize: function (win){
                  $(win.document.body).addClass('white-bg');
                  $(win.document.body).css('font-size', '10px');
                  $(win.document.body).find('table')
              .addClass('compact')
              .css('font-size', 'inherit');
          }
        }
      ]);




    /**
     * sales metrics
     * @type {*[]}
     */

    _dashboard.dismissSidebar = function(from){
      console.log('*** called From: '+from+' **');
      _dashboard.sidebar = false;
    }

    _dashboard.showStatsSummary = function(stats, filter){
       var idx = Util.indexOfObject(_dashboard.metricSummaryTabs, 'id', stats);
       if (idx != -1) {
         _dashboard.metricSummaryTabs[idx].active = true;
         if (filter) _dashboard.metricSummaryTabs[idx].contentFilter = filter;
       }
    }


    _dashboard.metrics = Dashboard.metrics();
    _dashboard.metricSummaryTabs = [
      {id: 'Phone', title: 'fa fa-phone', contentFilter: '', active: false,
        contentData: [
          {cname: 'Job Bloe', cavatar: 'assets/images/a1.jpg', ctype: 'outgoing',
            ctime: 'Today 4:21 pm', comments: 'Follow up with customer regarding service calls'},
          {cname: 'John Cacron', cavatar: 'assets/images/a2.jpg', ctype: 'incoming',
            ctime: 'Today 4:21 pm', comments: 'Customer wanted to know when his car was going to be ready'},
          {cname: 'OJ Simpson', cavatar: 'assets/images/a3.jpg', ctype: 'missed',
            ctime: 'Today 4:21 pm', commments: ''},
          {cname: 'Bob Shapiro', cavatar: 'assets/images/a4.jpg', ctype: 'outgoing',
            ctime: 'Today 4:21 pm', comments: ''},
          {cname: 'Jesus Christ', cavatar: 'assets/images/a5.jpg', ctype: 'missed',
            ctime: 'Today 4:21 pm', comments: ''}
        ]},
      {id: 'Correspondence', title:'fa fa-exchange', contentFilter: '', active: false,
        contentData: [
          {crname: 'Luda Agodio', crtype: 'Text',   crsubject:'',  crcontent: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', crtime: '9hours ago'},
          {crname: 'Eric Carper', crtype: 'Text',   crsubject: '', crcontent: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', crtime: '9hours ago'},
          {crname: 'Miles Johnson', crtype: 'Mail', crsubject: 'Attention Required', crcontent: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', crtime: '9hours ago'},
          {crname: 'Ronda Roussey', crtype: 'Mail', crsubject:'Re: Luda is good',  crcontent: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', crtime: '9hours ago'},
          {crname: 'Chris Brown',  crtype: 'Mail',  crsubject:'Progress Report',  crcontent: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', crtime: '9hours ago'},
        ]},
      {id: 'Appointments', title:'fa fa-calendar-o', contentFilter: '', active: false,
        sortableOptions: {connectWith: ".connectList"},
        contentData: [
          {
            cname: 'Johnny Bloe',
            comments: 'Sometimes by accident, sometimes on purpose (injected humour and the like).',
            date: '16.11.2015',
            statusClass: 'info',
            tagName: 'Mark',
            appointmentStatusClass: 'made',
          },
          {
            cname: 'Johnny Bloe',
            comments: 'Sometimes by accident, sometimes on purpose (injected humour and the like).',
            date: '16.11.2015',
            statusClass: 'danger',
            tagName: 'Mark',
            appointmentStatusClass: 'missed',
          },
          {
            cname: 'Johnny Bloe',
            comments: 'Sometimes by accident, sometimes on purpose (injected humour and the like).',
            date: '16.11.2015',
            statusClass: 'danger',
            tagName: 'Mark',
            appointmentStatusClass: 'missed',
          },
          {
            cname: 'Johnny Bloe',
            comments: 'Sometimes by accident, sometimes on purpose (injected humour and the like).',
            date: '16.11.2015',
            statusClass: 'success',
            tagName: 'Mark',
            appointmentStatusClass: 'sold',
          },
          {
            cname: 'Johnny Bloe',
            comments: 'Sometimes by accident, sometimes on purpose (injected humour and the like).',
            date: '16.11.2015',
            statusClass: 'success',
            tagName: 'Mark',
            appointmentStatusClass: 'sold',
          },
        ]},
    ]




    /**
     * Stats Display Mode
     * @type {string}
     */
    _dashboard.chartView = 'chart';

    /**
     * StatsMap & Options
     * @type {{}}
     */
    _dashboard.statsMap = {};
    _dashboard.chartMapOptions = {
      zoom: 11,
      center: new google.maps.LatLng(38.9072, -77.0369),
      // Style for Google Maps
      styles: [{
        "featureType": "water",
        "stylers": [{"saturation": 43}, {"lightness": -11}, {"hue": "#0088ff"}]
      }, {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{"hue": "#ff0000"}, {"saturation": -100}, {"lightness": 99}]
      }, {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{"color": "#808080"}, {"lightness": 54}]
      }, {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#ece2d9"}]
      }, {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#ccdca1"}]
      }, {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#767676"}]
      }, {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [{"color": "#ffffff"}]
      }, {"featureType": "poi", "stylers": [{"visibility": "off"}]}, {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [{"visibility": "on"}, {"color": "#b8cb93"}]
      }, {"featureType": "poi.park", "stylers": [{"visibility": "on"}]}, {
        "featureType": "poi.sports_complex",
        "stylers": [{"visibility": "on"}]
      }, {"featureType": "poi.medical", "stylers": [{"visibility": "on"}]}, {
        "featureType": "poi.business",
        "stylers": [{"visibility": "simplified"}]
      }],
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    /**
     * Refresh Map on hide and show
     * @param map
     */
    _dashboard.refreshMap = function (map) {
      $scope.$applyAsync(function(map){
        var m = map || _dashboard.statsMap;
        if (m) google.maps.event.trigger(m, 'resize');
        console.log('*** Refresh Map ***');
      })
    }


    /**
     * Deals Type
     * @type {*[]}
     */
    _dashboard.dealTypes = [{id: 0, text: 'All'}, {id: 1, text: 'New'}, {id: 2, text: 'Used'}];

    /**
     * Dealerships data Structures
     * @type {{name: string, owner: Array, genManger: Array, teams: *[]}}
     */
    _dashboard.dealerships = [{
      name: "Hagerstown Ford",
      owner: [{name: 'Rick kelly'}],
      genManger: [{name: 'Eric Carper'}],
      teams: [
        {
          name: "All Teams",
          members: [
            {
              name: 'All Employees',
              role: 'default'
            },
            {
              name: 'Ludovic Agodio',
              role: 'admin'
            },
            {
              name: 'Miles Johnson',
              role: 'admin'
            },
            {
              name: 'Eric Carper',
              role: 'gen_mgr'
            },
            {
              name: 'Rick Kelly',
              role: 'owner'
            },
            {
              name: 'Roger Mason',
              role: 'gen_sale_mgr'
            },
            {
              name: 'Stacy Dash',
              role: 'gen_sale_mgr'
            },
            {
              name: 'Meagan Good',
              role: 'sale_mgr'
            }, {
              name: 'Amber Rose',
              role: 'sale_mgr'
            }, {
              name: 'Kim Kardashian',
              role: 'bdc_mgr'
            },
            {
              name: 'Shenaka Adams',
              role: 'bdc_mgr'
            },
            {
              name: 'Roger Moody',
              role: 'sale_rep'
            }, {
              name: 'Dominique Toretto',
              role: 'sale_rep'
            }, {
              name: 'Romeo Zalch',
              role: 'sale_rep'
            },
            {
              name: 'Johnny Manzel',
              role: 'sale_rep'
            },
            {
              name: 'Michael Jordan',
              role: 'sale_rep'
            }, {
              name: 'Scotty Pippen',
              role: 'sale_rep'
            }, {
              name: 'Dennis Rodman',
              role: 'sale_rep'
            },
            {
              name: 'Magic Johnson',
              role: 'sale_rep'
            },
            {
              name: 'Allen Iverson',
              role: 'sale_rep'
            }, {
              name: 'Stephen Curry',
              role: 'sale_rep'
            }, {
              name: 'LeBron James',
              role: 'sale_rep'
            }, {
              name: 'Carmello Anthony',
              role: 'sale_rep'
            }, {
              name: 'Chris Paul',
              role: 'sale_rep'
            }, {
              name: 'Kyrie Irving',
              role: 'sale_rep'
            }, {
              name: 'Lauren Woods',
              role: 'sale_rep'
            }, {
              name: 'Julianna Rodgers',
              role: 'sale_rep'
            },
            {
              name: 'Chelsea Lynn',
              role: 'sale_rep'
            },
            {
              name: 'Vida Guierra',
              role: 'sale_rep'
            }
          ]
        }
      ]
    }];


    _dashboard.selectedType = _dashboard.dealTypes[0];
    _dashboard.selectedDealership = _dashboard.dealerships[0];
    _dashboard.selectedTeam = _dashboard.selectedDealership.teams[0];
    _dashboard.selectedEmployee = _dashboard.selectedTeam.members[0];


    _dashboard.datePickerOptions = {
      'ranges': {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      "alwaysShowCalendars": true,
      'opens': 'left',
    };

    _dashboard.dateRange = {startDate: _dashboard.datePickerOptions.ranges.Today[0],
                            endDate: _dashboard.datePickerOptions.ranges.Today[1]};

    _dashboard.summaryStats = [
      {
        bgStyle: 'navy-bg',
        category: 'calls',
        value: 217
      },
      {
        bgStyle: 'navy-bg',
        category: 'mail',
        value: 400
      },
      {
        bgStyle: 'navy-bg',
        category: 'text',
        value: 10
      },
      {
        bgStyle: 'lazur-bg',
        category: 'appointment_made',
        value: 120
      },
      {
        bgStyle: 'navy-bg',
        category: 'appointment_sold',
        value: 462
      },
      {
        bgStyle: 'red-bg',
        category: 'appointment_missed',
        value: 610
      },

    ];
    _dashboard.displayStatsDetails = function(stat){
      if (!_dashboard.sidebar) _dashboard.sidebar = true;
      console.log(stat);
      var categoryId, filter;
      switch(stat.category){
        case 'calls':
          categoryId = 'Phone';
          break
        case 'text':
          categoryId = 'Correspondence';
          filter = 'Text';
          break;
        case 'mail':
          categoryId = 'Correspondence';
          filter = 'Mail';
          break;
        case 'appointment_made':
          categoryId = 'Appointments';
          filter = 'Made';
          break;
        case 'appointment_sold':
          categoryId = 'Appointments';
          filter = 'Sold';
          break;
        case 'appointment_missed':
          categoryId = 'Appointments';
          filter = 'Missed';
          break;

      }
      _dashboard.showStatsSummary(categoryId, filter);
    }

    var updateBarChart = function(status, category){
      var barData, idx;
      switch(status){
        case 'won':
          idx  = Util.indexOfObject(_dashboard.wonDeals.bar, 'category', category);
          if (idx != -1) barData = _dashboard.wonDeals.bar[idx];
          break;
        case 'lost':
          idx  = Util.indexOfObject(_dashboard.lostDeals.bar, 'category', category);
          if (idx != -1) barData = _dashboard.lostDeals.bar[idx];
          break;
        case 'total':
          idx  = Util.indexOfObject(_dashboard.totalDeals.bar, 'category', category);
          if (idx != -1) barData = _dashboard.totalDeals.bar[idx];
          break;
      }

      //update sales
      _dashboard.sales.length = 0;
      angular.forEach(barData.sales, function(value,key){
        _dashboard.sales.push([key, value]);
      });
    }



    var updateTableData = function(status, category){
      var tableData = getDealsData(status).tableData;
      var data = $filter('filter')(tableData, {$: category});
      console.log(data);
      _dashboard.dealsTableData = data;
    }

    _dashboard.filterDeals = function(status){
      var idx = Util.indexOfObject(_dashboard.stats, 'id', status);
      console.log(idx);
      if (idx != -1){
         var s = _dashboard.stats[idx].sources;
         console.log(s);
         var sources = [];
         for(var i= 0; i < s.length; i++){
            if (s[i].state) sources.push(s[i].id)
         }
         Dashboard.filter(status, sources);
         if (_dashboard.showBarChart) updateBarChart(status, _dashboard.displayingCategory);
         if (_dashboard.showTable) updateTableData(status, _dashboard.displayingCategory);
         console.log('*** Deals Filtered ***');
      }
    }

    _dashboard.mapFilters = {Cars: false, Trucks: false, Utilities: false};
    _dashboard.expandedSection = '';

    _dashboard.resetMapFilters = function(){
      angular.forEach(_dashboard.mapFilters, function(value, key){
          _dashboard.mapFilters[key] = false;
      })
      _dashboard.resetFiltersBtn = false;
    }



    _dashboard.displayCategory = function(category){
         console.log('called');
        _dashboard.displayingCategory = category;
        _dashboard.expandSection = true;
        _dashboard.expandedSection = category;
        _dashboard.resetFiltersBtn = _dashboard.mapFilters.Cars || _dashboard.mapFilters.Trucks || _dashboard.mapFilters.Utilities;
        console.log('Cars: '+_dashboard.mapFilters.Cars);
        console.log('Trucks: '+_dashboard.mapFilters.Trucks);
        console.log('Utilities: '+_dashboard.mapFilters.Utilities);
        console.log(_dashboard.resetFiltersBtn);
    }

    _dashboard.toggleSection  = function(section) {
      if ((section == _dashboard.displayingCategory) && _dashboard.expandSection) {
        _dashboard.expandSection = false;
        _dashboard.expandedSection = '';
      } else _dashboard.displayCategory(section);
    }

    _dashboard.stats = [

      { id:'won',
        cars: {units: 3, pvr: 100000},
        trucks: {units: 4, pvr: 30000},
        sources: [
          {
            id: 'Walk-In',
            name: 'Walk In',
            state: true,
          },
          {
            id: 'Internet',
            name: 'Internet',
            state: true,
          },
          {
            id: 'Phone',
            name: 'Phone',
            state: true,
          },
          {
            id: 'HappyTag',
            name: 'Happy Tag',
            state: true,
          },
          {
            id: 'Other',
            name: 'Other',
            state: true,
          }
        ]
      },

      { id:'lost',
        cars: {units: 20, pvr: 100000},
        trucks: {units: 12, pvr: 30000},
        sources: [
          {
            id: 'Walk-In',
            name: 'Walk In',
            state: true,
          },
          {
            id: 'Internet',
            name: 'Internet',
            state: true,
          },
          {
            id: 'Phone',
            name: 'Phone',
            state: true,
          },
          {
            id: 'HappyTag',
            name: 'Happy Tag',
            state: true,
          },
          {
            id: 'Other',
            name: 'Other',
            state: true,
          }
        ]
      },

      { id:'total',
        sources: [
          {
            id: 'Walk-In',
            name: 'Walk In',
            state: true,
          },
          {
            id: 'Internet',
            name: 'Web',
            state: true,
          },
          {
            id: 'Phone',
            name: 'Phone',
            state: true,
          },
          {
            id: 'HappyTag',
            name: 'Happy Tag',
            state: true,
          },
          {
            id: 'Other',
            name: 'Other',
            state: true,
          }
        ]
      },

    ];


    _dashboard.chatRecipient = {name: '', number: ''};
    _dashboard.composeText = function(deal){
       if (!_dashboard.openChat) _dashboard.openChat = true;
      console.log('*** Compose Text ***');
      console.log(deal);
      _dashboard.chatRecipient = {name:deal.customerDetails.name, number: deal.customerDetails.phone};
    }

    _dashboard.composeMail = function(deal){
      console.log('*** Compose Mail ****');
      console.log(deal);
      var modalInstance = $uibModal.open({
        size: 'lg',
        //windowClass: 'animated slideInRight',
        templateUrl: 'app/views/index/dashboard/modalMailCompose.html',
        resolve: {
          deal: function(){
            return deal;
          }
        },
        controller: function($scope, $uibModalInstance, deal){
          console.log(deal);
          $scope.recipient = deal.customerDetails;
          $scope.ok = function () {
            $uibModalInstance.close();
          };

          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
        }
      });
    }

    $scope.addLead = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/dashboard/addLead.html',
        controller: 'AddLeadCtrl',
      });
    }
    $scope.addTask = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'slide-up',
        templateUrl: 'app/account/task/addTask.html',
        controller: 'AddTaskCtrl',
      });
    }





  });

function dashboardMap() {
  var data = {
    "US": 298,
    "SA": 200,
    "DE": 220,
    "FR": 540,
    "CN": 120,
    "AU": 760,
    "BR": 550,
    "IN": 200,
    "GB": 120
  };

  this.data = data;
}

angular.module('dealScanCrmApp').controller('dashboardMap', dashboardMap);

