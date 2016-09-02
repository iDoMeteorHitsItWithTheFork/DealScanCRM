
angular.module('dealScanCrmApp').controller('BDCCtrl',

    function ($scope, $state, $uibModal,$anchorScroll, Auth, Util, BDC, appConfig, DTOptionsBuilder, $filter, Lead, toaster) {
      $("#page-wrapper").css("overflow-x", "scroll");

      console.log("dashboard controller loaded");
      var _bdc = this;

      _bdc.user = Auth.getCurrentUser();
      _bdc.isAdmin = Auth.isAdmin;
      _bdc.isManager = false;
      _bdc.isGM = false;
      _bdc.showTable = false;
      _bdc.sidebar = false;
      _bdc.openChat = false;
      _bdc.loadingLeads = false;
      _bdc.savingAppointment  = false;
      _bdc.savingNote = false;
      _bdc.assigningLead = false;
      _bdc.note = {content: ''};
      _bdc.dealers = Auth.getDealerships();

      _bdc.leads = [];
      Auth.hasRole(appConfig.userRoles[2], function (ans) {
        _bdc.isManager = ans;
      });

      Auth.hasRole(appConfig.userRoles[7], function (ans) {
        _bdc.isGM = ans;
      })


      _bdc.viewOptions = 'charts';
      _bdc.showBarChart = false;
      _bdc.selectedPie = null;
      _bdc.showTable = false;
      _bdc.showTableDetails = false;

      _bdc.tabs = [
        {
          id: 'new_leads',
          title: 'New',
          icon: 'fa fa-bolt'
        },
        {
          id: 'working',
          title: 'Working',
          icon: 'fa fa-cog fa-spin'
        },
        {
          id: 'missed',
          title: 'Missed',
          icon: 'fa fa-exclamation-triangle'
        }
      ]

      _bdc.activeTab = _bdc.tabs[0];
      _bdc.viewTab = function(tab){
        _bdc.activeTab = tab;
      }


      _bdc.loadLeads = function(){
        if (_bdc.loadingLeads) return;
        _bdc.loadingLeads = true;
        Lead.leads().then(function(leads){
          console.log(leads);
          if (leads && !leads.error){
            _bdc.leads = leads;
            _bdc.categorizedLeads();
          } else toaster.error({title: 'Leads Load Error', body:'An error occured while attempting to load leads'});
          _bdc.loadingLeads = false;
        }).catch(function(err){
          console.log(err);
          _bdc.loadingLeads = false;
          toaster.error({title: 'Leads Load Error', body: 'An error occurred while attempting to load leads.'})
        });
      }

      _bdc.loadLeads();
      _bdc.activeLead = null;
      _bdc.showInDetails = function(lead){
        _bdc.activeLead = lead;
        if (lead.agents && lead.agents.length == 0){
          if (_bdc.assigningLead) return;
          _bdc.assigningLead = true;
          Lead.assign(lead).then(function(res){
              _bdc.assigningLead = false;
              if (res === true) toaster.success({title: 'Lead Assignment', body: 'Lead ('+lead.name+') is now assigned to you!'})
              else toaster.error({title: 'Lead Error', body: 'An error occured while attempting to assign lead'});
              console.log(lead);
              _bdc.categorizedLeads();
          }).catch(function(err){
              _bdc.assigningLead = false;
              console.log(err);
              return err;
          })
        }
      }

      _bdc.categorizedLeads = function(){

        _bdc.new_leads = $filter('filter')(_bdc.leads, function(value, index, arr){
          return value.status == 'new' && moment(value.createdAt).unix() >= moment().startOf('day').unix() && moment(value.createdAt).unix() <= moment().endOf('day').unix();
        })
        _bdc.working_leads = $filter('filter')(_bdc.leads, function(value, index, arr){
          return value.status == 'working';
        });
        _bdc.follow_up_leads = $filter('filter')(_bdc.leads, function(value, index, arr){
          return value.status == 'missed' || (value.status == 'new'  && ( value.appointments && value.appointments.length == 0) && moment(value.createdAt).unix() <  moment().startOf('day').unix());
        });
      }

      /**
       * Retreive Graph Data From Service
       */
      _bdc.getGraphData = function(){
        if (_bdc.retreivingGraphData) return;
        _bdc.retreivingGraphData = true;
        console.log('**** GETTING GRAPH DATA *****');
    /*    var searchOptions = {};
        searchOptions.type = _dashboard.selectedType;
        searchOptions.dealershipID = _dashboard.selectedDealership.DealershipID;
        searchOptions.teamID = _dashboard.selectedTeam.TeamID;
        searchOptions.employee = _dashboard.selectedEmployee;
        searchOptions.from = _dashboard.dateRange.startDate.format('YYYY/MM/DD');
        searchOptions.to = _dashboard.dateRange.endDate.format('YYYY/MM/DD');*/
        //console.log(searchOptions);
        BDC.graphData().then(function(leads){
          console.log('\n\n\n\ GRAPH DATA \n\n\n');
          console.log(leads);
          if (leads){
            _bdc.totalLeads = leads.totalLeads;
            _bdc.totalAppointments = leads.totalAppointments;
            _bdc.keptAppointments = leads.keptAppointments;
            _bdc.missedAppointments = leads.missedAppointments;
            _bdc.soldAppointments = leads.soldAppointments;
          }
          _bdc.retreivingGraphData = false;
        }).catch(function(err){
          _bdc.retreivingGraphData = false;
          console.log(err);
          toaster.error({title: 'Leads Load Error', body: 'An Error occurred while attempting to retreive leads data'});
        });
      }

      _bdc.getGraphData();

      /**
       * Pie Chart Data
       */

      /**
       * Pie Chart Display Options
       */
      _bdc.pieOptions = {
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
          cssClass: 'flotTip',
          content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
          defaultTheme: false
        }
      };

        /**
         * Get formatted Chart Data
         * @param status
         * @returns {*}
         */
      var getDealsData = function(status){
        var deals;
        switch(status.toLowerCase()){
          case 'total leads':
            deals = _bdc.totalLeads.tableData;
            break;
          case 'scheduled appointments':
            deals = _bdc.totalAppointments.tableData;
            break;
          case 'kept appointments':
            deals = _bdc.keptAppointments.tableData;
            break;
          case 'missed appointments':
            deals = _bdc.missedAppointments.tableData;
            break;
          case 'sold appointments':
            deals = _bdc.soldAppointments.tableData;
            break;
        }
        return deals;
      }

      /**
       *
       * @type {{category: string, status: string}}
       */

      _bdc.sectionTitle = {category: '', status: ''};

        /**
         * Initialize TableData For Selection
         * @param chart
         * @param status
         * @param category
         */
      _bdc.setTableData = function(chart, status, category){
        console.log(chart);
        console.log(status);
        console.log(category);
        _bdc.sectionTitle.status = status;
        _bdc.sectionTitle.category = chart ? chart.series.label: '';

        var tableData = getDealsData(_bdc.sectionTitle.status);
        console.log(tableData);
        console.log(_bdc.sectionTitle.category);
        var data = $filter('filter')(tableData, function(val, idx, arr){
          return val.sourceName == _bdc.sectionTitle.category;
        });
        console.log(data);
        $scope.$applyAsync(function(){
          _bdc.dealsTableData = data;
        })
      }

      /**
       *  Display Details Table
       * @param $event
       * @param pos
       * @param item
       */
      _bdc.displayTable = function($event, pos, item, status, category){
        if (!_bdc.showTable) _bdc.showTable = true;
        console.log(category);
        _bdc.setTableData(item, status, category);
      }

      _bdc.showDetails = function($event, pos, item, chart) {
        console.log("******chart*******");
        console.log(chart);
        _bdc.showTable = true;
        _bdc.selectedPie = chart;
      }
      /**
       *  deals  table Data
       */
      _bdc.dealsTableData = [];
      _bdc.dtOptions = DTOptionsBuilder.newOptions()
          .withDOM('<"html5buttons"B>lTfgitp')
          .withOption('order', [[5, 'desc']])
          .withOption('responsive', true)
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


      // _bdc.selectedDealership = _bdc.dealerships[0];
      // _bdc.selectedTeam = _bdc.selectedDealership.teams[0];
      // _bdc.selectedEmployee = _bdc.selectedTeam.members[0];

      _bdc.datePickerOptions = {
        'ranges': {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        "alwaysShowCalendars": true,
        'opens': 'left',
        eventHandlers: {'apply.daterangepicker': function(ev, picker) {
           console.log(ev);
           console.log(picker);
          _bdc.loadLeads();
        }}
      };

      _bdc.dateRange = {startDate: moment().subtract(6, 'days'),
        endDate: _bdc.datePickerOptions.ranges.Today[1]};

        /**
         * Update Table Data based on selection
         * @param status
         * @param category
         */
      var updateTableData = function(status, category){
        var tableData = getDealsData(status).tableData;
        var data = $filter('filter')(tableData, {$: category});
        console.log(data);
        _bdc.dealsTableData = data;
      }


        /**
         * Filter Deals based on Selection
         * @param status
         */




      /**
       * sales metrics
       * @type {*[]}
       */

      _bdc.dismissSidebar = function(from){
        console.log('*** called From: '+from+' **');
        _bdc.sidebar = false;
      }

      _bdc.showStatsSummary = function(stats, filter){
        var idx = Util.indexOfObject(_bdc.metricSummaryTabs, 'id', stats);
        if (idx != -1) {
          _bdc.metricSummaryTabs[idx].active = true;
          if (filter) _bdc.metricSummaryTabs[idx].contentFilter = filter;
        }
      }

      _bdc.displayStatsDetails = function(stat){
        if (!_bdc.sidebar) _bdc.sidebar = true;
        console.log(stat);
        var categoryId, filter;
        switch(stat.category){
          case 'calls':
            categoryId = 'Phone';
            break
          case 'text':
            categoryId = 'Correspondence';
            filter = 'Text';
            break;
          case 'mail':
            categoryId = 'Correspondence';
            filter = 'Mail';
            break;
          case 'appointment_made':
            categoryId = 'Appointments';
            filter = 'Made';
            break;
          case 'appointment_sold':
            categoryId = 'Appointments';
            filter = 'Sold';
            break;
          case 'appointment_missed':
            categoryId = 'Appointments';
            filter = 'Missed';
            break;

        }
        _bdc.showStatsSummary(categoryId, filter);
      }

      _bdc.chatRecipient = {name: '', number: ''};

      _bdc.composeText = function(lead){
        if (!_bdc.openChat) _bdc.openChat = true;
        console.log('*** Compose Text ***');
        console.log(deal);
        _bdc.chatRecipient = {name:deal.customerDetails.name, number: deal.customerDetails.phone};
      }

      _bdc.composeMail = function(lead){
        console.log('*** Compose Mail ****');
        console.log(deal);
        var modalInstance = $uibModal.open({
          size: 'lg',
          //windowClass: 'animated slideInRight',
          templateUrl: 'app/views/index/dashboard/modalMailCompose.html',
          resolve: {
            deal: function(){
              return deal;
            }
          },
          controller: function($scope, $uibModalInstance, deal){
            console.log(deal);
            $scope.recipient = deal.customerDetails;
            $scope.ok = function () {
              $uibModalInstance.close();
            };

            $scope.cancel = function () {
              $uibModalInstance.dismiss('cancel');
            };
          }
        });
      }

      _bdc.addAppointment = function (lead) {
        var modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'slide-up',
          templateUrl: 'app/views/index/bdc/lead/scheduleLead.html',
          controller: 'ScheduleLeadCtrl',
          controllerAs: 'scheduleLead',
          resolve: {
            Dealers: function(){
              return _bdc.dealers;
            },
            lead: function(){
              return lead;
            },
            loadPlugin: function ($ocLazyLoad) {
              return $ocLazyLoad.load([
                {
                  serie: true,
                  name: 'angular-ladda',
                  files: ['.resources/plugins/ladda/spin.min.js', '.resources/plugins/ladda/ladda.min.js',
                    '.styles/plugins/ladda/ladda-themeless.min.css','.resources/plugins/ladda/angular-ladda.min.js']
                },
                {
                  name: 'datePicker',
                  files: ['.styles/plugins/datapicker/angular-datapicker.css','.resources/plugins/datapicker/angular-datepicker.js']
                },
                {
                  serie: true,
                  files: ['.resources/plugins/daterangepicker/daterangepicker.js', '.styles/plugins/daterangepicker/daterangepicker-bs3.css']
                },
                {
                  name: 'daterangepicker',
                  files: ['.resources/plugins/daterangepicker/angular-daterangepicker.js']
                }
              ]);
            },
          }
        });

        modalInstance.result.then(function (lead) {
          console.log(lead);
          _bdc.activeLead = lead;
          _bdc.categorizedLeads();
        }).catch(function(e){
          console.log(e);
        });

      }

      _bdc.editLead = function(lead){
        console.log('*** Edit Lead ****');
        var modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'slide-up',
          templateUrl: 'app/views/index/bdc/lead/editLead.html',
          controller: 'EditLeadCtrl',
          controllerAs: 'editLead',
          resolve: {
            lead: function(){
              return lead;
            },
            loadPlugin: function ($ocLazyLoad) {
              return $ocLazyLoad.load([
                {
                  serie: true,
                  name: 'angular-ladda',
                  files: ['.resources/plugins/ladda/spin.min.js', '.resources/plugins/ladda/ladda.min.js',
                    '.styles/plugins/ladda/ladda-themeless.min.css','.resources/plugins/ladda/angular-ladda.min.js']
                }
              ]);
            }
          }
        });

        modalInstance.result.then(function (leads) {
            _bdc.activeLead = leads;
        }).catch(function(e){
          console.log(e);
        });
      }

      _bdc.appointment = {};
      _bdc.appointment.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      _bdc.appointment.format = _bdc.appointment.formats[0];
      _bdc.appointment.altInputFormats = ['M!/d!/yyyy'];

      _bdc.today = function () {
        _bdc.appointment.dt = new Date();
      };

      _bdc.today();
      _bdc.appointment.minDate = new Date();

      _bdc.clear = function () {
        _bdc.appointment.dt = null;
      };


      _bdc.appointment.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };



      _bdc.addLead = function () {
        var modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'slide-up',
          templateUrl: 'app/views/index/bdc/lead/addLead.html',
          controller: 'AddLeadCtrl as newLead',
          resolve: {
            Dealers: function(){
              return _bdc.dealers;
            }
          }
        });
      }

      _bdc.addNote= function (lead) {
        var modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'slide-up',
          templateUrl: 'app/views/index/bdc/lead/addLeadNote.html',
          controller: 'AddLeadNoteCtrl',
          controllerAs: 'addNote',
          resolve: {
            loadPlugin: function ($ocLazyLoad) {
              return $ocLazyLoad.load([
                {
                  serie: true,
                  name: 'angular-ladda',
                  files: ['.resources/plugins/ladda/spin.min.js', '.resources/plugins/ladda/ladda.min.js',
                    '.styles/plugins/ladda/ladda-themeless.min.css','.resources/plugins/ladda/angular-ladda.min.js']
                }
              ]);
            },
            lead: function(){
              return lead;
            }
          }
        });

        modalInstance.result.then(function (leads) {
          _bdc.activeLead = leads;
          _bdc.categorizedLeads();
        }).catch(function(e){
          console.log(e);
        });
      }

      _bdc.addTask = function (lead) {
        var modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'slide-up',
          templateUrl: 'app/views/index/task/assignLead.html',
          controller: 'AddTaskCtrl as addTask',
          resolve: {
            Dealers: function(){
              return _bdc.dealers;
            },
            loadPlugin: function ($ocLazyLoad) {
              return $ocLazyLoad.load([
                {
                  serie: true,
                  name: 'angular-ladda',
                  files: ['.resources/plugins/ladda/spin.min.js', '.resources/plugins/ladda/ladda.min.js',
                    '.styles/plugins/ladda/ladda-themeless.min.css','.resources/plugins/ladda/angular-ladda.min.js']
                },
                {
                  name: 'datePicker',
                  files: ['.styles/plugins/datapicker/angular-datapicker.css','.resources/plugins/datapicker/angular-datepicker.js']
                },
                {
                  serie: true,
                  files: ['.resources/plugins/daterangepicker/daterangepicker.js', '.styles/plugins/daterangepicker/daterangepicker-bs3.css']
                },
                {
                  name: 'daterangepicker',
                  files: ['.resources/plugins/daterangepicker/angular-daterangepicker.js']
                },
                {
                  name: 'ui.select',
                  files: ['.resources/plugins/ui-select/select.min.js',
                    '.styles/plugins/ui-select/select.min.css']
                }
              ]);
            }
          }
        });
      }

      _bdc.assignLead = function () {
        var modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'slide-up',
          templateUrl: 'app/views/index/bdc/lead/assignLead.html',
          controller: 'AssignLeadCtrl as assignLead',
          resolve: {
            Dealers: function(){
              return _bdc.dealers;
            },
            loadPlugin: function ($ocLazyLoad) {
              return $ocLazyLoad.load([
                {
                  serie: true,
                  name: 'angular-ladda',
                  files: ['.resources/plugins/ladda/spin.min.js', '.resources/plugins/ladda/ladda.min.js',
                    '.styles/plugins/ladda/ladda-themeless.min.css','.resources/plugins/ladda/angular-ladda.min.js']
                },
                {
                  name: 'datePicker',
                  files: ['.styles/plugins/datapicker/angular-datapicker.css','.resources/plugins/datapicker/angular-datepicker.js']
                },
                {
                  serie: true,
                  files: ['.resources/plugins/daterangepicker/daterangepicker.js', '.styles/plugins/daterangepicker/daterangepicker-bs3.css']
                },
                {
                  name: 'daterangepicker',
                  files: ['.resources/plugins/daterangepicker/angular-daterangepicker.js']
                },
                {
                  name: 'ui.select',
                  files: ['.resources/plugins/ui-select/select.min.js',
                    '.styles/plugins/ui-select/select.min.css']
                }
              ]);
            }
          }
        });
      }

      _bdc.openAppointment = function(appointments){
        var modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'slide-up',
          size: 'xl',
          templateUrl: 'app/views/index/bdc/openAppointment.html',
          controller: 'OpenAppointmentCtrl as apt',
          resolve: {
            appointments: function () {
              return appointments;
            },
            loadPlugin: function ($ocLazyLoad) {
              return $ocLazyLoad.load([
                {
                  serie: true,
                  files: ['.resources/plugins/dataTables/datatables.min.js',
                    '.styles/plugins/dataTables/datatables.min.css']
                },
                {
                  serie: true,
                  name: 'datatables',
                  files: ['.resources/plugins/dataTables/angular-datatables.min.js']
                },
                {
                  serie: true,
                  name: 'datatables.buttons',
                  files: ['.resources/plugins/dataTables/angular-datatables.buttons.min.js']
                }
              ]);
            }

          }
        });
      }

    });


