import { TabContentItemBase } from './tab-content-item-common';
export * from './tab-content-item-common';
export declare class TabContentItem extends TabContentItemBase {
    private __controller;
    setViewController(controller: UIViewController, nativeView: UIView): void;
    disposeNativeView(): void;
}
