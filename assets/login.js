$(function() {
  updateButton();
  $("#submit").click(function() {
    $.ajax({
      url: location.origin + '/login/' + $("#username").val(),
      success: function(result) {

        document.location.href = location.origin
      },
      async: true
    })
  })
  $("#username").keyup(function() {
    updateButton();
  })

  function updateButton() {
    $.ajax({
      url: location.origin + '/account/' + $("#username").val(),
      success: function(result) {
        console.log(result)
        if (result.length == 0) {
          $("#submit").text("Create Account")
        } else {
          $("#submit").text("Log in")
        }
      },
      async: true
    })
  }
})
