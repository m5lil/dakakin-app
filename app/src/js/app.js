'use strict';


// import './modules/helpers';

// Import jQuery (if you need jquery);
import $ from 'jquery';
window.jQuery = $;
console.log($.fn.jquery);

import ScrollReveal from './modules/scrollreveal';
    // https://github.com/liabru/jquery-match-height
import matchHeight from './modules/jquery.matchHeight';
    // https://github.com/WeCodePixels/theia-sticky-sidebar
import theiaStickySidebar from'./modules/theia-sticky-sidebar';
    // https://github.com/garand/sticky
import sticky from'./modules/jquery.sticky';
import sidr from'./modules/jquery.sidr';
// import velocity from'./modules/velocity';
import animatedModal from'./modules/animatedModal';

$(document).ready(function () {

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

    
  $("header").height($(window).height() - 40);

  // window.sr = ScrollReveal().reveal('.header');


    // $('.item').matchHeight(options);


    // $("#sticker").sticky({topSpacing:0});
    // $("#sticker").unstick();


    // $('.content, .sidebar').theiaStickySidebar({
    //   // Settings
    //   additionalMarginTop: 30
    // });

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



    $('.go-top').on('click', function (event) {
        $('html, body').velocity('scroll',{duration: 1000, offset:0});
    });

});
