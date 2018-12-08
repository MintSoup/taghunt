$(function() {
  $("#logout").click(function() {
    $.ajax({
      url: location.origin + '/logout/',
      success: function(result) {
        document.location.href = location.origin
      },
      async: false
    })
  })
})
