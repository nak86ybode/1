$(document).ready(function(){
  if($("#timer").length > 0) {
   var cookie = $.cookie("igym_timer");
   var date_cookie = $.cookie("igym_date");
   function getTimeRemaining(endtime) {
      var t = Date.parse(endtime) - Date.parse(new Date());
      var seconds = Math.floor((t / 1000) % 60);
      var minutes = Math.floor((t / 1000 / 60) % 60);
      var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
      var days = Math.floor(t / (1000 * 60 * 60 * 24));
      return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
      };
    }
  
    function initializeClock(id, endtime) {
      var clock = $(id);
      var daysSpan    = clock.children(".timer-block")[0];
      var hoursSpan   = clock.children(".timer-block")[1];
      var minutesSpan = clock.children(".timer-block")[2];
      var secondsSpan = clock.children(".timer-block")[3];
      
      function updateClock() {
        var t = getTimeRemaining(endtime);
        if (t.total <= 0) {
          clearInterval(timeinterval);
          $(minutesSpan).addClass("op");
          $(secondsSpan).addClass("op");
        }else{
          
          if(t.minutes == 0) {
            $(minutesSpan).addClass("op");  
          }
          if(t.seconds == 0 && t.minutes == 0) {
            $(secondsSpan).addClass("op");  
          }
          $(hoursSpan).children("div:nth-child(1)").text(('0' + t.hours).slice(-2));
        $(minutesSpan).children("div:nth-child(1)").text(('0' + t.minutes).slice(-2));
        $(secondsSpan).children("div:nth-child(1)").text(('0' + t.seconds).slice(-2));
    
        }
      }
    
      updateClock();
      var timeinterval = setInterval(updateClock, 1000);
    }
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;
    var curr_year = d.getFullYear();
    var date = curr_date + "/" + curr_month + "/" + curr_year;
    
    if(cookie == undefined || date != date_cookie){
      var deadline = new Date(Date.parse(new Date()) + 48 * 60 * 1000 - 1000);
      initializeClock('#timer', deadline);
      initializeClock('#timerp', deadline);
      initializeClock('#timer-s', deadline);  
      document.cookie = "igym_timer=" + new Date().getTime() + "; path=/;";
      document.cookie = "igym_date=" + date + "; path=/;";
    }else{
      
      initializeClock('#timer', new Date(parseInt($.cookie("igym_timer")) + 48 * 60 * 1000 - 1000));
      initializeClock('#timerp', new Date(parseInt($.cookie("igym_timer")) + 48 * 60 * 1000 - 1000));
      initializeClock('#timer-s', new Date(parseInt($.cookie("igym_timer")) + 48 * 60 * 1000 - 1000));
    }
  }
});