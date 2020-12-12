var petsdb = require('../database').petDatabase;
var usersdb = require('../database').userDatabase;
var sampledb = require('../database').sampleDatabase;

const fetch = require('node-fetch');
const bodyParser = require("body-parser");


module.exports.getUsersPets = function(userId) {
    return new Promise((resolve, reject)=>{
        petsdb.findAll({where:{idUser: userId}, raw: true })
            .then(pets=>{
                resolve(pets);
                console.log(pets);
            }).catch(err=>reject(err));
    })
}

module.exports.getPetSamplesByDate = function(petId, startDate, endDate) {
    return new Promise((resolve, reject)=>{
        petsdb.findAll({
            where: {
                idPet: petId,
                createdAt : {
                    $lt : endDate, $gt : startDate}
                }
                , raw: true })
            .then(pets=>{
                resolve(pets);
                console.log(pets);
            }).catch(err=>reject(err));
    })
}

function findDateOnly(array, thisday){
    let result = [];
    for(let i = 0; i < array.length; i++){
        if(array[i].createdAt.day == thisday)
            result.push(array[i]);
    }
    return result;
}

module.exports.getPetAverageInfoPerDay = function(petId, date) {
    return new Promise((resolve, reject)=>{
        sampledb.findAll({
            where: {
                idPet: petId
            }
            , raw: true })
            .then(samples=>{
                let dayInfo = findDateOnly(samples, date);

                let pulseDay = [];
                for(let i = 0; i < dayInfo.length; i++){
                    pulseDay.push(dayInfo[i].pulse_avg);
                }
                const averagePulse = pulseDay => pulseDay.reduce( ( p, c ) => p + c, 0 ) / pulseDay.length;


                let dayInfoC = findDateOnly(samples, date);

                let CaloriesDay = [];
                for(let i = 0; i < dayInfoC.length; i++){
                    CaloriesDay.push(dayInfoC[i].pulse_avg);
                }
                const averageCalories = CaloriesDay => CaloriesDay.reduce( ( p, c ) => p + c, 0 ) / CaloriesDay.length;


                let stats = {
                    averagePulseOfDay : averagePulse,
                    averageCaloriesBurnt : averageCalories
                }


                resolve(stats);
                console.log(stats);
            }).catch(err=>reject(err));
    })
}
