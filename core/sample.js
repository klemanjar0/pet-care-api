function Sample(sampleId, petId, pulseAvg, distance, caloriesBurnt, weight, starttime, endtime){

    this.sampleId = sampleId;
    this.petId= petId;
    this.pulseAvg = pulseAvg;
    this.distance = distance
    this.caloriesburnt= caloriesBurnt;
    this.weight = weight;
    this.starttime = starttime;
    this.endtime= endtime;
    this.displayInfo = function(){
        console.log(`sampleId: ${this.sampleId}  userId: ${this.userId}`);
    }
}
module.exports = Sample;