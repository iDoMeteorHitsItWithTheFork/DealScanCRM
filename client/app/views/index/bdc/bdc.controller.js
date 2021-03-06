
angular.module('dealScanCrmApp').controller('BDCCtrl',

    function ($scope, $state, $uibModal,$anchorScroll, Auth, Util, DataFilters, Dealers, BDC, Messages,appConfig, DTOptionsBuilder, $filter, Lead, toaster, $timeout, $window) {
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
      _bdc.loadingMessages = false;
      _bdc.sendingMessage = false;
      _bdc.messages = [];
      _bdc.sentMessages = {};
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

      _bdc.metricSummaryTabs = [
        {
          id: 'Phone', title: 'fa fa-phone', contentFilter: '',
          contentData: []
        },
        {
          id: 'Correspondence', title: 'fa fa-exchange', contentFilter: '',
          contentData: []
        },
      ]

      _bdc.timeAgo = function(time){
          if (!time) time = moment();
          return moment(time).fromNow();
      }

      var setMetricsData = function(id, data){
          switch(id){
            case 'Phone':
              _bdc.metricSummaryTabs[0].contentData = data;
              break;
            case 'Correspondence':
              _bdc.metricSummaryTabs[1].contentData = data;
              break;
          }
      }

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


      _bdc.viewNewLeads = function(){
        _bdc.viewOptions = 'list';
        _bdc.viewTab(_bdc.tabs[0]);
      }

      _bdc.viewLead = function(lead, tab){
        _bdc.viewOptions = 'list';
        switch(tab){
          case 'new':
            _bdc.viewTab(_bdc.tabs[0]);
            break;
          case 'working':
            _bdc.viewTab(_bdc.tabs[1]);
            break;
          case 'missed':
            _bdc.viewTab(_bdc.tabs[2]);
            break;
          default:
            _bdc.viewTab(_bdc.tabs[0]);
            break;
        }
        _bdc.activeLead = lead;
        console.log(lead);
        _bdc.dismissSidebar();
      }

      _bdc.loadLeads = function(){
        if (_bdc.loadingLeads) return;
        _bdc.loadingLeads = true;
        Lead.leads().then(function(leads){
          console.log(leads);
          if (leads && !leads.error){
            _bdc.leads = leads;
            _bdc.categorizedLeads();
          } else toaster.error({title: 'Leads Load Error', body:'An error occurred while attempting to load leads'});
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
         console.log(lead);
        _bdc.activeLead = lead;
        if (lead.agents && lead.agents.length == 0){
          if (_bdc.assigningLead) return;
          _bdc.assigningLead = true;
          Lead.assign(lead).then(function(res){
              _bdc.assigningLead = false;
              if (res === true) toaster.success({title: 'Lead Assignment', body: 'Lead ('+lead.name+') is now assigned to you!'})
              else toaster.error({title: 'Lead Error', body: 'An error occurred while attempting to assign lead'});
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

      _bdc.selectedDealership = {};
      _bdc.selectedTeam = {};

      _bdc.initFilters = function(){
        if (DataFilters){
          console.log(DataFilters);
          _bdc.dataFilters = DataFilters;
          _bdc.selectedDealership = _bdc.dataFilters[0];
          _bdc.selectedTeam = _bdc.selectedDealership.Teams[0];
          _bdc.selectedTeam.TeamMembers[0] = {
            profile: {
              name: 'BDC Personnel',
                role: 'BDC Agent',
                email: ''
            }
          };
          _bdc.selectedEmployee  = (_bdc.user.role == 'sale_rep') ?
          {MemberID: _bdc.user.userID, profile: _bdc.user.profile} :
            _bdc.selectedEmployee = _bdc.selectedTeam.TeamMembers[0];
          _bdc.viewIsReady = true;
          _bdc.getGraphData();
        } else toaster.error({title: 'Dashboard Error', body: 'An error occurred while loading data filters'})
      }

      _bdc.groupByRole = function (employee){
        return employee.profile.role;
      };


      _bdc.datePickerOptions = {
        'ranges': {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        'opens': 'left',
        eventHandlers: {'apply.daterangepicker': function(ev, picker) {
          _bdc.dateRange = {startDate: picker.startDate, endDate: picker.endDate};
          console.log('\n\n ++++++++++++++++++++++++++++++ \n\n');
          _bdc.getGraphData();
        }}
      }

      _bdc.dateRange = {startDate: _bdc.datePickerOptions.ranges['This Month'][0],
        endDate: _bdc.datePickerOptions.ranges.Today[1]};


      /**
       * Retreive Graph Data From Service
       */
      _bdc.getGraphData = function(){
        if (_bdc.retreivingGraphData) return;
        _bdc.retreivingGraphData = true;
        console.log('**** GETTING GRAPH DATA *****');
        var searchOptions = {};
        searchOptions.dealershipID = _bdc.selectedDealership.DealershipID;
        searchOptions.teamID = _bdc.selectedTeam.TeamID;
        searchOptions.employee = _bdc.selectedEmployee;
        searchOptions.from = _bdc.dateRange.startDate.format('YYYY/MM/DD');
        searchOptions.to = _bdc.dateRange.endDate.format('YYYY/MM/DD');
        //console.log(searchOptions);
        BDC.graphData(searchOptions).then(function(leads){
          console.log('\n\n\n\ GRAPH DATA \n\n\n');
          console.log(leads);
          if (leads){
            _bdc.totalLeads = leads.totalLeads;
            _bdc.totalAppointments = leads.totalAppointments;
            _bdc.keptAppointments = leads.keptAppointments;
            _bdc.missedAppointments = leads.missedAppointments;
            _bdc.soldAppointments = leads.soldAppointments;
            _bdc.sentMessages = leads.sentMessages;
            setMetricsData('Phone', []);
            setMetricsData('Correspondence', _bdc.sentMessages.messages);
          }
          _bdc.retreivingGraphData = false;
        }).catch(function(err){
          _bdc.retreivingGraphData = false;
          console.log(err);
          toaster.error({title: 'Leads Load Error', body: 'An Error occurred while attempting to retreive leads data'});
        });
      }


      _bdc.initFilters();


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

      _bdc.displayStatsDetails = function(stat) {
        if (!_bdc.sidebar) _bdc.sidebar = true;
        console.log(stat);
        var categoryId, filter;
        switch(stat){
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
        }
        _bdc.showStatsSummary(categoryId, filter);
      }

      /**
       * sales metrics
       * @type {*[]}
       */

      _bdc.dismissSidebar = function(from){
        if (from) console.log('*** called From: '+from+' **');
        _bdc.sidebar = false;
      }
      _bdc.sidebarActiveTab = 0;
      _bdc.showStatsSummary = function(stats, filter) {
        if (stats == 'Correspondence') console.log(_bdc.sentMessages);
        var idx = Util.indexOfObject(_bdc.metricSummaryTabs, 'id', stats);
        if (idx != -1) {
          _bdc.sidebarActiveTab = idx;
          if (filter) _bdc.metricSummaryTabs[idx].contentFilter = filter;
        }
      }




      _bdc.contactLead = function(lead, event) {
        if (event) event.stopPropagation();
         if (!lead.email && !lead.phone){
           toaster.error({
             title: 'Contact Error',
             body: 'No contact information was detected for customer. Please update the customer info.'
           });
         } else if (lead.phone && lead.phone.toString().trim() != ''){

           if (!_bdc.openChat) _bdc.openChat = true;
           _bdc.chatRecipient = {name:lead.name, number: lead.phone};

         } else if (lead.email && lead.email.toString().trim() != ''){
           var mailTo = 'mailto:' + lead.email
           var w = $window.open(mailTo);
           var t = $timeout(function () {
             w.close();
           });
           $scope.$on('destroy', function () {
             $timeout.cancel(t);
           })
         }

      }

      _bdc.chatRecipient = {name: '', number: ''};

      /*
       * Email a customer
       *
       * */
      _bdc.composeMail = function (lead) {
        if (lead.email && lead.email.toString().trim() != '') {
          var mailTo = 'mailto:' + lead.email
          var w = $window.open(mailTo);
          var t = $timeout(function () {
            w.close();
          });
          $scope.$on('destroy', function () {
            $timeout.cancel(t);
          })
        } else  toaster.error({
          title: 'Mail Error',
          body: 'No Email address detected for customer. Please update the customer info.'
        })

      }

      /**
       *
       * text Customer
       *
       *
       */
      _bdc.composeText = function (lead) {
        if (_bdc.loadingMessages) return;
        if (lead.phone && lead.phone.toString().trim() != '') {
          if (!_bdc.openChat) _bdc.openChat = true;
          _bdc.chatRecipient = {
            recipientID: lead.leadID,
            name: lead.name,
            number: lead.phone
          };
          _bdc.loadingMessages = true;
          _bdc.messages.length = 0;
          Messages.messages({id:lead.leadID, type: 'lead'}).then(function (messages) {
            if (messages)_bdc.messages = messages;
            else _bdc.messages = [];
            _bdc.loadingMessages = false;
          }).catch(function (err) {
            console.log(err);
            _bdc.loadingMessages = false;
            toaster.error({title: 'Messages Error', body: 'An error occurred while loading messages'});
          })

        } else toaster.error({
          title: 'Message Error',
          body: 'There are no phone number detected for this customer. please update the customer details.'
        })

      }

      _bdc.sendMessage = function(form){
        if (_bdc.sendingMessage) return;
        if (!_bdc.message || _bdc.message.toString().trim() == '') return;
        _bdc.sendingMessage = true;
        Messages.send({
          id: _bdc.chatRecipient.recipientID,
          recipient: 'lead',
          message: _bdc.message
        }).then(function (message) {
          console.log(message);
          if (message) {
            _bdc.messages.unshift(message);
            _bdc.message = '';
            form.$setPristine();
            _bdc.categorizedLeads();
          } else toaster.error({title: '', body: 'An error occured while attempting to send your message.'});
          _bdc.sendingMessage = false;
        }).catch(function (err) {
          console.log(err);
          _bdc.sendingMessage = false;
          toaster.error({title: 'Send Error', body: 'An error occured while attempting to send messages'});
        })

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
                  files: ['.resources/plugins/ladda/spin.min.js',
                    '.resources/plugins/ladda/ladda.min.js',
                    '.styles/plugins/ladda/ladda-themeless.min.css',
                    '.resources/plugins/ladda/angular-ladda.min.js'
                  ]
                },
                {
                  name: 'datePicker',
                  files: ['.styles/plugins/datapicker/angular-datapicker.css',
                    '.resources/plugins/datapicker/angular-datepicker.js'
                  ]
                },
                {
                  serie: true,
                  files: ['.resources/plugins/daterangepicker/daterangepicker.js',
                    '.styles/plugins/daterangepicker/daterangepicker-bs3.css'
                  ]
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
                  files: ['.resources/plugins/ladda/spin.min.js',
                    '.resources/plugins/ladda/ladda.min.js',
                    '.styles/plugins/ladda/ladda-themeless.min.css',
                    '.resources/plugins/ladda/angular-ladda.min.js'
                  ]
                }
              ]);
            }
          }
        });

        modalInstance.result.then(function (lead) {
          _bdc.activeLead = lead;
          _bdc.categorizedLeads();
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

        modalInstance.result.then(function (leads) {
          _bdc.categorizedLeads();
        }).catch(function(e){
          console.log(e);
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
                  files: ['.resources/plugins/ladda/spin.min.js',
                    '.resources/plugins/ladda/ladda.min.js',
                    '.styles/plugins/ladda/ladda-themeless.min.css',
                    '.resources/plugins/ladda/angular-ladda.min.js'
                  ]
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
                  files: ['.resources/plugins/ladda/spin.min.js',
                    '.resources/plugins/ladda/ladda.min.js',
                    '.styles/plugins/ladda/ladda-themeless.min.css',
                    '.resources/plugins/ladda/angular-ladda.min.js'
                  ]
                },
                {
                  name: 'datePicker',
                  files: ['.styles/plugins/datapicker/angular-datapicker.css',
                    '.resources/plugins/datapicker/angular-datepicker.js'
                  ]
                },
                {
                  serie: true,
                  files: ['.resources/plugins/daterangepicker/daterangepicker.js',
                    '.styles/plugins/daterangepicker/daterangepicker-bs3.css'
                  ]
                },
                {
                  name: 'daterangepicker',
                  files: ['.resources/plugins/daterangepicker/angular-daterangepicker.js']
                },
                {
                  name: 'ui.select',
                  files: ['.resources/plugins/ui-select/select.min.js',
                    '.styles/plugins/ui-select/select.min.css'
                  ]
                }
              ]);
            }
          }
        });
      }

      _bdc.assignLead = function (lead) {
        var modalInstance = $uibModal.open({
          animation: true,
          windowClass: 'slide-up',
          templateUrl: 'app/views/index/bdc/lead/assignLead.html',
          controller: 'AssignLeadCtrl as assignLead',
          resolve: {
            Dealers: function(){
              return _bdc.dealers;
            },
            selectedLead: function(){
              return lead;
            },
            loadPlugin: function ($ocLazyLoad) {
              return $ocLazyLoad.load([
                {
                  serie: true,
                  name: 'angular-ladda',
                  files: ['.resources/plugins/ladda/spin.min.js',
                    '.resources/plugins/ladda/ladda.min.js',
                    '.styles/plugins/ladda/ladda-themeless.min.css',
                    '.resources/plugins/ladda/angular-ladda.min.js'
                  ]
                },
                {
                  name: 'datePicker',
                  files: ['.styles/plugins/datapicker/angular-datapicker.css',
                    '.resources/plugins/datapicker/angular-datepicker.js'
                  ]
                },
                {
                  serie: true,
                  files: ['.resources/plugins/daterangepicker/daterangepicker.js',
                    '.styles/plugins/daterangepicker/daterangepicker-bs3.css'
                  ]
                },
                {
                  name: 'daterangepicker',
                  files: ['.resources/plugins/daterangepicker/angular-daterangepicker.js']
                },
                {
                  name: 'ui.select',
                  files: ['.resources/plugins/ui-select/select.min.js',
                    '.styles/plugins/ui-select/select.min.css'
                  ]
                }
              ]);
            }
          }
        });
      }

      _bdc.openAppointment = function(appointments) {
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
                    '.styles/plugins/dataTables/datatables.min.css'
                  ]
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


