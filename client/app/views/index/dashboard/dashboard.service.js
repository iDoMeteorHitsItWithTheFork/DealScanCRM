'use strict';

angular.module('dealScanCrmApp')
    .factory('Dashboard', function (Auth, User, Util, $q) {
        // Service logic
        // ...

        var _user = Auth.getCurrentUser();
        var _teamMates = {};
        var _wonDeals = {};
        var _lostDeals = {};
        var _totalDeals = {};
        var teamMates = [];
        var safeCb = Util.safeCb;


        var _metrics = {};

        function getMetrics(){
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


        /**
         * generate data for won deals
         */
        function wonDeals(){
            var wonDeals = [{
                label: "Cars",
                data: 21,
                color: Util.pieColors()[0],//"#d3d3d3",
              },{
                label: "Trucks",
                data: 15,
                color: Util.pieColors()[1], //"#79d2c0"
              },{
                label: "Utilities",
                data: 3,
                color: Util.pieColors()[2], //"#bababa"
              },{
                label: "Vans",
                data: 52,
                color: Util.pieColors()[3], //"#1ab394"
              },{
                label: "Other",
                data: 52,
                color: Util.pieColors()[4],//"#1ab380"
              }];
            _wonDeals.pie = wonDeals;
           var barData = [
             {
               category: 'Cars',
               models: ['Fiesta', 'Focus', 'C-Max', 'Fusion' ,'Taurus', 'Police Interceptor Sedan', 'Mustang'],
               sales: [30, 50, 45, 2, 4, 0, 45],
               avg_price: [15000, 20000, 22000, 15000, 15000, 20000, 25000]
             },
             {
               category: 'Trucks',
               models: ['F-Series', 'E-Series', 'Heavy Trucks', 'Tansit' ,'Transit Connect'],
               sales: [100, 70, 15, 20, 0],
               avg_price: [40000, 45000, 30000, 25000, 0]
             },
             {
               category: 'Utilities',
               models: ['Escape', 'Edge', 'Flex', 'Explorer', 'Expedition'],
               sales: [78, 19, 40, 29, 40],
               avg_price: [25000, 20000, 18000, 30000, 40000]
             },
             {
               category: 'Vans',
               models: [],
               sales: [],
               avg_price: []
             },
             {
               category: 'Other',
               models: [],
               sales: [],
               avg_price: []
             }
           ];
           _wonDeals.bar = barData;
            return _wonDeals;
        }



        function lostDeals(){
          var lostDeals = [{
            label: "Cars",
            data: 12,
            color: Util.pieColors()[0],//"#d3d3d3",
          },{
            label: "Trucks",
            data: 5,
            color: Util.pieColors()[1], //"#79d2c0"
          },{
            label: "Utilities",
            data: 30,
            color: Util.pieColors()[2], //"#bababa"
          },{
            label: "Vans",
            data: 32,
            color: Util.pieColors()[3], //"#1ab394"
          },{
            label: "Other",
            data: 17,
            color: Util.pieColors()[4],//"#1ab380"
          }];
          _lostDeals.pie = lostDeals;

          var barData = [
            {
              category: 'Cars',
              models: ['Fiesta', 'Focus', 'C-Max', 'Fusion' ,'Taurus', 'Police Interceptor Sedan', 'Mustang'],
              sales: [40, 20, 5, 20, 44, 1, 5],
              avg_price: [18000, 25000, 20000, 15000, 35000, 25000, 20000]
            },
            {
              category: 'Trucks',
              models: ['F-Series', 'E-Series', 'Heavy Trucks', 'Tansit' ,'Transit Connect'],
              sales: [10, 7, 45, 25, 30],
              avg_price: [50000, 55000, 40000, 35000, 30000]
            },
            {
              category: 'Utilities',
              models: ['Escape', 'Edge', 'Flex', 'Explorer', 'Expedition'],
              sales: [80, 15, 20, 19, 30],
              avg_price: [35000, 24000, 15000, 35000, 55000]
            },
            {
              category: 'Vans',
              models: [],
              sales: [],
              avg_price: []
            },
            {
              category: 'Other',
              models: [],
              sales: [],
              avg_price: []
            }
          ];
          _lostDeals.bar = barData;
          return _lostDeals;
        }


        function totalDeals(){
          var totalDeals = [{
            label: "Cars",
            data: _wonDeals.pie[0].data + _lostDeals.pie[0].data,
            color: Util.pieColors()[0],//"#d3d3d3",
          },{
            label: "Trucks",
            data: _wonDeals.pie[1].data + _lostDeals.pie[1].data,
            color: Util.pieColors()[1], //"#79d2c0"
          },{
            label: "Utilities",
            data: _wonDeals.pie[2].data + _lostDeals.pie[2].data,
            color: Util.pieColors()[2], //"#bababa"
          },{
            label: "Vans",
            data: _wonDeals.pie[3].data + _lostDeals.pie[3].data,
            color: Util.pieColors()[3], //"#1ab394"
          },{
            label: "Other",
            data: _wonDeals.pie[4].data + _lostDeals.pie[4].data,
            color: Util.pieColors()[4],//"#1ab380"
          }];
          _totalDeals.pie = totalDeals;

          var barData = [
            {
              category: 'Cars',
              models: ['Fiesta', 'Focus', 'C-Max', 'Fusion' ,'Taurus', 'Police Interceptor Sedan', 'Mustang'],
              sales: [
              _wonDeals.bar[0].sales[0]+_lostDeals.bar[0].sales[0],
              _wonDeals.bar[0].sales[1]+_lostDeals.bar[0].sales[1],
              _wonDeals.bar[0].sales[2]+_lostDeals.bar[0].sales[2],
              _wonDeals.bar[0].sales[3]+_lostDeals.bar[0].sales[3],
              _wonDeals.bar[0].sales[4]+_lostDeals.bar[0].sales[4],
              _wonDeals.bar[0].sales[5]+_lostDeals.bar[0].sales[5],
              _wonDeals.bar[0].sales[6]+_lostDeals.bar[0].sales[6]
              ],
              avg_price: [
                  (_wonDeals.bar[0].avg_price[0]+_lostDeals.bar[0].avg_price[0])/2 ,
                  (_wonDeals.bar[0].avg_price[1]+_lostDeals.bar[0].avg_price[1])/2 ,
                  (_wonDeals.bar[0].avg_price[2]+_lostDeals.bar[0].avg_price[2])/2 ,
                  (_wonDeals.bar[0].avg_price[3]+_lostDeals.bar[0].avg_price[3])/2 ,
                  (_wonDeals.bar[0].avg_price[4]+_lostDeals.bar[0].avg_price[4])/2 ,
                  (_wonDeals.bar[0].avg_price[5]+_lostDeals.bar[0].avg_price[5])/2 ,
                  (_wonDeals.bar[0].avg_price[6]+_lostDeals.bar[0].avg_price[6])/2
              ]
            },

            {
              category: 'Trucks',
              models: ['F-Series', 'E-Series', 'Heavy Trucks', 'Tansit' ,'Transit Connect'],
              sales: [
                _wonDeals.bar[1].sales[0]+_lostDeals.bar[1].sales[0],
                _wonDeals.bar[1].sales[1]+_lostDeals.bar[1].sales[1],
                _wonDeals.bar[1].sales[2]+_lostDeals.bar[1].sales[2],
                _wonDeals.bar[1].sales[3]+_lostDeals.bar[1].sales[3],
                _wonDeals.bar[1].sales[4]+_lostDeals.bar[1].sales[4]
              ],
              avg_price: [
                (_wonDeals.bar[1].avg_price[0]+_lostDeals.bar[1].avg_price[0])/2,
                (_wonDeals.bar[1].avg_price[1]+_lostDeals.bar[1].avg_price[1])/2,
                (_wonDeals.bar[1].avg_price[2]+_lostDeals.bar[1].avg_price[2])/2,
                (_wonDeals.bar[1].avg_price[3]+_lostDeals.bar[1].avg_price[3])/2,
                (_wonDeals.bar[1].avg_price[4]+_lostDeals.bar[1].avg_price[4])/2
              ]
            },
            {
              category: 'Utilities',
              models: ['Escape', 'Edge', 'Flex', 'Explorer', 'Expedition'],
              sales: [
                _wonDeals.bar[2].sales[0]+_lostDeals.bar[2].sales[0],
                _wonDeals.bar[2].sales[1]+_lostDeals.bar[2].sales[1],
                _wonDeals.bar[2].sales[2]+_lostDeals.bar[2].sales[2],
                _wonDeals.bar[2].sales[3]+_lostDeals.bar[2].sales[3],
                _wonDeals.bar[2].sales[4]+_lostDeals.bar[2].sales[4]
              ],
              avg_price: [
                (_wonDeals.bar[2].avg_price[0]+_lostDeals.bar[2].avg_price[0])/2,
                (_wonDeals.bar[2].avg_price[1]+_lostDeals.bar[2].avg_price[1])/2,
                (_wonDeals.bar[2].avg_price[2]+_lostDeals.bar[2].avg_price[2])/2,
                (_wonDeals.bar[2].avg_price[3]+_lostDeals.bar[2].avg_price[3])/2,
                (_wonDeals.bar[2].avg_price[4]+_lostDeals.bar[2].avg_price[4])/2
              ]
            },
            {
              category: 'Vans',
              models: [],
              sales: [],
              avg_price: []
            },
            {
              category: 'Other',
              models: [],
              sales: [],
              avg_price: []
            }
          ];
          _totalDeals.bar = barData;
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
            total: totalDeals
        };
    });
