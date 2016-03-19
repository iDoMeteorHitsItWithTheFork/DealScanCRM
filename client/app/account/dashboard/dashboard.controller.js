angular.module('dealScanCrmApp')
  .controller('DashboardCtrl', function ($scope, $state, $uibModal, $location, $anchorScroll, Auth, Util, Dashboard, NgMap) {
    console.log("dashboard controller loaded");
    var _dashboard = this;
    _dashboard.user = Auth.getCurrentUser();
    _dashboard.isAdmin = Auth.isAdmin;

    _dashboard.teamMates = Dashboard.teamMates();
    _dashboard.teamMate = {};

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
    var data = [
      {
        "model": "  Police Interceptor Utility",
        "Customer": "Burton Stuart",
        "Source": 2,
        "Location": "-61.7134, -116.20717"
      },
      {"model": "  Flex", "Customer": "Preston Z. Mack", "Source": 4, "Location": "32.03139, -166.94248"},
      {"model": "  Transit", "Customer": "Hayes Dunn", "Source": 4, "Location": "13.70113, -111.26865"},
      {"model": "  Edge", "Customer": "Lana H. Sheppard", "Source": 0, "Location": "20.48076, 38.38029"},
      {"model": "Fiesta", "Customer": "Sybil O. Ashley", "Source": 3, "Location": "-33.25441, 172.41903"},
      {"model": "  C-MAX", "Customer": "Chiquita A. Hart", "Source": 3, "Location": "-17.26592, 86.54964"},
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

    function getModelCount(id, data){
      var count = 0;
      for (var i = 0; i < data.length; i++)
        if (id == data[i].model.trim()) count++;
      return count;
    }

    _dashboard.labels = ['Fiesta', 'Focus', 'C-MAX', 'Fusion', 'Taurus', 'Police Interceptor Sedan', 'Mustang',
      'Escape', 'Edge', 'Flex', 'Explorer', 'Police Interceptor Utility', 'Expedition','F-Series','E-Series','Transit','Transit Connect','Heavy Trucks'];

    _dashboard.data = [
      getModelCount(_dashboard.labels[0], data), getModelCount(_dashboard.labels[1], data), getModelCount(_dashboard.labels[2], data),
      getModelCount(_dashboard.labels[3], data), getModelCount(_dashboard.labels[4], data), getModelCount(_dashboard.labels[5], data),
      getModelCount(_dashboard.labels[6], data), getModelCount(_dashboard.labels[7], data), getModelCount(_dashboard.labels[8], data),
      getModelCount(_dashboard.labels[9], data), getModelCount(_dashboard.labels[10], data), getModelCount(_dashboard.labels[11], data),
      getModelCount(_dashboard.labels[12], data), getModelCount(_dashboard.labels[13], data), getModelCount(_dashboard.labels[14], data),
      getModelCount(_dashboard.labels[15], data), getModelCount(_dashboard.labels[16], data), getModelCount(_dashboard.labels[17], data)];

    _dashboard.colors = ['#315777', '#F5888D', '#8BC33E', '#5B9BD1', '#9A89B5', '#F18636'];

    _dashboard.options = {
      responsive: true,
      segmentShowStroke: false,
      segmentStrokeColor: '#fff',
      segmentStrokeWidth: 1,
      percentageInnerCutout: 50, // This is 0 for Pie charts
      animationSteps: 40,
      animationEasing: 'easeOutBounce',
      animateRotate: true,
      animateScale: false

    };

    $scope.clickChart = function (points, evt) {
      console.log(points, evt);
      $scope.showTable = true;
      $location.hash('scrollToPoint');
      $anchorScroll();
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



