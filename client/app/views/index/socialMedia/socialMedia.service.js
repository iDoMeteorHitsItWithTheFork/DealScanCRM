'use strict';

angular.module('dealScanCrmApp')
  .factory('SocialMedia',
    function (Auth, Util, $resource, $filter, $q, appConfig, ezfb, SocialMediaResource, toaster, WatchlistResource, $interval) {
    // Service logic
    var _socialSearchResults = { data: null, searchParams: null};
    var _watchlists = [];

    /**
     * Get stored search results
     * @returns {{data: Array, searchParams: {}}}
       */
    function getSocialSearchResults(){
      return _socialSearchResults;
    }

    function getWatchlists(){
      return _watchlists;
    }

    /**
     * Clear search results
     */
    function clearResults(){
      _socialSearchResults = {data: [], searchParams: null};
    }

    /**
     * Remove Duplicate from Results
     * @param arr
     * @returns {Array}
       */
    function deDupPosts(arr) {
      var u = {}, a = [];
      for(var i = 0; i < arr.length; i++){
        if (!u.hasOwnProperty(arr[i].id)){
          a.push(arr[i]);
          u[arr[i].id] = 1;
        }
      }
      console.log(u);
      return a;
    }

    /**
     * Search Facebook
     * @param searchOptions
     * @param next
     * @returns {*}
       */
    function fbSearch(searchOptions, next) {

       var params = {
         q: searchOptions.term
       }
       if (searchOptions.location) {
        if (searchOptions.location.metrics != 'km' && searchOptions.location.metrics != 'mi')
          return {errorCode:'', errorMessage: 'Invalid Metric Parameter'};
        params.geocode = [searchOptions.location.lat, searchOptions.location.lon,
          (searchOptions.location.metrics == 'km' ?
          searchOptions.location.distance * 1000 : searchOptions.location.distance * 1000 * 1.6)];
       }

       //Perform search
       return SocialMediaResource
         .facebookSearch(params).$promise
         .then(function(res){

            console.log(res);
            res.data = deDupPosts(res.data);
            var _res = res.data, _data = [], dataModel;
           for (var i = 0; i < _res.length; i++) {

             dataModel = {
               datasource: 'facebook',
               username: _res[i].from.name,
               posterID: _res[i].from.id,
               postID: _res[i].id,
               avatar: _res[i].from.picture.data.url,
               created_at: moment(_res[i].created_time),
               time_ago: moment(_res[i].created_time).fromNow(),
               geo: _res[i].coordinates,
               comments: _res[i].comments && _res[i].comments.data.length > 0 ? _res[i].comments.data : [],
               counts: {
                 share_count: 0, //retweet count / share count for facebook
                 like_count: _res[i].likes ? _res[i].likes.summary.total_count : 0,
                 comment_count: _res[i].comments ? _res[i].comments.summary.total_count: 0,
               }
             }

             if (_res[i].likes && _res[i].likes.summary){
               dataModel.likes = {has_liked: _res[i].likes.summary.has_liked, can_like: _res[i].likes.summary.can_like};
             }

             if (_res[i].message && _res[i].message.trim() != '') dataModel.text = _res[i].message;
             if (_res[i].attachments && _res[i].attachments.data[0]){
               dataModel.text = _res[i].attachments.data[0].description ? _res[i].attachments.data[0].description : null;
               if (_res[i].attachments.data[0].media && _res[i].attachments.data[0].media.image){
                 dataModel.image = _res[i].attachments.data[0].media.image.src; //if empty null
               } else if (_res[i].attachments.data[0].subattachments){
                    if (_res[i].attachments.data[0].subattachments.data && _res[i].attachments.data[0].subattachments.data[0].media) {
                      dataModel.image = _res[i].attachments.data[0].subattachments.data[0].media.image.src;
                    } else dataModel.image = null;
               } else dataModel.image = null;
             }

             _data.push(dataModel);
           }
           return {data: _data, searchParams: params, next: res.paging};
         })
         .catch(function(err){
            console.log(err);
            return err;
         });

    }


    /**
     * get Next Results Parameters
     * @param next_results
     * @param source
     * @returns {{}}
       */
    function getNextParams(next_results, source){
       if (!next_results) return;
       if (!source) return;
       switch(source){
         case 'twitter':
           next_results = next_results.substr(1);
           var q = next_results.split('&'), params = {};
           for(var i= 0; i < q.length; i++){
             var p = q[i].split('=');
             params[p[0]] = p[1];
           }
           break;
         case 'facebook':
               break;
       }
       return params;
    }



      function statMonitoring(keywords){
        if (!Array.isArray(keywords)) throw {errorCode: '', errorMessage: 'Keywords should be an array'};
        var since = '';
        var q = keywords.join(' OR ');
        var params = {
          q: keywords,
          result_type:'recent',
          count: 100
        }
        console.log(params);
        return SocialMediaResource.twitterSearch(params)
          .$promise.then(function(res){
           console.log(res);

        }).catch(function(err){
             console.log(err);
             return err;
        })

      }

    /**
     * Search {query} on Twitter
     * @param searchOptions
     * @returns {*}
       */
    function twtSearch(searchOptions){

      //get new results or next results
      var params = (searchOptions.next) ? getNextParams(searchOptions.next, 'twitter') : {
        q: searchOptions.term,
        result_type: 'recent',
        count: 100
      };

      console.log(params);

      //if location available, validate metric parameters
      if (searchOptions.location) {
        if (searchOptions.location.metrics != 'km' && searchOptions.location.metrics != 'mi')
          return {errorCode:'', errorMessage: 'Invalid Metric Parameter'};
        params.geocode = [searchOptions.location.lat, searchOptions.location.lon,
        searchOptions.location.distance+searchOptions.location.metrics];
      }

      //perform search
      return SocialMediaResource.twitterSearch(params)
        .$promise.then(function (res) {
          console.log(res);
          if (res.resp.statusCode != 200)
            return {statusCode:res.resp.statusCode,  errorCode:res.data.errors[0].code,
              errorMessage: res.data.errors[0].message};
          if (res.data.statuses.length > 0) {
            var _res = res.data.statuses;
            var _data = [], dataModel, next = (res.data.search_metadata.next_results) ? res.data.search_metadata.next_results : null;
            for (var i = 0; i < _res.length; i++) {
              dataModel = {
                datasource: 'twitter',
                username: _res[i].user.screen_name,
                avatar: _res[i].user.profile_image_url,
                posterID: _res[i].user.id_str,
                postID: _res[i].id_str,
                text: _res[i].text,
                image: _res[i].entities.media ? _res[i].entities.media[0].media_url : null,
                created_at: moment(_res[i].created_at),
                time_ago: moment(_res[i].created_at).fromNow(),
                geo: _res[i].coordinates ? [_res[i].coordinates.coordinates[1],_res[i].coordinates.coordinates[0]]: null, //FYI: coordinates is formatted in geoJSON [longitude, latitude]
                counts: {
                  share_count: _res[i].retweet_count,
                  like_count: _res[i].favorite_count,
                  comment_count: null
                },
                comments: []
              };

              if (angular.isDefined(_res[i].retweeted)) dataModel.retweeted = _res[i].retweeted;
              if (angular.isDefined(_res[i].favorited)) dataModel.favorited = _res[i].favorited;

              if (searchOptions.location) {
                 var ref = new google.maps.LatLng(searchOptions.location.lat, searchOptions.location.lon);
                 switch(searchOptions.bounds){
                   case 'circle':
                     if (dataModel.geo)
                        if (Util.pointInCircle(new google.maps.LatLng(dataModel.geo[0],
                           dataModel.geo[1]), ref, (searchOptions.location.metrics == 'km' ?
                          searchOptions.location.distance * 1000 : searchOptions.location.distance * 1000 * 1.6)))
                          _data.push(dataModel);
                      break;
                   case 'polygon':
                      if (dataModel.geo)
                         if (Util.pointInPoly(dataModel.geo[0], dataModel.geo[1], searchOptions.location.poly))
                           _data.push(dataModel);
                         break;
                 }
              } else _data.push(dataModel);

            } return {data: _data, searchParams: params, next: next};
          } else return {data:[], searchParams: params, next: null};
        }).catch(function (err) {
          console.log(err);
          return err;
        });

    }


    /**
     * Search {query} on social media
     * @param searchOptions
     * @param next
     * @returns {*}
       */
    function searchSocialMedia(searchOptions, next){
      if (!searchOptions) return;
      if (!searchOptions.sources && searchOptions.sources.length == 0)
        return {errorCode:'',
          errorMessage:'there were no selected networks to search from. Please select a network and try again.'};
      console.log(searchOptions);
      var searches = [];
      for(var i = 0; i < searchOptions.sources.length; i++){
          if (searchOptions.sources[i].selected) {
            switch (searchOptions.sources[i].name) {
              case 'twitter':
                console.log('*** Searching Twitter ***');
                searches.push(twtSearch(searchOptions));
                break;
              case 'facebook':
                console.log('*** Searching Facebook ***');
                searches.push(fbSearch(searchOptions));
                break;
            }
          }
      }

      return $q.all(searches).then(function(res){
        _socialSearchResults = {data:[], searchParams:{}};
        console.log(res);
        for(var i = 0; i < res.length; i++){
          if (res[i].errorCode || res[i].errorMessage || (res[i].headers && res[i].status && res[i].statusText))
            throw {errorCode:(res[i].errorCode || res[i].status), errorMessage: (res[0].errorMessage || res[i].statusText)};
          _socialSearchResults.data = _socialSearchResults.data.concat(res[i].data);
          _socialSearchResults.searchParams[searchOptions.sources[i].name+'Params'] = res[i].searchParams;
        }

        /* filter results */
        _socialSearchResults.data = $filter('orderBy')(_socialSearchResults.data, "created_at", true);
        return _socialSearchResults;
      })
        .catch(function(err){
        console.log(err);
        return err;
      });

    }

    /**
     * Like Facebook Post
     * @param post
     * @returns {*}
       */
    function likeFbPost(post){
      if (!post || !post.postID || post.likes.has_liked) return;
      return ezfb.api('/'+post.postID+'/likes', 'POST').then(function(res){
         console.log(res);
         if (res.success){
            post.likes.has_liked = true;
            return post;
         } else return {errorCode: '', errorMessage:'Error[]: Unbale to Like Post!'};
      }).catch(function(err){
          console.log(err);
          return err;
      });
    }

      /**
       * Like a Tweet
       * @param post
       * @returns {*}
       */
    function favTweet(post){
      if (!post || !post.postID || post.favorited) return;
      return SocialMediaResource.
      favTweet({postID: post.postID}).$promise
        .then(function(res){
          console.log(res);
          if (res && (res.resp.statusCode == 200 || res.resp.statusCode == 403)){
              post.favorited = true;
              return post;
           } else return {errorCode: '', errorMessage: 'Error[]: Unbale to like tweet!'};
      }).catch(function(err){
           console.log(err);
           return err;
        })
    }

        /**
         * Post a Twitter status update
         * @param message
         * @returns {*}
         */
    function tweet(message){
      if (!message || message.trim() == '' || message.length > 140)
        throw {errorCode: '', errorMessage: 'Tweet can not be empty or more than 140 characters'};
      return SocialMediaResource
        .tweet({message: message}).$promise
        .then(function(res){
          console.log(res);
           if (res && res.resp.statusCode == 200){
             return {success: true, message: 'your tweet was successfully posted'};
           } else return {success: false};
      }).catch(function(err){
            console.log(err);
            return err;
        })
    }

    /**
     * Retweet a tweet
     * @param post
     * @returns {*}
       */
    function reTweet(post){
      if (!post || !post.postID || post.retweeted == true) return;
      return SocialMediaResource.
      reTweet({postID: post.postID}).$promise
        .then(function(res){
           console.log(res);
           if (res && (res.resp.statusCode == 200 || res.resp.statusCode == 403)){
              post.retweeted = true;
              return post;
           } else return {errorCode: '', errorMessage: 'Error[]: Unable to reTweet!'};
      }).catch(function(err){
           console.log(err);
           return err;
        });
    }

      /**
       * Add comment to fb posts
       * @param post
       */
    function addCommentFbPost(post){
       if (!post || !post.postID || !post.new_message || post.new_message.trim() == '') return;
       return ezfb.api('/'+post.postID+'/comments',{message: post.new_message}, 'POST')
         .then(function(res){
           console.log(res);
          if (res && res.id){
             return ezfb.api('/'+res.id+'?fields=attachment,like_count,from{name, picture},created_time,message')
               .then(function(res){
                 if(res && !res.error){
                    if (post.comments) post.comments.unshift(res);
                    else post.comments = ([]).push(res);
                    post.counts.comment_count++;
                    return post;
                 } else return {errorCode:'', errorMessage: 'Error[]: unable to retrieve posts comments'}
             }).catch(function(err){
                 console.log(err);
                 return err;
             })
          } else return {errorCode: '', errorMessage: 'Error[]: unable to update post comments'}
       }).catch(function(err){
          console.log(err);
          return err;
       });
    }

    //search Instagram
    function igSearch(term){


    }


    function createWatchlist(details){

      try {

        if (!details) throw {errorCode: '', errorMessage: 'Error[]: Monitoring Details are required'};
        if (!details.Watchlist) throw {errorCode: '', errorMessage: 'Error[]: Watchlist Details are required'};
        if (!details.Watchlist.WatchlistName || details.Watchlist.WatchlistName.trim() == '') throw {
          errorCode: '',
          errorMessage: 'Error[]: WatchlistName is required'
        };
        if (!details.Watchlist.dealershipName || details.Watchlist.dealershipName.trim() == '') throw {
          errorCode: '',
          errorMessage: 'Error[]: DealershipName is required'
        };
        if (!details.Keywords || !Array.isArray(details.Keywords) ||
          (Array.isArray(details.Keywords) && details.Keywords.length == 0)) throw {
          errorCode: '',
          errorMessage: 'Error[]: Keywords Array is required and cannot be empty'
        };
        if (!details.Sources || !Array.isArray(details.Sources) ||
          (Array.isArray(details.Sources) && details.Sources.length == 0)) throw {
          errorCode: '',
          errorMessage: 'Error[]: Sources Array is required and cannot be empty'
        };

        //Start monitoring social media
        return WatchlistResource.save(details).$promise
          .then(function (res) {
            console.log(res);
            toaster.success({
              title: 'Monitoring Started!',
              body: 'The watchlist was created and is currently being monitored!'
            });
          })
          .catch(function (err) {
            console.log(err);
            return err;
          });

      }
      catch(err) {
        return err;
      }


    }


      /**
       * getWatchlists
       * @param dealershipName
       * @returns {*}
       */
    function getWatchlistsByDealer(dealershipName){
        return WatchlistResource.query({dealershipName: dealershipName}).$promise
          .then(function (watchlists) {
            if (watchlists) {
              _watchlists = watchlists;
            } else return _watchlists = [];
          }).catch(function (err) {
            console.log(err);
            return err;
          });
    }






    // console.log(startMonitoring({
    //   Watchlist: {
    //     WatchlistName: 'Online Reputation Monitoring',
    //     WatchlistInfo: 'Monitor negative online activities pertaining to dealership',
    //     dealershipName: 'Hagerstown Ford'
    //   },
    //   Keywords: [
    //     {keyword: 'Fuck Hagerstown Ford'},
    //     {keyword: 'Hagerstown Ford is horrible'},
    //     {keyword: 'Hagerstown Ford sucks'},
    //     {keyword: 'Hagerstown Ford ripped me off'}
    //   ],
    //   Sources: ['facebook', 'twitter']
    // }));

    // Public API here
    return {
        search:searchSocialMedia,
        loadWatchlists: getWatchlistsByDealer,
        watchlists: getWatchlists,
        tweet: tweet,
        reTweet: reTweet,
        favs: favTweet,
        like: likeFbPost,
        comment: addCommentFbPost,
        searchResults: getSocialSearchResults,
        clear: clearResults,
        monitor:statMonitoring
    };

  });
