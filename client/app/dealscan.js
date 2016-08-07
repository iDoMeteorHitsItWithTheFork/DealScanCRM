/**
 * Created by ludovicagodio on 4/30/16.
 */
/**
 *
 * Custom scripts
 */

$(document).ready(function () {

  var size;
  function resizeFnc() {
    size = $(document).width();
    minimalize()
  }

  window.onresize = function(event) {

  };

  function minimalize (fire) {
    if (size < 1136) {
      $("body").addClass("mini-navbar");
      // For smoothly turn on menu
      setTimeout(
          function () {
            $('#side-menu').fadeIn(400);
          }, 100);
    } else {
      $("body").removeClass("mini-navbar");
      $('#side-menu').removeAttr('style');
    }

  }

  resizeFnc();

  function fix_height() {
    if ($('#page-wrapper').hasClass('social_media')) {
      $('#page-wrapper').css("height", $(window).height() + 15 + "px");
      $('body').css("overflow", "hidden");
      return;
    } else {
      setTimeout(function(){
        $('#page-wrapper').css("height", "100%");
        $('body').css("overflow", "auto");
      },1);
    }
  }
  setTimeout(function(){
    fix_height();
  });

});

// Minimalize menu when screen is less than 768px
$(function() {
  $(window).bind("load resize", function() {
    if ($(document).width() < 769) {
      $('body').addClass('body-small')
    } else {
      $('body').removeClass('body-small')
    }
  })
});
