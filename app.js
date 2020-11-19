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
/*
app.use(function(req, res, next){
    res.status(404);
    console.log('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(req, res, next, err){
    res.status(err.status || 500);
    console.log('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});
*/

module.exports = app;
