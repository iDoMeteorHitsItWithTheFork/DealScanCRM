'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider) {

    // Configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(120); // in seconds
    $ocLazyLoadProvider.config({
      // Set to true if you want to see what and when is dynamically loaded
      debug: true
    });

    $stateProvider
      .state('index', {
        abstract: true,
        url: "/index",
        templateUrl: "app/views/common/content.html",
        authenticate: true,
        resolve: {
          DataFilters: function ($q, Dashboard, Auth) {
            var df  = $q.defer();
            Auth.getCurrentUser().$promise
              .then(function(user){
                Dashboard.filters(user.userID).then(function(filters){
                  return (filters) ? df.resolve(filters) : df.reject();
                }).catch(function(err){
                  console.log(err);
                  df.reject(err);
                })
              })
              .catch(function(err){
               console.log(err);
               df.reject(err);
            })
            return df.promise;
          },
          Dealers: function($q, Auth){
            var df = $q.defer();
            Auth.loadDealerships().then(function(dealers){
              if (dealers) df.resolve(dealers);
              else df.reject();
            }).catch(function(err){
              console.log(err);
              df.reject(err);
            });
            return df.promise;
          },
          KPI: function(Dashboard, $q){
            var df = $q.defer();
            Dashboard.kpi().then(function(kpi){
              if (kpi) df.resolve(kpi);
              else df.reject();
            }).catch(function(err){
              console.log(err);
              df.reject(err);
            });
            return df.promise;
          },
          UnassignedLeads: function(Lead, $q){
            var df = $q.defer();
            Lead.scheduledLeads().then(function(leads){
              (leads) ? df.resolve(leads) : df.reject();

            }).catch(function(err){
              df.reject(err);
              console.log(err);
            })
            return df.promise;
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
                files: ['.resources/plugins/moment/moment.min.js']
              },
              {
                files: ['.resources/plugins/jasny/jasny-bootstrap.min.js']
              },
              {
                name: 'ui.checkbox',
                files: ['.resources/bootstrap/angular-bootstrap-checkbox.js']
              },
              {
                files: ['.styles/plugins/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css']
              },
              {
                files: ['.styles/plugins/iCheck/custom.css','.resources/plugins/iCheck/icheck.min.js']
              },
              {
                name: 'ui.sortable',
                files: ['.resources/plugins/ui-sortable/sortable.js']
              },
              {
                name: 'ui.select',
                files: ['.resources/plugins/ui-select/select.min.js',
                  '.styles/plugins/ui-select/select.min.css']
              },
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
              },
              {
                serie: true,
                files: ['.resources/plugins/daterangepicker/daterangepicker.js', '.styles/plugins/daterangepicker/daterangepicker-bs3.css']
              },
              {
                name: 'daterangepicker',
                files: ['.resources/plugins/daterangepicker/angular-daterangepicker.js']
              }
            ])
          }
        }
      })
      .state('logout', {
        url: '/logout?referrer',
        template: '',
        controller: function ($state, Auth) {
          Auth.logout();
          $state.go('login');
        }
      })
  })
  .run(function ($rootScope, $state, ezfb) {
    $rootScope.$state = $state;

    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
      console.log(' ** going to state --> ['+next.name+'] From state -> ['+current.name+']');
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });



    $rootScope.$on('$stateChangeSuccess', function (event, next, nextParams, prev, prevParams) {
      console.log(' --- state change success ---> Current State: '+next.name);
      console.log(next);
      console.log(prev);
      setTimeout(function(){
        console.log("fucking page on chage");
        fix_height()
      },1000);
    });


    $rootScope.$on('$stateChangeError', function (event, next, nextParams, prev, prevParams, error) {
      event.preventDefault();
      console.log('State Change Error');
      console.log(error);
      console.log('___ToState___');
      console.log(next);
      console.log('___FromState___');
      console.log(prev)
    });


    //Initialize Facebook Client
    ezfb.init({
      //App ID From Facebook App Dashboard
      appId: '126507794443463'
    });
    function fix_height() {
      console.log($('#page-wrapper').hasClass('social_media'));
      if ($('#page-wrapper').hasClass('social_media')) {
        $('#page-wrapper').css("height", $(window).height() + 15 + "px");
        $('body').css("overflow", "hidden");
        console.log("page wrapper has class")
        return;
      } else {

        setTimeout(function(){
          console.log("fucking page timeout");
          $('#page-wrapper').css("height", "100%");
          $('body').css("overflow", "auto");
        },1);
      }
    }
  });
