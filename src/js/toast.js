//toast.js
$.getScript("//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js", function(){

  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
  var toasts = [

    {
      type: 'success',
      message: 'Submissions are now open! Goto dashboard'
    },
    {
      type: 'info',
      message: 'Schedule has been updated!'
    },
    {
      type: 'success',
      message: 'Deadline extended till 4th Nov 2016 23:59 hrs!'
    }
  ]
  var i;
  i=0;
  function nextI (toasts) {
    if  (i>=toasts.length-1) {
      i = 0;
    } else {
      i += 1;
    }
    return toasts[i];
  }
  var toast = nextI(toasts);
  toastr[toast.type](toast.message);
  setInterval(function () {
    var toast = nextI(toasts);
    toastr[toast.type](toast.message);
  }, 5500);

});
