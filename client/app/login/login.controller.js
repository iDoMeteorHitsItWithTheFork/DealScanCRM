'use strict';

angular.module('dealScanCrmApp')
    .controller('LoginCtrl', function ($scope, Auth, $state) {


        this.user = {};
        this.errors = {};
        this.submitted = false;

        this.Auth = Auth;
        this.$state = $state;


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
                        this.$state.go('home.dashboard');
                        console.log('test123');
                    })
                    .catch(err => {
                        this.errors.other = err.message;
                    });
            }
        }
    });
