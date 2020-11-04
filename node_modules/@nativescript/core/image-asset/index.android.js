import { ImageAssetBase, getRequestedImageSize } from './image-asset-common';
import { path as fsPath, knownFolders } from '../file-system';
export * from './image-asset-common';
export class ImageAsset extends ImageAssetBase {
    constructor(asset) {
        super();
        let fileName = typeof asset === 'string' ? asset.trim() : '';
        if (fileName.indexOf('~/') === 0) {
            fileName = fsPath.join(knownFolders.currentApp().path, fileName.replace('~/', ''));
        }
        this.android = fileName;
    }
    // @ts-ignore
    get android() {
        return this._android;
    }
    set android(value) {
        this._android = value;
    }
    getImageAsync(callback) {
        let bitmapOptions = new android.graphics.BitmapFactory.Options();
        bitmapOptions.inJustDecodeBounds = true;
        // read only the file size
        let bitmap = android.graphics.BitmapFactory.decodeFile(this.android, bitmapOptions);
        let sourceSize = {
            width: bitmapOptions.outWidth,
            height: bitmapOptions.outHeight,
        };
        let requestedSize = getRequestedImageSize(sourceSize, this.options);
        let sampleSize = org.nativescript.widgets.image.Fetcher.calculateInSampleSize(bitmapOptions.outWidth, bitmapOptions.outHeight, requestedSize.width, requestedSize.height);
        let finalBitmapOptions = new android.graphics.BitmapFactory.Options();
        finalBitmapOptions.inSampleSize = sampleSize;
        try {
            let error = null;
            // read as minimum bitmap as possible (slightly bigger than the requested size)
            bitmap = android.graphics.BitmapFactory.decodeFile(this.android, finalBitmapOptions);
            if (bitmap) {
                if (requestedSize.width !== bitmap.getWidth() || requestedSize.height !== bitmap.getHeight()) {
                    // scale to exact size
                    bitmap = android.graphics.Bitmap.createScaledBitmap(bitmap, requestedSize.width, requestedSize.height, true);
                }
                const rotationAngle = calculateAngleFromFile(this.android);
                if (rotationAngle !== 0) {
                    const matrix = new android.graphics.Matrix();
                    matrix.postRotate(rotationAngle);
                    bitmap = android.graphics.Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
                }
            }
            if (!bitmap) {
                error = "Asset '" + this.android + "' cannot be found.";
            }
            callback(bitmap, error);
        }
        catch (ex) {
            callback(null, ex);
        }
    }
}
function calculateAngleFromFile(filename) {
    let rotationAngle = 0;
    const ei = new android.media.ExifInterface(filename);
    const orientation = ei.getAttributeInt(android.media.ExifInterface.TAG_ORIENTATION, android.media.ExifInterface.ORIENTATION_NORMAL);
    switch (orientation) {
        case android.media.ExifInterface.ORIENTATION_ROTATE_90:
            rotationAngle = 90;
            break;
        case android.media.ExifInterface.ORIENTATION_ROTATE_180:
            rotationAngle = 180;
            break;
        case android.media.ExifInterface.ORIENTATION_ROTATE_270:
            rotationAngle = 270;
            break;
    }
    return rotationAngle;
}
//# sourceMappingURL=index.android.js.map