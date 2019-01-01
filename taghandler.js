//String.format
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ?
        args[number] :
        match;
    });
  };
}

const sqlhandler = require('./sqlhandler');
const random = require('random-number');
const userhandler = require('./userhandler')

module.exports.attach = function(app) {
  //creates an unactivated tag
  app.get("/create", function(req, res) {
    if (req.query.type && req.query.count) {
      createTag(req.query.type, req.query.count, function(tags) {
        res.send(tags)
      })

    }
  })
  //returns tag data
  app.get("/data/:id", function(req, res) {
    getTag(req.params.id, function(result) {
      res.send(result)
    });
  })
  //activate tag
  app.get("/activate/:id", function(req, res) {
    setActive(req.params.id, true, function() {
      getTag(req.params.id, function(result) {
        res.send(result)
      })
    });
  })
  //deactivate tag
  app.get("/deactivate/:id", function(req, res) {
    setActive(req.params.id, false, function() {
      getTag(req.params.id, function(result) {
        res.send(result)
      })
    });
  })
  //claim tag - this part needs to be renamed and a separate page needs to be created for the html
  app.get("/tag/:id", function(req, res) {
    if (!req.cookies["username"]) {
      res.redirect("/login/")
    } else {

    }
  })

  app.get("/claim/:id", function(req, res) {
    claim(req.params.id, req.cookies["username"], function(result) {
      if (result == 1)
        res.send("Invalid username.").end()
      else if (result == 2)
        res.send("Invalid tag.").end()
      else
        res.send(result)
    })
  })


}
//get tag data
function getTag(id, callback) {
  sqlhandler.run(`select * from tags where id='${id}'`, function(result) {
    if (callback) callback(result)
  })
}
//creates tags
function createTag(type, count, callback) {
  var tags = []
  var alphanumeric = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"
  for (var i = 0; i < parseInt(count); i++) {

    var id = ""
    for (var f = 0; f < 24; f++) {
      id += alphanumeric[random({
        min: 0,
        max: alphanumeric.length - 1,
        integer: true
      })]
    }
    tags.push({
      id: id,
      type: type,
      active: false
    })
    sqlhandler.run(`insert into tags values ('${id}', '${type}', FALSE)`, function(result) {})

  }
  if (callback) callback(tags)

}
//actiavet/deactive tags
function setActive(id, state, callback) {
  sqlhandler.run("update tags SET active={0} where id='{1}'".format(state ? "TRUE" : "FALSE", id), function() {
    if (callback) callback()
  })

}

//claim a tag to a Username
function claim(id, username, callback) {
  sqlhandler.run(`select * from users where name='${username}'`, function(user) {
    if (user.length == 0) {
      callback(1)
      return
    }
    sqlhandler.run(`select * from tags where id='${id}'`, function(tag) {

      if (tag.length == 0) {
        callback(2)
        return
      }
      if (tag[0]["active"] != 1) {
        callback(2)
        return
      }
      var ownedTags = JSON.parse(user[0]["ownedTags"])
      ownedTags.push(tag[0]["id"])
      var tagString = JSON.stringify(ownedTags)
      sqlhandler.run(`update users set ownedTags='${tagString}' where name='${username}'`, function(result) {
        setActive(tag[0]["id"], false, function() {
          userhandler.getData(username, function(result) {
            callback(result)
          })
        })

      })

    })
  })
}
