// Requires
import { TabContentItemBase } from './tab-content-item-common';
export * from './tab-content-item-common';
export class TabContentItem extends TabContentItemBase {
    setViewController(controller, nativeView) {
        this.__controller = controller;
        this.setNativeView(nativeView);
    }
    disposeNativeView() {
        this.__controller = undefined;
        this.setNativeView(undefined);
    }
}
//# sourceMappingURL=index.ios.js.map