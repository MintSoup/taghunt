$(function () {
  updateButton();
  $("#submit").click(function () {
    login();
  })
  $("#username").keyup(function (e) {
    if (e.keyCode == 13) {
      login();
    }
    updateButton();
  })



  function updateButton() {
    $.ajax({
      url: location.origin + '/account/' + $("#username").val(),
      success: function (result) {
        if (result.length == 0) {
          $.ajax({
            url: location.origin + '/round/',
            success: function (result) {

              if (result.number == 1) {
                $("#submit").text("Create Account")
              } else {
                $("#submit").css("background-color", "#686868")
             
              }
            },
            async: true

          })

        } else {
          $("#submit").text("Log in")
          $("#submit").css("background-color", "#005f05")
        }
      },
      async: true
    })
  }

  function login() {
    
    $.ajax({
      url: location.origin + '/login/' + $("#username").val(),
      success: function (result) {
        if (typeof tagToClaim != 'undefined')
          document.location.href = tagToClaim
        else
          document.location.href = location.origin

      },
      async: true
    })
  }
})