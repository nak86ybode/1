function loadBgVideo(el) {
  el.each(function() {
    var id = $(this).data("video")
    var th = $(this);
    $.ajax({
      url: "https://www.googleapis.com/youtube/v3/videos?key=AIzaSyAdnxcrfZYGewc7H7A6C3kuqba2yyGZ2xk&part=snippet&id=" + id,
      success: function(a) {
        var res = "";
        if ("high" in a['items'][0]['snippet']['thumbnails']) {
          res = a['items'][0]['snippet']['thumbnails']['high']['url'];
        }
        if ("meium" in a['items'][0]['snippet']['thumbnails']) {
          res = a['items'][0]['snippet']['thumbnails']['medium']['url'];
        }
        if ("standard" in a['items'][0]['snippet']['thumbnails']) {
          res = a['items'][0]['snippet']['thumbnails']['standard']['url'];
        }
        if ("maxres" in a['items'][0]['snippet']['thumbnails']) {
          res = a['items'][0]['snippet']['thumbnails']['maxres']['url'];
        }
       
        th.css({
          "background": "url(" + res + ") no-repeat",
          "background-position": "center center",
          "background-size": "cover"
        })
      }
    })
  });
}
function handlerPlayVideo(el) {
  el.click(function() {
    
    var id = $(this).parent().data("video")
      
    $(this).parent().css("background","none");
    $(this).parent().append('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + id + '?autoplay=1&amp;rel=0" frameborder="0" allowfullscreen></iframe>');
    $(this).css("display","none")
  });
}
$(document).ready(function(){
  loadBgVideo($(".reviews-slider-item, .event-content-line1-right.video, .gallery-photo.video, .single-program-block.video"));
  handlerPlayVideo($(".reviews-slider-item .play, .event-content-line1-right .play, .gallery-photo.video .play, .single-program-block.video .play"));
  
})
