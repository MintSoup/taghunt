$(function() {

  var tagCount = {
    fire: 0,
    wind: 0,
    water: 0,
    earth: 0
  }
  updateTagCount()
  $("#logout").click(function() {
    $.ajax({
      url: location.origin + '/logout/',
      success: function(result) {
        document.location.href = location.origin
      },
      async: true
    })
  })

  $('.icon').click(function(e) {

    var iconID = $(e.target).attr("id")
    $.ajax({
      url: location.origin + '/count/' + iconID,
      success: function(result) {
        $(".tagtype").text(jsUcfirst(iconID))
        $("#collected").text(tagCount[iconID])
        $("#remaining").text(result)
        $(".w3-modal").css('display', 'block')
      },
      async: false
    })

  })

  $('.w3-modal').click(function(e) {

    $(".w3-modal").css('display', 'none')
  })


  function updateTagCount() {
    $.ajax({
      url: location.origin + '/account/' + Cookies.get("username"),
      success: function(result) {
        ownedTags = JSON.parse(result[0].ownedTags)
        for (var i = 0; i < ownedTags.length; i++) {
          $.ajax({
            url: location.origin + '/data/' + ownedTags[i],
            success: function(result) {
              if (tagCount[result[0]["type"]])
                tagCount[result[0]["type"]]++;
              else tagCount[result[0]["type"]] = 1;
            },
            async: true
          })
        }
      },
      async: true
    })
  }

  function jsUcfirst(string) {

    return string.charAt(0).toUpperCase() + string.slice(1);

  }
})
