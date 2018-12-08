const mysql = require('mysql');

module.exports.attach = function(app) {
  app.get("/login/:username", function(req, res) {
    res.cookie("username", req.params.username).redirect("/")
  })

  app.get("/login", function(req, res) {

    if(!req.cookies.username)
      res.render("login")
    else{
      res.send("<script>alert('You are already logged in');document.window</script>").redirect("/")
    }
  })
}