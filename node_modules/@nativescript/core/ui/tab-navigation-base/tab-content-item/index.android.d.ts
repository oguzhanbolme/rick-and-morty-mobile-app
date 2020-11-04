import { TabContentItemBase } from './tab-content-item-common';
import { View } from '../../core/view';
export * from './tab-content-item-common';
export declare class TabContentItem extends TabContentItemBase {
    nativeViewProtected: org.nativescript.widgets.GridLayout;
    tabItemSpec: org.nativescript.widgets.TabItemSpec;
    index: number;
    get _hasFragments(): boolean;
    createNativeView(): org.nativescript.widgets.GridLayout;
    initNativeView(): void;
    _addViewToNativeVisualTree(child: View, atIndex?: number): boolean;
    disposeNativeView(): void;
    _getChildFragmentManager(): androidx.fragment.app.FragmentManager;
}
