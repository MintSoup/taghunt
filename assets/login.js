$(function(){
  $("#submit").click(function() {
    $.ajax({
      url: location.origin + '/login/'+ $("#username").val(),
      success: function(result) {
        alert("oof")
        document.location.href = location.origin;
      },
      async: false
    });
  });
});
