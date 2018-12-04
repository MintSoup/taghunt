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

module.exports.attach = function(app) {

  app.get("/create", function(req, res) {
    if (req.query.id && req.query.type)
      res.send(createTag(req.query.id, req.query.type))

  })

}

function getTag(id) {

}


function createTag(id, type) {
  try {
    var tag = {
      id: id,
      type: type,
      active: false
    }
    runSQL("INSERT INTO tags VALUES ('{0}', '{1}', FALSE)".format(id, type));

  } catch (err) {
    console.log("ERROR " + err.message)
  }

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
