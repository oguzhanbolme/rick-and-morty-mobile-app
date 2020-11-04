import { TabContentItem as TabContentItemDefinition } from '.';
import { AddChildFromBuilder } from '../../core/view';
import { View } from '../../core/view';
import { ViewBase } from '../../core/view-base';
import { ContentView } from '../../content-view';
export declare const traceCategory = "TabView";
export declare abstract class TabContentItemBase extends ContentView implements TabContentItemDefinition, AddChildFromBuilder {
    eachChild(callback: (child: View) => boolean): void;
    loadView(view: ViewBase): void;
}
