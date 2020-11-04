const fromObject = require("tns-core-modules/data/observable").fromObject;
const axios = require("axios").default;

async function onNavigatingTo(args) {
    const page = args.object;
    const context = page.navigationContext;
    const image = page.getViewById("photo");
    const nameLabel = page.getViewById("name");
    const statusLabel = page.getViewById("status");
    const speciesLabel = page.getViewById("species");
    const genderLabel = page.getViewById("gender");
    await axios.get("https://rickandmortyapi.com/api/character/"+context.characterID).then(function(response){
        image.src = response.data.image;
        nameLabel.text = "Name: "+response.data.name;
        statusLabel.text = "Status: "+response.data.status;
        speciesLabel.text = "Species: "+response.data.species;
        genderLabel.text = "Gender: "+response.data.gender;
    }).catch(function(error){
        console.log(error);
    })
}
exports.onNavigatingTo = onNavigatingTo;