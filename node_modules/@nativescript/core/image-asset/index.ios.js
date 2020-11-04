import { ImageAssetBase, getRequestedImageSize } from './image-asset-common';
import { path as fsPath, knownFolders } from '../file-system';
export * from './image-asset-common';
export class ImageAsset extends ImageAssetBase {
    constructor(asset) {
        super();
        if (typeof asset === 'string') {
            if (asset.indexOf('~/') === 0) {
                asset = fsPath.join(knownFolders.currentApp().path, asset.replace('~/', ''));
            }
            this.nativeImage = UIImage.imageWithContentsOfFile(asset);
        }
        else if (asset instanceof UIImage) {
            this.nativeImage = asset;
        }
        else {
            this.ios = asset;
        }
    }
    // @ts-ignore
    get ios() {
        return this._ios;
    }
    set ios(value) {
        this._ios = value;
    }
    getImageAsync(callback) {
        if (!this.ios && !this.nativeImage) {
            callback(null, 'Asset cannot be found.');
        }
        let srcWidth = this.nativeImage ? this.nativeImage.size.width : this.ios.pixelWidth;
        let srcHeight = this.nativeImage ? this.nativeImage.size.height : this.ios.pixelHeight;
        let requestedSize = getRequestedImageSize({ width: srcWidth, height: srcHeight }, this.options);
        if (this.nativeImage) {
            let newSize = CGSizeMake(requestedSize.width, requestedSize.height);
            let resizedImage = this.scaleImage(this.nativeImage, newSize);
            callback(resizedImage, null);
            return;
        }
        let imageRequestOptions = PHImageRequestOptions.alloc().init();
        imageRequestOptions.deliveryMode = 1 /* HighQualityFormat */;
        imageRequestOptions.networkAccessAllowed = true;
        PHImageManager.defaultManager().requestImageForAssetTargetSizeContentModeOptionsResultHandler(this.ios, requestedSize, 0 /* AspectFit */, imageRequestOptions, (image, imageResultInfo) => {
            if (image) {
                let resultImage = this.scaleImage(image, requestedSize);
                callback(resultImage, null);
            }
            else {
                callback(null, imageResultInfo.valueForKey(PHImageErrorKey));
            }
        });
    }
    scaleImage(image, requestedSize) {
        // scaleFactor = 0 takes the scale factor of the devices's main screen.
        const scaleFactor = this.options && this.options.autoScaleFactor === false ? 1.0 : 0.0;
        UIGraphicsBeginImageContextWithOptions(requestedSize, false, scaleFactor);
        image.drawInRect(CGRectMake(0, 0, requestedSize.width, requestedSize.height));
        let resultImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        return resultImage;
    }
}
//# sourceMappingURL=index.ios.js.map