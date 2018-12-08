const mysql = require('mysql');

module.exports.attach = function(app) {
  app.get("/login/:username", function(req, res) {
    res.cookie("username", req.params.username).end()
  })

  app.get("/login", function(req, res) {

    if(!req.cookies["username"])
      res.render("login")
    else{
      res.send("<script>alert('You are already logged in');document.location.href = window.origin;</script>").redirect("/")
    }
  })

  app.get("/logout", function(req, res){
    res.clearCookie("username").end()
  })
}
