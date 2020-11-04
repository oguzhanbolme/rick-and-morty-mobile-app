// Requires
import { TabNavigationBase } from '../tab-navigation-base/tab-navigation-base';
import { CSSType } from '../core/view';
import { booleanConverter } from '../core/view-base';
import { Property } from '../core/properties';
export * from '../tab-navigation-base/tab-content-item';
export * from '../tab-navigation-base/tab-navigation-base';
export * from '../tab-navigation-base/tab-strip';
export * from '../tab-navigation-base/tab-strip-item';
export const traceCategory = 'TabView';
let TabsBase = class TabsBase extends TabNavigationBase {
};
TabsBase = __decorate([
    CSSType('Tabs')
], TabsBase);
export { TabsBase };
// TODO: Add Unit tests
export const swipeEnabledProperty = new Property({
    name: 'swipeEnabled',
    defaultValue: true,
    valueConverter: booleanConverter,
});
swipeEnabledProperty.register(TabsBase);
// TODO: Add Unit tests
// TODO: Coerce to max number of items?
export const offscreenTabLimitProperty = new Property({
    name: 'offscreenTabLimit',
    defaultValue: 1,
    valueConverter: (v) => parseInt(v),
});
offscreenTabLimitProperty.register(TabsBase);
export const tabsPositionProperty = new Property({
    name: 'tabsPosition',
    defaultValue: 'top',
});
tabsPositionProperty.register(TabsBase);
export const iOSTabBarItemsAlignmentProperty = new Property({ name: 'iOSTabBarItemsAlignment', defaultValue: 'justified' });
iOSTabBarItemsAlignmentProperty.register(TabsBase);
export const animationEnabledProperty = new Property({ name: 'animationEnabled', defaultValue: true, valueConverter: booleanConverter });
animationEnabledProperty.register(TabsBase);
//# sourceMappingURL=tabs-common.js.map