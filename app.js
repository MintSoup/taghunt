const express = require('express');
const mysql = require('mysql');
const tagHandler = require('./taghandler');
const cookie = require('cookie-parser');


var app = express()


app.set("view engine", "ejs")

app.use(express.static('./assets/'));
app.use(cookie("big oof"))






tagHandler.attach(app)



app.listen(80)
