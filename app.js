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


let round = {
  number: 1,
  end: new Date(2019, 02, 25)
}


//homepage (index.html lol)
app.get("/", function (req, res) {
  if (req.cookies.username) {

    sqlhandler.run(`select * from users where name='${req.cookies.username}'`, function (user) {
      if (user.length != 0) {
        var status = "no longer"
        if (user[0].active)
          status = "still"
        res.render("home", {
          username: user[0]["name"],
          round: round.number,
          end: `${round.end.getDate()}.${round.end.getMonth()}.${round.end.getFullYear()}`,
          status: status
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

app.use(function (req, res, next) {
  res.status(404).send('404 - Not Found!')
});

app.listen(80)