import { Tabs as TabsDefinition } from '.';
import { TabNavigationBase } from '../tab-navigation-base/tab-navigation-base';
import { Property } from '../core/properties';
export * from '../tab-navigation-base/tab-content-item';
export * from '../tab-navigation-base/tab-navigation-base';
export * from '../tab-navigation-base/tab-strip';
export * from '../tab-navigation-base/tab-strip-item';
export declare const traceCategory = "TabView";
export declare class TabsBase extends TabNavigationBase implements TabsDefinition {
    swipeEnabled: boolean;
    offscreenTabLimit: number;
    tabsPosition: 'top' | 'bottom';
    iOSTabBarItemsAlignment: IOSTabBarItemsAlignment;
}
export declare const swipeEnabledProperty: Property<TabsBase, boolean>;
export declare const offscreenTabLimitProperty: Property<TabsBase, number>;
export declare const tabsPositionProperty: Property<TabsBase, "top" | "bottom">;
export declare type IOSTabBarItemsAlignment = 'leading' | 'justified' | 'center' | 'centerSelected';
export declare const iOSTabBarItemsAlignmentProperty: Property<TabsBase, IOSTabBarItemsAlignment>;
export declare const animationEnabledProperty: Property<TabsBase, boolean>;
