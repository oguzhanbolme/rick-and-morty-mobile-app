require("./runtime.js");require("./vendor.js");module.exports =
(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["bundle"],{

/***/ "./ sync ^\\.\\/app\\.(css|scss|less|sass)$":
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./ sync ^\\.\\/app\\.(css|scss|less|sass)$";

/***/ }),

/***/ "./ sync recursive (?<!\\bApp_Resources\\b.*)(?<!\\.\\/\\btests\\b\\/.*?)\\.(xml|css|js|(?<!\\.d\\.)ts|(?<!\\b_[\\w-]*\\.)scss)$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./app-root.xml": "./app-root.xml",
	"./app.js": "./app.js",
	"./pages/character-detail/character-detail-page.js": "./pages/character-detail/character-detail-page.js",
	"./pages/character-detail/character-detail-page.xml": "./pages/character-detail/character-detail-page.xml",
	"./pages/episode-detail/episode-detail-page.js": "./pages/episode-detail/episode-detail-page.js",
	"./pages/episode-detail/episode-detail-page.xml": "./pages/episode-detail/episode-detail-page.xml",
	"./pages/episodes/episodes-page.js": "./pages/episodes/episodes-page.js",
	"./pages/episodes/episodes-page.xml": "./pages/episodes/episodes-page.xml"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./ sync recursive (?<!\\bApp_Resources\\b.*)(?<!\\.\\/\\btests\\b\\/.*?)\\.(xml|css|js|(?<!\\.d\\.)ts|(?<!\\b_[\\w-]*\\.)scss)$";

/***/ }),

/***/ "./app-root.xml":
/***/ (function(module, exports, __webpack_require__) {


module.exports = "<Frame defaultPage=\"./pages/episodes/episodes-page\">\r\n</Frame>"; 
if (false ) {} 

/***/ }),

/***/ "./app.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var _nativescript_core_bundle_entry_points__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@nativescript/core/bundle-entry-points.js");

        const isAndroid = __webpack_require__("../node_modules/@nativescript/core/index.js").isAndroid;
        if (isAndroid && !global["__snapshot"]) {
            __webpack_require__("../node_modules/@nativescript/core/ui/frame/index.js");
__webpack_require__("../node_modules/@nativescript/core/ui/frame/activity.js");
        }

        
            __webpack_require__("../node_modules/@nativescript/webpack/helpers/load-application-css-regular.js")();
            
            
        if (false) {}
        
            const context = __webpack_require__("./ sync recursive (?<!\\bApp_Resources\\b.*)(?<!\\.\\/\\btests\\b\\/.*?)\\.(xml|css|js|(?<!\\.d\\.)ts|(?<!\\b_[\\w-]*\\.)scss)$");
            global.registerWebpackModules(context);
            if (false) {}
            
        
        const { Application } = __webpack_require__("../node_modules/@nativescript/core/index.js");

Application.run({ moduleName: "app-root" });; 
if (false ) {} 
    
        
        
    
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./pages/character-detail/character-detail-page.js":
/***/ (function(module, exports, __webpack_require__) {

const fromObject = __webpack_require__("../node_modules/@nativescript/core/data/observable/index.js").fromObject;
const axios = __webpack_require__("../node_modules/axios/index.js").default;

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
exports.onNavigatingTo = onNavigatingTo;; 
if (false ) {} 

/***/ }),

/***/ "./pages/character-detail/character-detail-page.xml":
/***/ (function(module, exports, __webpack_require__) {


module.exports = "<Page xmlns=\"http://schemas.nativescript.org/tns.xsd\" navigatingTo=\"onNavigatingTo\">\r\n    <ActionBar title=\"Character Details\"></ActionBar>\r\n\r\n    <FlexboxLayout flexDirection=\"column\" justifyContent=\"center\" alignItems=\"center\">\r\n        <Image id=\"photo\" src=\"\" width=\"150\" height=\"150\" />\r\n        <Label id=\"name\" fontSize=\"20\" fontWeight=\"bold\" text=\"name\" textWrap=\"true\" class=\"title\" />\r\n        <Label id=\"status\" fontSize=\"20\" fontWeight=\"bold\" text=\"status\" textWrap=\"true\" class=\"title\" />\r\n        <Label id=\"species\" fontSize=\"20\" fontWeight=\"bold\" text=\"species\" textWrap=\"true\" class=\"title\" />\r\n        <Label id=\"gender\" fontSize=\"20\" fontWeight=\"bold\" text=\"gender\" textWrap=\"true\" class=\"title\" />\r\n  </FlexboxLayout>\r\n</Page>"; 
if (false ) {} 

/***/ }),

/***/ "./pages/episode-detail/episode-detail-page.js":
/***/ (function(module, exports, __webpack_require__) {

const fromObject = __webpack_require__("../node_modules/@nativescript/core/data/observable/index.js").fromObject;
const axios = __webpack_require__("../node_modules/axios/index.js").default;

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
exports.onItemTap = onItemTap;; 
if (false ) {} 

/***/ }),

/***/ "./pages/episode-detail/episode-detail-page.xml":
/***/ (function(module, exports, __webpack_require__) {


module.exports = "<Page xmlns=\"http://schemas.nativescript.org/tns.xsd\" navigatingTo=\"onNavigatingTo\">\r\n    <ActionBar id=\"actionBar\" title=\"Episode Details\"></ActionBar>\r\n\r\n    <StackLayout class=\"p-20\">\r\n        <ListView items=\"{{ characters }}\"\r\n            itemTap=\"onItemTap\" \r\n            loaded=\"{{ onListViewLoaded }}\" \r\n            separatorColor=\"black\" rowHeight=\"130\"\r\n            class=\"list-group\" id=\"listView\">\r\n            <ListView.itemTemplate>\r\n                <StackLayout class=\"list-group-item\" padding=\"5\" id=\"{{id}}\">\r\n                    <Image src=\"{{image}}\" width=\"100\" height=\"100\" />\r\n                    <Label textAlignment=\"center\" fontWeight=\"bold\" text=\"{{name}}\" textWrap=\"true\" class=\"title\" />\r\n                </StackLayout>\r\n            </ListView.itemTemplate>\r\n        </ListView>\r\n    </StackLayout>\r\n</Page>"; 
if (false ) {} 

/***/ }),

/***/ "./pages/episodes/episodes-page.js":
/***/ (function(module, exports, __webpack_require__) {

const fromObject = __webpack_require__("../node_modules/@nativescript/core/data/observable/index.js").fromObject;
const axios = __webpack_require__("../node_modules/axios/index.js").default;

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
exports.onItemTap = onItemTap;; 
if (false ) {} 

/***/ }),

/***/ "./pages/episodes/episodes-page.xml":
/***/ (function(module, exports, __webpack_require__) {


module.exports = "<Page xmlns=\"http://schemas.nativescript.org/tns.xsd\" navigatingTo=\"onNavigatingTo\">\r\n    <ActionBar title=\"Rick and Morty Episodes\"></ActionBar>\r\n\r\n    <StackLayout class=\"p-20\">\r\n        <ListView items=\"{{ episodes }}\"\r\n            itemTap=\"onItemTap\" \r\n            loaded=\"{{ onListViewLoaded }}\" \r\n            separatorColor=\"black\" rowHeight=\"100\"\r\n            class=\"list-group\" id=\"listView\">\r\n            <ListView.itemTemplate>\r\n                <StackLayout class=\"list-group-item\" padding=\"5\" id=\"{{id}}\">\r\n                    <Label textAlignment=\"left\" fontWeight=\"bold\" text=\"{{ episode || 'Downloading...' }}\" textWrap=\"true\" class=\"title\" />\r\n                    <Label textAlignment=\"center\" fontWeight=\"bold\" text=\"{{ name || 'Downloading...' }}\" textWrap=\"true\" class=\"title\" />\r\n                    <Label textAlignment=\"center\" text=\"{{ air_date || 'Downloading...' }}\" textWrap=\"true\" class=\"title\" />\r\n                </StackLayout>\r\n            </ListView.itemTemplate>\r\n        </ListView>\r\n    </StackLayout>\r\n</Page>"; 
if (false ) {} 

/***/ }),

/***/ "~/package.json":
/***/ (function(module, exports) {

module.exports = require("~/package.json");

/***/ })

},[["./app.js","runtime","vendor"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLiBzeW5jIG5vbnJlY3Vyc2l2ZSBeXFwuXFwvYXBwXFwuKGNzc3xzY3NzfGxlc3N8c2FzcykkIiwid2VicGFjazovLy9cXGJfW1xcdy1dKlxcLilzY3NzKSQiLCJ3ZWJwYWNrOi8vLy4vYXBwLXJvb3QueG1sIiwid2VicGFjazovLy8uL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9jaGFyYWN0ZXItZGV0YWlsL2NoYXJhY3Rlci1kZXRhaWwtcGFnZS5qcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9jaGFyYWN0ZXItZGV0YWlsL2NoYXJhY3Rlci1kZXRhaWwtcGFnZS54bWwiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvZXBpc29kZS1kZXRhaWwvZXBpc29kZS1kZXRhaWwtcGFnZS5qcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9lcGlzb2RlLWRldGFpbC9lcGlzb2RlLWRldGFpbC1wYWdlLnhtbCIsIndlYnBhY2s6Ly8vLi9wYWdlcy9lcGlzb2Rlcy9lcGlzb2Rlcy1wYWdlLmpzIiwid2VicGFjazovLy8uL3BhZ2VzL2VwaXNvZGVzL2VwaXNvZGVzLXBhZ2UueG1sIiwid2VicGFjazovLy9leHRlcm5hbCBcIn4vcGFja2FnZS5qc29uXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxXQUFXO0FBQ2xEO0FBQ0E7QUFDQSxzRTs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0o7Ozs7Ozs7O0FDNUJBLHNGO0FBQ0EsSUFBSSxLQUEwRixHQUFHLEU7Ozs7Ozs7Ozs7O0FDRGpHLDBCQUEwQixtQkFBTyxDQUFDLDZDQUFvQjtBQUN0RDtBQUNBLFlBQVksbUJBQU8sQ0FBQyxzREFBNkI7QUFDakQsbUJBQU8sQ0FBQyx5REFBc0M7QUFDOUM7OztBQUdBLFlBQVksbUJBQU8sQ0FBQywrRUFBNEQ7OztBQUdoRixZQUFZLEtBQVUsRUFBRSxFQWtCZjs7QUFFVCw0QkFBNEIsc0pBQStIO0FBQzNKO0FBQ0EsZ0JBQWdCLEtBQVUsRUFBRSxFQUlmOztBQUViLFFBQXdEO0FBQ3hELGVBQWUsY0FBYyxHQUFHLG1CQUFPLENBQUMsNkNBQW9COztBQUU1RCxpQkFBaUIseUJBQXlCLEc7QUFDMUMsSUFBSSxLQUFvRixHQUFHLEU7Ozs7Ozs7Ozs7OztBQzNDM0YsbUJBQW1CLG1CQUFPLENBQUMsNkRBQWtDO0FBQzdELGNBQWMsbUJBQU8sQ0FBQyxnQ0FBTzs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBLHlDO0FBQ0EsSUFBSSxLQUE2SCxHQUFHLEU7Ozs7Ozs7O0FDckJwSSxzMUI7QUFDQSxJQUFJLEtBQThILEdBQUcsRTs7Ozs7OztBQ0ZySSxtQkFBbUIsbUJBQU8sQ0FBQyw2REFBa0M7QUFDN0QsY0FBYyxtQkFBTyxDQUFDLGdDQUFPOztBQUU3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixtRUFBbUUsZ0JBQWdCO0FBQzVHO0FBQ0EsK0I7QUFDQSxJQUFJLEtBQXlILEdBQUcsRTs7Ozs7Ozs7QUNqQ2hJLDRQQUE0UCxjQUFjLG1FQUFtRSxvQkFBb0IseU9BQXlPLElBQUksMENBQTBDLE9BQU8sdUhBQXVILE1BQU0sMks7QUFDNXZCLElBQUksS0FBMEgsR0FBRyxFOzs7Ozs7O0FDRmpJLG1CQUFtQixtQkFBTyxDQUFDLDZEQUFrQztBQUM3RCxjQUFjLG1CQUFPLENBQUMsZ0NBQU87O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsK0RBQStELGNBQWM7QUFDdEc7QUFDQSwrQjtBQUNBLElBQUksS0FBNkcsR0FBRyxFOzs7Ozs7OztBQ3hCcEgsbVBBQW1QLFlBQVksbUVBQW1FLG9CQUFvQix5T0FBeU8sSUFBSSxzRkFBc0YsK0JBQStCLDRIQUE0SCw0QkFBNEIsd0dBQXdHLGdDQUFnQywySztBQUN4OUIsSUFBSSxLQUE4RyxHQUFHLEU7Ozs7Ozs7QUNGckgsMkMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gd2VicGFja0VtcHR5Q29udGV4dChyZXEpIHtcblx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdHRocm93IGU7XG59XG53ZWJwYWNrRW1wdHlDb250ZXh0LmtleXMgPSBmdW5jdGlvbigpIHsgcmV0dXJuIFtdOyB9O1xud2VicGFja0VtcHR5Q29udGV4dC5yZXNvbHZlID0gd2VicGFja0VtcHR5Q29udGV4dDtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0VtcHR5Q29udGV4dDtcbndlYnBhY2tFbXB0eUNvbnRleHQuaWQgPSBcIi4vIHN5bmMgXlxcXFwuXFxcXC9hcHBcXFxcLihjc3N8c2Nzc3xsZXNzfHNhc3MpJFwiOyIsInZhciBtYXAgPSB7XG5cdFwiLi9hcHAtcm9vdC54bWxcIjogXCIuL2FwcC1yb290LnhtbFwiLFxuXHRcIi4vYXBwLmpzXCI6IFwiLi9hcHAuanNcIixcblx0XCIuL3BhZ2VzL2NoYXJhY3Rlci1kZXRhaWwvY2hhcmFjdGVyLWRldGFpbC1wYWdlLmpzXCI6IFwiLi9wYWdlcy9jaGFyYWN0ZXItZGV0YWlsL2NoYXJhY3Rlci1kZXRhaWwtcGFnZS5qc1wiLFxuXHRcIi4vcGFnZXMvY2hhcmFjdGVyLWRldGFpbC9jaGFyYWN0ZXItZGV0YWlsLXBhZ2UueG1sXCI6IFwiLi9wYWdlcy9jaGFyYWN0ZXItZGV0YWlsL2NoYXJhY3Rlci1kZXRhaWwtcGFnZS54bWxcIixcblx0XCIuL3BhZ2VzL2VwaXNvZGUtZGV0YWlsL2VwaXNvZGUtZGV0YWlsLXBhZ2UuanNcIjogXCIuL3BhZ2VzL2VwaXNvZGUtZGV0YWlsL2VwaXNvZGUtZGV0YWlsLXBhZ2UuanNcIixcblx0XCIuL3BhZ2VzL2VwaXNvZGUtZGV0YWlsL2VwaXNvZGUtZGV0YWlsLXBhZ2UueG1sXCI6IFwiLi9wYWdlcy9lcGlzb2RlLWRldGFpbC9lcGlzb2RlLWRldGFpbC1wYWdlLnhtbFwiLFxuXHRcIi4vcGFnZXMvZXBpc29kZXMvZXBpc29kZXMtcGFnZS5qc1wiOiBcIi4vcGFnZXMvZXBpc29kZXMvZXBpc29kZXMtcGFnZS5qc1wiLFxuXHRcIi4vcGFnZXMvZXBpc29kZXMvZXBpc29kZXMtcGFnZS54bWxcIjogXCIuL3BhZ2VzL2VwaXNvZGVzL2VwaXNvZGVzLXBhZ2UueG1sXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vIHN5bmMgcmVjdXJzaXZlICg/PCFcXFxcYkFwcF9SZXNvdXJjZXNcXFxcYi4qKSg/PCFcXFxcLlxcXFwvXFxcXGJ0ZXN0c1xcXFxiXFxcXC8uKj8pXFxcXC4oeG1sfGNzc3xqc3woPzwhXFxcXC5kXFxcXC4pdHN8KD88IVxcXFxiX1tcXFxcdy1dKlxcXFwuKXNjc3MpJFwiOyIsIlxubW9kdWxlLmV4cG9ydHMgPSBcIjxGcmFtZSBkZWZhdWx0UGFnZT1cXFwiLi9wYWdlcy9lcGlzb2Rlcy9lcGlzb2Rlcy1wYWdlXFxcIj5cXHJcXG48L0ZyYW1lPlwiOyBcbmlmIChtb2R1bGUuaG90ICYmIGdsb2JhbC5faXNNb2R1bGVMb2FkZWRGb3JVSSAmJiBnbG9iYWwuX2lzTW9kdWxlTG9hZGVkRm9yVUkoXCIuL2FwcC1yb290LnhtbFwiKSApIHtcbiAgICBcbiAgICBtb2R1bGUuaG90LmFjY2VwdCgpO1xuICAgIG1vZHVsZS5ob3QuZGlzcG9zZSgoKSA9PiB7XG4gICAgICAgIGdsb2JhbC5obXJSZWZyZXNoKHsgdHlwZTogXCJtYXJrdXBcIiwgcGF0aDogXCIuL2FwcC1yb290LnhtbFwiIH0pO1xuICAgIH0pO1xufSAiLCJcbiAgICAgICAgY29uc3QgaXNBbmRyb2lkID0gcmVxdWlyZShcIkBuYXRpdmVzY3JpcHQvY29yZVwiKS5pc0FuZHJvaWQ7XG4gICAgICAgIGlmIChpc0FuZHJvaWQgJiYgIWdsb2JhbFtcIl9fc25hcHNob3RcIl0pIHtcbiAgICAgICAgICAgIHJlcXVpcmUoXCJAbmF0aXZlc2NyaXB0L2NvcmUvdWkvZnJhbWVcIik7XG5yZXF1aXJlKFwiQG5hdGl2ZXNjcmlwdC9jb3JlL3VpL2ZyYW1lL2FjdGl2aXR5XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgXG4gICAgICAgICAgICByZXF1aXJlKFwiQG5hdGl2ZXNjcmlwdC93ZWJwYWNrL2hlbHBlcnMvbG9hZC1hcHBsaWNhdGlvbi1jc3MtcmVndWxhclwiKSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgKG1vZHVsZS5ob3QpIHtcbiAgICAgICAgICAgIGNvbnN0IGhtclVwZGF0ZSA9IHJlcXVpcmUoXCJAbmF0aXZlc2NyaXB0L3dlYnBhY2svaG1yXCIpLmhtclVwZGF0ZTtcbiAgICAgICAgICAgIGdsb2JhbC5fX2NvcmVNb2R1bGVzTGl2ZVN5bmMgPSBnbG9iYWwuX19vbkxpdmVTeW5jO1xuXG4gICAgICAgICAgICBnbG9iYWwuX19vbkxpdmVTeW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBob3QgdXBkYXRlZCBvbiBMaXZlU3luY1xuICAgICAgICAgICAgICAgIGhtclVwZGF0ZSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZ2xvYmFsLmhtclJlZnJlc2ggPSBmdW5jdGlvbih7IHR5cGUsIHBhdGggfSA9IHt9KSB7XG4gICAgICAgICAgICAgICAgLy8gdGhlIGhvdCB1cGRhdGVzIGFyZSBhcHBsaWVkLCBhc2sgdGhlIG1vZHVsZXMgdG8gYXBwbHkgdGhlIGNoYW5nZXNcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsLl9fY29yZU1vZHVsZXNMaXZlU3luYyh7IHR5cGUsIHBhdGggfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBoYW5kbGUgaG90IHVwZGF0ZWQgb24gaW5pdGlhbCBhcHAgc3RhcnRcbiAgICAgICAgICAgIGhtclVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgY29uc3QgY29udGV4dCA9IHJlcXVpcmUuY29udGV4dChcIn4vXCIsIHRydWUsIC8oPzwhXFxiQXBwX1Jlc291cmNlc1xcYi4qKSg/PCFcXC5cXC9cXGJ0ZXN0c1xcYlxcLy4qPylcXC4oeG1sfGNzc3xqc3woPzwhXFwuZFxcLil0c3woPzwhXFxiX1tcXHctXSpcXC4pc2NzcykkLyk7XG4gICAgICAgICAgICBnbG9iYWwucmVnaXN0ZXJXZWJwYWNrTW9kdWxlcyhjb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChtb2R1bGUuaG90KSB7XG4gICAgICAgICAgICAgICAgbW9kdWxlLmhvdC5hY2NlcHQoY29udGV4dC5pZCwgKCkgPT4geyBcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJITVI6IEFjY2VwdCBtb2R1bGUgJ1wiICsgY29udGV4dC5pZCArIFwiJyBmcm9tICdcIiArIG1vZHVsZS5pZCArIFwiJ1wiKTsgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgaW1wb3J0IFwiQG5hdGl2ZXNjcmlwdC9jb3JlL2J1bmRsZS1lbnRyeS1wb2ludHNcIjtcbiAgICAgICAgY29uc3QgeyBBcHBsaWNhdGlvbiB9ID0gcmVxdWlyZShcIkBuYXRpdmVzY3JpcHQvY29yZVwiKTtcclxuXHJcbkFwcGxpY2F0aW9uLnJ1bih7IG1vZHVsZU5hbWU6IFwiYXBwLXJvb3RcIiB9KTs7IFxuaWYgKG1vZHVsZS5ob3QgJiYgZ2xvYmFsLl9pc01vZHVsZUxvYWRlZEZvclVJICYmIGdsb2JhbC5faXNNb2R1bGVMb2FkZWRGb3JVSShcIi4vYXBwLmpzXCIpICkge1xuICAgIFxuICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4gICAgbW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IHtcbiAgICAgICAgZ2xvYmFsLmhtclJlZnJlc2goeyB0eXBlOiBcInNjcmlwdFwiLCBwYXRoOiBcIi4vYXBwLmpzXCIgfSk7XG4gICAgfSk7XG59IFxuICAgIFxuICAgICAgICBcbiAgICAgICAgXG4gICAgIiwiY29uc3QgZnJvbU9iamVjdCA9IHJlcXVpcmUoXCJ0bnMtY29yZS1tb2R1bGVzL2RhdGEvb2JzZXJ2YWJsZVwiKS5mcm9tT2JqZWN0O1xyXG5jb25zdCBheGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKS5kZWZhdWx0O1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gb25OYXZpZ2F0aW5nVG8oYXJncykge1xyXG4gICAgY29uc3QgcGFnZSA9IGFyZ3Mub2JqZWN0O1xyXG4gICAgY29uc3QgY29udGV4dCA9IHBhZ2UubmF2aWdhdGlvbkNvbnRleHQ7XHJcbiAgICBjb25zdCBpbWFnZSA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJwaG90b1wiKTtcclxuICAgIGNvbnN0IG5hbWVMYWJlbCA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJuYW1lXCIpO1xyXG4gICAgY29uc3Qgc3RhdHVzTGFiZWwgPSBwYWdlLmdldFZpZXdCeUlkKFwic3RhdHVzXCIpO1xyXG4gICAgY29uc3Qgc3BlY2llc0xhYmVsID0gcGFnZS5nZXRWaWV3QnlJZChcInNwZWNpZXNcIik7XHJcbiAgICBjb25zdCBnZW5kZXJMYWJlbCA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJnZW5kZXJcIik7XHJcbiAgICBhd2FpdCBheGlvcy5nZXQoXCJodHRwczovL3JpY2thbmRtb3J0eWFwaS5jb20vYXBpL2NoYXJhY3Rlci9cIitjb250ZXh0LmNoYXJhY3RlcklEKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICBpbWFnZS5zcmMgPSByZXNwb25zZS5kYXRhLmltYWdlO1xyXG4gICAgICAgIG5hbWVMYWJlbC50ZXh0ID0gXCJOYW1lOiBcIityZXNwb25zZS5kYXRhLm5hbWU7XHJcbiAgICAgICAgc3RhdHVzTGFiZWwudGV4dCA9IFwiU3RhdHVzOiBcIityZXNwb25zZS5kYXRhLnN0YXR1cztcclxuICAgICAgICBzcGVjaWVzTGFiZWwudGV4dCA9IFwiU3BlY2llczogXCIrcmVzcG9uc2UuZGF0YS5zcGVjaWVzO1xyXG4gICAgICAgIGdlbmRlckxhYmVsLnRleHQgPSBcIkdlbmRlcjogXCIrcmVzcG9uc2UuZGF0YS5nZW5kZXI7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgfSlcclxufVxyXG5leHBvcnRzLm9uTmF2aWdhdGluZ1RvID0gb25OYXZpZ2F0aW5nVG87OyBcbmlmIChtb2R1bGUuaG90ICYmIGdsb2JhbC5faXNNb2R1bGVMb2FkZWRGb3JVSSAmJiBnbG9iYWwuX2lzTW9kdWxlTG9hZGVkRm9yVUkoXCIuL3BhZ2VzL2NoYXJhY3Rlci1kZXRhaWwvY2hhcmFjdGVyLWRldGFpbC1wYWdlLmpzXCIpICkge1xuICAgIFxuICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4gICAgbW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IHtcbiAgICAgICAgZ2xvYmFsLmhtclJlZnJlc2goeyB0eXBlOiBcInNjcmlwdFwiLCBwYXRoOiBcIi4vcGFnZXMvY2hhcmFjdGVyLWRldGFpbC9jaGFyYWN0ZXItZGV0YWlsLXBhZ2UuanNcIiB9KTtcbiAgICB9KTtcbn0gIiwiXG5tb2R1bGUuZXhwb3J0cyA9IFwiPFBhZ2UgeG1sbnM9XFxcImh0dHA6Ly9zY2hlbWFzLm5hdGl2ZXNjcmlwdC5vcmcvdG5zLnhzZFxcXCIgbmF2aWdhdGluZ1RvPVxcXCJvbk5hdmlnYXRpbmdUb1xcXCI+XFxyXFxuICAgIDxBY3Rpb25CYXIgdGl0bGU9XFxcIkNoYXJhY3RlciBEZXRhaWxzXFxcIj48L0FjdGlvbkJhcj5cXHJcXG5cXHJcXG4gICAgPEZsZXhib3hMYXlvdXQgZmxleERpcmVjdGlvbj1cXFwiY29sdW1uXFxcIiBqdXN0aWZ5Q29udGVudD1cXFwiY2VudGVyXFxcIiBhbGlnbkl0ZW1zPVxcXCJjZW50ZXJcXFwiPlxcclxcbiAgICAgICAgPEltYWdlIGlkPVxcXCJwaG90b1xcXCIgc3JjPVxcXCJcXFwiIHdpZHRoPVxcXCIxNTBcXFwiIGhlaWdodD1cXFwiMTUwXFxcIiAvPlxcclxcbiAgICAgICAgPExhYmVsIGlkPVxcXCJuYW1lXFxcIiBmb250U2l6ZT1cXFwiMjBcXFwiIGZvbnRXZWlnaHQ9XFxcImJvbGRcXFwiIHRleHQ9XFxcIm5hbWVcXFwiIHRleHRXcmFwPVxcXCJ0cnVlXFxcIiBjbGFzcz1cXFwidGl0bGVcXFwiIC8+XFxyXFxuICAgICAgICA8TGFiZWwgaWQ9XFxcInN0YXR1c1xcXCIgZm9udFNpemU9XFxcIjIwXFxcIiBmb250V2VpZ2h0PVxcXCJib2xkXFxcIiB0ZXh0PVxcXCJzdGF0dXNcXFwiIHRleHRXcmFwPVxcXCJ0cnVlXFxcIiBjbGFzcz1cXFwidGl0bGVcXFwiIC8+XFxyXFxuICAgICAgICA8TGFiZWwgaWQ9XFxcInNwZWNpZXNcXFwiIGZvbnRTaXplPVxcXCIyMFxcXCIgZm9udFdlaWdodD1cXFwiYm9sZFxcXCIgdGV4dD1cXFwic3BlY2llc1xcXCIgdGV4dFdyYXA9XFxcInRydWVcXFwiIGNsYXNzPVxcXCJ0aXRsZVxcXCIgLz5cXHJcXG4gICAgICAgIDxMYWJlbCBpZD1cXFwiZ2VuZGVyXFxcIiBmb250U2l6ZT1cXFwiMjBcXFwiIGZvbnRXZWlnaHQ9XFxcImJvbGRcXFwiIHRleHQ9XFxcImdlbmRlclxcXCIgdGV4dFdyYXA9XFxcInRydWVcXFwiIGNsYXNzPVxcXCJ0aXRsZVxcXCIgLz5cXHJcXG4gIDwvRmxleGJveExheW91dD5cXHJcXG48L1BhZ2U+XCI7IFxuaWYgKG1vZHVsZS5ob3QgJiYgZ2xvYmFsLl9pc01vZHVsZUxvYWRlZEZvclVJICYmIGdsb2JhbC5faXNNb2R1bGVMb2FkZWRGb3JVSShcIi4vcGFnZXMvY2hhcmFjdGVyLWRldGFpbC9jaGFyYWN0ZXItZGV0YWlsLXBhZ2UueG1sXCIpICkge1xuICAgIFxuICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4gICAgbW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IHtcbiAgICAgICAgZ2xvYmFsLmhtclJlZnJlc2goeyB0eXBlOiBcIm1hcmt1cFwiLCBwYXRoOiBcIi4vcGFnZXMvY2hhcmFjdGVyLWRldGFpbC9jaGFyYWN0ZXItZGV0YWlsLXBhZ2UueG1sXCIgfSk7XG4gICAgfSk7XG59ICIsImNvbnN0IGZyb21PYmplY3QgPSByZXF1aXJlKFwidG5zLWNvcmUtbW9kdWxlcy9kYXRhL29ic2VydmFibGVcIikuZnJvbU9iamVjdDtcclxuY29uc3QgYXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIikuZGVmYXVsdDtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIG9uTmF2aWdhdGluZ1RvKGFyZ3MpIHtcclxuICAgIGNvbnN0IHBhZ2UgPSBhcmdzLm9iamVjdDtcclxuICAgIGNvbnN0IGNvbnRleHQgPSBwYWdlLm5hdmlnYXRpb25Db250ZXh0O1xyXG4gICAgY29uc3QgYWN0aW9uQmFyID0gcGFnZS5nZXRWaWV3QnlJZChcImFjdGlvbkJhclwiKTtcclxuICAgIGxldCBjaGFyYWN0ZXJzVVJMID0gW107XHJcbiAgICBsZXQgY2hhcmFjdGVycyA9IFtdO1xyXG4gICAgYXdhaXQgYXhpb3MuZ2V0KFwiaHR0cHM6Ly9yaWNrYW5kbW9ydHlhcGkuY29tL2FwaS9lcGlzb2RlL1wiK2NvbnRleHQuZXBpc29kZUlEKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICBhY3Rpb25CYXIudGl0bGUgPSByZXNwb25zZS5kYXRhLmVwaXNvZGUrXCIgLSBcIityZXNwb25zZS5kYXRhLm5hbWU7XHJcbiAgICAgICAgY2hhcmFjdGVyc1VSTCA9IHJlc3BvbnNlLmRhdGEuY2hhcmFjdGVycztcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICB9KTtcclxuICAgIGF3YWl0IFByb21pc2UuYWxsKGNoYXJhY3RlcnNVUkwubWFwKGFzeW5jKGNoYXJhY3RlcikgPT4ge1xyXG4gICAgICAgIGF3YWl0IGF4aW9zLmdldChjaGFyYWN0ZXIpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICBjaGFyYWN0ZXJzLnB1c2gocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSk7XHJcbiAgICBjb25zdCB2bSA9IGZyb21PYmplY3Qoe1xyXG4gICAgICAgIGNoYXJhY3RlcnM6IGNoYXJhY3RlcnNcclxuICAgIH0pO1xyXG4gICAgcGFnZS5iaW5kaW5nQ29udGV4dCA9IHZtO1xyXG59XHJcbmV4cG9ydHMub25OYXZpZ2F0aW5nVG8gPSBvbk5hdmlnYXRpbmdUbztcclxuXHJcbmZ1bmN0aW9uIG9uSXRlbVRhcChhcmdzKSB7XHJcbiAgICBjb25zdCBpZCA9IGFyZ3Mudmlldy5pZDtcclxuICAgIGNvbnN0IGxpc3RWaWV3ID0gYXJncy5vYmplY3Q7XHJcbiAgICBjb25zdCBwYWdlID0gbGlzdFZpZXcucGFnZTtcclxuICAgIHBhZ2UuZnJhbWUubmF2aWdhdGUoe21vZHVsZU5hbWU6XCJwYWdlcy9jaGFyYWN0ZXItZGV0YWlsL2NoYXJhY3Rlci1kZXRhaWwtcGFnZVwiLGNvbnRleHQ6e2NoYXJhY3RlcklEOmlkfX0pO1xyXG59XHJcbmV4cG9ydHMub25JdGVtVGFwID0gb25JdGVtVGFwOzsgXG5pZiAobW9kdWxlLmhvdCAmJiBnbG9iYWwuX2lzTW9kdWxlTG9hZGVkRm9yVUkgJiYgZ2xvYmFsLl9pc01vZHVsZUxvYWRlZEZvclVJKFwiLi9wYWdlcy9lcGlzb2RlLWRldGFpbC9lcGlzb2RlLWRldGFpbC1wYWdlLmpzXCIpICkge1xuICAgIFxuICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4gICAgbW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IHtcbiAgICAgICAgZ2xvYmFsLmhtclJlZnJlc2goeyB0eXBlOiBcInNjcmlwdFwiLCBwYXRoOiBcIi4vcGFnZXMvZXBpc29kZS1kZXRhaWwvZXBpc29kZS1kZXRhaWwtcGFnZS5qc1wiIH0pO1xuICAgIH0pO1xufSAiLCJcbm1vZHVsZS5leHBvcnRzID0gXCI8UGFnZSB4bWxucz1cXFwiaHR0cDovL3NjaGVtYXMubmF0aXZlc2NyaXB0Lm9yZy90bnMueHNkXFxcIiBuYXZpZ2F0aW5nVG89XFxcIm9uTmF2aWdhdGluZ1RvXFxcIj5cXHJcXG4gICAgPEFjdGlvbkJhciBpZD1cXFwiYWN0aW9uQmFyXFxcIiB0aXRsZT1cXFwiRXBpc29kZSBEZXRhaWxzXFxcIj48L0FjdGlvbkJhcj5cXHJcXG5cXHJcXG4gICAgPFN0YWNrTGF5b3V0IGNsYXNzPVxcXCJwLTIwXFxcIj5cXHJcXG4gICAgICAgIDxMaXN0VmlldyBpdGVtcz1cXFwie3sgY2hhcmFjdGVycyB9fVxcXCJcXHJcXG4gICAgICAgICAgICBpdGVtVGFwPVxcXCJvbkl0ZW1UYXBcXFwiIFxcclxcbiAgICAgICAgICAgIGxvYWRlZD1cXFwie3sgb25MaXN0Vmlld0xvYWRlZCB9fVxcXCIgXFxyXFxuICAgICAgICAgICAgc2VwYXJhdG9yQ29sb3I9XFxcImJsYWNrXFxcIiByb3dIZWlnaHQ9XFxcIjEzMFxcXCJcXHJcXG4gICAgICAgICAgICBjbGFzcz1cXFwibGlzdC1ncm91cFxcXCIgaWQ9XFxcImxpc3RWaWV3XFxcIj5cXHJcXG4gICAgICAgICAgICA8TGlzdFZpZXcuaXRlbVRlbXBsYXRlPlxcclxcbiAgICAgICAgICAgICAgICA8U3RhY2tMYXlvdXQgY2xhc3M9XFxcImxpc3QtZ3JvdXAtaXRlbVxcXCIgcGFkZGluZz1cXFwiNVxcXCIgaWQ9XFxcInt7aWR9fVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8SW1hZ2Ugc3JjPVxcXCJ7e2ltYWdlfX1cXFwiIHdpZHRoPVxcXCIxMDBcXFwiIGhlaWdodD1cXFwiMTAwXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPExhYmVsIHRleHRBbGlnbm1lbnQ9XFxcImNlbnRlclxcXCIgZm9udFdlaWdodD1cXFwiYm9sZFxcXCIgdGV4dD1cXFwie3tuYW1lfX1cXFwiIHRleHRXcmFwPVxcXCJ0cnVlXFxcIiBjbGFzcz1cXFwidGl0bGVcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgIDwvU3RhY2tMYXlvdXQ+XFxyXFxuICAgICAgICAgICAgPC9MaXN0Vmlldy5pdGVtVGVtcGxhdGU+XFxyXFxuICAgICAgICA8L0xpc3RWaWV3PlxcclxcbiAgICA8L1N0YWNrTGF5b3V0PlxcclxcbjwvUGFnZT5cIjsgXG5pZiAobW9kdWxlLmhvdCAmJiBnbG9iYWwuX2lzTW9kdWxlTG9hZGVkRm9yVUkgJiYgZ2xvYmFsLl9pc01vZHVsZUxvYWRlZEZvclVJKFwiLi9wYWdlcy9lcGlzb2RlLWRldGFpbC9lcGlzb2RlLWRldGFpbC1wYWdlLnhtbFwiKSApIHtcbiAgICBcbiAgICBtb2R1bGUuaG90LmFjY2VwdCgpO1xuICAgIG1vZHVsZS5ob3QuZGlzcG9zZSgoKSA9PiB7XG4gICAgICAgIGdsb2JhbC5obXJSZWZyZXNoKHsgdHlwZTogXCJtYXJrdXBcIiwgcGF0aDogXCIuL3BhZ2VzL2VwaXNvZGUtZGV0YWlsL2VwaXNvZGUtZGV0YWlsLXBhZ2UueG1sXCIgfSk7XG4gICAgfSk7XG59ICIsImNvbnN0IGZyb21PYmplY3QgPSByZXF1aXJlKFwidG5zLWNvcmUtbW9kdWxlcy9kYXRhL29ic2VydmFibGVcIikuZnJvbU9iamVjdDtcclxuY29uc3QgYXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIikuZGVmYXVsdDtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIG9uTmF2aWdhdGluZ1RvKGFyZ3MpIHtcclxuICAgIGNvbnN0IHBhZ2UgPSBhcmdzLm9iamVjdDtcclxuICAgIGxldCBlcGlzb2RlcyA9IFtdO1xyXG4gICAgYXdhaXQgYXhpb3MuZ2V0KFwiaHR0cHM6Ly9yaWNrYW5kbW9ydHlhcGkuY29tL2FwaS9lcGlzb2RlXCIpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgIGVwaXNvZGVzID0gcmVzcG9uc2UuZGF0YVtcInJlc3VsdHNcIl07XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgfSk7XHJcbiAgICBjb25zdCB2bSA9IGZyb21PYmplY3Qoe1xyXG4gICAgICAgIGVwaXNvZGVzOiBlcGlzb2Rlc1xyXG4gICAgfSk7XHJcbiAgICBwYWdlLmJpbmRpbmdDb250ZXh0ID0gdm07XHJcbn1cclxuZXhwb3J0cy5vbk5hdmlnYXRpbmdUbyA9IG9uTmF2aWdhdGluZ1RvO1xyXG5cclxuZnVuY3Rpb24gb25JdGVtVGFwKGFyZ3MpIHtcclxuICAgIGNvbnN0IGlkID0gYXJncy52aWV3LmlkO1xyXG4gICAgY29uc3QgbGlzdFZpZXcgPSBhcmdzLm9iamVjdDtcclxuICAgIGNvbnN0IHBhZ2UgPSBsaXN0Vmlldy5wYWdlO1xyXG4gICAgcGFnZS5mcmFtZS5uYXZpZ2F0ZSh7bW9kdWxlTmFtZTpcInBhZ2VzL2VwaXNvZGUtZGV0YWlsL2VwaXNvZGUtZGV0YWlsLXBhZ2VcIixjb250ZXh0OntlcGlzb2RlSUQ6aWR9fSk7XHJcbn1cclxuZXhwb3J0cy5vbkl0ZW1UYXAgPSBvbkl0ZW1UYXA7OyBcbmlmIChtb2R1bGUuaG90ICYmIGdsb2JhbC5faXNNb2R1bGVMb2FkZWRGb3JVSSAmJiBnbG9iYWwuX2lzTW9kdWxlTG9hZGVkRm9yVUkoXCIuL3BhZ2VzL2VwaXNvZGVzL2VwaXNvZGVzLXBhZ2UuanNcIikgKSB7XG4gICAgXG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoKTtcbiAgICBtb2R1bGUuaG90LmRpc3Bvc2UoKCkgPT4ge1xuICAgICAgICBnbG9iYWwuaG1yUmVmcmVzaCh7IHR5cGU6IFwic2NyaXB0XCIsIHBhdGg6IFwiLi9wYWdlcy9lcGlzb2Rlcy9lcGlzb2Rlcy1wYWdlLmpzXCIgfSk7XG4gICAgfSk7XG59ICIsIlxubW9kdWxlLmV4cG9ydHMgPSBcIjxQYWdlIHhtbG5zPVxcXCJodHRwOi8vc2NoZW1hcy5uYXRpdmVzY3JpcHQub3JnL3Rucy54c2RcXFwiIG5hdmlnYXRpbmdUbz1cXFwib25OYXZpZ2F0aW5nVG9cXFwiPlxcclxcbiAgICA8QWN0aW9uQmFyIHRpdGxlPVxcXCJSaWNrIGFuZCBNb3J0eSBFcGlzb2Rlc1xcXCI+PC9BY3Rpb25CYXI+XFxyXFxuXFxyXFxuICAgIDxTdGFja0xheW91dCBjbGFzcz1cXFwicC0yMFxcXCI+XFxyXFxuICAgICAgICA8TGlzdFZpZXcgaXRlbXM9XFxcInt7IGVwaXNvZGVzIH19XFxcIlxcclxcbiAgICAgICAgICAgIGl0ZW1UYXA9XFxcIm9uSXRlbVRhcFxcXCIgXFxyXFxuICAgICAgICAgICAgbG9hZGVkPVxcXCJ7eyBvbkxpc3RWaWV3TG9hZGVkIH19XFxcIiBcXHJcXG4gICAgICAgICAgICBzZXBhcmF0b3JDb2xvcj1cXFwiYmxhY2tcXFwiIHJvd0hlaWdodD1cXFwiMTAwXFxcIlxcclxcbiAgICAgICAgICAgIGNsYXNzPVxcXCJsaXN0LWdyb3VwXFxcIiBpZD1cXFwibGlzdFZpZXdcXFwiPlxcclxcbiAgICAgICAgICAgIDxMaXN0Vmlldy5pdGVtVGVtcGxhdGU+XFxyXFxuICAgICAgICAgICAgICAgIDxTdGFja0xheW91dCBjbGFzcz1cXFwibGlzdC1ncm91cC1pdGVtXFxcIiBwYWRkaW5nPVxcXCI1XFxcIiBpZD1cXFwie3tpZH19XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxMYWJlbCB0ZXh0QWxpZ25tZW50PVxcXCJsZWZ0XFxcIiBmb250V2VpZ2h0PVxcXCJib2xkXFxcIiB0ZXh0PVxcXCJ7eyBlcGlzb2RlIHx8ICdEb3dubG9hZGluZy4uLicgfX1cXFwiIHRleHRXcmFwPVxcXCJ0cnVlXFxcIiBjbGFzcz1cXFwidGl0bGVcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8TGFiZWwgdGV4dEFsaWdubWVudD1cXFwiY2VudGVyXFxcIiBmb250V2VpZ2h0PVxcXCJib2xkXFxcIiB0ZXh0PVxcXCJ7eyBuYW1lIHx8ICdEb3dubG9hZGluZy4uLicgfX1cXFwiIHRleHRXcmFwPVxcXCJ0cnVlXFxcIiBjbGFzcz1cXFwidGl0bGVcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8TGFiZWwgdGV4dEFsaWdubWVudD1cXFwiY2VudGVyXFxcIiB0ZXh0PVxcXCJ7eyBhaXJfZGF0ZSB8fCAnRG93bmxvYWRpbmcuLi4nIH19XFxcIiB0ZXh0V3JhcD1cXFwidHJ1ZVxcXCIgY2xhc3M9XFxcInRpdGxlXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICA8L1N0YWNrTGF5b3V0PlxcclxcbiAgICAgICAgICAgIDwvTGlzdFZpZXcuaXRlbVRlbXBsYXRlPlxcclxcbiAgICAgICAgPC9MaXN0Vmlldz5cXHJcXG4gICAgPC9TdGFja0xheW91dD5cXHJcXG48L1BhZ2U+XCI7IFxuaWYgKG1vZHVsZS5ob3QgJiYgZ2xvYmFsLl9pc01vZHVsZUxvYWRlZEZvclVJICYmIGdsb2JhbC5faXNNb2R1bGVMb2FkZWRGb3JVSShcIi4vcGFnZXMvZXBpc29kZXMvZXBpc29kZXMtcGFnZS54bWxcIikgKSB7XG4gICAgXG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoKTtcbiAgICBtb2R1bGUuaG90LmRpc3Bvc2UoKCkgPT4ge1xuICAgICAgICBnbG9iYWwuaG1yUmVmcmVzaCh7IHR5cGU6IFwibWFya3VwXCIsIHBhdGg6IFwiLi9wYWdlcy9lcGlzb2Rlcy9lcGlzb2Rlcy1wYWdlLnhtbFwiIH0pO1xuICAgIH0pO1xufSAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ+L3BhY2thZ2UuanNvblwiKTsiXSwic291cmNlUm9vdCI6IiJ9