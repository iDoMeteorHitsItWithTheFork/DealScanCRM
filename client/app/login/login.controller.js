'use strict';

angular.module('dealScanCrmApp')
    .controller('LoginCtrl', function ($scope, Auth, appConfig, $state) {

        this.user = {};
        this.errors = {};
        this.submitted = false;

        this.Auth = Auth;
        this.$state = $state;

        this.landingPage = function(user){
          switch(user.role){
            case appConfig.userRoles[1]:
            case appConfig.userRoles[5]:
                  return 'home.bdc';
            default:
                  return 'home.dashboard';

          }
        }


        this.login = function (form) {
            this.submitted = true;

            if (form.$valid) {
                this.Auth.login({
                    email: this.user.email,
                    password: this.user.password
                })
                    .then(() => {
                        console.log('login successfull');
                        // Logged in, redirect to home
                        this.$state.go(this.landingPage(Auth.getCurrentUser()));
                    })
                    .catch(err => {
                        this.errors.other = err.message;
                    });
            }
        }
    });
