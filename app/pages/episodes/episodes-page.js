const fromObject = require("tns-core-modules/data/observable").fromObject;
const axios = require("axios").default;

async function onNavigatingTo(args) {
    const page = args.object;
    let episodes = [];
    await axios.get("https://rickandmortyapi.com/api/episode").then(function(response){
        episodes = response.data["results"];
    }).catch(function(error){
        console.log(error);
    });
    const vm = fromObject({
        episodes: episodes
    });
    page.bindingContext = vm;
}
exports.onNavigatingTo = onNavigatingTo;

function onItemTap(args) {
    const id = args.view.id;
    const listView = args.object;
    const page = listView.page;
    page.frame.navigate({moduleName:"pages/episode-detail/episode-detail-page",context:{episodeID:id}});
}
exports.onItemTap = onItemTap;