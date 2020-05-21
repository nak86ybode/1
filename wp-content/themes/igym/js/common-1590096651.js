
var timeout1;
var timeout2;
function templateMessage(text, close) {
  $(".overlay-popup").css("display","block");
  $(".overlay-popup .text").html(text);
  clearTimeout(timeout1);
  if(close) {
    timeout1 = setTimeout(function(){
      $(".overlay-popup").css("display","none");
      $(".overlay-popup .text").empty();    
    }, 4000);
  }
}
function templateMessage2(text, close) {
  $.magnificPopup.open({
      items: {
          src: '.custom-popup2' 
      },
      type: 'inline'
  });
  clearTimeout(timeout2);
  $(".custom-popup2 .text").html(text);
  if(close) {
    timeout2 = setTimeout(function(){
      $.magnificPopup.close();
      $(".custom-popup2 .text").empty();    
    }, 4000);
  }
}
$(document).ready(function() {
  $('input[name="phone"]').focusout(function() {
    var th = $(this);
    var l = $(this).val().length;
    if( th.val() == "" || th.val()[l - 1] == "_"){
      th.css("border", "1px solid red");
      setTimeout(function(){
        th.css("border", "none");  
      }, 3000)  
    }
  })
  $("input").each(function(){
    $(this).attr("autocomplete", "off")
  });
  $('input[name="phone"]').inputmask({"mask": "+38 (999) 999 99 99"});
  $(".close-menu").click(function(){
    $(".burger").toggleClass("open");
    $(".menu-mobile").slideToggle();
    return false;
  });
  $(".burger").click(function(){
    $(this).toggleClass("open");
    $(".menu-mobile").slideToggle();
  })
  $('.mfp-lnk').magnificPopup({});
  $('.mfp-vant').magnificPopup({
    callbacks: {
      open:function() {
        if($(window).width() >= 1170) {
          var h = $(".vantage-popup-right").innerHeight();
          $(".vantage-popup-left").height(h); 
        }
      }
    }
  });
  $('.fyo').magnificPopup({
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });
  $(".target-item.active").mCustomScrollbar({axis:"y"});
  $(".target-list-menu-item").on('click touchend', function(){
    $(".target-list-menu-item, .target-item").removeClass("active");
    $(this).addClass("active");
    var index = $(this).index();
    $(".target-item").eq(index).addClass("active"); 
    $(".target-item.active").mCustomScrollbar({axis:"y"});
  });
  $(".reviews-slider").slick({
    nextArrow: '<a class="arrow-reviews arrow-reviews-right"><i class="fa fa-angle-right"></i></a>',
    prevArrow: '<a class="arrow-reviews arrow-reviews-left"><i class="fa fa-angle-left"></i></a>',
    slidesToShow: 1,
    slidesToScroll: 1,
     responsive: [
    {
      breakpoint: 1170,
      settings: {
        
        arrows:false,
        dots: true
      }
    },
    ]
  });
  
  
  //UTM
  function addParameterToURL(url, param){
    _url = url;
    if(url.indexOf(param) == -1) {
      if(param.split("=")[1] != "") {
        _url += (_url.split('?')[1] ? '&':'?') + param;  
      }
    }
    return _url;
  }
  $("body a").each(function(){
    var a = $(this).attr("href");
    if(a != undefined) {
      if(a.indexOf("#") == -1) {
        if(a.indexOf("http") != -1 || a.indexOf("https") != -1) {
          a = addParameterToURL(a, "utm_source=" + getUrlParameter("utm_source"));
          a = addParameterToURL(a, "utm_campaign=" + getUrlParameter("utm_campaign"));
          a = addParameterToURL(a, "utm_term=" + getUrlParameter("utm_term"));
          a = addParameterToURL(a, "utm_medium=" + getUrlParameter("utm_medium"));
          a = addParameterToURL(a, "utm_content=" + getUrlParameter("utm_content"));
          $(this).attr("href", a);  
        }
      }
    }
  });
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
});


$(window).scroll(function() {
  var height = $(this).scrollTop();
  $('#promo')[height >= 360 ? 'addClass' : 'removeClass']('active');
});


