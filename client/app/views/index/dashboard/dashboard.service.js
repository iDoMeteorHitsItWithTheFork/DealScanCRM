'use strict';

angular.module('dealScanCrmApp')
    .factory('Dashboard', function (Auth, User, Util, $q, $filter) {
        // Service logic
        // ...



        var _user = Auth.getCurrentUser();
        var _teamMates = {};
        var _wonDeals = {};
        var _lostDeals = {};
        var _totalDeals = {};
        var teamMates = [];
        var safeCb = Util.safeCb;

        var salesData = Util.dummyData();
        var filteredData = salesData;
        console.log(salesData);

        function filterData(status, sources){
            //var df = $q.defer();
            console.log(status);
            console.log(sources);
            filteredData = $filter('filter')(salesData, function(value, index, arr){
              var filtered = false;
              for (var i = 0; i < sources.length; i++) {
                   if (status != 'total') {
                     if (value.status == status && value.source == sources[i]) {
                       filtered = true;
                       break;
                     } else filtered = false;
                   }
                   else {
                     if (value.source == sources[i]) {
                       filtered = true;
                       break;
                     } else filtered = false;
                   }
              }
              return filtered;
            });
            console.log(filteredData);
            switch(status){
                case 'won':
                  wonDeals();
                  break;
                case 'lost':
                  lostDeals();
                  break;
                case 'total':
                  totalDeals();
            }
        }

        var _metrics = {};

        function getMetrics(){
          //process data to generate metrics
           var metrics = [ {
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
           _metrics = metrics;
           return _metrics;
        }

        function getTeamMates(callback) {
            if (!_user) return;
            return Auth.getTeamMates(function(teammates){
                _teamMates = teammates;
                if (teamMates.length > 0) teamMates.length = 0;
                angular.forEach(_teamMates, function(teamMate){
                    teamMates.push({userID: teamMate.userID, profile: teamMate.profile});
                }); return safeCb(callback)(teamMates);
            }, function(err){
                safeCb(callback)(err);
                return err;
            }).$promise;
        }


        function getCategoryCount(arr, category, status){
            var count = 0;
            for(var i = 0; i < arr.length; i++) {
              if (status) {
                if (arr[i].category == category && arr[i].status == status) count++;
              } else {
                if (arr[i].category == category) count++;
              }
            }
            return count;
        }

        function getModels(arr, category, status){
           var models = [];
           var sales = [];
           var sources = [];
           for(var i=0; i < arr.length; i++){
             if (status){
               if (sources.indexOf(arr[i].source) == -1 && arr[i].status == status) sources.push(arr[i].source);
               if (arr[i].category == category && arr[i].status == status && models.indexOf(arr[i].model) == -1){
                 models.push(arr[i].model);
                 sales.push(getModelSales(arr, arr[i].model, status));
               }
             } else {
               if (sources.indexOf(arr[i].source) == -1) sources.push(arr[i].source);
               if (arr[i].category == category  && models.indexOf(arr[i].model) == -1){
                 models.push(arr[i].model);
                 sales.push(getModelSales(arr, arr[i].model));
               }
             }
           }
          return {models: models, sales: sales, data: getCategoryCount(arr, category, status), sources: sources};
        }

        function getModelSales(arr, model, status){
          var sales = 0;
          for(var i=0; i < arr.length; i++){
            if (status){
              if (arr[i].model == model && arr[i].status == status) sales++;
            }
            else {
              if (arr[i].model == model) sales++;
            }
          }
          return sales;
        }

        /**
         * generate data for won deals
         */
        function wonDeals(){
           //process data to generate won deals
          var cars = getModels(filteredData, "Cars", "won");
          var trucks = getModels(filteredData, "Trucks", "won");
          var utilities = getModels(filteredData, "Utilities", "won");
          var vans = getModels(filteredData, "Vans", "won");
          var other = getModels(filteredData, "Other", "won");
          var wonDeals = [{
                label: "Cars",
                data: cars.data,
                color: Util.pieColors()[0],//"#d3d3d3",
              },{
                label: "Trucks",
                data: trucks.data,
                color: Util.pieColors()[1], //"#79d2c0"
              },{
                label: "Utilities",
                data: utilities.data,
                color: Util.pieColors()[2], //"#bababa"
              },{
                label: "Vans",
                data: vans.data,
                color: Util.pieColors()[3], //"#1ab394"
              },{
                label: "Other",
                data: other.data,
                color: Util.pieColors()[4],//"#1ab380"
              }]
          _wonDeals.pie = wonDeals;
           var barData = [
             {
               category: 'Cars',
               models: cars.models,
               sales: cars.sales,
             },
             {
               category: 'Trucks',
               models: trucks.models,
               sales: trucks.sales,
             },
             {
               category: 'Utilities',
               models: utilities.models,
               sales: utilities.sales,
             },
             {
               category: 'Vans',
               models: vans.models,
               sales: vans.sales,
             },
             {
               category: 'Other',
               models: other.models,
               sales: other.sales,
             }
           ];
           _wonDeals.bar = barData;
            var tableData = [];
            angular.forEach(filteredData, function(value, key){
               if(value.status == 'won'){
                  tableData.push({
                   vehicleInformation: {
                     category: value.category,
                     year: value.year,
                     make: 'Ford',
                     model: value.model,
                     trim: value.trimLevel,
                   },
                   customerDetails: {
                     name: value.name,
                     phone: value.phone,
                     email : value.email,
                   },
                   dealDetails: {
                     date: value.date,
                     salesman: value.salesman,
                     source: value.source,
                     price: value.price
                   }
                 });
               }
            });
           _wonDeals.tableData = tableData;
            return _wonDeals;
        }



        function lostDeals(){
          var cars = getModels(filteredData, "Cars", "lost");
          var trucks = getModels(filteredData, "Trucks", "lost");
          var utilities = getModels(filteredData, "Utilities", "lost");
          var vans = getModels(filteredData, "Vans", "lost");
          var other = getModels(filteredData, "Other", "lost");
          var lostDeals = [{
            label: "Cars",
            data: cars.data,
            color: Util.pieColors()[0],//"#d3d3d3",
          },{
            label: "Trucks",
            data: trucks.data,
            color: Util.pieColors()[1], //"#79d2c0"
          },{
            label: "Utilities",
            data: utilities.data,
            color: Util.pieColors()[2], //"#bababa"
          },{
            label: "Vans",
            data: vans.data,
            color: Util.pieColors()[3], //"#1ab394"
          },{
            label: "Other",
            data: other.data,
            color: Util.pieColors()[4],//"#1ab380"
          }];
          _lostDeals.pie = lostDeals;

          var barData = [
            {
              category: 'Cars',
              models: cars.models,
              sales: cars.sales,
            },
            {
              category: 'Trucks',
              models:trucks.models,
              sales: trucks.sales,
            },
            {
              category: 'Utilities',
              models:utilities.models,
              sales: trucks.sales,
            },
            {
              category: 'Vans',
              models: vans.models,
              sales: vans.sales,
            },
            {
              category: 'Other',
              models: other.models,
              sales: other.sales,
            }
          ];
          _lostDeals.bar = barData;
          var tableData = [];
          angular.forEach(filteredData, function(value, key){
            if(value.status == 'lost'){
              tableData.push({
                vehicleInformation: {
                  category: value.category,
                  year: value.year,
                  make: 'Ford',
                  model: value.model,
                  trim: value.trimLevel,
                },
                customerDetails: {
                  name: value.name,
                  phone: value.phone,
                  email : value.email,
                },
                dealDetails: {
                  date: value.date,
                  salesman: value.salesman,
                  source: value.source,
                  price: value.price
                }
              });
            }
          });
          _lostDeals.tableData = tableData;
          return _lostDeals;
        }


        function totalDeals(){
          var cars = getModels(filteredData, "Cars");
          var trucks = getModels(filteredData, "Trucks");
          var utilities = getModels(filteredData, "Utilities");
          var vans = getModels(filteredData, "Vans");
          var other = getModels(filteredData, "Other");

          var totalDeals = [{
            label: "Cars",
            data: cars.data,
            color: Util.pieColors()[0],//"#d3d3d3",
          },{
            label: "Trucks",
            data: trucks.data,
            color: Util.pieColors()[1], //"#79d2c0"
          },{
            label: "Utilities",
            data: utilities.data,
            color: Util.pieColors()[2], //"#bababa"
          },{
            label: "Vans",
            data: vans.data,
            color: Util.pieColors()[3], //"#1ab394"
          },{
            label: "Other",
            data: other.data,
            color: Util.pieColors()[4],//"#1ab380"
          }];
          _totalDeals.pie = totalDeals;

          var barData = [
            {
              category: 'Cars',
              models: cars.models,
              sales:cars.sales,
            },

            {
              category: 'Trucks',
              models:trucks.models,
              sales:trucks.sales,
            },
            {
              category: 'Utilities',
              models: utilities.models,
              sales: utilities.sales,
            },
            {
              category: 'Vans',
              models: vans.models,
              sales: vans.sales,
            },
            {
              category: 'Other',
              models: other.models,
              sales: other.sales,
            }
          ];
          _totalDeals.bar = barData;
          var tableData = [];
          angular.forEach(filteredData, function(value, key){
              tableData.push({
                vehicleInformation: {
                  category: value.category,
                  year: value.year,
                  make: 'Ford',
                  model: value.model,
                  trim: value.trimLevel,
                },
                customerDetails: {
                  name: value.name,
                  phone: value.phone,
                  email : value.email,
                },
                dealDetails: {
                  date: value.date,
                  salesman: value.salesman,
                  source: value.source,
                  price: value.price
                }
              });
          });
          _totalDeals.tableData = tableData;
          return _totalDeals;
        }

        // Public API here
        return {
            getTeamMates: getTeamMates,
            metrics: getMetrics,
            teamMates: function(){
                return teamMates;
            },
            won: wonDeals,
            lost: lostDeals,
            total: totalDeals,
            filter: filterData
        };
    });
