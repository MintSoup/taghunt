const sqlhandler = require('./sqlhandler');

module.exports.attach = function(app) {

  //login request handler (the part that actually logs in)
  app.get("/login/:username", function(req, res) {
    res.cookie("username", req.params.username).end()
    sqlhandler.run(`select * from users where name='${req.params.username}'`,function(result){
      if (result.length == 0){
        sqlhandler.run(`insert into users values ('${req.params.username}', '[]')`)
      }
    })
  })

  //login page
  app.get("/login", function(req, res) {

    if (!req.cookies["username"])
      res.render("login")
    else {
      res.send("<script>alert('You are already logged in');document.location.href = window.origin;</script>").redirect("/")
    }
  })

  //logs out
  app.get("/logout", function(req, res) {
    res.clearCookie("username").end()
  })
  //returns account data
  app.get("/account/:username", function(req, res) {
    sqlhandler.run(`SELECT * FROM users where name=\'${req.params.username}\'`, function(result) {
      res.send(result)
    })
  })
}
