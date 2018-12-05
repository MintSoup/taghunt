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

const mysql = require('mysql');
const random = require('random-number');
module.exports.attach = function(app) {

  app.get("/create", function(req, res) {
    if (req.query.type && req.query.count) {
      res.send(createTag(req.query.type, req.query.count))

    }
  })

}

function getTag(id) {

}


function createTag(type, count) {
  var tags = []
  var alphanumeric = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"
  for (var i = 0; i < parseInt(count); i++) {

    var id = ""
    for (var f = 0; f < 16; f++) {
      id += alphanumeric[random({min: 0, max: alphanumeric.length-1, integer: true})]
    }
    tags.push({id: id, type: type, active: false})
    runSQL("INSERT INTO tags VALUES ('{0}', '{1}', FALSE)".format(id, type))
  }
  return tags

}

function deleteTag(id) {

}

function clearAll() {

}

function setActive(id, state) {

}

function runSQL(query) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "yoursql",
    database: "taghunt"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(query, function(err, result) {
      if (err) {
        throw err
      };
    });
  });
}
