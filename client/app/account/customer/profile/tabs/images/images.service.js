'use strict';

angular.module('dealScanCrmApp')
  .factory('Images', function (ImageResource) {
    // Service logic
    // ...

    var _images = [];
    var _searchResults = []
    var _imagesInfo = [];
    var _searchResultsInfo = [];
    var _pageSize = 1000;

    /*
     * Returns a list of images
     * */
    function getImages() {
      _images.length = 0;
      return ImageResource.get()
        .$promise.then(function (images) {
          _images = images || [];
          _imagesInfo = images ? images.rows : [];
          _imagesInfo = (_imagesInfo.length > _pageSize) ? _imagesInfo.slice(0, _pageSize) : _imagesInfo;
          console.log(_imagesInfo);
          return _imagesInfo;
        }).catch(function (err) {
          console.log(err);
          return err;
        })
    }


    /*
     * Returns image with specified imageId
     * */
    function getImage(imageID) {
      console.log(imageID);
      return ImageResource.get({id: imageID})
        .$promise.then(function (image) {
          return image;
        }).catch(function (err) {
          console.log(err);
          return err;
        })
    }

    /*
     * Search image array for image match
     *
     * */
    function filterImages(find, images) {
      return $filter('filter')(images, find);
    }

    /*
     * Sort image array
     *
     * */
    function sortImages(images, criteria, reverse) {
      return $filter('orderBy')(images, criteria, reverse);
    }

    /*
     * Returns a list of images with the associated name
     *
     * */
    function findImage(imageTitle) {
      _images.length = 0;
      imageTitle = Util.slimTrim(imageTitle);
      return ImageResource.get({title: imageTitle}).
        $promise.then(function (searchResults) {
          _searchResults = searchResults || [];
          _searchResultsInfo = searchResults ? searchResults.rows : [];
          _searchResultsInfo = (_searchResultsInfo.length > _pageSize) ? _searchResultsInfo.slice(0, _pageSize) : _searchResultsInfo;
          return _searchResultsInfo;
        }).catch(function (err) {
          console.log(err);
          return err;
        })
    }


    function updateImages(newImage) {
      var idx = _images.rows.indexOf(newImage);
      if (idx != -1) return false;
      _images.rows.unshift(newImage);
      _images.count++;
      return true;
    }

    /*
     *  Create a new image
     *
     *
     * */

    function addImage(image) {
      return ImageResource.save(image).
        $promise.then(function (newImage) {
        console.log(newImage);
        updateImages(newImage);
        return newImage;
      }).catch(function (err) {
        console.log(err);
        return err;
      })
    }

    function updateImage(id, image) {
      console.log(image);
      return ImageResource.update({id:id}, image).
        $promise.then(function (updatedImage) {
          console.log(updatedImage);
          if (Util.indexOfObject(_images.rows, 'imageID', id) != -1) {
            var idx = Util.indexOfObject(_images.rows, 'imageID', id);
            _images.rows.splice(idx, 1, updatedImage);
          }
          return updatedImage;
        }).catch(function (err) {
          console.log(err);
          return err;
        })
    }


    function removeImage(id) {
      return ImageResource.delete({id:id}).
        $promise.then(function(deletedImage){
          if (_images.rows){
            var idx = Util.indexOfObject(_images.rows, 'imageID', id);
            if (idx != -1) _images.rows.splice(idx,1);
          }
          if (_searchResults.rows) {
            var idx_ = Util.indexOfObject(_searchResults.rows, 'imageID', id);
            if (idx_ != -1) _searchResults.rows.splice(idx_,1);
          }
          return _imagesInfo;
        }).catch(function(err){
          console.log(err);
          return err;
        })
    }


    // Public API here
    return {
      get: getImage,
      find: findImage,
      getImages: getImages,
      filterImages: filterImages,
      sortImages: sortImages,
      add: addImage,
      update: updateImage,
      remove: removeImage,
      images: function () {
        return _imagesInfo;
      },
      searchResults: function () {
        return _searchResults;
      },
      getRows: function () {
        return _images.rows;
      },
      getCount: function () {
        return _images.count;
      },
      getResultsCount: function () {
        return _searchResults.count;
      }
    };
  });
