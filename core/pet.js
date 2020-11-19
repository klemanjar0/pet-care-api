function Pet(petId, userId, name, birthday, height, species, weight){

    this.petId = petId;
    this.userId= userId;
    this.name= name;
    this.birthday= birthday;
    this.height= height;
    this.species= species;
    this.weight = weight;
    this.displayInfo = function(){
        console.log(`petId: ${petId}  userId: ${this.userId}`);
    }
}
module.exports = Pet;