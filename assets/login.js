$(function() {
  $("#submit").click(function() {
    $.ajax({
      url: location.origin + '/login/' + $("#username").val(),
      success: function(result) {

        document.location.href = location.origin
      },
      async: false
    })
  })
})
