'use strict';


import './modules/helpers';

// Import jQuery (if you need jquery);
import $ from 'jquery';
window.jQuery = $;
console.log($.fn.jquery);

    // https://scrollrevealjs.org
import ScrollReveal             from './modules/scrollreveal';
    // https://github.com/liabru/jquery-match-height
import matchHeight              from './modules/jquery.matchHeight';
    // https://github.com/WeCodePixels/theia-sticky-sidebar
import theiaStickySidebar       from './modules/theia-sticky-sidebar';
    // https://github.com/garand/sticky
import sticky                   from './modules/jquery.sticky';
    // https://www.berriart.com/sidr/
import sidr                     from './modules/jquery.sidr';
    // https://github.com/joaopereirawd/animatedModal.js
import animatedModal            from './modules/animatedModal';
    // http://github.com/EasyFood/PageAccelerator 
import                               './modules/page-accelerator';
    // https://github.com/wagerfield/parallax
// import parallax                 from './modules/parallax';
    // https://github.com/hustcc/timeago.js
// import timeago                  from './modules/timeago';



$(document).ready(function () {

    pageAccelerator();
    
    // loading bar
    Pace.on("done", function(){
        $("#wrapper").fadeIn(2000);
    });


    // login form in top bar
    $("#login-link").animatedModal({
      beforeOpen: function() {
        setTimeout( function(){
          $(".login-form").show().velocity("slideDown", { duration: 200 });
        } , 600 );
      },
      afterClose: function() {
        $(".login-form").hide();
      }
    });

    // Sticky navegation
    $(window).on("scroll", function(e) {
        if ($(window).scrollTop() > 120) {
            $('.main-menu').addClass('main-menu-stick');
        }
         else {
            $('.main-menu').removeClass('main-menu-stick');
        }
    });

    // mobile menu
    $('.mobile_menu').on('click', function(event){
      if ( $('nav').is(":visible") ) {
        $('nav').velocity("slideUp", { duration: 200 });
      }else {
        $('nav').velocity("slideDown", { duration: 200 });
      }
    });

    // Side Menu
    $('#toggle-menu').sidr({
        side: 'right'
    });

    // Header hiehgt
    $("header").css("height", $(window).height() - 40);
    // $("header").height($(window).height() - 40);


    

    // var scene = document.getElementById('scene');
    // var parallax = new Parallax(scene, {
    //   calibrateX: false,
    //   calibrateY: true,
    //   invertX: false,
    //   invertY: true,
    //   limitX: false,
    //   limitY: 10,
    //   scalarX: 2,
    //   scalarY: 8,
    //   frictionX: 0.2,
    //   frictionY: 0.8,
    //   originX: 0.0,
    //   originY: 1.0
    // });


  // $(function(){
  //   var $container = $('.portfolioContainer');
  //   $container.isotope({
  //       filter: '*',
  //       itemSelector: '.mix',
  //       isOriginLeft: false,
  //       // layoutMode:'masonry',
  //       // masonry:{
  //       //     columnWidth: 100
  //       // }    
  //   });
  //   $('.portfolioFilter').on( 'click', 'button', function() {
  //       $('.portfolioFilter .current').removeClass('current');
  //       $(this).addClass('current');
 
  //       var selector = $(this).attr('data-filter');
  //       $container.isotope({
  //           filter: selector,
  //       });
  //       return false;
  //   }); 
  // });





    // $('.item').matchHeight(options);

    // $('.content, .sidebar').theiaStickySidebar({
    //   // Settings
    //   additionalMarginTop: 30
    // });


    window.sr = ScrollReveal().reveal('.sec_headline');

    $('.go-top').on('click', function (event) {
        $('html, body').velocity('scroll',{duration: 1000, offset:0});
    });

});
