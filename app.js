var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const doDropTable = false;
const { Sequelize, DataTypes } = require('sequelize');
var bodyParser = require("body-parser");
var fs = require("fs");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

var app = express();
var jsonParser = bodyParser.json();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("stylesheets",express.static(path.join(__dirname, 'public/stylesheets')));


app.get('/ErrorExample', function(req, res, next){
    next(new Error('Random error!'));
});



app.get('/api', function (req, res) {
    res.send('API is running');
});

app.set("view engine", "hbs");


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

module.exports = app;
