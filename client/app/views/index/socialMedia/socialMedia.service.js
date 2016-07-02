'use strict';

angular.module('dealScanCrmApp')
  .factory('SocialMedia', function (Auth, Util, $resource, $filter, $q, appConfig, SocialMediaResource) {
    // Service logic
    var _socialSearchResults = { data: [], searchParams: {}};

    //get Stored results
    function getSocialSearchResults(){
      return _socialSearchResults;
    }

    //clear stored results
    function clearResults(){
      _socialSearchResults = {data: [], searchParams: {}};
    }


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

    //Search facebook
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
               avatar: _res[i].from.picture.data.url,
               created_at: _res[i].created_time,
               geo: _res[i].coordinates,
               comments: _res[i].comments && _res[i].comments.data.length > 0 ? _res[i].comments.data : [],
               counts: {
                 share_count: 0, //retweet count / share count for facebook
                 like_count: _res[i].likes ? _res[i].likes.summary.total_count : 0,
                 comment_count: _res[i].comments ? _res[i].comments.summary.total_count: 0,
               }
             }

             // if (_res[i].comments && _res[i].comments.data.length > 0){
             //    var _comments = [], comments = _res[i].comments;
             //    for(var c=0; c < comments.data.length; i++){
             //        _comments.push({
             //           from: comments.data[c].from.name,
             //           avatar: comments.data[c].from.picture.data.url,
             //           text: comments.data[c].message,
             //           created_at: comments.data[c].created_time,
             //           like_count: comments.data[c].like_count
             //        });
             //    }
             //   dataModel.comments = _comments;
             // }

             if (_res[i].attachments && _res[i].attachments.data[0]){
               dataModel.text = _res[i].attachments.data[0].description ? _res[i].attachments.data[0].description : null;
               if (_res[i].attachments.data[0].media && _res[i].attachments.data[0].media.image){
                 dataModel.image = _res[i].attachments.data[0].media.image.src; //if empty null
               } else dataModel.image = null;
             }
             _data.push(dataModel);
           }
           return _socialSearchResults = {data: _data, searchParams: params, next: next};;
         })
         .catch(function(err){
            console.log(err);
            return err;
         });

    }


    //parse next_results string from twitter queries
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



    //Search Twitter
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
                text: _res[i].text,
                image: _res[i].entities.media ? _res[i].entities.media[0].media_url : null,
                created_at: _res[i].created_at,
                geo: _res[i].coordinates ? [_res[i].coordinates.coordinates[1],_res[i].coordinates.coordinates[0]]: null, //FYI: coordinates is formatted in geoJSON [longitude, latitude]
                counts: {
                  share_count: _res[i].retweet_count,
                  like_count: _res[i].favorite_count,
                  comment_count: null
                },
                comments: []
              };
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

            } return _socialSearchResults = {data: _data, searchParams: params, next: next};
          } else return [];
        }).catch(function (err) {
          console.log(err);
          return err;
        });

    }


    //Search social
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
        var resData = {data:[], searchParams:{}};
        console.log(res);
        for(var i = 0; i < res.length; i++){
          if (res[i].errorCode || res[i].errorMessage)
            throw {errorCode:res[i].errorCode, errorMessage:res[i].errorMessage};
          resData.data = resData.data.concat(res[i].data);
          resData.searchParams[searchOptions.sources[i].name+'Params'] = res[i].searchParams;
        } return resData;
      })
        .catch(function(err){
        console.log(err);
        return err;
      });

    }


    //search Instagram
    function igSearch(term){


    }



    // Public API here
    return {
        search:searchSocialMedia,
        searchResults: getSocialSearchResults,
        clear: clearResults
    };

  });
