var express = require('express');
var router = express.Router();
var sampledb = require('../database').sampleDatabase;

const bodyParser = require("body-parser");


const urlencodedParser = bodyParser.urlencoded({extended: false});



router.get('/get-all-samples', function(req, res) {
    sampledb.findAll({raw:true}).then(samples=>{
        console.log(samples);
        res.send(samples);
    }).catch(err=>console.log(err));
});

router.get('/pet/:id', function(req, res) {
    const petId = req.params.id;
    sampledb.findAll({where:{idPet: petId}, raw: true }).then(samples=>{
        console.log(samples);
        res.send(samples);
    }).catch(err=>console.log(err));
});

router.post("/create", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    const idSample = req.body.idSample;
    const idPet = req.body.idPet;
    const pulse_avg = req.body.pulse_avg;
    const distance_travel = req.body.distance_travel;
    const calories_burnt = req.body.calories_burnt;
    const weight = req.body.weight;
    const start_time_measure = req.body.start_time_measure;
    const end_time_measure = req.body.end_time_measure;
    sampledb.create({ idSample: idSample, idPet: idPet, pulse_avg: pulse_avg, distance_travel:distance_travel, calories_burnt: calories_burnt,
        weight: weight, start_time_measure: start_time_measure, end_time_measure: end_time_measure}).then(()=>{
        res.redirect("/sample");
    }).catch(err=>console.log(err));

});

router.post("/delete/:id", function(req, res){
    const sampleId = req.params.id;
    sampledb.destroy({where: {idSample: sampleId} }).then(() => {
        res.redirect("/sample");
    }).catch(err=>console.log(err));
});


module.exports = router;
