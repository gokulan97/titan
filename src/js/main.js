
function main() {

(function () {
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
		console.log(top)
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

    // First, parse the query string
    var params = {}, queryString = location.hash.substring(1),
        regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    // Verify that the access_token is in the response
    if (params['access_token']) {
      // And send the token over to the server
      var url = 'https://auth.emergency-108-hackathon.hasura-app.io/google/authenticate?access_token='
        + params['access_token'];
      $.get(url, function(response) {
        // Sample response:
        // {
        //   "hasura_id": 23,
        //   "hasura_roles": ["user"],
        //   "auth_token": "aeo8u3dhauh3d39pdsiaw",
        //   "new_user": true
        // }
        console.log(response);
      });
    }
  	// Portfolio isotope filter
    $(window).load(function() {
        var $container = $('.portfolio-items');
        $container.isotope({
            filter: '*',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
        $('.cat a').click(function() {
            $('.cat .active').removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
            return false;
        });

    });


    // CounterUp
	$(document).ready(function( $ ) {
		if($("span.count").length > 0){
			$('span.count').counterUp({
					delay: 10, // the delay time in ms
			time: 1500 // the speed time in ms
			});
		}
	});

  	// Pretty Photo
	$("a[rel^='prettyPhoto']").prettyPhoto({
		social_tools: false
	});

}());


}
main();
