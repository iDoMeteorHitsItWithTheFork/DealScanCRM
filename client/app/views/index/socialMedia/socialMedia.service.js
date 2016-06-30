'use strict';

angular.module('dealScanCrmApp')
  .factory('SocialMedia', function (Auth, Util, ezfb, $resource, $filter, appConfig, SocialMediaResource) {
    // Service logic
    var _socialSearchResults = { data: [], searchParams: {}};



    //Search facebook
    function fbSearch(searchOptions) {




    }

    //Search Twitter
    function twtSearch(searchOptions){
      var type = Util.searchPath(searchOptions);
      if (!type) return null;

      /*Search Logic */
      switch(type){
        case 'Term':
              break;
        case 'Location':
              break;
        case 'TermAndLocation':
              break;
      }
      
      var params = {
        q: searchOptions.term,
        result_type: 'mixed',
        count: 100
      }
      return SocialMediaResource.twitterSearch(params)
        .$promise.then(function (res) {
          console.log('*** Results ***');
          console.log(res);
          if (res.data.statuses) return {errorCode:'', errorMessage: ''};
          if (res.data.statuses.length > 0) {
            var _res = res.data.statuses;
            var _data = [];
            for (var i = 0; i < _res.length; i++) {
              _data.push({
                datasource: 'twitter',
                username: _res[i].user.screen_name,
                avatar: _res[i].user.profile_image_url,
                text: _res[i].text,
                image: _res[i].entities.media ? _res[i].entities.media[0].media_url : null,
                created_at: _res[i].created_at,
                geo: _res[i].geo ? _res[i].geo : null,
                counts: {
                  share_count: _res[i].retweet_count,
                  like_count: _res[i].favorite_count,
                  comment_count: null
                },
                comments: []
              });
            } return _socialSearchResults = {data: _data, searchParams: params};
          } else return [];
        }).catch(function (err) {
          console.log(err);
          return err;
        });

    }


    //search Instagram
    function igSearch(term){


    }



    // Public API here
    return {
        searchTwitter: twtSearch
    };

  });
