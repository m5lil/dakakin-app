'use strict';


// import './modules/helpers';

// Import jQuery (if you need jquery);
import $ from 'jquery';
window.jQuery = $;
console.log($.fn.jquery);

import ScrollReveal from './modules/scrollreveal';
import matchHeight from './modules/jquery.matchHeight';
import theiaStickySidebar from'./modules/theia-sticky-sidebar';
import sticky from'./modules/jquery.sticky';
import sidr from'./modules/jquery.sidr';

$(document).ready(function () {


    Pace.on("done", function(){
        $("#wrapper").fadeIn(2000);
    });



	// Loader
	$(window).on('load', function(){
		setTimeout(function () {
		    $('#loader').css('display', 'none');
		}, 300);
	});

	


	// ScrollReveal
	// window.sr = ScrollReveal().reveal('.header');



    // Login DropDown Form 
    $('#session').click(function () {
        if ($('#signin-dropdown').is(":visible")) {
            $('#signin-dropdown').hide()
            $('#session').removeClass('active'); // When the dropdown is not visible removes the class "active"
        } else {
            $('#signin-dropdown').show()
            $('#session').addClass('active'); // When the dropdown is visible add class "active"
        }
        return false;
    });



    // Release when click outside
    $('#signin-dropdown').click(function(e) {
        e.stopPropagation();
    });

    $(document).click(function() {
        $('#signin-dropdown').hide();
        $('#session').removeClass('active');
    });



    // Side Menu
    $('#toggle-menu').sidr({
        side: 'right'
    });

});
