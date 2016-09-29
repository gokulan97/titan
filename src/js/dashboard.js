var DATA_URL = 'https://data.emergency-108-hackathon.hasura-app.io/v1/query';
var AUTH_URL = 'https://auth.emergency-108-hackathon.hasura-app.io/';

var USER;
var TEAM;
var EDIT_PERSON;
var TEAM_COPY;

function dashboard() {

(function () {
   'use strict';
   $.ajaxSetup({
      xhrFields: { withCredentials: true },
      crossDomain: true,
      headers: {'X-Hasura-Role' : 'user'}
    });

//   	$('a.page-scroll').click(function() {
//         if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
//           var target = $(this.hash);
//           target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
//           if (target.length) {
//             $('html,body').animate({
//               scrollTop: target.offset().top - 40
//             }, 900);
//             return false;
//           }
//         }
//       });
//
// 	// affix the navbar after scroll below header
// $('#nav').affix({
//       offset: {
//         top: $('header').height()
//       }
// });

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
        crossDomain: true,
        type: 'GET',
        url: url,
        success: function(response) {
          window.location = "/dashboard.html";
          console.log(response);
        }
      });
    }

    function loadUser(){
      $.ajax({
        xhrFields: { withCredentials: true },
        crossDomain: true,
        type: 'GET',
        url: AUTH_URL + '/user/account/info',
        success: function (data) {
            USER = data;
        },
        error: function (error) {
          console.log(error);
        },
        dataType: 'json',
        contentType: 'application/json'
      });
    };
    loadUser();

    function loadTeam() {
      $.ajax({
        xhrFields: { withCredentials: true },
        crossDomain: true,
        type: 'POST',
        url: DATA_URL,
        data: JSON.stringify({
          type: 'select',
          args: {
            table: 'registration',
            columns: ['*']
          }
        }),
        success: function (data) {
          if (data.length == 0) {
            $('#register_div').show();
          } else {
            TEAM = data[0];
            $('#team_details_div').show();
          }
          renderTeamDetails();
        },
        dataType: 'json',
        contentType: 'application/json'
      });
    };
    loadTeam();

    function renderTeamDetails () {
      $('span#team_name').html(TEAM.name);
      var team_copy = $.extend({}, TEAM);
      delete(team_copy.name);
      delete(team_copy.id);
      delete(team_copy.leader_id);
      for (var key in team_copy){
        $('#'+key).html(team_copy[key] || '-');
      }
    }

    function createTeam(team) {
      $.ajax({
        xhrFields: { withCredentials: true },
        crossDomain: true,
        type: 'POST',
        url: DATA_URL,
        data: JSON.stringify({
          type: 'insert',
          args: {
            table: 'registration',
            returning: [
              'id',
              'leader_id',
              'leader_name',
              'leader_email',
              'leader_mobile',
              'leader_institute',
              'member1_name',
              'member1_email',
              'member1_mobile',
              'member1_institute',
              'member2_name',
              'member2_email',
              'member2_mobile',
              'member2_institute',
              'name'
            ],
            objects: [
              {
                name: team,
                leader_id: USER.hasura_id
              }
            ]
          }
      }),
      success: function (data) {
          TEAM = data['returning'][0];
          $('#register_team_button').html('Registered');
          $('#register_div').hide();
          $('#team_details_div').show();
          renderTeamDetails();
      },
      error: function (error) {
          $('#register_team_button').html('Error! Try again');
          console.log(error);
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  };

  function saveTeam(payload) {
    $.ajax({
      xhrFields: { withCredentials: true },
      crossDomain: true,
      type: 'POST',
      url: DATA_URL,
      data: JSON.stringify({
        type: 'update',
        args: {
          table: 'registration',
          $set: payload,
          where: {
            id: TEAM.id
          },
          returning: [
            'id',
            'leader_id',
            'leader_name',
            'leader_email',
            'leader_mobile',
            'leader_institute',
            'member1_name',
            'member1_email',
            'member1_mobile',
            'member1_institute',
            'member2_name',
            'member2_email',
            'member2_mobile',
            'member2_institute',
            'name'
          ]
        }
      }),
      success: function (data) {
        TEAM = data['returning'][0];
        $('#save_person_button').html('Saved');
        $('#addPeopleModal').modal('hide');
        renderTeamDetails();
      },
      error: function (error) {
        $('#save_person_button').html('Error! Try again');
        console.log(error);
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }

  $('#register_team_button').click(function(e){
    var terms_agree = $('#agree_to_terms').is(":checked");
    var team_name = $('#team_name_input').val();

    if (terms_agree && team_name) {
      createTeam(team_name);
      $('#register_team_button').html('Registering...');
    } else {
      $('#register_team_button').html('Enter team name and agree to terms!');
    }
  });

  $('.edit_person_button').click(function () {
      EDIT_PERSON = $(this).data('person');
      var fields = ['name', 'email', 'mobile', 'institute'];
        var data = {};
        for (var key in fields) {
          $("#form_"+fields[key]).val(TEAM[EDIT_PERSON + '_' + fields[key] ])
        }
      $('#addPeopleModal').modal('show');
  });

  $('#save_person_button').click(function () {
    $('#save_person_button').html('Saving...');
    var fields = ['name', 'email', 'mobile', 'institute'];
      var data = {};
      for (var key in fields) {
        data[EDIT_PERSON + '_' + fields[key] ] = $("#form_"+fields[key]).val()
      }
      console.log(data);
      saveTeam(data);
  });

  $('#logout_button').click(function () {
    $.ajax({
      xhrFields: { withCredentials: true },
      crossDomain: true,
      type: 'GET',
      url: AUTH_URL + 'user/logout',
      success: function(response) {
        window.location = "/";
      },
      error: function (error) {
        console.log(error);
      }
    });
  })


}());


}
dashboard();
