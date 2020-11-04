// Requires
import { CSSType } from '../../core/view';
import { ContentView } from '../../content-view';
export const traceCategory = 'TabView';
let TabContentItemBase = class TabContentItemBase extends ContentView {
    eachChild(callback) {
        if (this.content) {
            callback(this.content);
        }
    }
    loadView(view) {
        const tabView = this.parent;
        if (tabView && tabView.items) {
            // Don't load items until their fragments are instantiated.
            if (this.canBeLoaded) {
                super.loadView(view);
            }
        }
    }
};
TabContentItemBase = __decorate([
    CSSType('TabContentItem')
], TabContentItemBase);
export { TabContentItemBase };
//# sourceMappingURL=tab-content-item-common.js.map