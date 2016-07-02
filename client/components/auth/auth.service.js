'use strict';

(function () {

    function AuthService($location, $http, $cookies, $q, appConfig, Util, User, ezfb, SocialMediaResource) {
        var safeCb = Util.safeCb;
        var currentUser = {};
        var fbStatus = {};
        var userRoles = appConfig.userRoles || [];

        if ($cookies.get('token') && $location.path() !== '/logout') {
            currentUser = User.get();
        }

        var Auth = {

            /**
             * Authenticate user and save token
             *
             * @param  {Object}   user     - login_ info
             * @param  {Function} callback - optional, function(error, user)
             * @return {Promise}
             */
              login({email, password}, callback) {
                return $http.post('/auth/local', {
                    email: email,
                    password: password
                }, {})
                    .then(res => {
                        $cookies.put('token', res.data.token);
                        currentUser = User.get();
                        return currentUser.$promise;
                    })
                    .then(user => {
                        safeCb(callback)(null, user);
                        Auth.facebookInit();
                        Auth.dealScanInit(appConfig.dscUsr, appConfig.dscPwd);
                        return user;
                    })
                    .catch(err => {
                        Auth.logout();
                        safeCb(callback)(err.data);
                        return $q.reject(err.data);
                    });
            },
          /**
           * Update Facebook login Status
           * @param status
           */
            updateFb(status){
             if (status == 'disconnected') Auth.facebookLogout();
             else fbStatus = status;
            },

            /**
             * get loging Status from Facebook
             * @param more
             */
            getStatusFromFb(more){
              ezfb.getLoginStatus(function (res) {
                fbStatus = res;
                (more || angular.noop)();
              });
            },

            /**
             * Intialize Facebook oAuth flow and obtain access_token
             * @param callback
             */
            facebookInit(callback){
              ezfb.login(function (res) {
                if (res.authResponse) {
                   $cookies.put('fbToken', res.authResponse.accessToken);
                   fbStatus = res.authResponse.status;
                   Auth.setFbAccessToken(res.authResponse.accessToken);
                }
              }, {scope: 'email,user_likes,user_about_me, user_birthday, user_location,user_posts, publish_actions, user_friends'});
            },

            /**
             *  logout from Facebook Server
             */
            facebookLogout(){
              ezfb.logout(function(res){
                $cookies.remove('fbToken');
                fbStatus = null;
              });
            },

            /**
             * Pass Access Token to Back end facebook module
             * @param token
             */
            setFbAccessToken(token){
              var token  = token ? token : $cookies.get('fbToken');
              if (token && token.trim() != '' && token != 'null') {
                 SocialMediaResource.setFbToken({accessToken: token})
                   .$promise.then(function(res){
                    console.log(res);
                 }).catch(function(err){
                     console.log(err);
                     return err;
                 });
              }
            },

            /**
             *  Initialize with Dealscan for integration
             */

            dealScanInit(username, password, link){

               if (!link) link = 'http://www.kelcar.net/api/authenticate'; //default authentication api
               return $http.get(link, {
                 Username: username,
                 Password: password
               }).then(function(res){
                   console.log(res);
                   console.log(' --- Connection to DealScan Established ---');
               }).catch(err =>{
                   console.log(err);
                   console.log('Unable to establish connection with DealScan Desking Suite');
               });
            },

          /**
           * Delete access token and user info
             */
             logout() {
                $cookies.remove('token');
                currentUser = {};
                //facebookLogout();
            },

            /**
             * Create a new user
             *
             * @param  {Object}   user     - user info
             * @param  {Function} callback - optional, function(error, user)
             * @return {Promise}
             */
              createUser(user, callback) {
                return User.save(user,
                    function (data) {
                        $cookies.put('token', data.token);
                        currentUser = User.get();
                        return safeCb(callback)(null, user);
                    },
                    function (err) {
                        Auth.logout();
                        return safeCb(callback)(err);
                    }).$promise;
            },

            /**
             * Change password
             *
             * @param  {String}   oldPassword
             * @param  {String}   newPassword
             * @param  {Function} callback    - optional, function(error, user)
             * @return {Promise}
             */
              changePassword(oldPassword, newPassword, callback) {
                return User.changePassword({id: currentUser.userID}, {
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }, function () {
                    return safeCb(callback)(null);
                }, function (err) {
                    return safeCb(callback)(err);
                }).$promise;
            },

            /**
             * Gets all available info on a user
             *   (synchronous|asynchronous)
             *
             * @param  {Function|*} callback - optional, funciton(user)
             * @return {Object|Promise}
             */
             getCurrentUser(callback) {
                if (arguments.length === 0) {
                    return currentUser;
                }

                var value = (currentUser.hasOwnProperty('$promise')) ?
                    currentUser.$promise : currentUser;
                return $q.when(value)
                    .then(user => {
                        safeCb(callback)(user);
                        return user;
                    }, () => {
                        safeCb(callback)({});
                        return {};
                    });
            },

            /**
             * Gets a user teammates
             *   (synchronous|asynchronous)
             *
             * @param  {Function|*} callback - optional, funciton(user)
             * @return {Object|Promise}
             */
              getTeamMates(callback) {
                var value = (currentUser.hasOwnProperty('$promise')) ? currentUser.$promise : currentUser;
                return $q.when(value).then(function(user){
                    User.getTeamMates({id: user.userID}, function(teammates) {
                        safeCb(callback)(teammates);
                        return teammates;
                    }, function(err){
                        safeCb(callback)(err);
                        return err;
                    }).$promise;
                }).catch(function(err){
                    safeCb(callback)(err);
                    return err;
                });
            },

            /**
             * Check if a user is logged in
             *   (synchronous|asynchronous)
             *
             * @param  {Function|*} callback - optional, function(is)
             * @return {Bool|Promise}
             */
              isLoggedIn(callback) {
                if (arguments.length === 0) {
                    return currentUser.hasOwnProperty('role');
                }

                return Auth.getCurrentUser(null)
                    .then(user => {
                        var is = user.hasOwnProperty('role');
                        safeCb(callback)(is);
                        return is;
                    });
            },

            /**
             * Check if a user has a specified role or higher
             *   (synchronous|asynchronous)
             *
             * @param  {String}     role     - the role to check against
             * @param  {Function|*} callback - optional, function(has)
             * @return {Bool|Promise}
             */
             hasRole(role, callback) {
                var hasRole = function (r, h) {
                    return userRoles.indexOf(r) >= userRoles.indexOf(h);
                };

                if (arguments.length < 2) {
                    return hasRole(currentUser.role, role);
                }

                return Auth.getCurrentUser(null)
                    .then(user => {
                        var has = (user.hasOwnProperty('role')) ?
                            hasRole(user.role, role) : false;
                        safeCb(callback)(has);
                        return has;
                    });
            },

            /**
             * Check if a user is an admin
             *   (synchronous|asynchronous)
             *
             * @param  {Function|*} callback - optional, function(is)
             * @return {Bool|Promise}
             */
             isAdmin() {
                return Auth.hasRole
                    .apply(Auth, [].concat.apply(['admin'], arguments));
            },

            /**
             * Get auth token
             *
             * @return {String} - a token string used for authenticating
             */
             getToken() {
                return $cookies.get('token');
            }
        };

        return Auth;
    }

    angular.module('dealScanCrmApp.auth')
        .factory('Auth', AuthService);

})();
