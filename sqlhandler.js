const mysql = require('mysql');

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "yoursql",
  database: "taghunt"
});

module.exports.run = function (query, callback) {

  pool.getConnection(function (err, connection) {
    if (err) throw err
    connection.query(query, function (err, rows) {
      if (err) throw err
      callback(rows)
      connection.release();
    });
  });


}