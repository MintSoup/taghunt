const express = require('express');
const mysql = require('mysql');
const tagHandler = require('./taghandler');
const userhandler = require('./userhandler');
const sqlhandler = require('./sqlhandler');
const cookie = require('cookie-parser');


var app = express()


app.set("view engine", "ejs")

app.use(express.static('./assets/'));
app.use(cookie("big oof"))
app.use(express.urlencoded()); // to support URL-encoded bodies

tagHandler.attach(app)
userhandler.attach(app)


//homepage (index.html lol)
app.get("/", function(req, res) {
  if (req.cookies["username"]) {
    sqlhandler.run(`select * from users where name='${req.cookies["username"]}'`, function(user) {
      if (user.length != 0) {
        res.render("home", {
          username: user[0]["name"],
        })
      } else {
        res.clearCookie("username")
        res.redirect("/login")
      }
    })

  } else {
    res.redirect("/login")
  }
})

app.listen(80)
