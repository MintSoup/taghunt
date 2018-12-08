const express = require('express');
const mysql = require('mysql');
const tagHandler = require('./taghandler');

var app = express()

tagHandler.attach(app)



app.listen(80)
