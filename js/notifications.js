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
      type: 'info',
      message: 'The finalists have been announced, please check dashboard.'
    },
    {
      type: 'info',
      message: 'The final event date is on December 17th Saturday and 18th Sunday 2016'
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
