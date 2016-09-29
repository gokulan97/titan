var DATA_URL = 'https://data.emergency-108-hackathon.hasura-app.io/v1/query';
var AUTH_URL = 'https://auth.emergency-108-hackathon.hasura-app.io/';

var USER;

function dashboard() {

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
      $.ajax({
        xhrFields: { withCredentials: true },
        type: 'GET',
        url: url,
        success: function(response) {
          USER = response;
          loadTeam();
          console.log(response);
        }
      });
    }

    function loadUser(){
      $.ajax({
        xhrFields: { withCredentials: true },
        type: 'GET',
        url: AUTH_URL + '/user/account/info',
        success: function (data) {
            console.log(data);
            USER = data;
        },
        dataType: 'json',
        contentType: 'application/json'
      });
    };
    loadUser();

    function loadTeam() {
      $.ajax({
        xhrFields: { withCredentials: true },
        type: 'POST',
        url: DATA_URL,
        data: JSON.stringify({
          type: 'select',
          args: {
            table: 'team',
            columns: [
              'id', 'name', {name: 'leader', columns:['name', 'email', 'mobile']},
              {name: 'member2', columns:['name', 'email', 'mobile']},
              {name: 'member3', columns:['name', 'email', 'mobile']}
            ]
          }
        }),
        success: function (data) {
            console.log(data);
        },
        dataType: 'json',
        contentType: 'application/json'
      });
    };
    loadTeam();

    function createTeam(team) {
      $.ajax({
        xhrFields: { withCredentials: true },
        type: 'POST',
        url: DATA_URL,
        data: JSON.stringify({
          type: 'insert',
          args: {
            table: 'team',
            returning: ['id', 'name'],
            objects: [
              {
                name: team,
                leader_id: USER.hasura_id
              }
            ]
          }
      }),
      success: function (data) {
          console.log(data);
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  };

  $('#register_team_button').click(function(e){
    createTeam($('#team_name_input').val());
  });




}());


}
dashboard();
