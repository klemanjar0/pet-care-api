var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const bodyParser = require("body-parser");
const usersdb = require('../database').userDatabase;
const doDropTable = false;
const { Sequelize, DataTypes } = require('sequelize');

const urlencodedParser = bodyParser.urlencoded({extended: false});

router.get("/", function(req, res){
  usersdb.findAll({raw: true }).then(data=>{
    res.render("index.hbs", {
      users: data
    });
  }).catch(err=>console.log(err));
});

router.get("/create", function(req, res){
  res.render("create.hbs");
});

router.get('/get-all-users', function(req, res) {
  usersdb.findAll({raw:true}).then(users=>{
    console.log(users);
    res.send(users);
  }).catch(err=>console.log(err));
});

router.post("/create", urlencodedParser, function (req, res) {

  if(!req.body) return res.sendStatus(400);

  const login1 = req.body.login;
  const password1 = req.body.password;
  const name1 = req.body.name;
  const body1 = req.body.body;

  usersdb.create({ login: login1, password: password1, name: name1, body: body1}).then(()=>{
    res.redirect("/users");
  }).catch(err=>console.log(err));

});

router.get("/edit/:id", function(req, res){
  const userid = req.params.id;
  usersdb.findAll({where:{idUser: userid}, raw: true })
      .then(data=>{
        res.render("edit.hbs", {
          user: data[0]
        });
      })
      .catch(err=>console.log(err));
});


router.post("/edit", urlencodedParser, function (req, res) {

  if(!req.body) return res.sendStatus(400);

  const userid = req.body.id;
  const name1 = req.body.name;
  const body1 = req.body.body;
  usersdb.update({name:name1, body: body1}, {where: {idUser: userid } }).then(() => {
    res.redirect("/users");
  })
      .catch(err=>console.log(err));
});
router.post("/delete/:id", function(req, res){
  const userid = req.params.id;
  usersdb.destroy({where: {idUser: userid} }).then(() => {
    res.redirect("/users");
  }).catch(err=>console.log(err));
});

router.get('/cabinet/:login', function (req, res){
  let userLogin = req.params.login;
  usersdb.findAll({where:{name: userLogin}, raw: true })
      .then(users=>{
        res.send(users);
        console.log(users);
      }).catch(err=>console.log(err));
});

router.get('/user/:login', function(req, res) {
  res.send('This is not implemented yet');
});


module.exports = router;

