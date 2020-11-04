import { View } from '../core/view';
export * from './background-common';
export declare module ad {
    function onBackgroundOrBorderPropertyChanged(view: View): void;
}
export declare enum CacheMode {
    none = 0,
    memory = 1,
    diskAndMemory = 2
}
export declare function initImageCache(context: android.content.Context, mode?: CacheMode, memoryCacheSize?: number, diskCacheSize?: number): void;
