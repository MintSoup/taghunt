const mysql = require('mysql');

module.exports.run = function(query, callback) {

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "yoursql",
    database: "taghunt"
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query(query, function(err, result) {
      if (err) {
        throw err
      };
      if (callback) callback(result)
    });
  });
}
