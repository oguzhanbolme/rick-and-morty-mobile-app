import { ListViewBase } from './list-view-common';
import { View } from '../core/view';
export * from './list-view-common';
export declare class ListView extends ListViewBase {
    nativeViewProtected: android.widget.ListView;
    private _androidViewId;
    _realizedItems: Map<globalAndroid.view.View, View>;
    _realizedTemplates: Map<string, Map<globalAndroid.view.View, View>>;
    createNativeView(): globalAndroid.widget.ListView;
    initNativeView(): void;
    disposeNativeView(): void;
    onLoaded(): void;
    refresh(): void;
    scrollToIndex(index: number): void;
    scrollToIndexAnimated(index: number): void;
    get _childrenCount(): number;
    eachChildView(callback: (child: View) => boolean): void;
    _dumpRealizedTemplates(): void;
    private clearRealizedCells;
    isItemAtIndexVisible(index: number): boolean;
}
