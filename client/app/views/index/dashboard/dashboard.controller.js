// function dashboardCharts() {
//
//   var data1 = [
//     [gd(2012, 1, 1), 7],
//     [gd(2012, 1, 2), 6],
//     [gd(2012, 1, 3), 4],
//     [gd(2012, 1, 4), 8],
//     [gd(2012, 1, 5), 9],
//     [gd(2012, 1, 6), 7],
//     [gd(2012, 1, 7), 5],
//     [gd(2012, 1, 8), 4],
//     [gd(2012, 1, 9), 7],
//     [gd(2012, 1, 10), 8],
//     [gd(2012, 1, 11), 9],
//     [gd(2012, 1, 12), 6],
//     [gd(2012, 1, 13), 4],
//     [gd(2012, 1, 14), 5],
//     [gd(2012, 1, 15), 11],
//     [gd(2012, 1, 16), 8],
//     [gd(2012, 1, 17), 8],
//     [gd(2012, 1, 18), 11],
//     [gd(2012, 1, 19), 11],
//     [gd(2012, 1, 20), 6],
//     [gd(2012, 1, 21), 6],
//     [gd(2012, 1, 22), 8],
//     [gd(2012, 1, 23), 11],
//     [gd(2012, 1, 24), 13],
//     [gd(2012, 1, 25), 7],
//     [gd(2012, 1, 26), 9],
//     [gd(2012, 1, 27), 9],
//     [gd(2012, 1, 28), 8],
//     [gd(2012, 1, 29), 5],
//     [gd(2012, 1, 30), 8],
//     [gd(2012, 1, 31), 25]
//   ];
//
//   var data2 = [
//     [gd(2012, 1, 1), 800],
//     [gd(2012, 1, 2), 500],
//     [gd(2012, 1, 3), 600],
//     [gd(2012, 1, 4), 700],
//     [gd(2012, 1, 5), 500],
//     [gd(2012, 1, 6), 456],
//     [gd(2012, 1, 7), 800],
//     [gd(2012, 1, 8), 589],
//     [gd(2012, 1, 9), 467],
//     [gd(2012, 1, 10), 876],
//     [gd(2012, 1, 11), 689],
//     [gd(2012, 1, 12), 700],
//     [gd(2012, 1, 13), 500],
//     [gd(2012, 1, 14), 600],
//     [gd(2012, 1, 15), 700],
//     [gd(2012, 1, 16), 786],
//     [gd(2012, 1, 17), 345],
//     [gd(2012, 1, 18), 888],
//     [gd(2012, 1, 19), 888],
//     [gd(2012, 1, 20), 888],
//     [gd(2012, 1, 21), 987],
//     [gd(2012, 1, 22), 444],
//     [gd(2012, 1, 23), 999],
//     [gd(2012, 1, 24), 567],
//     [gd(2012, 1, 25), 786],
//     [gd(2012, 1, 26), 666],
//     [gd(2012, 1, 27), 888],
//     [gd(2012, 1, 28), 900],
//     [gd(2012, 1, 29), 178],
//     [gd(2012, 1, 30), 555],
//     [gd(2012, 1, 31), 993]
//   ];
//
//
//   var dataset = [
//     {
//       label: "Number of orders",
//       grow: {stepMode: "linear"},
//       data: data2,
//       color: "#1ab394",
//       bars: {
//         show: true,
//         align: "center",
//         barWidth: 24 * 60 * 60 * 600,
//         lineWidth: 0
//       }
//
//     },
//     {
//       label: "Payments",
//       grow: {stepMode: "linear"},
//       data: data1,
//       yaxis: 2,
//       color: "#1C84C6",
//       lines: {
//         lineWidth: 1,
//         show: true,
//         fill: true,
//         fillColor: {
//           colors: [
//             {
//               opacity: 0.2
//             },
//             {
//               opacity: 0.2
//             }
//           ]
//         }
//       }
//     }
//   ];
//
//
//   var options = {
//     grid: {
//       hoverable: true,
//       clickable: true,
//       tickColor: "#d5d5d5",
//       borderWidth: 0,
//       color: '#d5d5d5'
//     },
//     colors: ["#1ab394", "#464f88"],
//     tooltip: true,
//     xaxis: {
//       mode: "time",
//       tickSize: [3, "day"],
//       tickLength: 0,
//       axisLabel: "Date",
//       axisLabelUseCanvas: true,
//       axisLabelFontSizePixels: 12,
//       axisLabelFontFamily: 'Arial',
//       axisLabelPadding: 10,
//       color: "#d5d5d5"
//     },
//     yaxes: [
//       {
//         position: "left",
//         max: 1070,
//         color: "#d5d5d5",
//         axisLabelUseCanvas: true,
//         axisLabelFontSizePixels: 12,
//         axisLabelFontFamily: 'Arial',
//         axisLabelPadding: 3
//       },
//       {
//         position: "right",
//         color: "#d5d5d5",
//         axisLabelUseCanvas: true,
//         axisLabelFontSizePixels: 12,
//         axisLabelFontFamily: ' Arial',
//         axisLabelPadding: 67
//       }
//     ],
//     legend: {
//       noColumns: 1,
//       labelBoxBorderColor: "#d5d5d5",
//       position: "nw"
//     }
//
//   };
//
//   function gd(year, month, day) {
//     return new Date(year, month - 1, day).getTime();
//   }
//
//   /**
//    * Definition of variables
//    * Flot chart
//    */
//   this.flotData = dataset;
//   this.flotOptions = options;
// }
//
// angular.module('dealScanCrmApp').controller('DashboardCharts', dashboardCharts);
//
//
// function dashboardMap() {
//   var data = {
//     "US": 298,
//     "SA": 200,
//     "DE": 220,
//     "FR": 540,
//     "CN": 120,
//     "AU": 760,
//     "BR": 550,
//     "IN": 200,
//     "GB": 120
//   };
//
//   this.data = data;
// }
//
// angular.module('dealScanCrmApp').controller('DashboardMap', dashboardMap);



function dealCtrl($scope, Auth, Util, Dashboard){

  var _deals = this;
  _deals.user = Auth.getCurrentUser();
  _deals.showBarChart = false;
  _deals.selectedPie = null;


  /**
   * Pie Chart Data
   */
  _deals.wonDeals = Dashboard.won();
  _deals.lostDeals = Dashboard.lost();
  _deals.totalDeals = Dashboard.total();

  /**
   * Pie Chart Options
   */
 _deals.pieOptions = {
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


  _deals.sales = [];
  _deals.avg_price = [];
  _deals.models = [];
  _deals.color = '#1ab394';


  _deals.showDetails = function($event, pos, item, chart){
    console.log(item);
    console.log(chart);
    _deals.selectedPie = chart;
    _deals.color = item.series.color;

    var barData;
    switch(chart){
        case 'won':
          barData = _deals.wonDeals.bar[item.seriesIndex];
          break;
        case 'lost':
          barData = _deals.lostDeals.bar[item.seriesIndex];
          break;
        case 'total':
          barData = _deals.totalDeals.bar[item.seriesIndex];
          break;
    }
    //set section title
    _deals.displayingCategory = barData.category;

    //set labels
    _deals.models.length = 0;
    angular.forEach(barData.models, function(value, key){
      _deals.models.push([key, value]);
    });

    //set sales
    _deals.sales.length = 0;
    angular.forEach(barData.sales, function(value,key){
      _deals.sales.push([key, value]);
    });

    //set avg_price
    _deals.avg_price.length = 0;
    angular.forEach(barData.avg_price, function(value, key){
      _deals.avg_price.push([key, value]);
    });
    if (!_deals.showBarChart) _deals.showBarChart = true;


    console.log('WonDeals');
    console.log(_deals.wonDeals);
    console.log("*****************************");

    console.log('LostDeals');
    console.log(_deals.lostDeals);
    console.log("*****************************");

    console.log('TotalDeals');
    console.log(_deals.totalDeals);
    console.log("*****************************");


    console.log('*** DEBUG Data Generated ***');
    console.log("*****************************");

    console.log(' Bar Color ');
    console.log(_deals.color);
    console.log("*****************************");

    console.log(' Models Data');
    console.log(_deals.models);
    console.log("*****************************");
    console.log(' Sales Data ');
    console.log(_deals.sales);
    console.log("*****************************");
    console.log(' Average Price Data ');
    console.log(_deals.avg_price);
    console.log("*****************************");

 }

 _deals.barChartData = [
    {
      label: "Sales",
      grow:{stepMode:"linear"},
      data: _deals.sales,
      color: _deals.color,
      bars: {
        show: true,
        align: "center",
        barWidth: .62,  //24 * 60 *60 * 600
        lineWidth: 0
      }

    },
    {
      label: "Average Price",
      grow:{stepMode:"linear"},
      data: _deals.avg_price,
      yaxis: 2,
      color: "#1C84C6",
      lines: {
        lineWidth: 1,
        show: true,
        fill: true,
        fillColor: {
          colors: [
            {
              opacity: 0.2
            },
            {
              opacity: 0.2
            }
          ]
        }
      }
    }
  ];


  _deals.barChartOptions = {
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
      ticks: _deals.models,
      tickLength: 0,
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
        axisLabelPadding: 3
      },
      {
        position: "right",
        color: "#d5d5d5",
        axisLabelUseCanvas: true,
        axisLabelFontSizePixels: 12,
        axisLabelFontFamily: ' Arial',
        axisLabelPadding: 67
      }
    ],
    legend: {
      noColumns: 1,
      labelBoxBorderColor: "#d5d5d5",
      position: "se"
    }
  };

}
angular.module('dealScanCrmApp').controller('DealCtrl', dealCtrl);
angular.module('dealScanCrmApp').controller('DashboardCtrl',

  function ($scope, $state, $uibModal, $anchorScroll, Auth, Util, Dashboard, appConfig) {


    console.log("dashboard controller loaded");

    var _dashboard = this;

    _dashboard.user = Auth.getCurrentUser();
    _dashboard.isAdmin = Auth.isAdmin;
    _dashboard.isManager = false;
    _dashboard.isGM = false;
    _dashboard.showTable = false;

    Auth.hasRole(appConfig.userRoles[2], function (ans) {
      _dashboard.isManager = ans;
    });

    Auth.hasRole(appConfig.userRoles[7], function (ans) {
      _dashboard.isGM = ans;
    })

    _dashboard.dealerships = [{name: 'Hagerstown Ford'},
      {name: 'King Kia'},
      {name: 'King Hyndai'}];

    _dashboard.teamMates = Dashboard.teamMates();
    _dashboard.teamMate = {};
    _dashboard.dealership = {};

    _dashboard.sources = ['Walk-In', 'Phone', 'Internet', 'HappyTags', 'Social Media', 'DirectMail'];
    _dashboard.colors = ['#315777', '#F5888D', '#8BC33E', '#5B9BD1', '#9A89B5', '#F18636'];


      /**
       *  Display Details Table
       * @param $event
       * @param pos
       * @param item
       */
    _dashboard.displayTable = function($event, pos, item){
       if (!_dashboard.showTable) _dashboard.showTable = true;

    }

    /**
     * sales metrics
     * @type {*[]}
     */
    _dashboard.metrics = Dashboard.metrics();

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
      var m = map || _dashboard.statsMap;
      if (m) google.maps.event.trigger(m, 'resize');
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



    _dashboard.dateOptions = {
      format: 'MM-DD-YYYY'
    };

    _dashboard.presetRange = 'today';
    _dashboard.selectedDate = {start: moment().startOf('day'), end: moment(), text: 'today'};


    _dashboard.resetRange = function($event){
      console.log($event);
      console.log('*** called ***');
      _dashboard.presetRange = null;
    }

    _dashboard.updateStats = function(option){
      console.log('*** Updating Date Value ***');
      console.log(option);
      switch(option){
        case 'today':
          _dashboard.selectedDate = {
            start: moment().startOf('day'), end: moment(), text: 'today'
          };
          break;
        case 'yesterday':
          _dashboard.selectedDate = {
            start: moment().startOf('day').subtract(1, 'day'),
            end: moment().endOf('day').subtract(1, 'day'), text: 'yesterday'
          };
          break;
        case 'mtd':
          _dashboard.selectedDate = {
            start: moment().startOf('month'), end: moment(), text: 'mtd'
          };
          break;
        case 'ytd':
          _dashboard.selectedDate = {
            start: moment().startOf('year') , end: moment(), text: 'ytd'
          };
          break;
      }
    }

    _dashboard.updateMaxDate = function(){
      console.log('*** Update Picker ***');
      $scope.$broadcast('pickerUpdate', 'endDate', {
        minDate: _dashboard.selectedDate.start,
      });
    }




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



    _dashboard.stats = [

      { id:'won',
        cars: {total: 100000},
        trucks: {total: 30000},
        sources: [
          {
            id: 'WalkIn',
            name: 'Walk In',
            state: true,
          },
          {
            id: 'Web',
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

      { id:'lost',
        cars: {total: 100000},
        trucks: {total: 30000},
        sources: [
          {
            id: 'WalkIn',
            name: 'Walk In',
            state: true,
          },
          {
            id: 'Web',
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

      { id:'total',
        sources: [
          {
            id: 'WalkIn',
            name: 'Walk In',
            state: true,
          },
          {
            id: 'Web',
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


function datatablesCtrl($scope,DTOptionsBuilder){

  $scope.dtOptions = DTOptionsBuilder.newOptions()
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
   * persons - Data used in Tables view for Data Tables plugin
   */
  $scope.persons = [
    {
      id: '1',
      firstName: 'Monica',
      lastName: 'Smith'
    },
    {
      id: '2',
      firstName: 'Sandra',
      lastName: 'Jackson'
    },
    {
      id: '3',
      firstName: 'John',
      lastName: 'Underwood'
    },
    {
      id: '4',
      firstName: 'Chris',
      lastName: 'Johnatan'
    },
    {
      id: '5',
      firstName: 'Kim',
      lastName: 'Rosowski'
    }
  ];

}

angular.module('dealScanCrmApp').controller('datatablesCtrl', datatablesCtrl);
