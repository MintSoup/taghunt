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
module.exports.attach = function(app) {

  app.get("/create", function(req, res) {
    if (req.query.type && req.query.count) {
      createTag(req.query.type, req.query.count, function(tags) {
        res.send(tags)
      })

    }
  })

  app.get("/data/:id", function(req, res) {
    getTag(req.params.id, function(result) {
      res.send(result)
    });
  })

  app.get("/activate/:id", function(req, res) {
    setActive(req.params.id, true, function() {
      getTag(req.params.id, function(result) {
        res.send(result)
      })
    });
  })

  app.get("/deactivate/:id", function(req, res) {
    setActive(req.params.id, false, function() {
      getTag(req.params.id, function(result) {
        res.send(result)
      })
    });
  })

}

function getTag(id, callback) {
  sqlhandler.run(`select * from tags where id='${id}'`, function(result) {
    if (callback) callback(result)
  })
}


function createTag(type, count, callback) {
  var tags = []
  var alphanumeric = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"
  for (var i = 0; i < parseInt(count); i++) {

    var id = ""
    for (var f = 0; f < 16; f++) {
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

function setActive(id, state, callback) {
  sqlhandler.run("update tags SET active={0} where id='{1}'".format(state ? "TRUE" : "FALSE", id), function(){
    if (callback) callback()
  })

}

function runSQL(query) {

}
