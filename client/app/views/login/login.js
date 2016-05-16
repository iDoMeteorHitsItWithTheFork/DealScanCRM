/**
 * Created by ludovicagodio on 5/2/16.
 */
angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: "/login",
        title: 'login',
        templateUrl: "app/views/login/login.html",
        controller: 'LoginCtrl as landing',
        data: {pageTitle: 'Login', specialClass: 'gray-bg'},
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
          }
        }
      })
  })
