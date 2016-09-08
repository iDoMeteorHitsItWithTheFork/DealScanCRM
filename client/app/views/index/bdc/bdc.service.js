'use strict';
angular.module('dealScanCrmApp')
  .factory('BDC', function (Auth, User, Util, $q, $filter, $resource, LeadResource, Lead) {


    var _leads = [];
    var _appointments = [];
    var _totalLeads = {};
    var _totalAppointments = {};
    var _keptAppointments = {};
    var _missedAppointments = {};
    var _soldAppointments = {};




    function updateLeads(data){


    }

    var TOP_LIMIT  = 5;

      /**
       * Get Leads
       */
    function getLeads() {
      var promises = [];
      promises.push(totalLeads());
      promises.push(totalAppointments());
      promises.push(keptAppointments());
      promises.push(missedAppointments());
      promises.push(soldAppointments());
      promises.push(sentMessages());

      return $q.all(promises).then(function (results) {
        return {totalLeads: results[0],
                totalAppointments: results[1],
                keptAppointments: results[2],
                missedAppointments: results[3],
                soldAppointments: results[4],
                sentMessages: results[5]};
      }).catch(function (err) {
        console.log(err);
        return err;
      });
    }


    function sentMessages(){
      return LeadResource.sentMessages().$promise
        .then(function(messages){
        console.log(messages);
        if (messages){
          for(var i = 0; i < messages.messages.length; i++){
            var msg = messages.messages[i];
            msg.lead.timeline = Lead.timeline(msg.lead);
            msg.lead.notes = $filter('orderBy')(msg.lead.notes, "createdAt", true);
            msg.lead.appointments = $filter('orderBy')(msg.lead.appointments, "createdAt", true);
            msg.lead.agents = $filter('orderBy')(msg.lead.agents, "createdAt", true);
            msg.lead.name = Util.slimTrim(msg.lead.name);
            msg.timeAgo = moment(msg.createdAt).fromNow();
            if (msg.lead.interest && msg.lead.interest.trim() != ''){
              try {
                var js = JSON.parse(msg.lead.interest);
                var parseInterest = '';
                if (js.type) parseInterest += js.type;
                if (js.year) parseInterest += ' '+js.year;
                if (js.make) parseInterest += ' '+js.make;
                if (js.model) parseInterest += ' '+js.model;
                if (js.hasOwnProperty('trim') || js.trimlevel || js.trimLevel) parseInterest += ' '+ (js['trim'] || js.trimlevel || js.trimLevel);
                if (js.vin || js.VIN || js.vinnumber || js.vinNumber) parseInterest += ' '+(js.vin || js.VIN || js.vinnumber || js.vinNumber);
                if (js.stocknumber || js.stockNumber) parseInterest += ' '+(js.stocknumber || js.stockNumber);
                msg.lead.interest = Util.slimTrim(parseInterest);
              } catch(ex){}
            }
          }
          return {messages: messages.messages, count: messages.count};
        }
        else return {error: {code: '', msg:''}};
      }).catch(function(err){
         console.log(err);
         return err;
      })
    }



    function extractAppointments(){
      _appointments.length = 0;
      for(var i = 0; i < _leads.length; i++)
        _appointments = _appointments.concat(_leads[i].appointments);
      console.log('\n\n\n>> Appointments');
      console.log(_appointments);
      console.log('\n\n **********************');
    }


    function getSourceTypeCount(arr, sourceType, status){
      var count = 0;
      for(var i = 0; i < arr.length; i++) {
        if (status){
          if (arr[i].sourceType == sourceType && arr[i].status == status)
            count++;
        } else {
            if (arr[i].sourceType == sourceType)
              count++;
        }
      }
      return count;
    }

    function getSourceNames(arr, sourceType, status){
      var sourceNames = [];
      var leads = [];
      for(var i=0; i < arr.length; i++){
          if (status){
            if (arr[i].sourceType == sourceType && sourceNames.indexOf(arr[i].sourceName) == -1 && arr[i].status == status) {
              sourceNames.push(arr[i].sourceName);
              leads.push(getSourceNameLeads(arr, arr[i].sourceName));
            }
          } else {
            if (arr[i].sourceType == sourceType && sourceNames.indexOf(arr[i].sourceName) == -1) {
              sourceNames.push(arr[i].sourceName);
              leads.push(getSourceNameLeads(arr, arr[i].sourceName));
            }
          }
      }
      return {sourceNames: sourceNames, leads: leads, data: getSourceTypeCount(arr, sourceType, status)};
    }

    function getSourceNameLeads(arr, sourceName, status){
      var leads = 0;
      for(var i=0; i < arr.length; i++){
        if (status){
          if (arr[i].sourceName == sourceName && arr[i].status == status)
            leads++;
        } else {
          if (arr[i].sourceName == sourceName) leads++;
        }
      }
      return leads;
    }

    /**
     * generate data for won deals
     */
    function totalLeads(){
      //process data to generate won deals
      return LeadResource.totalLeads()
        .$promise.then(function(leads){
          console.log('\n\n\n LEADS   \n\n\n');
          console.log(leads);
          console.log('\n\n\n ________________ \n\n\n');
          if (leads && leads.stats && leads.stats.length > 0 && leads.sourceSummary && leads.sourceSummary.length > 0) {
            var threshold = 0;
            if (leads.stats.length > TOP_LIMIT) {
              threshold = (leads.stats[TOP_LIMIT].Percentage) / 100;
            }


            /* Set total lead Pie Options */
            var pieOptions = {
              series: {
                pie: {
                  show: true,
                  combine: {
                    color: Util.pieColorsBySource('other'),
                    threshold: threshold
                  }
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

            var totalDeals = [];
            for (var i = 0; i < TOP_LIMIT; i++) {
              totalDeals.push({
                label: leads.stats[i].Source,
                data: leads.stats[i].Leads,
                color: Util.pieColorsBySource(leads.stats[i].Source),//"#d3d3d3",};
              });
            }

            _totalLeads.pie = totalDeals;
            _totalLeads.pieOptions = pieOptions;

            for(var i = 0; i < leads.data.length; i++){
              leads.data[i].timeline = Lead.timeline(leads.data[i]);
              leads.data[i].agents = $filter('orderBy')(leads.data[i].agents, "createdAt", true);
              if (leads.data[i].interest && leads.data[i].interest.trim() != ''){
                try {
                  var js = JSON.parse(leads.data[i].interest);
                  var parseInterest = '';
                  if (js.type) parseInterest += js.type;
                  if (js.year) parseInterest += ' '+js.year;
                  if (js.make) parseInterest += ' '+js.make;
                  if (js.model) parseInterest += ' '+js.model;
                  if (js.hasOwnProperty('trim') || js.trimlevel || js.trimLevel) parseInterest += ' '+ (js['trim'] || js.trimlevel || js.trimLevel);
                  if (js.vin || js.VIN || js.vinnumber || js.vinNumber) parseInterest += ' '+(js.vin || js.VIN || js.vinnumber || js.vinNumber);
                  if (js.stocknumber || js.stockNumber) parseInterest += ' '+(js.stocknumber || js.stockNumber);
                  leads.data[i].interest = Util.slimTrim(parseInterest);
                } catch(ex){}
              }
            }
             leads.data = $filter('orderBy')(leads.data, 'createdAt', true);
            _totalLeads.tableData = leads.data;
            _totalLeads.sourceSummary = leads.sourceSummary;

             return _totalLeads;

          } else return [];

      }).catch(function(err){
          console.log(err);
          return err;
        });
    }

      /**
       * Get Appointment scheduled
       */
      function totalAppointments(){
        //process data to generate won deals
        return LeadResource.totalAppointments()
          .$promise.then(function(appointments){
            console.log('\n\n\n TOTAL APPOINTMENTS   \n\n\n');
            console.log(appointments);
            console.log('\n\n\n ________________ \n\n\n');
            if (appointments && appointments.stats && appointments.stats.length > 0 && appointments.sourceSummary && appointments.sourceSummary.length > 0) {
              var threshold = 0;
              if (appointments.stats.length > TOP_LIMIT) {
                threshold = (appointments.stats[TOP_LIMIT].Percentage) / 100;
              }
              /* Set total lead Pie Options */
              var pieOptions = {
                series: {
                  pie: {
                    show: true,
                    combine: {
                      color: Util.pieColorsBySource('source'),
                      threshold: threshold
                    }
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

              var totalAppointments = [];
              for (var i = 0; i < TOP_LIMIT && i < appointments.stats.length; i++) {
                totalAppointments.push({
                  label: appointments.stats[i].Source,
                  data: appointments.stats[i].Appointments,
                  color: Util.pieColorsBySource(appointments.stats[i].Source),//"#d3d3d3",};
                });
              }

              for(var i = 0; i < appointments.data.length; i++){
                appointments.data[i].timeline = Lead.timeline(appointments.data[i]);
                appointments.data[i].agents = $filter('orderBy')(appointments.data[i].agents, "createdAt", true);
                if (appointments.data[i].interest && appointments.data[i].interest.trim() != ''){
                  try {
                    var js = JSON.parse(appointments.data[i].interest);
                    var parseInterest = '';
                    if (js.type) parseInterest += js.type;
                    if (js.year) parseInterest += ' '+js.year;
                    if (js.make) parseInterest += ' '+js.make;
                    if (js.model) parseInterest += ' '+js.model;
                    if (js.hasOwnProperty('trim') || js.trimlevel || js.trimLevel) parseInterest += ' '+ (js['trim'] || js.trimlevel || js.trimLevel);
                    if (js.vin || js.VIN || js.vinnumber || js.vinNumber) parseInterest += ' '+(js.vin || js.VIN || js.vinnumber || js.vinNumber);
                    if (js.stocknumber || js.stockNumber) parseInterest += ' '+(js.stocknumber || js.stockNumber);
                    appointments.data[i].interest = Util.slimTrim(parseInterest);
                  } catch(ex){}
                }
              }
              appointments.data = $filter('orderBy')(appointments.data, 'createdAt', true);

              _totalAppointments.pie = totalAppointments;
              _totalAppointments.pieOptions = pieOptions;
              _totalAppointments.tableData = appointments.data;
              _totalAppointments.sourceSummary = appointments.sourceSummary;

              return _totalAppointments;

            } else return [];

          }).catch(function(err){
            console.log(err);
            return err;
          });

     }


    /**
     * Get Appointment Missed
     */
    function missedAppointments(){
      //process data to generate won deals
      return LeadResource.missedAppointments()
        .$promise.then(function(appointments){
          console.log('\n\n\n MISSED APPOINTMENTS   \n\n\n');
          console.log(appointments);
          console.log('\n\n\n ________________ \n\n\n');
          if (appointments && appointments.stats && appointments.stats.length > 0 && appointments.sourceSummary && appointments.sourceSummary.length > 0) {
            var threshold = 0;
            if (appointments.stats.length > TOP_LIMIT) {
              threshold = (appointments.stats[TOP_LIMIT].Percentage) / 100;
            }
            /* Set total lead Pie Options */
            var pieOptions = {
              series: {
                pie: {
                  show: true,
                  combine: {
                    color: Util.pieColorsBySource('other'),
                    threshold: threshold
                  }
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

            var missedAppointments = [];
            for (var i = 0; i < TOP_LIMIT  && i < appointments.stats.length; i++) {
              missedAppointments.push({
                label: appointments.stats[i].Source,
                data: appointments.stats[i].Appointments,
                color: Util.pieColorsBySource(appointments.stats[i].Source),//"#d3d3d3",};
              });
            }

            for(var i = 0; i < appointments.data.length; i++){
              appointments.data[i].timeline = Lead.timeline(appointments.data[i]);
              appointments.data[i].agents = $filter('orderBy')(appointments.data[i].agents, "createdAt", true);
              if (appointments.data[i].interest && appointments.data[i].interest.trim() != ''){
                try {
                  var js = JSON.parse(appointments.data[i].interest);
                  var parseInterest = '';
                  if (js.type) parseInterest += js.type;
                  if (js.year) parseInterest += ' '+js.year;
                  if (js.make) parseInterest += ' '+js.make;
                  if (js.model) parseInterest += ' '+js.model;
                  if (js.hasOwnProperty('trim') || js.trimlevel || js.trimLevel) parseInterest += ' '+ (js['trim'] || js.trimlevel || js.trimLevel);
                  if (js.vin || js.VIN || js.vinnumber || js.vinNumber) parseInterest += ' '+(js.vin || js.VIN || js.vinnumber || js.vinNumber);
                  if (js.stocknumber || js.stockNumber) parseInterest += ' '+(js.stocknumber || js.stockNumber);
                  appointments.data[i].interest = Util.slimTrim(parseInterest);
                } catch(ex){}
              }
            }
            appointments.data = $filter('orderBy')(appointments.data, 'createdAt', true);

            _missedAppointments.pie = missedAppointments;
            _missedAppointments.pieOptions = pieOptions;
            _missedAppointments.tableData = appointments.data;
            _missedAppointments.sourceSummary = appointments.sourceSummary;

            return _missedAppointments;

          } else return [];

        }).catch(function(err){
          console.log(err);
          return err;
        });

    }


    /**
     * Get Appointment Kept
     */
    function keptAppointments(){
      //process data to generate won deals
      return LeadResource.keptAppointments()
        .$promise.then(function(appointments){
          console.log('\n\n\n KEPT APPOINTMENTS   \n\n\n');
          console.log(appointments);
          console.log('\n\n\n ________________ \n\n\n');
          if (appointments && appointments.stats && appointments.stats.length > 0 && appointments.sourceSummary && appointments.sourceSummary.length > 0) {
            var threshold = 0;
            if (appointments.stats.length > TOP_LIMIT) {
              threshold = (appointments.stats[TOP_LIMIT].Percentage) / 100;
            }
            /* Set total lead Pie Options */
            var pieOptions = {
              series: {
                pie: {
                  show: true,
                  combine: {
                    color: Util.pieColorsBySource('other'),
                    threshold: threshold
                  }
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

            var keptAppointments = [];
            for (var i = 0; i < TOP_LIMIT  && i < appointments.stats.length; i++) {
              keptAppointments.push({
                label: appointments.stats[i].Source,
                data: appointments.stats[i].Appointments,
                color: Util.pieColorsBySource(appointments.stats[i].Source),//"#d3d3d3",};
              });
            }

            for(var i = 0; i < appointments.data.length; i++){
              appointments.data[i].timeline = Lead.timeline(appointments.data[i]);
              appointments.data[i].agents = $filter('orderBy')(appointments.data[i].agents, "createdAt", true);
              if (appointments.data[i].interest && appointments.data[i].interest.trim() != ''){
                try {
                  var js = JSON.parse(appointments.data[i].interest);
                  var parseInterest = '';
                  if (js.type) parseInterest += js.type;
                  if (js.year) parseInterest += ' '+js.year;
                  if (js.make) parseInterest += ' '+js.make;
                  if (js.model) parseInterest += ' '+js.model;
                  if (js.hasOwnProperty('trim') || js.trimlevel || js.trimLevel) parseInterest += ' '+ (js['trim'] || js.trimlevel || js.trimLevel);
                  if (js.vin || js.VIN || js.vinnumber || js.vinNumber) parseInterest += ' '+(js.vin || js.VIN || js.vinnumber || js.vinNumber);
                  if (js.stocknumber || js.stockNumber) parseInterest += ' '+(js.stocknumber || js.stockNumber);
                  appointments.data[i].interest = Util.slimTrim(parseInterest);
                } catch(ex){}
              }
            }
            appointments.data = $filter('orderBy')(appointments.data, 'createdAt', true);

            _keptAppointments.pie = keptAppointments;
            _keptAppointments.pieOptions = pieOptions;
            _keptAppointments.tableData = appointments.data;
            _keptAppointments.sourceSummary = appointments.sourceSummary;

            return _keptAppointments;

          } else return [];

        }).catch(function(err){
          console.log(err);
          return err;
        });
    }

    /**
     * Get Appointment Sold
     */
    function soldAppointments(){
      //process data to generate won deals
      return LeadResource.soldAppointments()
        .$promise.then(function(appointments){
          console.log('\n\n\n SOLD APPOINTMENTS   \n\n\n');
          console.log(appointments);
          console.log('\n\n\n ________________ \n\n\n');
          if (appointments && appointments.stats && appointments.stats.length > 0 && appointments.sourceSummary && appointments.sourceSummary.length > 0) {
            var threshold = 0;
            if (appointments.stats.length > TOP_LIMIT) {
              threshold = (appointments.stats[TOP_LIMIT].Percentage) / 100;
            }
            /* Set total lead Pie Options */
            var pieOptions = {
              series: {
                pie: {
                  show: true,
                  combine: {
                    color: Util.pieColorsBySource('other'),
                    threshold: threshold
                  }
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

            var soldAppointments = [];
            for (var i = 0; i < TOP_LIMIT  && i < appointments.stats.length; i++) {
              soldAppointments.push({
                label: appointments.stats[i].Source,
                data: appointments.stats[i].Appointments,
                color: Util.pieColorsBySource(appointments.stats[i].Source),//"#d3d3d3",};
              });
            }

            for(var i = 0; i < appointments.data.length; i++){
              appointments.data[i].timeline = Lead.timeline(appointments.data[i]);
              appointments.data[i].agents = $filter('orderBy')(appointments.data[i].agents, "createdAt", true);
              if (appointments.data[i].interest && appointments.data[i].interest.trim() != ''){
                try {
                  var js = JSON.parse(appointments.data[i].interest);
                  var parseInterest = '';
                  if (js.type) parseInterest += js.type;
                  if (js.year) parseInterest += ' '+js.year;
                  if (js.make) parseInterest += ' '+js.make;
                  if (js.model) parseInterest += ' '+js.model;
                  if (js.hasOwnProperty('trim') || js.trimlevel || js.trimLevel) parseInterest += ' '+ (js['trim'] || js.trimlevel || js.trimLevel);
                  if (js.vin || js.VIN || js.vinnumber || js.vinNumber) parseInterest += ' '+(js.vin || js.VIN || js.vinnumber || js.vinNumber);
                  if (js.stocknumber || js.stockNumber) parseInterest += ' '+(js.stocknumber || js.stockNumber);
                  appointments.data[i].interest = Util.slimTrim(parseInterest);
                } catch(ex){}
              }
            }

            appointments.data = $filter('orderBy')(appointments.data, 'createdAt', true);

            _soldAppointments.pie = soldAppointments;
            _soldAppointments.pieOptions = pieOptions;
            _soldAppointments.tableData = appointments.data;
            _soldAppointments.sourceSummary = appointments.sourceSummary;

            return _soldAppointments;

          } else return [];

        }).catch(function(err){
          console.log(err);
          return err;
        });
    }


    return {
      graphData: getLeads,
      totalLeads: totalLeads,
      totalAppointments: totalAppointments,
      keptAppointments: keptAppointments,
      missedAppointments: missedAppointments,
      soldAppointments: soldAppointments,
      update: updateLeads
    }
  })

