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
        data: {pageTitle: 'Login', specialClass: 'gray-bg'}
      })
  })
