"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hmrUpdate = void 0;
const hot = require("../helpers/hot");
function hmrUpdate() {
    const coreFile = require('@nativescript/core');
    const currentAppFolder = coreFile.knownFolders.currentApp();
    const latestHash = __webpack_require__['h']();
    return hot(latestHash, (filename) => {
        const fullFilePath = coreFile.path.join(currentAppFolder.path, filename);
        return coreFile.File.exists(fullFilePath) ? currentAppFolder.getFile(filename) : null;
    });
}
exports.hmrUpdate = hmrUpdate;
//# sourceMappingURL=hmr-update.js.map