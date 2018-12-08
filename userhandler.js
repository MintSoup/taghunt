const mysql = require('mysql');

module.exports.attach = function(app) {
  app.get("/login/:username", function(req, res) {
    res.cookie("username", req.params.username).redirect("/")
  })

  app.get("/login", function(req, res) {
    res.render("login.ejs")
  })
}
