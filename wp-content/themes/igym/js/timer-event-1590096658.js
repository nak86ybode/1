$(document).ready(function(){
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
    
    function updateClock() {
      var t = getTimeRemaining(endtime);
      if (t.total <= 0) {
        $(daysSpan).addClass("op");
        $(hoursSpan).addClass("op");
        $(minutesSpan).addClass("op");
        clearInterval(timeinterval);
      }else{
        if(t.days == 0) {
          $(daysSpan).addClass("op");  
        }
        if(t.hours == 0 && t.days == 0) {
          $(hoursSpan).addClass("op");  
        }
        if(t.minutes == 0 && t.hours == 0 && t.days == 0) {
          $(minutesSpan).addClass("op");  
        }
        
        $(daysSpan).children("div:nth-child(1)").text(t.days);
        $(hoursSpan).children("div:nth-child(1)").text(('0' + t.hours).slice(-2));
        $(minutesSpan).children("div:nth-child(1)").text(('0' + t.minutes).slice(-2));
      }
    }
  
    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
  }
  //var deadline = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);
  var time  = $("#timer1").data("time").split(":");
  var hour = parseInt(time[0]) * 60 * 60 * 1000;
  var minutes = parseInt(time[1]) * 60 * 1000;
  var deadline = new Date(Date.parse($("#timer1").data("date")) + hour + minutes);
  initializeClock('#timer1', deadline);
});