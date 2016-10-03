var AUTH_URL = 'https://auth.108hackathon.in/';

function main() {

(function () {



  $('#dashboard').hide();
  $('#logoutNav').hide();

    if (window.location.hostname === 'localhost') {
      $('#google_signin_link').attr('href', "https://accounts.google.com/o/oauth2/v2/auth?scope=email&redirect_uri=http://localhost:8080/dashboard.html&response_type=token&client_id=252844604703-37otm075sogq6ggjub35qijh8qbuvqgu.apps.googleusercontent.com")
    }

   'use strict';

  	$('a.page-scroll').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 40
            }, 900);
            return false;
          }
        }
      });

	// affix the navbar after scroll below header
$('#nav').affix({
      offset: {
        top: $('header').height()
      }
});

	// skills chart
	$(document).ready(function(e) {
	//var windowBottom = $(window).height();
	var index=0;
	$(document).scroll(function(){
		var top = $('#skills').height()-$(window).scrollTop();
		if(top<-300){
			if(index==0){

				$('.chart').easyPieChart({
					easing: 'easeOutBounce',
					onStep: function(from, to, percent) {
						$(this.el).find('.percent').text(Math.round(percent));
					}
				});

				}
			index++;
		}
	})
	//console.log(nagativeValue)
	});

    $('.modal-btn').click(function(event)
      {
        $('.navbar-custom').toggle();
      });


    $('#logoutNav').click(function () {
      $.ajax({
        xhrFields: { withCredentials: true },
        crossDomain: true,
        type: 'GET',
        url: AUTH_URL + 'user/logout',
        success: function(response) {
          window.location = "/";
        },
        error: function (error) {
          //console.log(error);
        }
      });
    });

     function loginStatus(){

      $.ajax({
        xhrFields: { withCredentials: true },
        crossDomain: true,
        type: 'GET',
        url: AUTH_URL + 'user/account/info',
        success: function (data) {
         $('#dashboard').show();
         $('#logoutNav').show();
         $('#loginNav').hide();
         $('#login').hide();
         $('#header_register_button').hide();
         $('#header_dashboard_button').show();
         $('#registerNav').hide();
        },
        error: function (error) {
          // console.log(error);
        },
        dataType: 'json',
        contentType: 'application/json'
      });


    };
    loginStatus();


    // CounterUp
	$(document).ready(function( $ ) {
		if($("span.count").length > 0){
			$('span.count').counterUp({
					delay: 10, // the delay time in ms
			time: 1500 // the speed time in ms
			});
		}
	});


}());


}
main();
