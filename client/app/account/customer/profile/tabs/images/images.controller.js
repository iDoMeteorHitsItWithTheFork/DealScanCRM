'use strict';

angular.module('dealScanCrmApp')
  .controller('ImagesCtrl', function ($scope, Auth, Images, sweetAlert) {

    var _images = this;

    _images.user = Auth.getCurrentUser();
    _images.loadingImages = false;
    _images.imagesInfo = [];

    var loadImages = function(){
      if (_images.loadingImages) return;
      _images.loadingImages = true;
      Images.getImages().then(function(images){
        if (images)_images.imagesInfo = images;
        _images.loadingImages  = false;
      }).catch(function(err){
        _images.loadingImages = false;
        console.log(err);
        sweetAlert.swal('Images Load Error', 'Sorry, an error occured while attempting to retreive your images', 'error');
      })
    }


    loadImages();








    _images.data = [
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford',
        title:'Driver License',
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi',
        title: 'Trade In',
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi',
        title: 'Insurance Card',
      },
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford',
        title: 'Trade In',
      },
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford',
        title: 'Trade In',
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi',
        title: 'Trade In',
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi',
        title: 'Trade In',
      },
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford',
        title: 'Trade In',
      },
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford',
        title: 'Trade In',
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi'
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi',
        title: 'Trade In',
      },
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford',
        title: 'Trade In',
      },
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford',
        title: 'Trade In',
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi',
        title: 'Trade In',
      },
      {
        url: 'https://pbs.twimg.com/profile_images/650236170480189440/-1U1Fzij.jpg',
        alt: 'Audi',
        title: 'Trade In',
      },
      {
        url: 'http://ep.yimg.com/ay/yhst-59923783762737/2008-2014-3d-carbon-ford-f150-dual-hood-scoop-style-kits-3.jpg',
        alt: 'Ford',
        title: 'Trade In',
      }
    ]


  });
