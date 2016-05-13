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

angular.module('dealScanCrmApp')
  .controller('DashboardCtrl', function ($scope, $state, $uibModal, $anchorScroll, Auth, Util, Dashboard, appConfig) {
    console.log("dashboard controller loaded");

    var _dashboard = this;
    _dashboard.showTable = false;
    _dashboard.showBarChart = false;
    _dashboard.selectedPie = null;
    _dashboard.showDetails = function($event, pos, item, chart){
      console.log(item);
      console.log(chart);
      if (!_dashboard.showTable) _dashboard.showTable = true;
      if (!_dashboard.showBarChart) {
        _dashboard.showBarChart = true;
        _dashboard.selectedPie = chart;
      }
    }


    /**
     * sales metrics
     * @type {*[]}
     */
    _dashboard.metrics = [

      {
        Category: "Cars",
        Won: {
          percentage: 44,
          trend: "up",
          deals: '100,000'
        },
        Lost: {
          percentage: 44,
          trend: "down",
          deals: '30,000'
        }
      },
      {
        Category: "Trucks",
        Won: {
          percentage: 44,
          trend: "up",
          deals: '100,000'
        },
        Lost: {
          percentage: 44,
          trend: "down",
          deals: '20,000'
        }
      },
      {
        Category: "Total",
        Won: {
          percentage: 44,
          trend: "up",
          deals: '100,000'
        },
        Lost: {
          percentage: 44,
          trend: "down",
          deals: '100,000'
        }
      }
    ];

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


    _dashboard.user = Auth.getCurrentUser();
    _dashboard.isAdmin = Auth.isAdmin;
    _dashboard.isManager = false;
    _dashboard.isGM = false;
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

    _dashboard.dataView = 'charts';

    // /* Initialize Map Object */
    // NgMap.getMap().then(function (map) {
    //   _dashboard.map = map;
    //   console.log(console.log(_dashboard.map.center));
    // }).catch(function (err) {
    //   console.log(err);
    // });


    $scope.itemArray = [
      {id: 1, name: 'first'},
      {id: 2, name: 'second'},
      {id: 3, name: 'third'},
      {id: 4, name: 'fourth'},
      {id: 5, name: 'fifth'},
    ];


    _dashboard.sources = ['Walk-In', 'Phone', 'Internet', 'HappyTags', 'Social Media', 'DirectMail'];
    $scope.data = [
      {
        "model": "  Police Interceptor Utility",
        "Customer": "Burton Stuart",
        "Source": 2,
        "Location": "-61.7134, -116.20717"
      },
      {"model": "  Flex", "Customer": "Preston Z. Mack", "Source": 4, "Location": "39.649315, -77.716352"},
      {"model": "  Transit", "Customer": "Hayes Dunn", "Source": 4, "Location": "38.649315, -77.716352"},
      {"model": "  Edge", "Customer": "Lana H. Sheppard", "Source": 0, "Location": "39.649315, -78.716352"},
      {"model": "Fiesta", "Customer": "Sybil O. Ashley", "Source": 3, "Location": "39.645, -77.712"},
      {"model": "  C-MAX", "Customer": "Chiquita A. Hart", "Source": 3, "Location": "39.6315, -77.7352"},
      {"model": "  Taurus", "Customer": "Ira P. Aguilar", "Source": 0, "Location": "-36.91876, -154.89909"},
      {"model": "  Transit Connect", "Customer": "Aurora M. Barker", "Source": 2, "Location": "-61.40704, 35.46322"},
      {"model": "  F-Series", "Customer": "Allen O. Cotton", "Source": 2, "Location": "38.59563, 144.26042"},
      {"model": "  E-Series", "Customer": "Sara Dotson", "Source": 0, "Location": "46.65687, -138.97388"},
      {"model": " Escape", "Customer": "Marny Bauer", "Source": 2, "Location": "50.76128, -11.0083"},
      {"model": "  Expedition", "Customer": "Rigel R. Mcfarland", "Source": 3, "Location": "87.98009, 4.81177"},
      {"model": "  Mustang", "Customer": "Dorothy W. Floyd", "Source": 0, "Location": "0.64868, -86.14322"},
      {"model": "  Edge", "Customer": "Teagan Smith", "Source": 2, "Location": "55.14929, -107.83601"},
      {"model": " Escape", "Customer": "Sawyer G. Craft", "Source": 2, "Location": "-5.65359, 54.20513"},
      {"model": "  Flex", "Customer": "Danielle Key", "Source": 4, "Location": "12.16535, -142.18172"},
      {"model": "  Focus", "Customer": "Elaine I. Gillespie", "Source": 1, "Location": "-42.72035, 70.32532"},
      {"model": "  Transit", "Customer": "Elaine Sharp", "Source": 0, "Location": "37.0338, 132.43708"},
      {"model": "  Edge", "Customer": "Malachi William", "Source": 4, "Location": "-55.00577, 155.18963"},
      {"model": "  E-Series", "Customer": "Lesley S. Bennett", "Source": 3, "Location": "73.89979, 57.2256"},
      {"model": "  Edge", "Customer": "Hedley V. Wyatt", "Source": 1, "Location": "-78.45337, -82.62056"},
      {"model": "  Fusion", "Customer": "Breanna P. Ochoa", "Source": 1, "Location": "-9.60771, 23.04113"},
      {"model": "  F-Series", "Customer": "Brenda Y. Gilliam", "Source": 2, "Location": "3.22292, -146.14035"},
      {"model": "  Transit Connect", "Customer": "Jillian W. Rowland", "Source": 3, "Location": "-16.55997, 154.36447"},
      {"model": "  Explorer", "Customer": "Keegan Q. Mccoy", "Source": 1, "Location": "74.5614, 143.80712"},
      {"model": " Escape", "Customer": "Alfreda Sharp", "Source": 0, "Location": "-62.10501, 178.26537"},
      {
        "model": "  Transit Connect",
        "Customer": "Deirdre J. Schroeder",
        "Source": 2,
        "Location": "80.53221, 146.73891"
      },
      {"model": "  Flex", "Customer": "Griffith Johns", "Source": 0, "Location": "87.91365, -20.85216"},
      {"model": "  E-Series", "Customer": "Caldwell Y. Molina", "Source": 1, "Location": "86.76801, 152.46283"},
      {"model": " Escape", "Customer": "Judith P. Mcdowell", "Source": 4, "Location": "-0.33494, 133.92029"},
      {"model": "  Taurus", "Customer": "Halla Mcneil", "Source": 1, "Location": "-75.9842, 25.28015"},
      {"model": " Escape", "Customer": "Kane Parks", "Source": 4, "Location": "-51.17851, -163.15278"},
      {"model": "  F-Series", "Customer": "Zachary P. Franco", "Source": 1, "Location": "48.20758, 162.725"},
      {
        "model": "  Police Interceptor Utility",
        "Customer": "Carson Harris",
        "Source": 1,
        "Location": "42.12875, 75.27898"
      },
      {"model": "  Expedition", "Customer": "Amos Santos", "Source": 0, "Location": "-55.547, 178.43553"},
      {"model": "  Transit", "Customer": "Gwendolyn Q. Moon", "Source": 4, "Location": "73.29029, 93.39895"},
      {"model": "  Taurus", "Customer": "Ursa Barry", "Source": 3, "Location": "-75.29267, 102.67701"},
      {"model": "  Transit Connect", "Customer": "Blaze Briggs", "Source": 4, "Location": "20.76297, 178.04791"},
      {
        "model": "  Police Interceptor Sedan",
        "Customer": "Hadassah Hawkins",
        "Source": 2,
        "Location": "-22.48686, -27.55911"
      },
      {"model": "  F-Series", "Customer": "Ivor Y. Ferrell", "Source": 3, "Location": "-0.78076, 23.0466"},
      {"model": "  E-Series", "Customer": "Sophia Powers", "Source": 2, "Location": "44.35765, -154.05369"},
      {"model": "  Taurus", "Customer": "Rowan Doyle", "Source": 1, "Location": "-34.37199, 100.56223"},
      {"model": "  Expedition", "Customer": "Darius Dalton", "Source": 2, "Location": "-60.72485, 166.02213"},
      {"model": "  Fusion", "Customer": "Quinlan H. Mcconnell", "Source": 3, "Location": "-8.07484, -179.98041"},
      {"model": "  F-Series", "Customer": "Cara Snyder", "Source": 1, "Location": "44.79726, 54.1726"},
      {
        "model": "  Police Interceptor Sedan",
        "Customer": "Diana Lambert",
        "Source": 0,
        "Location": "-58.89222, 83.47729"
      },
      {"model": "  Taurus", "Customer": "Cherokee Stevens", "Source": 1, "Location": "-19.06368, -156.36258"},
      {
        "model": "  Police Interceptor Sedan",
        "Customer": "Melanie C. Cherry",
        "Source": 1,
        "Location": "-31.87361, -55.43507"
      },
      {"model": "  Mustang", "Customer": "Kibo C. Mathews", "Source": 3, "Location": "82.85833, -10.78286"},
      {"model": "  Transit Connect", "Customer": "Leandra Moran", "Source": 1, "Location": "6.72887, -59.85321"},
      {"model": "  Heavy Trucks", "Customer": "Kenyon R. Gilbert", "Source": 3, "Location": "-58.94333, 142.98454"},
      {
        "model": "  Police Interceptor Utility",
        "Customer": "Yeo Garner",
        "Source": 1,
        "Location": "-62.71138, -73.84034"
      },
      {"model": "  Transit Connect", "Customer": "Mari T. Thomas", "Source": 1, "Location": "-16.66672, 88.21379"},
      {"model": "  Edge", "Customer": "Cole Whitfield", "Source": 3, "Location": "35.83326, -97.86066"},
      {"model": "  Taurus", "Customer": "Kylie Dennis", "Source": 1, "Location": "12.51335, 80.56326"},
      {"model": "  Edge", "Customer": "Orson Franco", "Source": 2, "Location": "11.85978, 87.09157"},
      {"model": "  Taurus", "Customer": "Mira Kelley", "Source": 4, "Location": "41.27345, -49.56652"},
      {"model": "  C-MAX", "Customer": "Charity Larsen", "Source": 4, "Location": "-32.40536, 179.33016"},
      {"model": "  E-Series", "Customer": "Hayes Marshall", "Source": 3, "Location": "-35.16883, -153.07389"},
      {"model": "  F-Series", "Customer": "Benedict S. Cline", "Source": 1, "Location": "-4.06549, -117.95998"},
      {
        "model": "  Police Interceptor Sedan",
        "Customer": "Chastity Mullins",
        "Source": 2,
        "Location": "-28.14013, -77.16485"
      },
      {"model": "  Flex", "Customer": "Mechelle K. Flynn", "Source": 2, "Location": "27.34912, 160.38288"},
      {"model": " Escape", "Customer": "Deirdre I. Scott", "Source": 1, "Location": "-3.05951, -162.06277"},
      {"model": "  Taurus", "Customer": "Randall Robinson", "Source": 2, "Location": "-12.77962, 42.17835"},
      {"model": "  Expedition", "Customer": "Judah P. Melton", "Source": 2, "Location": "3.46344, -57.48586"},
      {"model": "  Mustang", "Customer": "Sybil Osborne", "Source": 4, "Location": "50.00452, -130.78749"},
      {"model": "  F-Series", "Customer": "Tobias Freeman", "Source": 1, "Location": "-31.61834, -179.0951"},
      {"model": "  Fusion", "Customer": "Uriel B. Mendoza", "Source": 0, "Location": "-18.77187, -134.84606"},
      {"model": "  Mustang", "Customer": "Whilemina H. Perry", "Source": 1, "Location": "48.03953, 10.21058"},
      {"model": "  E-Series", "Customer": "Margaret Bishop", "Source": 4, "Location": "-78.04184, -94.65421"},
      {"model": "  Focus", "Customer": "Aurelia Hunt", "Source": 1, "Location": "63.09929, -58.22583"},
      {"model": "  Flex", "Customer": "Ora T. Mccormick", "Source": 0, "Location": "-14.87937, -18.03435"},
      {"model": "  Flex", "Customer": "Nicole S. Gordon", "Source": 4, "Location": "-79.7376, 178.98953"},
      {"model": "  Heavy Trucks", "Customer": "Aspen S. Cannon", "Source": 2, "Location": "-13.98187, -67.77116"},
      {"model": " Escape", "Customer": "Keelie Mclean", "Source": 2, "Location": "-28.13597, -159.39798"},
      {"model": "  F-Series", "Customer": "Ora D. Valenzuela", "Source": 3, "Location": "-60.71418, -44.07965"},
      {"model": "  E-Series", "Customer": "Dalton E. Rivers", "Source": 1, "Location": "71.81995, 78.04778"},
      {"model": " Escape", "Customer": "Veda X. Boyd", "Source": 0, "Location": "-16.07693, 92.56026"},
      {"model": "Fiesta", "Customer": "Ivory Day", "Source": 1, "Location": "-38.68987, 45.38678"},
      {"model": "  Explorer", "Customer": "Stephanie O. Goodwin", "Source": 2, "Location": "4.73118, 89.83733"},
      {"model": "  Edge", "Customer": "Stella I. Campos", "Source": 3, "Location": "77.03727, -107.08311"},
      {"model": "  Expedition", "Customer": "Nina U. Wilkerson", "Source": 0, "Location": "-15.11292, 44.67406"},
      {"model": "  Transit Connect", "Customer": "Nissim P. Arnold", "Source": 4, "Location": "-58.72341, -31.68987"},
      {"model": "  Transit", "Customer": "Barbara P. Mcfadden", "Source": 0, "Location": "49.00923, 98.60218"},
      {"model": " Escape", "Customer": "Delilah Houston", "Source": 3, "Location": "-50.86109, -38.58693"},
      {"model": "  Flex", "Customer": "Idona Kline", "Source": 4, "Location": "-44.62527, -126.75731"},
      {"model": "  E-Series", "Customer": "Whilemina F. Mcbride", "Source": 0, "Location": "-48.29391, -125.29906"},
      {"model": "  Mustang", "Customer": "Brennan X. Oconnor", "Source": 2, "Location": "-28.05372, -71.64166"},
      {"model": "  F-Series", "Customer": "Gray J. Franklin", "Source": 1, "Location": "30.28186, 74.38088"},
      {"model": "  F-Series", "Customer": "Kitra Weber", "Source": 0, "Location": "-25.57155, 150.29702"},
      {"model": "  Mustang", "Customer": "Henry W. Richardson", "Source": 3, "Location": "51.5159, -151.32792"},
      {
        "model": "  Police Interceptor Utility",
        "Customer": "Boris Moore",
        "Source": 4,
        "Location": "54.31373, -92.63074"
      },
      {"model": "  Heavy Trucks", "Customer": "Ronan I. Logan", "Source": 1, "Location": "-84.69772, -110.94463"},
      {"model": "  C-MAX", "Customer": "Carson Berger", "Source": 3, "Location": "-59.71558, 143.49995"},
      {"model": "  Flex", "Customer": "Alvin Chaney", "Source": 4, "Location": "-66.07796, -119.76158"},
      {"model": "  E-Series", "Customer": "Byron Z. Sweeney", "Source": 0, "Location": "-48.29244, 167.3873"},
      {"model": "  Mustang", "Customer": "Guinevere W. Davidson", "Source": 4, "Location": "46.27142, -101.55754"},
      {
        "model": "  Police Interceptor Utility",
        "Customer": "Ulla Koch",
        "Source": 4,
        "Location": "7.46417, -116.24491"
      },
      {"model": "  E-Series", "Customer": "Gavin G. Ochoa", "Source": 3, "Location": "-69.62098, 178.77986"},
      {"model": "  Transit", "Customer": "Olga U. Spencer", "Source": 4, "Location": "85.12752, 156.05205"}
    ];


    //= ['Walk-In', 'Phone', 'Internet', 'HappyTags', 'Social Media', 'DirectMail'];

    function getModelCount(id, data) {
      var count = 0;
      for (var i = 0; i < data.length; i++)
        if (id == data[i].model.trim()) count++;
      return count;
    }

    _dashboard.labels = ['Fiesta', 'Focus', 'C-MAX', 'Fusion', 'Taurus', 'Police Interceptor Sedan', 'Mustang',
      'Escape', 'Edge', 'Flex', 'Explorer', 'Police Interceptor Utility', 'Expedition', 'F-Series', 'E-Series', 'Transit', 'Transit Connect', 'Heavy Trucks'];

    _dashboard.data = [
      getModelCount(_dashboard.labels[0], $scope.data), getModelCount(_dashboard.labels[1], $scope.data), getModelCount(_dashboard.labels[2], $scope.data),
      getModelCount(_dashboard.labels[3], $scope.data), getModelCount(_dashboard.labels[4], $scope.data), getModelCount(_dashboard.labels[5], $scope.data),
      getModelCount(_dashboard.labels[6], $scope.data), getModelCount(_dashboard.labels[7], $scope.data), getModelCount(_dashboard.labels[8], $scope.data),
      getModelCount(_dashboard.labels[9], $scope.data), getModelCount(_dashboard.labels[10], $scope.data), getModelCount(_dashboard.labels[11], $scope.data),
      getModelCount(_dashboard.labels[12], $scope.data), getModelCount(_dashboard.labels[13], $scope.data), getModelCount(_dashboard.labels[14], $scope.data),
      getModelCount(_dashboard.labels[15], $scope.data), getModelCount(_dashboard.labels[16], $scope.data), getModelCount(_dashboard.labels[17], $scope.data)];

    _dashboard.smallData = [getModelCount(_dashboard.labels[0], $scope.data), getModelCount(_dashboard.labels[1], $scope.data),
      getModelCount(_dashboard.labels[2], $scope.data), getModelCount(_dashboard.labels[3], $scope.data),
      getModelCount(_dashboard.labels[4], $scope.data)];
    _dashboard.smallColors = ['#315777', '#F5888D', '#8BC33E', '#5B9BD1', '#9A89B5'];
    _dashboard.smallLabels = ['Fiesta', 'Focus', 'C-MAX', 'Fusion', 'Taurus'];

    _dashboard.colors = ['#315777', '#F5888D', '#8BC33E', '#5B9BD1', '#9A89B5', '#F18636'];

    _dashboard.options = {
      responsive: true,
      segmentShowStroke: false,
      segmentStrokeColor: '#fff',
      segmentStrokeWidth: 1,
      percentageInnerCutout: 0, // This is 0 for Pie charts
      animationSteps: 40,
      animationEasing: 'easeOutBounce',
      animateRotate: true,
      animateScale: false
    };

    $scope.clickChart = function (points, evt) {
      console.log(points, evt);
      $scope.showTable = true;
      //$location.hash('scrollToPoint');
      $anchorScroll('scrollToPoint');
    }


    $scope.labels = ['Fiesta', 'Focus', 'C-MAX', 'Fusion', 'Taurus', 'Police Interceptor Sedan', 'Mustang',
      'Escape', 'Edge', 'Flex', 'Explorer', 'Police Interceptor Utility', 'Expedition', 'F-Series', 'E-Series', 'Transit', 'Transit Connect', 'Heavy Trucks'];
    $scope.series = ['Series A', 'Series B'];

    $scope.data2 = [
      [getModelCount(_dashboard.labels[0], $scope.data), getModelCount(_dashboard.labels[1], $scope.data), getModelCount(_dashboard.labels[2], $scope.data),
        getModelCount(_dashboard.labels[3], $scope.data), getModelCount(_dashboard.labels[4], $scope.data), getModelCount(_dashboard.labels[5], $scope.data),
        getModelCount(_dashboard.labels[6], $scope.data), getModelCount(_dashboard.labels[7], $scope.data), getModelCount(_dashboard.labels[8], $scope.data),
        getModelCount(_dashboard.labels[9], $scope.data), getModelCount(_dashboard.labels[10], $scope.data), getModelCount(_dashboard.labels[11], $scope.data),
        getModelCount(_dashboard.labels[12], $scope.data), getModelCount(_dashboard.labels[13], $scope.data), getModelCount(_dashboard.labels[14], $scope.data),
        getModelCount(_dashboard.labels[15], $scope.data), getModelCount(_dashboard.labels[16], $scope.data), getModelCount(_dashboard.labels[17], $scope.data)]
    ];
    $scope.options = {
      //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      //scaleBeginAtZero : true,
      responsive: true,
      maintainAspectRatio: true,
      //Boolean - Whether grid lines are shown across the chart
      //scaleShowGridLines : true,

      //String - Colour of the grid lines
      // scaleGridLineColor : "rgba(0,0,0,.05)",

      //Number - Width of the grid lines
      //scaleGridLineWidth : 1,

      //Boolean - Whether to show horizontal lines (except X axis)
      //scaleShowHorizontalLines: true,

      //Boolean - Whether to show vertical lines (except Y axis)
      //scaleShowVerticalLines: true,

      //Boolean - If there is a stroke on each bar
      // barShowStroke : true,

      //Number - Pixel width of the bar stroke
      // barStrokeWidth : 2,

      //Number - Spacing between each of the X value sets
      // barValueSpacing : 5,

      //Number - Spacing between data sets within X values
      // barDatasetSpacing : 1,

      //String - A legend template
      legendTemplate: "<ul ><% for (var i=0; i<datasets.length; i++){%><li ><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

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


function flotChartCtrl($scope) {


  /**
   * Bar Chart Options
   */
  var barOptions = {
    series: {
      bars: {
        show: true,
        align: "center",
        lineWidth: 0,
        barWidth: .8,
        fill: true,
        fillColor: {
          colors: [
            {
              opacity: 0.8
            },
            {
              opacity: 0.8
            }
          ]
        }
      }
    },
    xaxis: {
      mode: "time",
      tickLength: 0,
      axisLabelUseCanvas: true,
      axisLabelFontSizePixels: 12,
      axisLabelFontFamily: 'Arial',
      axisLabelPadding: 10,
      color: "#d5d5d5"

    },
    colors: ["#1ab394"],
    grid: {
      color: "#999999",
      hoverable: true,
      clickable: true,
      tickColor: "#D4D4D4",
      borderWidth: 0
    },
    legend: {
      show: false
    },
    tooltip: true,
    tooltipOpts: {
      content: "x: %x, y: %y"
    }
  };

  /**
   * Bar Chart data
   */
  var chartData = [
    {
      label: "",
      grow: {stepMode: "linear"},
      color: "#1ab394",
      data: [
        [1, 34],
        [2, 25],
        [3, 19],
        [4, 34],
        [5, 32],
        [6, 44],
        [7, 34]
      ],
    }
  ];


  /**
   * Pie Chart Data
   */
  var pieData = [
    {
      label: "Cars",
      data: 21,
      color: "#d3d3d3",
    },
    {
      label: "Trucks",
      data: 15,
      color: "#79d2c0"
    },
    {
      label: "Sport Utility",
      data: 3,
      color: "#bababa"
    },
    {
      label: "Vans",
      data: 52,
      color: "#1ab394"
    },
    {
      label: "Other",
      data: 52,
      color: "#1ab380"
    },

  ];


  /**
   * Pie Chart Options
   */
  var pieOptions = {
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

  /**
   * Line Chart Options
   */
  var lineOptions = {
    series: {
      lines: {
        show: true,
        lineWidth: 2,
        fill: true,
        fillColor: {
          colors: [
            {
              opacity: 0.0
            },
            {
              opacity: 0.0
            }
          ]
        }
      }
    },
    xaxis: {
      tickDecimals: 0
    },
    colors: ["#1ab394"],
    grid: {
      color: "#999999",
      hoverable: true,
      clickable: true,
      tickColor: "#D4D4D4",
      borderWidth: 0
    },
    legend: {
      show: false
    },
    tooltip: true,
    tooltipOpts: {
      content: "x: %x, y: %y"
    }
  };

  /**
   * Line Chart Data
   */
  var lineAreaData = [
    {
      label: "line",
      data: [
        [1, 34],
        [2, 22],
        [3, 19],
        [4, 12],
        [5, 32],
        [6, 54],
        [7, 23],
        [8, 57],
        [9, 12],
        [10, 24],
        [11, 44],
        [12, 64],
        [13, 21]
      ]
    }
  ];

  /**
   * Line Area Chart Options
   */
  var lineAreaOptions = {
    series: {
      lines: {
        show: true,
        lineWidth: 2,
        fill: true,
        fillColor: {
          colors: [
            {
              opacity: 0.7
            },
            {
              opacity: 0.5
            }
          ]
        }
      }
    },
    xaxis: {
      tickDecimals: 0
    },
    colors: ["#1ab394"],
    grid: {
      color: "#999999",
      hoverable: true,
      clickable: true,
      tickColor: "#D4D4D4",
      borderWidth: 0
    },
    legend: {
      show: false
    },
    tooltip: true,
    tooltipOpts: {
      content: "x: %x, y: %y"
    }
  };

  /**
   * Data for Multi line chart
   */
  var oilprices = [[1167692400000, 61.05], [1167778800000, 58.32], [1167865200000, 57.35], [1167951600000, 56.31], [1168210800000, 55.55], [1168297200000, 55.64], [1168383600000, 54.02], [1168470000000, 51.88], [1168556400000, 52.99], [1168815600000, 52.99], [1168902000000, 51.21], [1168988400000, 52.24], [1169074800000, 50.48], [1169161200000, 51.99], [1169420400000, 51.13], [1169506800000, 55.04], [1169593200000, 55.37], [1169679600000, 54.23], [1169766000000, 55.42], [1170025200000, 54.01], [1170111600000, 56.97], [1170198000000, 58.14], [1170284400000, 58.14], [1170370800000, 59.02], [1170630000000, 58.74], [1170716400000, 58.88], [1170802800000, 57.71], [1170889200000, 59.71], [1170975600000, 59.89], [1171234800000, 57.81], [1171321200000, 59.06], [1171407600000, 58.00], [1171494000000, 57.99], [1171580400000, 59.39], [1171839600000, 59.39], [1171926000000, 58.07], [1172012400000, 60.07], [1172098800000, 61.14], [1172444400000, 61.39], [1172530800000, 61.46], [1172617200000, 61.79], [1172703600000, 62.00], [1172790000000, 60.07], [1173135600000, 60.69], [1173222000000, 61.82], [1173308400000, 60.05], [1173654000000, 58.91], [1173740400000, 57.93], [1173826800000, 58.16], [1173913200000, 57.55], [1173999600000, 57.11], [1174258800000, 56.59], [1174345200000, 59.61], [1174518000000, 61.69], [1174604400000, 62.28], [1174860000000, 62.91], [1174946400000, 62.93], [1175032800000, 64.03], [1175119200000, 66.03], [1175205600000, 65.87], [1175464800000, 64.64], [1175637600000, 64.38], [1175724000000, 64.28], [1175810400000, 64.28], [1176069600000, 61.51], [1176156000000, 61.89], [1176242400000, 62.01], [1176328800000, 63.85], [1176415200000, 63.63], [1176674400000, 63.61], [1176760800000, 63.10], [1176847200000, 63.13], [1176933600000, 61.83], [1177020000000, 63.38], [1177279200000, 64.58], [1177452000000, 65.84], [1177538400000, 65.06], [1177624800000, 66.46], [1177884000000, 64.40], [1178056800000, 63.68], [1178143200000, 63.19], [1178229600000, 61.93], [1178488800000, 61.47], [1178575200000, 61.55], [1178748000000, 61.81], [1178834400000, 62.37], [1179093600000, 62.46], [1179180000000, 63.17], [1179266400000, 62.55], [1179352800000, 64.94], [1179698400000, 66.27], [1179784800000, 65.50], [1179871200000, 65.77], [1179957600000, 64.18], [1180044000000, 65.20], [1180389600000, 63.15], [1180476000000, 63.49], [1180562400000, 65.08], [1180908000000, 66.30], [1180994400000, 65.96], [1181167200000, 66.93], [1181253600000, 65.98], [1181599200000, 65.35], [1181685600000, 66.26], [1181858400000, 68.00], [1182117600000, 69.09], [1182204000000, 69.10], [1182290400000, 68.19], [1182376800000, 68.19], [1182463200000, 69.14], [1182722400000, 68.19], [1182808800000, 67.77], [1182895200000, 68.97], [1182981600000, 69.57], [1183068000000, 70.68], [1183327200000, 71.09], [1183413600000, 70.92], [1183586400000, 71.81], [1183672800000, 72.81], [1183932000000, 72.19], [1184018400000, 72.56], [1184191200000, 72.50], [1184277600000, 74.15], [1184623200000, 75.05], [1184796000000, 75.92], [1184882400000, 75.57], [1185141600000, 74.89], [1185228000000, 73.56], [1185314400000, 75.57], [1185400800000, 74.95], [1185487200000, 76.83], [1185832800000, 78.21], [1185919200000, 76.53], [1186005600000, 76.86], [1186092000000, 76.00], [1186437600000, 71.59], [1186696800000, 71.47], [1186956000000, 71.62], [1187042400000, 71.00], [1187301600000, 71.98], [1187560800000, 71.12], [1187647200000, 69.47], [1187733600000, 69.26], [1187820000000, 69.83], [1187906400000, 71.09], [1188165600000, 71.73], [1188338400000, 73.36], [1188511200000, 74.04], [1188856800000, 76.30], [1189116000000, 77.49], [1189461600000, 78.23], [1189548000000, 79.91], [1189634400000, 80.09], [1189720800000, 79.10], [1189980000000, 80.57], [1190066400000, 81.93], [1190239200000, 83.32], [1190325600000, 81.62], [1190584800000, 80.95], [1190671200000, 79.53], [1190757600000, 80.30], [1190844000000, 82.88], [1190930400000, 81.66], [1191189600000, 80.24], [1191276000000, 80.05], [1191362400000, 79.94], [1191448800000, 81.44], [1191535200000, 81.22], [1191794400000, 79.02], [1191880800000, 80.26], [1191967200000, 80.30], [1192053600000, 83.08], [1192140000000, 83.69], [1192399200000, 86.13], [1192485600000, 87.61], [1192572000000, 87.40], [1192658400000, 89.47], [1192744800000, 88.60], [1193004000000, 87.56], [1193090400000, 87.56], [1193176800000, 87.10], [1193263200000, 91.86], [1193612400000, 93.53], [1193698800000, 94.53], [1193871600000, 95.93], [1194217200000, 93.98], [1194303600000, 96.37], [1194476400000, 95.46], [1194562800000, 96.32], [1195081200000, 93.43], [1195167600000, 95.10], [1195426800000, 94.64], [1195513200000, 95.10], [1196031600000, 97.70], [1196118000000, 94.42], [1196204400000, 90.62], [1196290800000, 91.01], [1196377200000, 88.71], [1196636400000, 88.32], [1196809200000, 90.23], [1196982000000, 88.28], [1197241200000, 87.86], [1197327600000, 90.02], [1197414000000, 92.25], [1197586800000, 90.63], [1197846000000, 90.63], [1197932400000, 90.49], [1198018800000, 91.24], [1198105200000, 91.06], [1198191600000, 90.49], [1198710000000, 96.62], [1198796400000, 96.00], [1199142000000, 99.62], [1199314800000, 99.18], [1199401200000, 95.09], [1199660400000, 96.33], [1199833200000, 95.67], [1200351600000, 91.90], [1200438000000, 90.84], [1200524400000, 90.13], [1200610800000, 90.57], [1200956400000, 89.21], [1201042800000, 86.99], [1201129200000, 89.85], [1201474800000, 90.99], [1201561200000, 91.64], [1201647600000, 92.33], [1201734000000, 91.75], [1202079600000, 90.02], [1202166000000, 88.41], [1202252400000, 87.14], [1202338800000, 88.11], [1202425200000, 91.77], [1202770800000, 92.78], [1202857200000, 93.27], [1202943600000, 95.46], [1203030000000, 95.46], [1203289200000, 101.74], [1203462000000, 98.81], [1203894000000, 100.88], [1204066800000, 99.64], [1204153200000, 102.59], [1204239600000, 101.84], [1204498800000, 99.52], [1204585200000, 99.52], [1204671600000, 104.52], [1204758000000, 105.47], [1204844400000, 105.15], [1205103600000, 108.75], [1205276400000, 109.92], [1205362800000, 110.33], [1205449200000, 110.21], [1205708400000, 105.68], [1205967600000, 101.84], [1206313200000, 100.86], [1206399600000, 101.22], [1206486000000, 105.90], [1206572400000, 107.58], [1206658800000, 105.62], [1206914400000, 101.58], [1207000800000, 100.98], [1207173600000, 103.83], [1207260000000, 106.23], [1207605600000, 108.50], [1207778400000, 110.11], [1207864800000, 110.14], [1208210400000, 113.79], [1208296800000, 114.93], [1208383200000, 114.86], [1208728800000, 117.48], [1208815200000, 118.30], [1208988000000, 116.06], [1209074400000, 118.52], [1209333600000, 118.75], [1209420000000, 113.46], [1209592800000, 112.52], [1210024800000, 121.84], [1210111200000, 123.53], [1210197600000, 123.69], [1210543200000, 124.23], [1210629600000, 125.80], [1210716000000, 126.29], [1211148000000, 127.05], [1211320800000, 129.07], [1211493600000, 132.19], [1211839200000, 128.85], [1212357600000, 127.76], [1212703200000, 138.54], [1212962400000, 136.80], [1213135200000, 136.38], [1213308000000, 134.86], [1213653600000, 134.01], [1213740000000, 136.68], [1213912800000, 135.65], [1214172000000, 134.62], [1214258400000, 134.62], [1214344800000, 134.62], [1214431200000, 139.64], [1214517600000, 140.21], [1214776800000, 140.00], [1214863200000, 140.97], [1214949600000, 143.57], [1215036000000, 145.29], [1215381600000, 141.37], [1215468000000, 136.04], [1215727200000, 146.40], [1215986400000, 145.18], [1216072800000, 138.74], [1216159200000, 134.60], [1216245600000, 129.29], [1216332000000, 130.65], [1216677600000, 127.95], [1216850400000, 127.95], [1217282400000, 122.19], [1217455200000, 124.08], [1217541600000, 125.10], [1217800800000, 121.41], [1217887200000, 119.17], [1217973600000, 118.58], [1218060000000, 120.02], [1218405600000, 114.45], [1218492000000, 113.01], [1218578400000, 116.00], [1218751200000, 113.77], [1219010400000, 112.87], [1219096800000, 114.53], [1219269600000, 114.98], [1219356000000, 114.98], [1219701600000, 116.27], [1219788000000, 118.15], [1219874400000, 115.59], [1219960800000, 115.46], [1220306400000, 109.71], [1220392800000, 109.35], [1220565600000, 106.23], [1220824800000, 106.34]];
  var exchangerates = [[1167606000000, 0.7580], [1167692400000, 0.7580], [1167778800000, 0.75470], [1167865200000, 0.75490], [1167951600000, 0.76130], [1168038000000, 0.76550], [1168124400000, 0.76930], [1168210800000, 0.76940], [1168297200000, 0.76880], [1168383600000, 0.76780], [1168470000000, 0.77080], [1168556400000, 0.77270], [1168642800000, 0.77490], [1168729200000, 0.77410], [1168815600000, 0.77410], [1168902000000, 0.77320], [1168988400000, 0.77270], [1169074800000, 0.77370], [1169161200000, 0.77240], [1169247600000, 0.77120], [1169334000000, 0.7720], [1169420400000, 0.77210], [1169506800000, 0.77170], [1169593200000, 0.77040], [1169679600000, 0.7690], [1169766000000, 0.77110], [1169852400000, 0.7740], [1169938800000, 0.77450], [1170025200000, 0.77450], [1170111600000, 0.7740], [1170198000000, 0.77160], [1170284400000, 0.77130], [1170370800000, 0.76780], [1170457200000, 0.76880], [1170543600000, 0.77180], [1170630000000, 0.77180], [1170716400000, 0.77280], [1170802800000, 0.77290], [1170889200000, 0.76980], [1170975600000, 0.76850], [1171062000000, 0.76810], [1171148400000, 0.7690], [1171234800000, 0.7690], [1171321200000, 0.76980], [1171407600000, 0.76990], [1171494000000, 0.76510], [1171580400000, 0.76130], [1171666800000, 0.76160], [1171753200000, 0.76140], [1171839600000, 0.76140], [1171926000000, 0.76070], [1172012400000, 0.76020], [1172098800000, 0.76110], [1172185200000, 0.76220], [1172271600000, 0.76150], [1172358000000, 0.75980], [1172444400000, 0.75980], [1172530800000, 0.75920], [1172617200000, 0.75730], [1172703600000, 0.75660], [1172790000000, 0.75670], [1172876400000, 0.75910], [1172962800000, 0.75820], [1173049200000, 0.75850], [1173135600000, 0.76130], [1173222000000, 0.76310], [1173308400000, 0.76150], [1173394800000, 0.760], [1173481200000, 0.76130], [1173567600000, 0.76270], [1173654000000, 0.76270], [1173740400000, 0.76080], [1173826800000, 0.75830], [1173913200000, 0.75750], [1173999600000, 0.75620], [1174086000000, 0.7520], [1174172400000, 0.75120], [1174258800000, 0.75120], [1174345200000, 0.75170], [1174431600000, 0.7520], [1174518000000, 0.75110], [1174604400000, 0.7480], [1174690800000, 0.75090], [1174777200000, 0.75310], [1174860000000, 0.75310], [1174946400000, 0.75270], [1175032800000, 0.74980], [1175119200000, 0.74930], [1175205600000, 0.75040], [1175292000000, 0.750], [1175378400000, 0.74910], [1175464800000, 0.74910], [1175551200000, 0.74850], [1175637600000, 0.74840], [1175724000000, 0.74920], [1175810400000, 0.74710], [1175896800000, 0.74590], [1175983200000, 0.74770], [1176069600000, 0.74770], [1176156000000, 0.74830], [1176242400000, 0.74580], [1176328800000, 0.74480], [1176415200000, 0.7430], [1176501600000, 0.73990], [1176588000000, 0.73950], [1176674400000, 0.73950], [1176760800000, 0.73780], [1176847200000, 0.73820], [1176933600000, 0.73620], [1177020000000, 0.73550], [1177106400000, 0.73480], [1177192800000, 0.73610], [1177279200000, 0.73610], [1177365600000, 0.73650], [1177452000000, 0.73620], [1177538400000, 0.73310], [1177624800000, 0.73390], [1177711200000, 0.73440], [1177797600000, 0.73270], [1177884000000, 0.73270], [1177970400000, 0.73360], [1178056800000, 0.73330], [1178143200000, 0.73590], [1178229600000, 0.73590], [1178316000000, 0.73720], [1178402400000, 0.7360], [1178488800000, 0.7360], [1178575200000, 0.7350], [1178661600000, 0.73650], [1178748000000, 0.73840], [1178834400000, 0.73950], [1178920800000, 0.74130], [1179007200000, 0.73970], [1179093600000, 0.73960], [1179180000000, 0.73850], [1179266400000, 0.73780], [1179352800000, 0.73660], [1179439200000, 0.740], [1179525600000, 0.74110], [1179612000000, 0.74060], [1179698400000, 0.74050], [1179784800000, 0.74140], [1179871200000, 0.74310], [1179957600000, 0.74310], [1180044000000, 0.74380], [1180130400000, 0.74430], [1180216800000, 0.74430], [1180303200000, 0.74430], [1180389600000, 0.74340], [1180476000000, 0.74290], [1180562400000, 0.74420], [1180648800000, 0.7440], [1180735200000, 0.74390], [1180821600000, 0.74370], [1180908000000, 0.74370], [1180994400000, 0.74290], [1181080800000, 0.74030], [1181167200000, 0.73990], [1181253600000, 0.74180], [1181340000000, 0.74680], [1181426400000, 0.7480], [1181512800000, 0.7480], [1181599200000, 0.7490], [1181685600000, 0.74940], [1181772000000, 0.75220], [1181858400000, 0.75150], [1181944800000, 0.75020], [1182031200000, 0.74720], [1182117600000, 0.74720], [1182204000000, 0.74620], [1182290400000, 0.74550], [1182376800000, 0.74490], [1182463200000, 0.74670], [1182549600000, 0.74580], [1182636000000, 0.74270], [1182722400000, 0.74270], [1182808800000, 0.7430], [1182895200000, 0.74290], [1182981600000, 0.7440], [1183068000000, 0.7430], [1183154400000, 0.74220], [1183240800000, 0.73880], [1183327200000, 0.73880], [1183413600000, 0.73690], [1183500000000, 0.73450], [1183586400000, 0.73450], [1183672800000, 0.73450], [1183759200000, 0.73520], [1183845600000, 0.73410], [1183932000000, 0.73410], [1184018400000, 0.7340], [1184104800000, 0.73240], [1184191200000, 0.72720], [1184277600000, 0.72640], [1184364000000, 0.72550], [1184450400000, 0.72580], [1184536800000, 0.72580], [1184623200000, 0.72560], [1184709600000, 0.72570], [1184796000000, 0.72470], [1184882400000, 0.72430], [1184968800000, 0.72440], [1185055200000, 0.72350], [1185141600000, 0.72350], [1185228000000, 0.72350], [1185314400000, 0.72350], [1185400800000, 0.72620], [1185487200000, 0.72880], [1185573600000, 0.73010], [1185660000000, 0.73370], [1185746400000, 0.73370], [1185832800000, 0.73240], [1185919200000, 0.72970], [1186005600000, 0.73170], [1186092000000, 0.73150], [1186178400000, 0.72880], [1186264800000, 0.72630], [1186351200000, 0.72630], [1186437600000, 0.72420], [1186524000000, 0.72530], [1186610400000, 0.72640], [1186696800000, 0.7270], [1186783200000, 0.73120], [1186869600000, 0.73050], [1186956000000, 0.73050], [1187042400000, 0.73180], [1187128800000, 0.73580], [1187215200000, 0.74090], [1187301600000, 0.74540], [1187388000000, 0.74370], [1187474400000, 0.74240], [1187560800000, 0.74240], [1187647200000, 0.74150], [1187733600000, 0.74190], [1187820000000, 0.74140], [1187906400000, 0.73770], [1187992800000, 0.73550], [1188079200000, 0.73150], [1188165600000, 0.73150], [1188252000000, 0.7320], [1188338400000, 0.73320], [1188424800000, 0.73460], [1188511200000, 0.73280], [1188597600000, 0.73230], [1188684000000, 0.7340], [1188770400000, 0.7340], [1188856800000, 0.73360], [1188943200000, 0.73510], [1189029600000, 0.73460], [1189116000000, 0.73210], [1189202400000, 0.72940], [1189288800000, 0.72660], [1189375200000, 0.72660], [1189461600000, 0.72540], [1189548000000, 0.72420], [1189634400000, 0.72130], [1189720800000, 0.71970], [1189807200000, 0.72090], [1189893600000, 0.7210], [1189980000000, 0.7210], [1190066400000, 0.7210], [1190152800000, 0.72090], [1190239200000, 0.71590], [1190325600000, 0.71330], [1190412000000, 0.71050], [1190498400000, 0.70990], [1190584800000, 0.70990], [1190671200000, 0.70930], [1190757600000, 0.70930], [1190844000000, 0.70760], [1190930400000, 0.7070], [1191016800000, 0.70490], [1191103200000, 0.70120], [1191189600000, 0.70110], [1191276000000, 0.70190], [1191362400000, 0.70460], [1191448800000, 0.70630], [1191535200000, 0.70890], [1191621600000, 0.70770], [1191708000000, 0.70770], [1191794400000, 0.70770], [1191880800000, 0.70910], [1191967200000, 0.71180], [1192053600000, 0.70790], [1192140000000, 0.70530], [1192226400000, 0.7050], [1192312800000, 0.70550], [1192399200000, 0.70550], [1192485600000, 0.70450], [1192572000000, 0.70510], [1192658400000, 0.70510], [1192744800000, 0.70170], [1192831200000, 0.70], [1192917600000, 0.69950], [1193004000000, 0.69940], [1193090400000, 0.70140], [1193176800000, 0.70360], [1193263200000, 0.70210], [1193349600000, 0.70020], [1193436000000, 0.69670], [1193522400000, 0.6950], [1193612400000, 0.6950], [1193698800000, 0.69390], [1193785200000, 0.6940], [1193871600000, 0.69220], [1193958000000, 0.69190], [1194044400000, 0.69140], [1194130800000, 0.68940], [1194217200000, 0.68910], [1194303600000, 0.69040], [1194390000000, 0.6890], [1194476400000, 0.68340], [1194562800000, 0.68230], [1194649200000, 0.68070], [1194735600000, 0.68150], [1194822000000, 0.68150], [1194908400000, 0.68470], [1194994800000, 0.68590], [1195081200000, 0.68220], [1195167600000, 0.68270], [1195254000000, 0.68370], [1195340400000, 0.68230], [1195426800000, 0.68220], [1195513200000, 0.68220], [1195599600000, 0.67920], [1195686000000, 0.67460], [1195772400000, 0.67350], [1195858800000, 0.67310], [1195945200000, 0.67420], [1196031600000, 0.67440], [1196118000000, 0.67390], [1196204400000, 0.67310], [1196290800000, 0.67610], [1196377200000, 0.67610], [1196463600000, 0.67850], [1196550000000, 0.68180], [1196636400000, 0.68360], [1196722800000, 0.68230], [1196809200000, 0.68050], [1196895600000, 0.67930], [1196982000000, 0.68490], [1197068400000, 0.68330], [1197154800000, 0.68250], [1197241200000, 0.68250], [1197327600000, 0.68160], [1197414000000, 0.67990], [1197500400000, 0.68130], [1197586800000, 0.68090], [1197673200000, 0.68680], [1197759600000, 0.69330], [1197846000000, 0.69330], [1197932400000, 0.69450], [1198018800000, 0.69440], [1198105200000, 0.69460], [1198191600000, 0.69640], [1198278000000, 0.69650], [1198364400000, 0.69560], [1198450800000, 0.69560], [1198537200000, 0.6950], [1198623600000, 0.69480], [1198710000000, 0.69280], [1198796400000, 0.68870], [1198882800000, 0.68240], [1198969200000, 0.67940], [1199055600000, 0.67940], [1199142000000, 0.68030], [1199228400000, 0.68550], [1199314800000, 0.68240], [1199401200000, 0.67910], [1199487600000, 0.67830], [1199574000000, 0.67850], [1199660400000, 0.67850], [1199746800000, 0.67970], [1199833200000, 0.680], [1199919600000, 0.68030], [1200006000000, 0.68050], [1200092400000, 0.6760], [1200178800000, 0.6770], [1200265200000, 0.6770], [1200351600000, 0.67360], [1200438000000, 0.67260], [1200524400000, 0.67640], [1200610800000, 0.68210], [1200697200000, 0.68310], [1200783600000, 0.68420], [1200870000000, 0.68420], [1200956400000, 0.68870], [1201042800000, 0.69030], [1201129200000, 0.68480], [1201215600000, 0.68240], [1201302000000, 0.67880], [1201388400000, 0.68140], [1201474800000, 0.68140], [1201561200000, 0.67970], [1201647600000, 0.67690], [1201734000000, 0.67650], [1201820400000, 0.67330], [1201906800000, 0.67290], [1201993200000, 0.67580], [1202079600000, 0.67580], [1202166000000, 0.6750], [1202252400000, 0.6780], [1202338800000, 0.68330], [1202425200000, 0.68560], [1202511600000, 0.69030], [1202598000000, 0.68960], [1202684400000, 0.68960], [1202770800000, 0.68820], [1202857200000, 0.68790], [1202943600000, 0.68620], [1203030000000, 0.68520], [1203116400000, 0.68230], [1203202800000, 0.68130], [1203289200000, 0.68130], [1203375600000, 0.68220], [1203462000000, 0.68020], [1203548400000, 0.68020], [1203634800000, 0.67840], [1203721200000, 0.67480], [1203807600000, 0.67470], [1203894000000, 0.67470], [1203980400000, 0.67480], [1204066800000, 0.67330], [1204153200000, 0.6650], [1204239600000, 0.66110], [1204326000000, 0.65830], [1204412400000, 0.6590], [1204498800000, 0.6590], [1204585200000, 0.65810], [1204671600000, 0.65780], [1204758000000, 0.65740], [1204844400000, 0.65320], [1204930800000, 0.65020], [1205017200000, 0.65140], [1205103600000, 0.65140], [1205190000000, 0.65070], [1205276400000, 0.6510], [1205362800000, 0.64890], [1205449200000, 0.64240], [1205535600000, 0.64060], [1205622000000, 0.63820], [1205708400000, 0.63820], [1205794800000, 0.63410], [1205881200000, 0.63440], [1205967600000, 0.63780], [1206054000000, 0.64390], [1206140400000, 0.64780], [1206226800000, 0.64810], [1206313200000, 0.64810], [1206399600000, 0.64940], [1206486000000, 0.64380], [1206572400000, 0.63770], [1206658800000, 0.63290], [1206745200000, 0.63360], [1206831600000, 0.63330], [1206914400000, 0.63330], [1207000800000, 0.6330], [1207087200000, 0.63710], [1207173600000, 0.64030], [1207260000000, 0.63960], [1207346400000, 0.63640], [1207432800000, 0.63560], [1207519200000, 0.63560], [1207605600000, 0.63680], [1207692000000, 0.63570], [1207778400000, 0.63540], [1207864800000, 0.6320], [1207951200000, 0.63320], [1208037600000, 0.63280], [1208124000000, 0.63310], [1208210400000, 0.63420], [1208296800000, 0.63210], [1208383200000, 0.63020], [1208469600000, 0.62780], [1208556000000, 0.63080], [1208642400000, 0.63240], [1208728800000, 0.63240], [1208815200000, 0.63070], [1208901600000, 0.62770], [1208988000000, 0.62690], [1209074400000, 0.63350], [1209160800000, 0.63920], [1209247200000, 0.640], [1209333600000, 0.64010], [1209420000000, 0.63960], [1209506400000, 0.64070], [1209592800000, 0.64230], [1209679200000, 0.64290], [1209765600000, 0.64720], [1209852000000, 0.64850], [1209938400000, 0.64860], [1210024800000, 0.64670], [1210111200000, 0.64440], [1210197600000, 0.64670], [1210284000000, 0.65090], [1210370400000, 0.64780], [1210456800000, 0.64610], [1210543200000, 0.64610], [1210629600000, 0.64680], [1210716000000, 0.64490], [1210802400000, 0.6470], [1210888800000, 0.64610], [1210975200000, 0.64520], [1211061600000, 0.64220], [1211148000000, 0.64220], [1211234400000, 0.64250], [1211320800000, 0.64140], [1211407200000, 0.63660], [1211493600000, 0.63460], [1211580000000, 0.6350], [1211666400000, 0.63460], [1211752800000, 0.63460], [1211839200000, 0.63430], [1211925600000, 0.63460], [1212012000000, 0.63790], [1212098400000, 0.64160], [1212184800000, 0.64420], [1212271200000, 0.64310], [1212357600000, 0.64310], [1212444000000, 0.64350], [1212530400000, 0.6440], [1212616800000, 0.64730], [1212703200000, 0.64690], [1212789600000, 0.63860], [1212876000000, 0.63560], [1212962400000, 0.6340], [1213048800000, 0.63460], [1213135200000, 0.6430], [1213221600000, 0.64520], [1213308000000, 0.64670], [1213394400000, 0.65060], [1213480800000, 0.65040], [1213567200000, 0.65030], [1213653600000, 0.64810], [1213740000000, 0.64510], [1213826400000, 0.6450], [1213912800000, 0.64410], [1213999200000, 0.64140], [1214085600000, 0.64090], [1214172000000, 0.64090], [1214258400000, 0.64280], [1214344800000, 0.64310], [1214431200000, 0.64180], [1214517600000, 0.63710], [1214604000000, 0.63490], [1214690400000, 0.63330], [1214776800000, 0.63340], [1214863200000, 0.63380], [1214949600000, 0.63420], [1215036000000, 0.6320], [1215122400000, 0.63180], [1215208800000, 0.6370], [1215295200000, 0.63680], [1215381600000, 0.63680], [1215468000000, 0.63830], [1215554400000, 0.63710], [1215640800000, 0.63710], [1215727200000, 0.63550], [1215813600000, 0.6320], [1215900000000, 0.62770], [1215986400000, 0.62760], [1216072800000, 0.62910], [1216159200000, 0.62740], [1216245600000, 0.62930], [1216332000000, 0.63110], [1216418400000, 0.6310], [1216504800000, 0.63120], [1216591200000, 0.63120], [1216677600000, 0.63040], [1216764000000, 0.62940], [1216850400000, 0.63480], [1216936800000, 0.63780], [1217023200000, 0.63680], [1217109600000, 0.63680], [1217196000000, 0.63680], [1217282400000, 0.6360], [1217368800000, 0.6370], [1217455200000, 0.64180], [1217541600000, 0.64110], [1217628000000, 0.64350], [1217714400000, 0.64270], [1217800800000, 0.64270], [1217887200000, 0.64190], [1217973600000, 0.64460], [1218060000000, 0.64680], [1218146400000, 0.64870], [1218232800000, 0.65940], [1218319200000, 0.66660], [1218405600000, 0.66660], [1218492000000, 0.66780], [1218578400000, 0.67120], [1218664800000, 0.67050], [1218751200000, 0.67180], [1218837600000, 0.67840], [1218924000000, 0.68110], [1219010400000, 0.68110], [1219096800000, 0.67940], [1219183200000, 0.68040], [1219269600000, 0.67810], [1219356000000, 0.67560], [1219442400000, 0.67350], [1219528800000, 0.67630], [1219615200000, 0.67620], [1219701600000, 0.67770], [1219788000000, 0.68150], [1219874400000, 0.68020], [1219960800000, 0.6780], [1220047200000, 0.67960], [1220133600000, 0.68170], [1220220000000, 0.68170], [1220306400000, 0.68320], [1220392800000, 0.68770], [1220479200000, 0.69120], [1220565600000, 0.69140], [1220652000000, 0.70090], [1220738400000, 0.70120], [1220824800000, 0.7010], [1220911200000, 0.70050]];

  function euroFormatter(v, axis) {
    return v.toFixed(axis.tickDecimals) + "€";
  }

  var position = 'right';

  /**
   * multiData - data for multi line chart
   */
  var multiData = [
    {
      data: oilprices,
      label: "Oil price ($)"
    },
    {
      data: exchangerates,
      label: "USD/EUR exchange rate",
      yaxis: 2
    }
  ];

  /**
   * multiOptions - options for multi chart
   */
  var multiOptions = {
    xaxes: [
      {
        mode: 'time'
      }
    ],
    yaxes: [
      {
        min: 0
      },
      {
        // align if we are to the right
        alignTicksWithAxis: position == "right" ? 1 : null,
        position: position,
        tickFormatter: euroFormatter
      }
    ],
    legend: {
      position: 'sw'
    },
    colors: ["#1ab394"],
    grid: {
      color: "#999999",
      hoverable: true,
      clickable: true,
      tickColor: "#D4D4D4",
      borderWidth: 0

    },
    tooltip: true,
    tooltipOpts: {
      content: "%s for %x was %y",
      xDateFormat: "%y-%0m-%0d",
      onHover: function (flotItem, $tooltipEl) {
      }
    }

  };

  /**
   * Definition of variables
   * Flot chart
   */
  this.flotChartData = chartData;
  this.flotBarOptions = barOptions;
  this.flotLineOptions = lineOptions;
  this.flotPieData = pieData;
  this.flotPieOptions = pieOptions;
  this.flotLineAreaData = lineAreaData;
  this.flotLineAreaOptions = lineAreaOptions;
  this.flotMultiData = multiData;
  this.flotMultiOptions = multiOptions;
}

angular.module('dealScanCrmApp').controller('flotChartCtrl', flotChartCtrl);


function dashboardFlotTwo() {

  var data1 = [
    [gd(2012, 1, 1), 7],
    [gd(2012, 1, 2), 6],
    [gd(2012, 1, 3), 4],
    [gd(2012, 1, 4), 8],
    [gd(2012, 1, 5), 9],
    [gd(2012, 1, 6), 7],
    [gd(2012, 1, 7), 5],
    [gd(2012, 1, 8), 4],
    [gd(2012, 1, 9), 7],
    [gd(2012, 1, 10), 8],
    [gd(2012, 1, 11), 9],
    [gd(2012, 1, 12), 6],
    [gd(2012, 1, 13), 4],
    [gd(2012, 1, 14), 5],
    [gd(2012, 1, 15), 11],
    [gd(2012, 1, 16), 8],
    [gd(2012, 1, 17), 8],
    [gd(2012, 1, 18), 11],
    [gd(2012, 1, 19), 11],
    [gd(2012, 1, 20), 6],
    [gd(2012, 1, 21), 6],
    [gd(2012, 1, 22), 8],
    [gd(2012, 1, 23), 11],
    [gd(2012, 1, 24), 13],
    [gd(2012, 1, 25), 7],
    [gd(2012, 1, 26), 9],
    [gd(2012, 1, 27), 9],
    [gd(2012, 1, 28), 8],
    [gd(2012, 1, 29), 5],
    [gd(2012, 1, 30), 8],
    [gd(2012, 1, 31), 25]
  ];

  var data2 = [
    [gd(2012, 1, 1), 800],
    [gd(2012, 1, 2), 500],
    [gd(2012, 1, 3), 600],
    [gd(2012, 1, 4), 700],
    [gd(2012, 1, 5), 500],
    [gd(2012, 1, 6), 456],
    [gd(2012, 1, 7), 800],
    [gd(2012, 1, 8), 589],
    [gd(2012, 1, 9), 467],
    [gd(2012, 1, 10), 876],
    [gd(2012, 1, 11), 689],
    [gd(2012, 1, 12), 700],
    [gd(2012, 1, 13), 500],
    [gd(2012, 1, 14), 600],
    [gd(2012, 1, 15), 700],
    [gd(2012, 1, 16), 786],
    [gd(2012, 1, 17), 345],
    [gd(2012, 1, 18), 888],
    [gd(2012, 1, 19), 888],
    [gd(2012, 1, 20), 888],
    [gd(2012, 1, 21), 987],
    [gd(2012, 1, 22), 444],
    [gd(2012, 1, 23), 999],
    [gd(2012, 1, 24), 567],
    [gd(2012, 1, 25), 786],
    [gd(2012, 1, 26), 666],
    [gd(2012, 1, 27), 888],
    [gd(2012, 1, 28), 900],
    [gd(2012, 1, 29), 178],
    [gd(2012, 1, 30), 555],
    [gd(2012, 1, 31), 993]
  ];


  var dataset = [
    {
      label: "Number of orders",
      grow:{stepMode:"linear"},
      data: data2,
      color: "#1ab394",
      bars: {
        show: true,
        align: "center",
        barWidth: 24 * 60 * 60 * 600,
        lineWidth: 0
      }

    },
    {
      label: "Payments",
      grow:{stepMode:"linear"},
      data: data1,
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


  var options = {
    grid: {
      hoverable: true,
      clickable: true,
      tickColor: "#d5d5d5",
      borderWidth: 0,
      color: '#d5d5d5'
    },
    colors: ["#1ab394", "#464f88"],
    tooltip: true,
    xaxis: {
      mode: "time",
      tickSize: [3, "day"],
      tickLength: 0,
      axisLabel: "Date",
      axisLabelUseCanvas: true,
      axisLabelFontSizePixels: 12,
      axisLabelFontFamily: 'Arial',
      axisLabelPadding: 10,
      color: "#d5d5d5"
    },
    yaxes: [
      {
        position: "left",
        max: 1070,
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
      position: "nw"
    }

  };

  function gd(year, month, day) {
    return new Date(year, month - 1, day).getTime();
  }

  /**
   * Definition of variables
   * Flot chart
   */
  this.flotData = dataset;
  this.flotOptions = options;
}


angular.module('dealScanCrmApp').controller('dashboardFlotTwo', dashboardFlotTwo);

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
