const fromObject = require("tns-core-modules/data/observable").fromObject;
const axios = require("axios").default;

async function onNavigatingTo(args) {
    const page = args.object;
    const context = page.navigationContext;
    const actionBar = page.getViewById("actionBar");
    let charactersURL = [];
    let characters = [];
    await axios.get("https://rickandmortyapi.com/api/episode/"+context.episodeID).then(function(response){
        actionBar.title = response.data.episode+" - "+response.data.name;
        charactersURL = response.data.characters;
    }).catch(function(error){
        console.log(error);
    });
    await Promise.all(charactersURL.map(async(character) => {
        await axios.get(character).then(function(response){
            characters.push(response.data);
        });
    }));
    const vm = fromObject({
        characters: characters
    });
    page.bindingContext = vm;
}
exports.onNavigatingTo = onNavigatingTo;

function onItemTap(args) {
    const id = args.view.id;
    const listView = args.object;
    const page = listView.page;
    page.frame.navigate({moduleName:"pages/character-detail/character-detail-page",context:{characterID:id}});
}
exports.onItemTap = onItemTap;