var DATA_URL = 'https://data.108hackathon.in/v1/query';
var AUTH_URL = 'https://auth.108hackathon.in/';

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

    // $('.modal-btn').click(function(event)
      // {
        // $('.navbar-custom').toggle();
      // });

    // First, parse the query string
    var params = {}, queryString = location.hash.substring(1),
        regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    // Verify that the access_token is in the response
    if (params['access_token']) {
      // And send the token over to the server
      var url = AUTH_URL + 'google/authenticate?access_token='
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

    if (window.location.hostname === 'localhost') {
      $('#google_signin_link').attr('href', "https://accounts.google.com/o/oauth2/v2/auth?scope=email&redirect_uri=http://localhost:8080/dashboard.html&response_type=token&client_id=252844604703-37otm075sogq6ggjub35qijh8qbuvqgu.apps.googleusercontent.com")
    }

    function logout(){
      $.ajax({
        xhrFields: { withCredentials: true },
        crossDomain: true,
        type: 'GET',
        url: AUTH_URL + 'user/logout',
        success: function (data) {

        },
        error: function (error) {
          console.log(error);
        },
        dataType: 'json',
        contentType: 'application/json'
      });
    };

    function loadUser(){
      $.ajax({
        xhrFields: { withCredentials: true },
        crossDomain: true,
        type: 'GET',
        url: AUTH_URL + 'user/account/info',
        success: function (data) {
            USER = data;
            $('#google_signin_link').hide();
            $('#loading_overlay').hide();
        },
        error: function (error) {
          console.log(error);
          $('#loading_overlay').hide();
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
          $('.loading').hide();

          if (data.length == 0) {
            $('#register_div').show();
          } else {
            TEAM = data[0];
            $('#team_details_div').show();
            $('.proposal_submission').show();
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

    function createTeam(team_name, inst_name) {
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
                name: team_name,
                leader_id: USER.hasura_id,
                leader_email: USER.email,
                leader_institute: inst_name
              }
            ]
          }
      }),
      success: function (data) {
          TEAM = data['returning'][0];
          $('#register_team_button').html('Registered');
          $('#register_div').hide();
          $('#team_details_div').show();

            $('.proposal_submission').show();
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

  function deleteTeam() {
    $.ajax({
      xhrFields: { withCredentials: true },
      crossDomain: true,
      type: 'POST',
      url: DATA_URL,
      data: JSON.stringify({
        type: 'delete',
        args: {
          table: 'registration',
          where: {
            name: TEAM.team,
            leader_id: USER.hasura_id,
          }
        }
    }),
    success: function (data) {
        window.location = "/dashboard.html";
    },
    error: function (error) {
        $('#delete_registration').html('Error! Try again');
        console.log(error);
    },
    dataType: 'json',
    contentType: 'application/json'
  });
  }

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
    var inst_name = $('#leader_inst_name_input').val();

    if (terms_agree && team_name && inst_name) {
      createTeam(team_name, inst_name);
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



  function validateEmail(email) {
  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}
var fields = ['name', 'email', 'mobile', 'institute'];
for(var key in fields)
{
$("#form_"+fields[key]).val('');
}
  $('#save_person_button').click(function () {


    var member_name=$('#form_name').val();
    var member_email=$('#form_email').val();
    var member_mobile=$('#form_mobile').val();
    var member_institute=$('#form_institute').val();
    var moblength=member_mobile.length;
  if (moblength==10&&member_name&&member_email&&member_institute&&member_mobile&&validateEmail(member_email)) {
    $('#save_person_button').html('Saving...');


    var fields = ['name', 'email', 'mobile', 'institute'];
      var data = {};
      for (var key in fields) {
        var dataType = EDIT_PERSON + '_' + fields[key];
        if (dataType == 'leader_email') {
          // do nothing
        } else {
          data[dataType] = $("#form_"+fields[key]).val();
        }
      }
      console.log(data);
      saveTeam(data);
  }
  else{


   $('#save_person_button').html('Enter details');}

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
  });

  $('#delete_registration').click(function(){
    var result = confirm("Are you sure you want to unregister? All data will be lost!");
    if (result) {
      deleteTeam();
    }
  })


}());


}
dashboard();
