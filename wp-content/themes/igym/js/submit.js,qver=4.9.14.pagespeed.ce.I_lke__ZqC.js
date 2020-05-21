$(document).ready(function(){
  function validateForm(form){
     var t = true;
      
     $(form).find("input[type=text],input[type=tel],input[type=email],textarea").each(function(){
       if($(this).data("check") != true) {
         if($(this).attr("name") == "phone"){
          var l = $(this).val().length;
          if( $(this).val() == "" || $(this).val()[l - 1] == "_"){
            changeBorder($(this));
            t = false;
          }
        }else
        
        if (!validateEmail($(this).val()) && $(this).attr("name") == "email") {
          
          changeBorder($(this));
          t = false;
        }else{
          
          if($(this).val() == ""){
           changeBorder($(this));
           t = false;
          }
        }
      }
      
     })
     
     return t;
   }
   function changeBorder(input){
     var border = $(input).css("border");
     $(input).css("border","1px solid red");
     
     setTimeout(function(){
      $(input).css("border",border);  
     },2000)
   }
    function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
   function changeBorderEmail(input){
     var border = $(input).css("border");;
     $(input).css("border","1px solid red");
     setTimeout(function(){
      $(input).css("border",border);  
     },2000)
   }
   function cleanForm(form){
     $(form)[0].reset();
   }
  $("form").submit(function(){
    
    var th = $(this);
    if(validateForm(th)) {
      $(".loader-wrp").toggle();
      $.ajax({
        url: $("body").data("url") + "/wp-admin/admin-ajax.php",
        type:"POST",
        data:th.serialize(),
        success:function(data){
          var json = JSON.parse(data);
          $(".loader-wrp").toggle();
          if(json.code == 1) {
            fbq('track', th.data("target"));
            var a = json.url;
            a = addParameterToURL(a, "utm_source=" + getUrlParameter("utm_source"));
            a = addParameterToURL(a, "utm_campaign=" + getUrlParameter("utm_campaign"));
            a = addParameterToURL(a, "utm_term=" + getUrlParameter("utm_term"));
            a = addParameterToURL(a, "utm_medium=" + getUrlParameter("utm_medium"));
            a = addParameterToURL(a, "utm_content=" + getUrlParameter("utm_content"));
			var  b = 'https://igym.com.ua/blagodarnost/';
			  b = addParameterToURL(b, "utm_source=" + getUrlParameter("utm_source"));
              b = addParameterToURL(b, "utm_campaign=" + getUrlParameter("utm_campaign"));
              b = addParameterToURL(b, "utm_term=" + getUrlParameter("utm_term"));
              b = addParameterToURL(b, "utm_medium=" + getUrlParameter("utm_medium"));
              b = addParameterToURL(b, "utm_content=" + getUrlParameter("utm_content"));
			if(th.data("target") == 'Lead_karta'){
				window.location.href = b;
			} else {
				window.location.href = a;
			}
          }
        }
      })
    }
    return false;
  });
  function clearColor(c) {
    setTimeout(function(){
      $("input[type=radio][name=p" + c + "]").parent().parent().parent().children(".anketa-question-title").css("color", "#191919");  
    }, 3000)
  }
  function addParameterToURL(url, param){
    _url = url;
    if(url.indexOf(param) == -1) {
      if(param.split("=")[1] != "") {
        _url += (_url.split('?')[1] ? '&':'?') + param;  
      }
    }
    return _url;
  }
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
})
