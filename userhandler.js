const mysql = require('mysql');

module.exports.attach = function(app) {

  //login request handler (the part that actually logs in)
  app.get("/login/:username", function(req, res) {
    res.cookie("username", req.params.username).end()
  })

  //login page
  app.get("/login", function(req, res) {

    if(!req.cookies["username"])
      res.render("login")
    else{
      res.send("<script>alert('You are already logged in');document.location.href = window.origin;</script>").redirect("/")
    }
  })

  //logs out
  app.get("/logout", function(req, res){
    res.clearCookie("username").end()
  })
}
