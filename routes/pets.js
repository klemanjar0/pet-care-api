var express = require('express');
var router = express.Router();
var petsdb = require('../database').petDatabase;


const bodyParser = require("body-parser");


const urlencodedParser = bodyParser.urlencoded({extended: false});


router.get('/get-all-pets', function(req, res) {
    petsdb.findAll({raw:true}).then(pets=>{
        console.log(pets);
        res.send(pets);
    }).catch(err=>console.log(err));
});

router.get('/user/:id/pet', function(req, res) {
    const userId = req.params.id;
    petsdb.findAll({where:{idUser: userId}, raw: true }).then(pets=>{
        console.log(pets);
        res.send(pets);
    }).catch(err=>console.log(err));
});

router.post("/create", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    const userid = req.body.idUser;
    const name = req.body.name;
    const birthday = req.body.birthday;
    const height = req.body.height;
    const species = req.body.species;

    petsdb.create({ idUser: userid, name: name, birthday: birthday, height:height, species: species }).then(()=>{
        res.redirect("/pets");
    }).catch(err=>console.log(err));

});

router.post("/delete/:id", function(req, res){
    const petId = req.params.id;
    petsdb.destroy({where: {idPet: petId} }).then(() => {
        res.redirect("/pets");
    }).catch(err=>console.log(err));
});

module.exports = router;
