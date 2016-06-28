'use strict';

angular.module('dealScanCrmApp')
  .controller('LoginCtrl', function ($scope, Auth, $state, appConfig) {


    var _landing = this;
    console.log('Login Controller loaded!');

    /**
     * view models & flags
     * @type {{}}
     */
    _landing.user = {};
    _landing.errors = {};
    _landing.submitted = false;
    _landing.Auth = Auth;


    /**
     * Determine a user landing page based on user role
     * @param user
     * @returns {*}
     */
    _landing.proceedTo = function (user) {
      switch (user.role) {
        case appConfig.userRoles[1]:
        case appConfig.userRoles[5]:
          return 'index.bdc';
        default:
          return 'index.dashboard';

      }
    }

    /**
     * Login
     * @param form
     */
    _landing.login = function (form) {
      if (_landing.submitted) return;
      _landing.submitted = true;

      if (form.$valid) {
        _landing.Auth.login({
          email: _landing.user.email,
          password: _landing.user.password,
        })
          .then(() => {
            console.log('login successfull');
            $state.go(_landing.proceedTo(Auth.getCurrentUser()));
          })
          .catch(err => {
            _landing.submitted = false;
            _landing.errors.other = err.message;
          });
      }
    }
  });
