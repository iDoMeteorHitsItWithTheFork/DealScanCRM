'use strict';

angular.module('dealScanCrmApp')
    .factory('Dashboard', function (Auth, User, Util, $q, $filter, $resource, DealResource) {

        /**
         * KPI Constants gola
         * @type {any}
         * @private
         */
        var _remainingDays = null;

        function getRemainingDays(){
          return _remainingDays;
        }
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
          if (searchOptions.type.text && searchOptions.type.text.toLowerCase() != 'all') query.type = searchOptions.type.text;
          salesData.length = 0;
          return DealResource.query(query)
            .$promise.then(function(deals){
             console.log('\n>> DEALS')
             console.log(deals);
             console.log('\n\n================================\n\n');
             if (deals && deals.length > 0){
                 //process deals.
               for(var i = 0; i < deals.length; i++){
                 var dl = deals[i];
                 if (dl.geo && dl.geo.lat && dl.geo.lng){
                   var pin = '';
                   if (dl.status == 'won') pin = '../../assets/images/wonDealMarker.png';
                   if (dl.status == 'lost') pin  = '../../assets/images/lostDealMarker.png';
                   dl.geo.marker = {
                     url: pin,
                     scaledSize:[40,40],
                     origin: [0,0],
                     anchor: [21,45]
                   };
                 }
               }
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

        function getKPI(){
          var wrkStats = computeWorkingDays();
          return DealResource.getKPI({})
            .$promise.then(function(res){
              console.log("\n>> KPIS");
              console.log(res);
              console.log('\n___________________________');
              var kpis = [];
              var workingDays = wrkStats.WorkingDays;
              var workedDays = wrkStats.DaysWorked;
              var rWorkDays = wrkStats.RemainingWorkingDays;
              if (res){
                var idx = Util.indexOfObject(res.new, 'Classification', "car");
                var newCarsKpi = {
                    group : "Cars",
                    units : 0,
                    units_goal : KPI_CAR_UNITS_GOAL,
                    gross : 0,
                    gross_goal: KPI_CAR_UNITS_GOAL * KPI_CAR_PER_UNIT_GROSS_GOAL
                };
                if (idx != -1){
                  newCarsKpi.units = res.new[idx].Units;
                  newCarsKpi.gross = res.new[idx].Gross;
                }

                newCarsKpi.tracking = parseFloat(newCarsKpi.units / workedDays).toFixed(2);
                newCarsKpi.delta = rWorkDays > 0 ? parseFloat((KPI_CAR_UNITS_GOAL - newCarsKpi.units) / rWorkDays).toFixed(2) : 0;
                newCarsKpi.trend = newCarsKpi.delta > newCarsKpi.tracking ? 'Up' : 'Steady';
                newCarsKpi.unit_progress = Math.ceil(((newCarsKpi.units * 100)/newCarsKpi.units_goal));
                newCarsKpi.unit_progress_bar = "width: "+Math.ceil(((newCarsKpi.units * 100)/newCarsKpi.units_goal))+"%";
                newCarsKpi.gross_progress = Math.ceil(((newCarsKpi.gross * 100)/newCarsKpi.gross_goal));
                newCarsKpi.gross_progress_bar = "width: "+Math.ceil(((newCarsKpi.gross * 100)/newCarsKpi.gross_goal))+"%";


                kpis.push(newCarsKpi);

                var tIdx = Util.indexOfObject(res.new, 'Classification', "truck");
                var uIdx = Util.indexOfObject(res.new, 'Classification', "utility");
                var vIdx = Util.indexOfObject(res.new, 'Classification', "van");

                var newTrucksKpi = {
                  group: "Trucks",
                  units: 0,
                  units_goal: KPI_TRUCK_UNITS_GOAL,
                  gross: 0,
                  gross_goal: KPI_TRUCK_UNITS_GOAL * KPI_TRUCK_PER_UNIT_GROSS_GOAL
                }

                if (tIdx != -1) {
                  newTrucksKpi.units += res.new[tIdx].Units;
                  newTrucksKpi.gross += res.new[tIdx].Gross;
                }
                if (uIdx != -1) {
                  newTrucksKpi.units += res.new[uIdx].Units;
                  newTrucksKpi.gross += res.new[uIdx].Gross;
                }
                if (vIdx != -1) {
                  newTrucksKpi.units += res.new[vIdx].Units;
                  newTrucksKpi.gross += res.new[vIdx].Gross;
                }

                newTrucksKpi.tracking = parseFloat(newTrucksKpi.units / workedDays).toFixed(2);
                newTrucksKpi.delta = rWorkDays > 0 ? parseFloat((KPI_TRUCK_UNITS_GOAL - newTrucksKpi.units) / rWorkDays).toFixed(2) : 0;
                newTrucksKpi.trend = newTrucksKpi.delta > newTrucksKpi.tracking ? 'Up' : 'Steady';
                newTrucksKpi.unit_progress = Math.ceil((newTrucksKpi.units * 100)/newTrucksKpi.units_goal);
                newTrucksKpi.unit_progress_bar = "width: "+Math.ceil((newTrucksKpi.units * 100)/newTrucksKpi.units_goal)+"%";
                newTrucksKpi.gross_progress = Math.ceil((newTrucksKpi.gross * 100)/newTrucksKpi.gross_goal);
                newTrucksKpi.gross_progress_bar = "width: "+Math.ceil((newTrucksKpi.gross * 100)/newTrucksKpi.gross_goal)+"%";

                kpis.push(newTrucksKpi);

                var usedKpi = {
                  group: "Used",
                  units: 0,
                  units_goal: KPI_USED_UNITS_GOAL,
                  gross: 0,
                  gross_goal: KPI_USED_UNITS_GOAL * KPI_USED_PER_UNIT_GROSS_GOAL
                }

                var uCIdx = Util.indexOfObject(res.used, 'Classification', "car");
                var uTIdx = Util.indexOfObject(res.used, 'Classification', "truck");
                var uUIdx = Util.indexOfObject(res.used, 'Classification', "utility");
                var uVIdx = Util.indexOfObject(res.used, 'Classification', "van");

                if (uCIdx != -1) {
                  usedKpi.units += res.used[uCIdx].Units;
                  usedKpi.gross += res.used[uCIdx].Gross;
                }
                if (uTIdx != -1) {
                  usedKpi.units += res.used[uTIdx].Units;
                  usedKpi.gross += res.used[uTIdx].Gross;
                }
                if (uUIdx != -1) {
                  usedKpi.units += res.used[uUIdx].Units;
                  usedKpi.gross += res.used[uUIdx].Gross;
                }
                if (uVIdx != -1) {
                  usedKpi.units += res.used[uVIdx].Units;
                  usedKpi.gross += res.used[uVIdx].Gross;
                }


                usedKpi.tracking = parseFloat(usedKpi.units / workedDays).toFixed(2);
                usedKpi.delta = rWorkDays > 0 ? parseFloat((KPI_USED_UNITS_GOAL - usedKpi.units) / rWorkDays).toFixed(2) : 0;
                usedKpi.trend = usedKpi.delta > usedKpi.tracking ? 'Up' : 'Steady';
                usedKpi.unit_progress = Math.ceil((usedKpi.units * 100)/usedKpi.units_goal);
                usedKpi.gross_progress = Math.ceil((usedKpi.gross * 100)/usedKpi.gross_goal);
                usedKpi.unit_progress_bar = "width: "+((usedKpi.units * 100)/usedKpi.units_goal)+"%";
                usedKpi.gross_progress_bar = 'width: '+((usedKpi.gross * 100)/usedKpi.gross_goal)+"%";

                kpis.push(usedKpi);

                var totalKpi = {
                  group: "Total",
                  units: newCarsKpi.units + newTrucksKpi.units + usedKpi.units,
                  units_goal: KPI_TOTAL_UNITS_GOAL,
                  gross: newCarsKpi.gross + newTrucksKpi.gross + usedKpi.gross,
                  gross_goal: KPI_TOTAL_GROSS_GOAL
                }

                totalKpi.tracking = parseFloat(totalKpi.units / workedDays).toFixed(2);
                totalKpi.delta = rWorkDays > 0 ? parseFloat((KPI_TOTAL_UNITS_GOAL - totalKpi.units) / rWorkDays).toFixed(2) : 0;
                totalKpi.trend = totalKpi.delta > totalKpi.tracking ? 'Up' : 'Steady';
                totalKpi.unit_progress = Math.ceil((totalKpi.units * 100)/totalKpi.units_goal);
                totalKpi.gross_progress = Math.ceil((totalKpi.gross * 100)/totalKpi.gross_goal);
                totalKpi.unit_progress_bar = "width: "+((totalKpi.units * 100)/totalKpi.units_goal)+"%";
                totalKpi.gross_progress_bar = 'width: '+((totalKpi.gross * 100)/totalKpi.gross_goal)+"%";

                kpis.push(totalKpi);

                return {KPI:kpis, WorkedDays: workedDays, RemainingWorkingDays: rWorkDays};
              }
          }).catch(function(err){
             console.log(err);
             return err;
          });
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

          _remainingDays = workingDays - daysWorked;

          return {WorkingWeeks:workingWeeks, WorkingDays: workingDays, DaysWorked: daysWorked, RemainingWorkingDays: (workingDays - daysWorked)};
        }

       /* console.log('\n\n\n[ --------------------- START ------------------------ ]');
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
        console.log('[ ---------------------- END ------------------------ ]\n\n\n');*/

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
           var models = [], _models = [];
           var sales = [];
           var sources = [];
           for(var i=0; i < arr.length; i++){
             if (status){
               if (sources.indexOf(arr[i].source) == -1 && arr[i].status == status) sources.push(arr[i].source);
               if (arr[i].category == category && arr[i].status == status && models.indexOf(arr[i].model) == -1){
                 models.push(arr[i].model);
                 _models.push({name: arr[i].model, state: true});
                 sales.push(getModelSales(arr, arr[i].model, status));
               }
             } else {
               if (sources.indexOf(arr[i].source) == -1) sources.push(arr[i].source);
               if (arr[i].category == category  && models.indexOf(arr[i].model) == -1){
                 models.push(arr[i].model);
                 _models.push({name: arr[i].model, state: true});
                 sales.push(getModelSales(arr, arr[i].model));
               }
             }
           }
          var rs = getCategoryCount(arr, category, status);
          return {models: models, map: _models,  sales: sales, data: rs.count, pvr: rs.pvr, sources: sources};
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
          var cars = getModels(filteredData, "car", "won");
          var trucks = getModels(filteredData, "truck", "won");
          var utilities = getModels(filteredData, "utility", "won");
          var vans = getModels(filteredData, "van", "won");
          var other = getModels(filteredData, "other", "won");
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
               if(value.status == 'won'){
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
                  customerID: value.customerID,
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


          var map = [
            {
              category: 'Cars',
              models: cars.map
            },
            {
              category: 'Trucks',
              models: trucks.map
            },
            {
              category: 'Utilities',
              models: utilities.map
            },
            {
              category: 'Vans',
              models: vans.map
            },
            {
              category: 'Other',
              models: other.map
            },
          ]
          _totalDeals.map = map;
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
                  customerID: value.customerID,
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

        function filterMap(category, status){
            var _arr;
            switch(category.toLowerCase()){
              case 'cars':
              case 'car':
                _arr = _totalDeals.map[0].models;
                break;
              case 'trucks':
              case 'truck':
                _arr = _totalDeals.map[1].models;
                break;
              case 'utilities':
              case 'utility':
                _arr = _totalDeals.map[2].models;
                break;
              case 'Vans':
              case 'van':
                _arr = _totalDeals.map[3].models;
                break;
              case 'Other':
              case 'other':
                _arr = _totalDeals.map[4].models;
                break;
            }
            var m = $filter('filter')(_arr, function(val, idx, arr){
              return val.state
            })
            console.log('\n\n\n MODELS TO FILTER  \n\n\n');
            console.log(m);
            console.log('\n\n\n ======================== \n\n');
            var filteredMapData = $filter('filter')(filteredData, function(val, idx, arr){
              return val.category == category.toLowerCase() && Util.indexOfObject(m, 'name', val.model) != -1 && (status ? status == val.status : true);
            });
            console.log('\n\n\n MAP DATA FILTERED BY MODEL  \n\n\n');
            console.log(filteredMapData);
            console.log('\n\n\n +++++++++++++++++ \n\n\n');
            return filteredMapData;
        }

        function getfilteredData(){
          return filteredData;
        }


        // Public API here
        return {
            filters: getFilters,
            kpi: getKPI,
            getRemainingDays: getRemainingDays,
            deals: getDeals,
            won: wonDeals,
            lost: lostDeals,
            total: totalDeals,
            filter: filterData,
            filterMap: filterMap,
            sales: getfilteredData
        };
    });
