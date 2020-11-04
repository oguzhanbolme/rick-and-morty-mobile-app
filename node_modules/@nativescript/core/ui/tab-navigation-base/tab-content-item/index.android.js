import { GridLayout } from '../../layouts/grid-layout';
// Requires
import { TabContentItemBase, traceCategory } from './tab-content-item-common';
import { Trace } from '../../../trace';
export * from './tab-content-item-common';
export class TabContentItem extends TabContentItemBase {
    get _hasFragments() {
        return true;
    }
    createNativeView() {
        const layout = new org.nativescript.widgets.GridLayout(this._context);
        layout.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
        return layout;
    }
    initNativeView() {
        super.initNativeView();
    }
    _addViewToNativeVisualTree(child, atIndex) {
        // Set the row property for the child
        if (this.nativeViewProtected && child.nativeViewProtected) {
            GridLayout.setRow(child, 0);
        }
        return super._addViewToNativeVisualTree(child, atIndex);
    }
    disposeNativeView() {
        super.disposeNativeView();
        this.canBeLoaded = false;
    }
    _getChildFragmentManager() {
        const tabView = this.parent;
        let tabFragment = null;
        const fragmentManager = tabView._getFragmentManager();
        if (typeof this.index === 'undefined') {
            Trace.write(`Current TabContentItem index is not set`, traceCategory, Trace.messageType.error);
        }
        const fragments = fragmentManager.getFragments().toArray();
        for (let i = 0; i < fragments.length; i++) {
            if (fragments[i].index === this.index) {
                tabFragment = fragments[i];
                break;
            }
        }
        // TODO: can happen in a modal tabview scenario when the modal dialog fragment is already removed
        if (!tabFragment) {
            // if (Trace.isEnabled()) {
            //     Trace.write(`Could not get child fragment manager for tab item with index ${this.index}`, traceCategory);
            // }
            // TODO: fix d.ts in view module
            return tabView._getRootFragmentManager();
        }
        return tabFragment.getChildFragmentManager();
    }
}
//# sourceMappingURL=index.android.js.map