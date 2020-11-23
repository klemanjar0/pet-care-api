var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const usersdb = require('../database').userDatabase;

const urlencodedParser = bodyParser.urlencoded({extended: false});

const creepto = require("../models/userHash");

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

  const hash = creepto.hashPasswordToSHA256(password1);
  usersdb.create({ login: login1, password: hash, name: name1, body: body1}).then(()=>{
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

router.get("/:login/change-password", function(req, res){
  const userLogin = req.params.login;
  usersdb.findOne({where:{login: userLogin}, raw: true })
      .then(data=>{
        res.render("change_pass.hbs", {
          user: data
        });
      })
      .catch(err=>console.log(err));
});

router.post('/:login/update-password', function(req, res, next) {
  const username = req.params.login;
  const oldPassword = req.body.oldpassword;
  const newPassword = req.body.password;

  const oldhash = creepto.hashPasswordToSHA256(oldPassword);
  const newhash = creepto.hashPasswordToSHA256(newPassword);

  usersdb.findOne({where:{login: username}, raw: true }).then(dbUser=>{

    const passwordMatch = dbUser.password === oldPassword || dbUser.password === oldhash;
    if (!passwordMatch) {
      return res.status(400).json({message:"Old password incorrect."});
    }
    try {
      usersdb.update({password:newhash}, {where: {idUser: dbUser.idUser } }).then(() => {
      }).catch(err=>console.log(err));
    } catch (e) {
      return res.status(400).json(e);
    }
    return res.redirect(200, '/users');
  })
});

router.get('/user/:login', function(req, res) {
  res.send('This is not implemented yet');
});


module.exports = router;

