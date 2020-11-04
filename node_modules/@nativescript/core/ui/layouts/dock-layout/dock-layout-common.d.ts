import { DockLayout as DockLayoutDefinition, Dock } from '.';
import { LayoutBase } from '../layout-base';
import { View } from '../../core/view';
import { Property } from '../../core/properties';
export * from '../layout-base';
export declare class DockLayoutBase extends LayoutBase implements DockLayoutDefinition {
    static getDock(element: View): Dock;
    static setDock(element: View, value: Dock): void;
    stretchLastChild: boolean;
    onDockChanged(view: View, oldValue: Dock, newValue: Dock): void;
}
export declare const dockProperty: Property<View, "left" | "right" | "top" | "bottom">;
export declare const stretchLastChildProperty: Property<DockLayoutBase, boolean>;
