function dashboardCharts() {

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
      grow: {stepMode: "linear"},
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
      grow: {stepMode: "linear"},
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

angular.module('dealScanCrmApp').controller('DashboardCharts', dashboardCharts);


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

angular.module('dealScanCrmApp').controller('DashboardMap', dashboardMap);

angular.module('dealScanCrmApp')
  .controller('DashboardCtrl', function ($scope, $state, $uibModal, $anchorScroll, Auth, Util, Dashboard, NgMap, appConfig) {
    console.log("dashboard controller loaded");
    var _dashboard = this;
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

    /* Initialize Map Object */
    NgMap.getMap().then(function (map) {
      _dashboard.map = map;
      console.log(console.log(_dashboard.map.center));
    }).catch(function (err) {
      console.log(err);
    });


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



