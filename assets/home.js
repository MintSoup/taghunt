$(function() {

  var tagCount = {
    fire: 0,
    wind: 0,
    water: 0,
    earth: 0
  }
  updateTagCount()
  $("#logout").click(function() {
    $.get(location.origin + '/logout/', function(result) {
      document.location.href = location.origin
    })
  })

  $('.icon').click(function(e) {

    var iconID = $(e.target).attr("id")
    $.get(location.origin + '/count/' + iconID, function(result) {
        $(".tagtype").text(jsUcfirst(iconID))
        $("#collected").text(tagCount[iconID])
        $("#remaining").text(result)
        $(".w3-modal").css('display', 'block')
      })
  })

  $('.w3-modal').click(function(e) {

    $(".w3-modal").css('display', 'none')
  })


  function updateTagCount() {
    $.get(location.origin + "/account/" + Cookies.get("username"), function(result) {
      ownedTags = JSON.parse(result[0].ownedTags)
      for (var i = 0; i < ownedTags.length; i++) {
        $.get(location.origin + "/data/" + ownedTags[i], function(result) {
          if (tagCount[result[0]["type"]])
            tagCount[result[0]["type"]]++;
          else tagCount[result[0]["type"]] = 1;
        })
      }
    })
  }

  function jsUcfirst(string) {

    return string.charAt(0).toUpperCase() + string.slice(1);

  }

})

function create(type, count, password) {
  $.post(location.origin + "/create", {
      type: type,
      count: count,
      password: password
    },
    function(data) {
      console.log(data)
    });
}
