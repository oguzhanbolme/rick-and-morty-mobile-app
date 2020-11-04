import { View } from '../core/view';
export * from './background-common';
export declare enum CacheMode {
    none = 0
}
export declare module ios {
    function createBackgroundUIColor(view: View, callback: (uiColor: UIColor) => void, flip?: boolean): void;
}
