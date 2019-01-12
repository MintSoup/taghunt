$(function() {
  updateButton();
  $("#submit").click(function() {
    login();
  })
  $("#username").keyup(function(e) {
    if (e.keyCode == 13) {
      login();
    }
    updateButton();
  })



  function updateButton() {
    $.ajax({
      url: location.origin + '/account/' + $("#username").val(),
      success: function(result) {
        if (result.length == 0) {
          $("#submit").text("Create Account")
        } else {
          $("#submit").text("Log in")
        }
      },
      async: true
    })
  }

  function login() {
    $.ajax({
      url: location.origin + '/login/' + $("#username").val(),
      success: function(result) {

        document.location.href = location.origin
      },
      async: true
    })
  }
})
