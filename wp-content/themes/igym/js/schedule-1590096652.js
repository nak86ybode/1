$(document).ready(function(){ 
  
  $(".arrow-schedule").click(function(){
    $("html, body").animate({ scrollTop: $(".schedule").offset().top }, 1000);
  })
  
  var currentDateTime = new Date();
  var startTimeOfCurrentYear = (new Date(currentDateTime.getFullYear(), 0, 1)).getTime();
  var currentTime = currentDateTime.getTime();
  var pastTimeOfStartCurrentYear = currentTime - startTimeOfCurrentYear;
  var hourOfMillisecs = 3600000;
  var hoursOfOneWeek = 168;



  var week = Math.ceil(pastTimeOfStartCurrentYear / hourOfMillisecs / hoursOfOneWeek);
  var rooms = "";
  var groups = "";
  var trainers = "";
  var handlerSelect_f = false;
  
  loadSchedule(week);
  $(".schedule-filter-tools-today").click(function(){
    rooms = "";
    groups = "";
    trainers = "";
    $(".select[name=groups] .select-dropdown-item-title").each(function(){
      $(this).removeClass("active"); 
    });
    $(".select[name=rooms] .select-dropdown-item-title").each(function(){
      $(this).removeClass("active"); 
    });
    $(".select[name=trainers] .select-dropdown-item-title").each(function(){
      $(this).removeClass("active"); 
    });
    week = Math.ceil(pastTimeOfStartCurrentYear / hourOfMillisecs / hoursOfOneWeek);
    loadSchedule(week);  
    return false;
  });
  
  
  $(".schedule-filter-tools > div a").click(function(){
    week = $(this).data("week");
    rooms = "";
    groups = "";
    trainers = "";
    loadSchedule(week);  
    return false;
  });
  
  $(".schedule-filter-tools-print").click(function(){
    var href = $(this).data("url");
    href += "?week=" + week;
    href += "&rooms=" + rooms;
    href += "&groups=" + groups;
    href += "&trainers=" + trainers;
    $(this).attr("href", href);
  })
  
  function loadSchedule(week, change = 's1') {
    $(".schedule-wrp-time").css("display", "block");
    $(".schedule-wrp-time-date").empty();
    $(".schedule-dates div").removeClass("current");
    $(".loader-wrp2").toggle();
    $.ajax({
    "url": $("body").data("url") + "/wp-admin/admin-ajax.php",
    "type":"POST",
    "data": {
      "action":"get_schedule",
      "week": week,
      "rooms": rooms,
      "groups": groups,
      "trainers": trainers,
    },
    success:function(data) {
      var json = JSON.parse(data);
      var dates = json.dates;
      var schedule = json.schedule;
      if(json.next_week == 0) {
        $(".schedule-filter-tools > div a:nth-child(3)").css("display", "none");
      } else {
        $(".schedule-filter-tools > div a:nth-child(3)").css("display", "inline-block");
        $(".schedule-filter-tools > div a:nth-child(3)").data("week", json.next_week)
      }
      if(json.prev_week == 0) {
        $(".schedule-filter-tools > div a:nth-child(1)").css("display", "none");
      } else {
        $(".schedule-filter-tools > div a:nth-child(1)").css("display", "inline-block");
        $(".schedule-filter-tools > div a:nth-child(1)").data("week", json.prev_week)
      }
      
      $(".schedule-filter-tools > div span").text(json.date_start + " - " + json.date_end);
      for(var i = 0; i < 7; i++) {
        var n = i + 2;
        $(".schedule-dates div:nth-child(" + n + ") span:nth-child(1)").text(dates[i].day_name + ": ");
        $(".schedule-dates div:nth-child(" + n + ") span:nth-child(2)").text(dates[i].date);
        $(".schedule-wrp-time div:nth-child(" + n + ")").attr("data-date", dates[i].date);
        if(dates[i].current) {
          $(".schedule-dates div:nth-child(" + n + ")").addClass("current");  
        }
      }
      for(var i = 0; i < schedule.length; i++) {
        var item = schedule[i];
        var current_class = '';
        var change_class = '';
        if(item.change_flag) {
          change_class = 'change';
        }
        if(item.current) {
          current_class = 'current';
        }
        var item_element = '<div class="schedule-item ' + current_class + ' ' + change_class + '" data-id="' + item.id + '">';
        item_element += '<div class="schedule-item-data clearfix">';
        item_element += '<div class="schedule-item-photos">';
        for(var j = 0; j < item.trainers.length; j++) {
          if(item.trainers[j].facePhoto) {
            item_element += '<div class="schedule-item-photo" style="background: url(' + item.trainers[j].facePhoto + ') no-repeat;background-position: center;background-size: cover"></div>';  
          }
        }
        item_element += '</div>';
        item_element += '<div class="schedule-item-types">';
        if(item.commercial) {
          item_element += '<img src="' + $("body").data("theme") + '/img/commercial-c.png">';  
        } else {
          item_element += '<img src="' + $("body").data("theme") + '/img/commercial.png">';
        }
        if(item.popular) {
          item_element += '<img src="' + $("body").data("theme") + '/img/popular-c.png">';  
        } else {
          item_element += '<img src="' + $("body").data("theme") + '/img/popular.png">';
        }
        item_element += '</div>';
        item_element += '</div>';
        item_element += '<div class="schedule-item-title">' + item.name + '</div>';
        item_element += '<div class="schedule-item-inreval">' + item.time_start + ' - ' + item.time_end + '</div>';
        if(item.age) {
          item_element += '<div class="schedule-item-length">' + item.age + '</div>';  
        }
        if(item.change) {
          console.log(item.change.type);
          if(item.change.type == 'canceled') {
            item_element += '<div class="schedule-item-canceled">' + item.change.title + '</div>';
          }
        }
        item_element += '</div>';
        $(".schedule-wrp-time-date[data-time='" + item.time_sort + "'][data-date='" + item.date + "']").append(item_element);
      }
      $(".schedule-wrp-time").each(function(){
        if($(this).find(".schedule-item").length == 0) {
          $(this).css("display", "none");
        }
      });
      $(".schedule-item-photos").each(function(){
        if($(this).children("div").length == 0) {
          $(this).parent().addClass("nophoto");
        }
      });
      if(change == 's1' || change == 's2') {
        var rooms = json.rooms;
        if($("#rooms > div").length == 1) {
          for(var i = 0; i < 100; i++) {
            if(rooms[i]) {
              $("#rooms").append('<div class="select-dropdown-item" data-value="' + rooms[i].id + '"><div class="select-dropdown-item-title">' + rooms[i].title + '</div></div>');
            }  
          } 
        } else {
          $("#rooms > div").css("display", "none");
          $("#rooms > div[data-value=all]").css("display", "block");
          for(var i = 0; i < 100; i++) {
            $("#rooms > div").each(function(){
              for(var i = 0; i < 100; i++) {
                if(rooms[i]) {
                  if($(this).data("value") == rooms[i].id) {
                    $(this).css("display", "block");
                  }
                }  
              }     
            });
          }
        }
      }
      if(change == 's1' || change == 's3') {
        var trainers = json.trainers;
        if($("#trainers > div").length == 1) {
          for(var i = 0; i < 100; i++) {
            if(trainers[i]) {
              $("#trainers").append('<div class="select-dropdown-item" data-value="' + trainers[i].id + '">' +
                                      '<div class="select-dropdown-item-title select-dropdown-item-title-trainer">' +
                                        '<span  style="background: url(' + trainers[i].photo + ') no-repeat;background-position: center;background-size: cover"></span>' +
                                        '<span>' + trainers[i].title + '</span>' + 
                                      '</div>' +
                                    '</div>');
            }  
          } 
        } else {
          $("#trainers > div").css("display", "none");
          $("#trainers > div[data-value=all]").css("display", "block");
          for(var i = 0; i < 100; i++) {
            $("#trainers > div").each(function(){
              for(var i = 0; i < 100; i++) {
                if(trainers[i]) {
                  if($(this).data("value") == trainers[i].id) {
                    $(this).css("display", "block");
                  }
                }  
              }     
            });
          }
        }
      }
      $(".loader-wrp2").toggle();
      if(!handlerSelect_f) {
        get_group();
        handlerSelect_f = true;
      }
      clickScheduleItem();
      if($(window).width() < 720) {
        
        if(week != Math.ceil(pastTimeOfStartCurrentYear / hourOfMillisecs / hoursOfOneWeek)) {
          var date = $(".schedule-dates div").eq(1).children("span:nth-child(2)").text();
          $(".schedule-dates div").removeClass("current");
          $(".schedule-dates div").eq(1).addClass("current");
          $(".schedule-item").css("display", "none");
          $(".schedule-wrp-time-date[data-date='" + date + "'] .schedule-item").css("display", "block");
        }
      }
    }
  });  
  }
  function get_group() {
     $.ajax({
      "url": $("body").data("url") + "/wp-admin/admin-ajax.php",
      "type":"POST",
      "data": {
        "action":"get_group",
      },
      success:function(data) {
        $("#groups").append(data);
        handlerSelect();
      }
    });
  }
  
  //Select
  
  $(document).mouseup(function(e) {
    if($(e.target).parents(".select").length == 0) {
      $(".select-dropdown").css("display", "none");  
    }
  });
  
  $(".select .select-title").click(function() {
    //
    var th = $(this);
    var name = th.parent().attr("name");
    $(".select[name!='" + name + "'] .select-dropdown").css("display", "none");
    if($(this).parent().children(".select-dropdown").css("display") == "block") {
      $(this).parent().children(".select-dropdown").css("display", "none");
    } else {
      $(this).parent().children(".select-dropdown").css("display", "block");
    }
  });
  
  function handlerSelect() {
    $(".select-dropdown-item-title").click(function() {
      var name = $(this).parents(".select").attr("name");
      $(this).toggleClass("active");
      if($(this).parent().data("value") == "all") {
        $(this).parent().parent().find(".select-dropdown-item[data-value!=all] .select-dropdown-item-title").removeClass("active");
      } else {
        $(".select[name=" + name + "] .select-dropdown-item[data-value=all]").children().removeClass("active");
        if($(this).parent().find(".select-dropdown-item-item").length == 1) {
          if($(this).hasClass("active")) {
            $(this).parent().find(".select-dropdown-item-item .select-dropdown-item-title").addClass("active");  
          } else {
            $(this).parent().find(".select-dropdown-item-item .select-dropdown-item-title").removeClass("active");
          }
        } else {
          var count = 0;
          $(this).parent().parent().find(".select-dropdown-item-title").each(function() {
            if($(this).hasClass("active")) {
              count++;
            }
          });
          if(count == 0) {
            $(this).parent().parent().prev().removeClass("active");
          }  
        }
      }
      var value_arr = [];
      $(".select[name=" + name + "] .select-dropdown-item-title").each(function(){
        if($(this).hasClass("active")) {
          value_arr.push($(this).parent().data("value"));
        } 
      });
      var status = 's1';
      if(name == "rooms") {
        rooms = value_arr.join(",");
        status = 's3';
      }
      
      if(name == "groups") {
        groups = value_arr.join(",");
        rooms = "";
        trainers = "";
        $(".select[name=rooms] .select-dropdown-item-title").each(function(){
          $(this).removeClass("active"); 
        });
        $(".select[name=trainers] .select-dropdown-item-title").each(function(){
          $(this).removeClass("active"); 
        });
      }
      if(name == "trainers") {
        trainers = value_arr.join(","); 
        status = 's2';
      }
      loadSchedule(week, status);
    });
  }
  
  function clickScheduleItem() {
    $(".schedule-item").click(function(){
      $(".loader-wrp").toggle();
      var id = $(this).data("id");
      $.ajax({
        "url": $("body").data("url") + "/wp-admin/admin-ajax.php",
        "type":"POST",
        "data": {
          "action":"get_info_schedule",
          "id":id
        },
        success:function(data) {
          $('.form-info-schedule').empty();
          $('.form-info-schedule').append(data);
          $.magnificPopup.open({
            items: {
                src: $('.form-info-schedule')
            },
            type: 'inline'
          });
          $(".loader-wrp").toggle();
          if($(".form-info-schedule-toogle-wrp div:nth-child(1)").text().trim() == "") {
            $(".form-info-schedule-toogle-wrp div:nth-child(1)").remove();
            $(".form-info-schedule-toogle-button a:nth-child(1)").remove();
            $(".form-info-schedule-toogle-button a:nth-child(2)").addClass("active");
          } else {
            $(".form-info-schedule-toogle-wrp div:nth-child(1)").css("display", "block");
            $(".form-info-schedule-toogle-wrp div:nth-child(2)").css("display", "none");
          }
          if($(".form-info-schedule-toogle-wrp div:nth-child(2)").text().trim() == "") {
            $(".form-info-schedule-toogle-wrp div:nth-child(2)").remove();
            $(".form-info-schedule-toogle-button a:nth-child(2)").remove();
            $(".form-info-schedule-toogle-button a:nth-child(1)").addClass("active");
          } else {
            $(".form-info-schedule-toogle-wrp div:nth-child(2)").css("display", "block");
            $(".form-info-schedule-toogle-wrp div:nth-child(1)").css("display", "none");
          }
          if($(".form-info-schedule-toogle-wrp div:nth-child(1)").text().trim() != "" && $(".form-info-schedule-toogle-wrp div:nth-child(2)").text().trim() != "") {
            $(".form-info-schedule-toogle-button a:nth-child(1)").addClass("active");
            $(".form-info-schedule-toogle-wrp div:nth-child(1)").css("display", "block");
            $(".form-info-schedule-toogle-wrp div:nth-child(2)").css("display", "none");
          }
          $(".form-info-schedule-toogle-button a").click(function(){
            $(".form-info-schedule-toogle-button a").removeClass("active");
            $(this).addClass("active");
            $(".form-info-schedule-toogle-wrp div").css("display", "none");
            $(".form-info-schedule-toogle-wrp div").eq($(this).index()).css("display", "block");
            return false;
          });
        }
      });
      
    });
  }
  var w_g = $(window).width();
  var w_g_flag = false;
  $(window).resize(function() {
    /*if(w_g < $(window).width() && !w_g_flag && $(window).width() > 720) {
      rooms = "";
      groups = "";
      trainers = "";
      $(".select[name=groups] .select-dropdown-item-title").each(function(){
        $(this).removeClass("active"); 
      });
      $(".select[name=rooms] .select-dropdown-item-title").each(function(){
        $(this).removeClass("active"); 
      });
      $(".select[name=trainers] .select-dropdown-item-title").each(function(){
        $(this).removeClass("active"); 
      });
      week = Math.ceil(pastTimeOfStartCurrentYear / hourOfMillisecs / hoursOfOneWeek);
      loadSchedule(week);
      w_g_flag = true;
    } else {
      w_g_flag = false;
    }
    w_g = $(window).width();*/
  });
  $(".schedule-dates div").click(function(){
    if($(window).width() < 720) {
      var date = $(this).children("span:nth-child(2)").text();
      $(".schedule-dates div").removeClass("current");
      $(this).addClass("current");
      $(".schedule-item").css("display", "none");
      $(".schedule-wrp-time-date[data-date='" + date + "'] .schedule-item").css("display", "block");
    }
  })
});
