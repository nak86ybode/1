$(document).ready(function(){
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
  
  var ids = "";
  function listID() {
    var a = [];
    $(".program-category a").each(function(){
      if($(this).hasClass("active")) {
        a.push($(this).data("id"));
      }
    });
    ids = a.join(",");
  }
  startProg();
  function startProg() {
    var pg = getUrlParameter("pg");
    if(pg != "") {
      $(".program-category a[data-id=" + pg + "]").addClass("active");
      loadProgram(); 
    }
  }
  $(".program-category a").click(function(){
    $(this).toggleClass("active");
    var id = $(this).data("id");
    loadProgram();
    return false;
  });
  function loadProgram() {
    $(".loader-wrp").toggle();
    listID();
    $.ajax({
      url: $("body").data("url") + "/wp-admin/admin-ajax.php",
      type:"POST",
      data: {
        "action":"get_program",
        "cat": ids
      },
      success:function(data){
        $(".loader-wrp").toggle();
        $(".list-programm").empty();
        $(".list-programm").append(data);
      }
    })
  }
})
