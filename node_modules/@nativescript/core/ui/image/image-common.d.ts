import { Image as ImageDefinition, Stretch } from '.';
import { View } from '../core/view';
import { ImageAsset } from '../../image-asset';
import { ImageSource } from '../../image-source';
import { Color } from '../../color';
import { Style } from '../styling/style';
import { Length } from '../styling/style-properties';
import { Property, InheritedCssProperty } from '../core/properties';
export declare abstract class ImageBase extends View implements ImageDefinition {
    imageSource: ImageSource;
    src: string | ImageSource;
    isLoading: boolean;
    stretch: Stretch;
    loadMode: 'sync' | 'async';
    decodeWidth: Length;
    decodeHeight: Length;
    get tintColor(): Color;
    set tintColor(value: Color);
    /**
     * @internal
     */
    _createImageSourceFromSrc(value: string | ImageSource | ImageAsset): void;
}
export declare const imageSourceProperty: Property<ImageBase, ImageSource>;
export declare const srcProperty: Property<ImageBase, any>;
export declare const loadModeProperty: Property<ImageBase, "sync" | "async">;
export declare const isLoadingProperty: Property<ImageBase, boolean>;
export declare const stretchProperty: Property<ImageBase, Stretch>;
export declare const tintColorProperty: InheritedCssProperty<Style, Color>;
export declare const decodeHeightProperty: Property<ImageBase, Length>;
export declare const decodeWidthProperty: Property<ImageBase, Length>;
