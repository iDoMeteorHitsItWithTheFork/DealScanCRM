'use strict';

angular.module('dealScanCrmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.socialMedia', {
        title: 'social_media',
        url: '/socialMedia',
        templateUrl: 'app/views/index/socialMedia/socialMedia.html',
        controller: 'SocialMediaCtrl as sm',
        data: {pageTitle: 'Social Media'},
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                name: 'ui.checkbox',
                files: ['.resources/bootstrap/angular-bootstrap-checkbox.js']
              },
              {
                files: ['.styles/plugins/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css']
              },
              {
                name: 'ui.select',
                files: ['.resources/plugins/ui-select/select.min.js',
                  '.styles/plugins/ui-select/select.min.css']
              },
            ])
          },
          watchlists: function($q, SocialMedia){
              var df = $q.defer();
              return SocialMedia.loadWatchlists('hagerstown ford').then(function(watchlists){
                 if (watchlists){
                    console.log(watchlists);
                    return df.resolve();
                 } else df.reject();
              });
              return df.promise;
          }
        }
      });
  });
