'use strict';

angular.module('dealScanCrmApp')
    .factory('Dashboard', function (Auth, User, Util, $q, $filter, $resource, DealResource) {

        /**
         * KPI Constants gola
         * @type {any}
         * @private
         */

        var KPI_CAR_UNITS_GOAL = 50;
        var KPI_CAR_PER_UNIT_GROSS_GOAL = 800;
        var KPI_TRUCK_UNITS_GOAL = 100;
        var KPI_TRUCK_PER_UNIT_GROSS_GOAL = 1600;
        var KPI_USED_UNITS_GOAL = 125;
        var KPI_USED_PER_UNIT_GROSS_GOAL = 2000;

        var KPI_TOTAL_UNITS_GOAL = KPI_CAR_UNITS_GOAL + KPI_TRUCK_UNITS_GOAL + KPI_USED_UNITS_GOAL;
        var KPI_TOTAL_GROSS_GOAL = (KPI_CAR_UNITS_GOAL * KPI_CAR_PER_UNIT_GROSS_GOAL) +
                              (KPI_TRUCK_UNITS_GOAL * KPI_TRUCK_PER_UNIT_GROSS_GOAL) +
                              (KPI_USED_UNITS_GOAL * KPI_USED_PER_UNIT_GROSS_GOAL);


      var _user = Auth.getCurrentUser();
        var _teamMates = {};
        var _wonDeals = {};
        var _lostDeals = {};
        var _totalDeals = {};
        var teamMates = [];
        var safeCb = Util.safeCb;
        var _filters = {dealerships: []};

        var salesData = [];
        var filteredData = [];
        //console.log(salesData);

        function getFilters() {
        return User.getFilters({id:_user.userID})
          .$promise.then(function(filters){
            console.log(filters);
            for(var i = 0; i < filters.length; i++){
              for (var j = 0;  j < filters[i].Teams.length; j++){
                if (filters[i].Teams[j].TeamMembers)
                  filters[i].Teams[j].TeamMembers.unshift({profile: {name: 'Sales Personnel', role: 'Sales Representative', email: ''}});
              }
            }
            return filters;
          }).catch(function(err){
            console.log(err);
            return err;
          })
      }

        function getDeals(searchOptions){
          console.log(searchOptions);
          if (!searchOptions) throw new Error('Please Select Search Options');
          if (!searchOptions.type) throw new Error('Please Select Type');
          if (!searchOptions.dealershipID) throw new Error('Please Select Dealership');
          if (!searchOptions.teamID) throw new Error('Please Select a Team');
          if (!searchOptions.from || !searchOptions.to) throw new Error('Please Select Date Range');
          var query = {};
          query.dealershipID = searchOptions.dealershipID;
          if (searchOptions.employee.MemberID) query.employee = searchOptions.employee.MemberID;
          query.from = searchOptions.from;
          query.to = searchOptions.to;
          salesData.length = 0;
          return DealResource.query(query)
            .$promise.then(function(deals){
             console.log('\n>> DEALS')
             console.log(deals);
             console.log('\n\n================================\n\n');
             if (deals && deals.length > 0){
                 //process deals.
               salesData = deals;
               filteredData = salesData;
               console.log(salesData);
               return filteredData;
             } else return [];
          }).catch(function(err){
             console.log(err);
             return err;
          });
        }

        function filterData(status, sources){
            //var df = $q.defer();
            console.log(status);
            status = status == 'won' ? 'working' : status;
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
                case 'working':
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

        function getKPI(searchOptions){
          if (!searchOptions) throw new Error('SearchOptions is required!');
          if (!searchOptions.dealershipID || searchOptions.dealershipID.trim() == '')
            throw new Error('DealershipID is required');
          return DealResource.getKPI(searchOptions)
            .$promise.then(function(res){
              console.log(res);
              if (res){

              }
          }).catch(function(err){
             console.log(err);
             return err;
          })
          //process data to generate metrics
           /*var metrics = [ {
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
               Category: "Used",
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
           return _metrics;*/
        }

        /**
         *
         * @returns {{remainingDays: number, workingDays: number}}
         */
        function computeWorkingWeeks(options){
          var workWeek = {start:'Monday', end: 'Saturday'};
          if (options) {
            if (options.workWeek) workWeek = options.workWeek;
          }
          var firstWorkWeekStartDay = moment().startOf('month').day(workWeek.start);
          var firstWorkWeekEndDay = moment().startOf('month').day(workWeek.end);
          if (!firstWorkWeekEndDay.isAfter(firstWorkWeekStartDay)) firstWorkWeekEndDay.add(7, 'd');

          var startOfWeek = firstWorkWeekStartDay; //start of week
          var endOfWeek = firstWorkWeekEndDay;// end of week
          var lastDayOfMonth = moment().endOf('month');//end of month

          var workWeeks = [];
          var idx = 1;

          while(!startOfWeek.isAfter(lastDayOfMonth) && !endOfWeek.isAfter(lastDayOfMonth)){
              workWeeks.push({name: 'Week '+idx, start: startOfWeek.clone(), end: endOfWeek.clone()});
              startOfWeek.add(7, 'd');
              endOfWeek.add(7, 'd');
              idx++;
          }

          if (!startOfWeek.isAfter(lastDayOfMonth) && endOfWeek.isAfter(lastDayOfMonth))
              workWeeks.push({name: 'Week '+idx, start:startOfWeek.clone(), end: lastWorkingDay(lastDayOfMonth, workWeek).clone()})

          return workWeeks;
        }

      /**
       *  Return the last working of the month based on the work week and the last day of the month
       * @param lastDay
       * @param workWeek
       * @returns {*}
         */
        function lastWorkingDay(lastDay, workWeek){
          while(!(lastDay.weekday() >= Util.getDayNumber(workWeek.start)
                && lastDay.weekday() <= Util.getDayNumber(workWeek.end)))
            lastDay.subtract(1, 'd');
          return lastDay;
        }

        function computeWorkingDays(options){
          var workingWeeks = computeWorkingWeeks(options);
          var workingDays = 0;
          var currentWeekIdx, located = false, daysWorked = 0;
          for(var i = 0; i < workingWeeks.length; i++) {
            workingDays += (Math.abs(workingWeeks[i].end.diff(workingWeeks[i].start, 'days')) + 1);
            if (!located && moment().isBetween(workingWeeks[i].start, workingWeeks[i].end)){
              currentWeekIdx = i;
              located = true;
            }
          }


          if (located){
            for(var i=0; i <= currentWeekIdx; i++){
              daysWorked += (i == currentWeekIdx ? Math.abs(moment().diff(workingWeeks[i].start, 'days') + 1)
                : (Math.abs(workingWeeks[i].end.diff(workingWeeks[i].start, 'days')) + 1));
            }
            --daysWorked; //current day is excluded
          } else {
            for(var i=0; i < workingWeeks.length; i++) {
              if (!moment().isAfter(workingWeeks[i].start)) {
                currentWeekIdx = i;
                break;
              }
            }
            var remainingWorkDays = 0;
            for(var i = currentWeekIdx; i < workingWeeks.length; i++)
               remainingWorkDays +=  (Math.abs(workingWeeks[i].end.diff(workingWeeks[i].start, 'days')) + 1)
            daysWorked = workingDays - remainingWorkDays;
            --daysWorked; //current day is excluded
          }

          console.log('*** Working Weeks ***');
          console.log(workingWeeks);

          console.log('*** Working Days ***');
          console.log(workingDays);

          console.log('*** Days Worked ****');
          console.log(daysWorked);

          console.log('*** Days Left ***');
          console.log(workingDays - daysWorked);
        }

        console.log('\n\n\n[ --------------------- START ------------------------ ]');
        console.log("Default WorkWeek: Monday - Saturday ");
        computeWorkingDays();
        console.log('[ ---------------------- END ------------------------ ]\n\n\n');

        console.log('\n\n\n[ --------------------- START ------------------------ ]');
        console.log("WorkWeek: Monday - Friday");
        computeWorkingDays({workWeek: {start: 'Monday', end: 'Friday'}});
        console.log('[ ---------------------- END ------------------------ ]\n\n\n');

        console.log('\n\n\n[ --------------------- START ------------------------ ]');
        console.log("WorkWeek: Monday - Thursday");
        computeWorkingDays({workWeek: {start: 'Monday', end: 'Thursday'}});
        console.log('[ ---------------------- END ------------------------ ]\n\n\n');

        function getCategoryCount(arr, category, status){
            var count = 0;
            var pvr = 0;
            for(var i = 0; i < arr.length; i++) {
              if (status) {
                if (arr[i].category == category && arr[i].status == status) {
                  count++;
                  pvr += arr[i].price - arr[i].retailValue;
                }
              } else {
                if (arr[i].category == category) {
                  count++;
                  pvr += arr[i].price - arr[i].retailValue;
                }
              }
            }
            return {count: count, pvr: pvr};
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
          var rs = getCategoryCount(arr, category, status);
          return {models: models, sales: sales, data: rs.count, pvr: rs.pvr, sources: sources};
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
          var cars = getModels(filteredData, "car", "working");
          var trucks = getModels(filteredData, "truck", "working");
          var utilities = getModels(filteredData, "utility", "working");
          var vans = getModels(filteredData, "van", "working");
          var other = getModels(filteredData, "other", "working");
          var wonDeals = [{
                label: "Cars",
                data: cars.data,
                pvr: cars.pvr,
                color: Util.pieColors()[0],//"#d3d3d3",
              },{
                label: "Trucks",
                data: trucks.data,
                pvr: trucks.pvr,
                color: Util.pieColors()[1], //"#79d2c0"
              },{
                label: "Utilities",
                data: utilities.data,
                pvr: utilities.pvr,
                color: Util.pieColors()[2], //"#bababa"
              },{
                label: "Vans",
                data: vans.data,
                pvr: vans.pvr,
                color: Util.pieColors()[3], //"#1ab394"
              },{
                label: "Other",
                data: other.data,
                pvr: other.pvr,
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
               if(value.status == 'working'){
                  tableData.push({
                   vehicleInformation: {
                     vehicleID: value.vehicleID,
                     category: value.category,
                     year: value.year,
                     make: value.make,
                     model: value.model,
                     trim: value.trimLevel,
                   },
                   customerDetails: {
                     customerID: value.customerID,
                     name: value.name,
                     phone: value.phone,
                     email : value.email,
                   },
                   dealDetails: {
                     dealID: value.dealID,
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
          var cars = getModels(filteredData, "car", "lost");
          var trucks = getModels(filteredData, "truck", "lost");
          var utilities = getModels(filteredData, "utility", "lost");
          var vans = getModels(filteredData, "van", "lost");
          var other = getModels(filteredData, "other", "lost");
          var lostDeals = [{
            label: "Cars",
            data: cars.data,
            pvr: cars.pvr,
            color: Util.pieColors()[0],//"#d3d3d3",
          },{
            label: "Trucks",
            data: trucks.data,
            pvr: trucks.pvr,
            color: Util.pieColors()[1], //"#79d2c0"
          },{
            label: "Utilities",
            data: utilities.data,
            pvr: utilities.pvr,
            color: Util.pieColors()[2], //"#bababa"
          },{
            label: "Vans",
            data: vans.data,
            pvr: vans.pvr,
            color: Util.pieColors()[3], //"#1ab394"
          },{
            label: "Other",
            data: other.data,
            pvr: other.pvr,
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
                  make: value.make,
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
          var cars = getModels(filteredData, "car");
          var trucks = getModels(filteredData, "truck");
          var utilities = getModels(filteredData, "utility");
          var vans = getModels(filteredData, "van");
          var other = getModels(filteredData, "other");

          var totalDeals = [{
            label: "Cars",
            data: cars.data,
            pvr: cars.pvr,
            color: Util.pieColors()[0],//"#d3d3d3",
          },{
            label: "Trucks",
            data: trucks.data,
            pvr: trucks.pvr,
            color: Util.pieColors()[1], //"#79d2c0"
          },{
            label: "Utilities",
            data: utilities.data,
            pvr: utilities.pvr,
            color: Util.pieColors()[2], //"#bababa"
          },{
            label: "Vans",
            data: vans.data,
            pvr: vans.pvr,
            color: Util.pieColors()[3], //"#1ab394"
          },{
            label: "Other",
            data: other.data,
            pvr: other.pvr,
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
                  make: value.make,
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
            filters: getFilters,
            kpi: getKPI,
            deals: getDeals,
            won: wonDeals,
            lost: lostDeals,
            total: totalDeals,
            filter: filterData
        };
    });
