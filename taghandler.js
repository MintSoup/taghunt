//String.format
if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ?
        args[number] :
        match;
    });
  };
}
const sqlhandler = require('./sqlhandler')
const random = require('random-number')
const round = require("./round")
const userhandler = require("./userhandler")
const {
  SHA3
} = require('sha3')

const password = 'f5fa6c56b48890813bb32de1068e2294fa1587c4cd218911d7d74d7c773ee1cb1760c5face2ce26f79b26815fcf9d9a8c28493a9e50979a7e0fc531cee0a223f'


module.exports.attach = function (app) {
  //creates an unactivated tag
  app.post("/create", function (req, res) {
    if (req.body.type && req.body.count && req.body.password) {
      var hash = new SHA3(512);
      hash.update(req.body.password)
      if (hash.digest("hex") == password) {
        createTag(req.body.type, req.body.count, function (tags) {
          res.send(tags).end()
        })
      } else {
        res.send("bad password").end()
      }

    }
  })
  /*
    //activate tag
    app.get("/activate/:id", function (req, res) {
      setActive(req.params.id, true, function () {
        getTag(req.params.id, function (result) {
          res.send(result)
        })
      });
    })
    
    //deactivate tag
    app.get("/deactivate/:id", function (req, res) {
      setActive(req.params.id, false, function () {
        getTag(req.params.id, function (result) {
          res.send(result)
        })
      });
    })*/

  //counts and returns the number of tag swith 'type' type
  app.get("/count/:type", function (req, res) {
    sqlhandler.run(`select * from tags where type='${req.params.type}' and active=true`, function (result) {
      res.send(result.length + "")
    })
  })

  //claim tag with nice ui
  app.get("/tag/:id", function (req, res) {
    if (!req.cookies["username"]) {
      res.render("login", {
        url: req.params.id
      })
    } else {
      claim(req.params.id, req.cookies["username"], function (result) {
        if (result == 1)
          res.render("claimed", {
            message: "Invalid username."
          })
        else if (result == 2)
          res.render("claimed", {
            message: "Invalid tag."
          })
        else if (result == 3)
          res.render("claimed", {
            message: "Tag has already been claimed."
          })
        else if (result == 4)
          res.render("claimed", {
            message: "You are out of the game and can no longer claim tags."
          })
        else if (result == 5)
          res.render("claimed", {
            message: "You have claimed all of the tags of this type you needed for this round, no need to search for any more tags!"
          })
        else {
          var msg;
          if ("aeiou".indexOf((result.type.toLowerCase().charAt(0))) != -1) {
            msg = `You claimed an ${result.type} tag!`
          } else msg = `You claimed a ${result.type} tag!`
          res.render("claimed", {
            message: msg,
            tagtype: result.type
          })
        }
      })
    }
  })
  //claim tag without ui
  app.get("/claim/:id", function (req, res) {
    claim(req.params.id, req.cookies["username"], function (result) {
      if (result == 1)
        res.send("Invalid username.").end()
      else if (result == 2)
        res.send("Invalid tag.").end()
      else if (result == 3)
        res.send("Tag has already been claimed").end()
      else if (result == 4)
        res.send("You are out of the game and can no longer claim tags.").end()
      else if (result == 5)
        res.send("You have claimed all the tags of this type you needed for this round, no need to search for any more tags!").end()
      else
        res.send(result).end()
    })
  })

  //get tag data
  app.get("/data/:id", function (req, res) {
    getTag(req.params.id, function (result) {
      res.send(result)
    })
  })

}



//get tag data
function getTag(id, callback) {
  sqlhandler.run(`select * from tags where id='${id}'`, function (result) {
    if (callback) callback(result[0])
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
      active: true
    })
    sqlhandler.run(`insert into tags values ('${id}', '${type}', TRUE)`, function (result) {})

  }
  if (callback) callback(tags)

}
//actiavet/deactive tags
function setActive(id, state, callback) {
  sqlhandler.run("update tags SET active={0} where id='{1}'".format(state ? "TRUE" : "FALSE", id), function () {
    if (callback) callback()
  })

}

//claim a tag to a Username
function claim(id, username, callback) {
  userhandler.getData(username, function (user) {
    if (user.length == 0) {
      callback(1)
      return
    }
    if (!user[0].active) {
      callback(4)
      return
    }
    var collectedTags = []
   
    var ownedTags = JSON.parse(user[0].ownedTags)
    for (var i = 0; i < ownedTags.length; i++) {
      getTag(ownedTags[i], function (tag) {
        if(tag !== undefined) collectedTags.push(tag)
      })
    }
    getTag(id, function (result) {
      
      if (!round.canClaim(collectedTags, result)) {
        callback(5)
        return
      } else {

        getTag(id, function (tag) {
  
          if (tag === undefined) {
            callback(2)
            return
          }
          if (tag["active"] != 1) {
            callback(3)
            return
          }
          var ownedTags = JSON.parse(user[0]["ownedTags"])
          ownedTags.push(tag["id"])
          var tagString = JSON.stringify(ownedTags)
          sqlhandler.run(`update users set ownedTags='${tagString}' where name='${username}'`, function (result) {
            setActive(tag["id"], false, function () {
              callback(tag)
            })

          })

        })
      }
    })
  })
}


module.exports.getTag = getTag