'use strict';
angular.module('dealScanCrmApp')
  .factory('BDC', function (Auth, User, Util, $q, $filter, $resource, LeadResource) {


    var _leads = [];
    var _appointments = [];
    var _totalLeads = {};
    var _totalAppointments = {};
    var _keptAppointments = {};
    var _missedAppointments = {};
    var _soldAppointments = {};


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
      return $q.all(promises).then(function (results) {
        var totalLeads = results[0];
        var totalAppointments = results[1];
        var keptAppointments = results[2];
        var missedAppointments = results[3];
        var soldAppointments = results[4];
        return {totalLeads: totalLeads,
                totalAppointments: totalAppointments,
                keptAppointments: keptAppointments,
                missedAppointments: missedAppointments,
                soldAppointments: soldAppointments};
      }).catch(function (err) {
        console.log(err);
        return err;
      });
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
          if (leads) {
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
            _totalLeads.tableData = leads.data;

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
            console.log(appointments);
            if (appointments) {
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
              for (var i = 0; i < TOP_LIMIT; i++) {
                totalAppointments.push({
                  label: appointments.stats[i].Source,
                  data: appointments.stats[i].Appointments,
                  color: Util.pieColorsBySource(appointments.stats[i].Source),//"#d3d3d3",};
                });
              }

              _totalAppointments.pie = totalAppointments;
              _totalAppointments.pieOptions = pieOptions;
              _totalAppointments.tableData = appointments.data;

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
          console.log(appointments);
          if (appointments) {
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
            for (var i = 0; i < TOP_LIMIT; i++) {
              missedAppointments.push({
                label: appointments.stats[i].Source,
                data: appointments.stats[i].Appointments,
                color: Util.pieColorsBySource(appointments.stats[i].Source),//"#d3d3d3",};
              });
            }

            _missedAppointments.pie = missedAppointments;
            _missedAppointments.pieOptions = pieOptions;
            _missedAppointments.tableData = appointments.data;

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
          console.log(appointments);
          if (appointments) {
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
            for (var i = 0; i < TOP_LIMIT; i++) {
              keptAppointments.push({
                label: appointments.stats[i].Source,
                data: appointments.stats[i].Appointments,
                color: Util.pieColorsBySource(appointments.stats[i].Source),//"#d3d3d3",};
              });
            }

            _keptAppointments.pie = keptAppointments;
            _keptAppointments.pieOptions = pieOptions;
            _keptAppointments.tableData = appointments.data;

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
          console.log(appointments);
          if (appointments) {
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
            for (var i = 0; i < TOP_LIMIT; i++) {
              soldAppointments.push({
                label: appointments.stats[i].Source,
                data: appointments.stats[i].Appointments,
                color: Util.pieColorsBySource(appointments.stats[i].Source),//"#d3d3d3",};
              });
            }

            _soldAppointments.pie = soldAppointments;
            _soldAppointments.pieOptions = pieOptions;
            _soldAppointments.tableData = appointments.data;

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
      soldAppointments: soldAppointments
    }
  })

