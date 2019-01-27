$(function () {

  var collectedTags = {
    fire: 0,
    wind: 0,
    water: 0,
    earth: 0
  }

  var remainingTags = {
    fire: 0,
    wind: 0,
    water: 0,
    earth: 0
  }

  updateTagCount()

  $("#logout").click(function () {
    $.get(location.origin + '/logout/', function (result) {
      document.location.href = location.origin
    })
  })

  $('.icon').click(function (e) {

    var iconID = $(e.target).attr("id")
    $(".tagtype").text(jsUcfirst(iconID))
    $("#collected").text(collectedTags[iconID])
    $("#remaining").text(remainingTags[iconID])
    $(".w3-modal").css('display', 'block')
  
  })

  $('.w3-modal').click(function (e) {
    $(".w3-modal").css('display', 'none')
    $("#main").css("filter", "none")
  })


  function updateTagCount() {
    $.get(location.origin + "/account/" + Cookies.get("username"), function (result) {
      ownedTags = JSON.parse(result[0].ownedTags)
      for (var i = 0; i < ownedTags.length; i++) {
        $.get(location.origin + "/data/" + ownedTags[i], function (result) {
          if (collectedTags[result[0]["type"]])
            collectedTags[result[0]["type"]]++;
          else collectedTags[result[0]["type"]] = 1;
        })
      }
    })

    for (const [kyeet, value] of Object.entries(remainingTags)) {
      $.get(location.origin + "/count/" + kyeet, function (result) {
        remainingTags[kyeet] = result
      })
    }
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
    function (data) {
      console.log(data)
    });
}