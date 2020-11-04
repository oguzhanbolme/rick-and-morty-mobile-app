import { Font as FontBase, parseFontFamily, genericFontFamilies, FontStyle, FontWeight } from './font-common';
import { Trace } from '../../trace';
import { Device } from '../../platform';
import * as fs from '../../file-system';
export * from './font-common';
const EMULATE_OBLIQUE = true;
const OBLIQUE_TRANSFORM = CGAffineTransformMake(1, 0, 0.2, 1, 0, 0);
const DEFAULT_SERIF = 'Times New Roman';
const DEFAULT_MONOSPACE = 'Courier New';
const SUPPORT_FONT_WEIGHTS = parseFloat(Device.osVersion) >= 10.0;
export class Font extends FontBase {
    constructor(family, size, style, weight) {
        super(family, size, style, weight);
    }
    withFontFamily(family) {
        return new Font(family, this.fontSize, this.fontStyle, this.fontWeight);
    }
    withFontStyle(style) {
        return new Font(this.fontFamily, this.fontSize, style, this.fontWeight);
    }
    withFontWeight(weight) {
        return new Font(this.fontFamily, this.fontSize, this.fontStyle, weight);
    }
    withFontSize(size) {
        return new Font(this.fontFamily, size, this.fontStyle, this.fontWeight);
    }
    getUIFont(defaultFont) {
        if (!this._uiFont) {
            this._uiFont = createUIFont(this, defaultFont);
        }
        return this._uiFont;
    }
    getAndroidTypeface() {
        return undefined;
    }
}
Font.default = new Font(undefined, undefined, FontStyle.NORMAL, FontWeight.NORMAL);
function getFontFamilyRespectingGenericFonts(fontFamily) {
    if (!fontFamily) {
        return fontFamily;
    }
    switch (fontFamily.toLowerCase()) {
        case genericFontFamilies.serif:
            return DEFAULT_SERIF;
        case genericFontFamilies.monospace:
            return DEFAULT_MONOSPACE;
        default:
            return fontFamily;
    }
}
function shouldUseSystemFont(fontFamily) {
    return !fontFamily || fontFamily === genericFontFamilies.sansSerif || fontFamily === genericFontFamilies.system;
}
function getNativeFontWeight(fontWeight) {
    switch (fontWeight) {
        case FontWeight.THIN:
            return UIFontWeightUltraLight;
        case FontWeight.EXTRA_LIGHT:
            return UIFontWeightThin;
        case FontWeight.LIGHT:
            return UIFontWeightLight;
        case FontWeight.NORMAL:
        case '400':
        case undefined:
        case null:
            return UIFontWeightRegular;
        case FontWeight.MEDIUM:
            return UIFontWeightMedium;
        case FontWeight.SEMI_BOLD:
            return UIFontWeightSemibold;
        case FontWeight.BOLD:
        case '700':
            return UIFontWeightBold;
        case FontWeight.EXTRA_BOLD:
            return UIFontWeightHeavy;
        case FontWeight.BLACK:
            return UIFontWeightBlack;
        default:
            throw new Error(`Invalid font weight: "${fontWeight}"`);
    }
}
function getSystemFont(size, nativeWeight, italic, symbolicTraits) {
    let result = UIFont.systemFontOfSizeWeight(size, nativeWeight);
    if (italic) {
        let descriptor = result.fontDescriptor.fontDescriptorWithSymbolicTraits(symbolicTraits);
        result = UIFont.fontWithDescriptorSize(descriptor, size);
    }
    return result;
}
function createUIFont(font, defaultFont) {
    let result;
    const size = font.fontSize || defaultFont.pointSize;
    const nativeWeight = getNativeFontWeight(font.fontWeight);
    const fontFamilies = parseFontFamily(font.fontFamily);
    let symbolicTraits = 0;
    if (font.isBold) {
        symbolicTraits |= 2 /* TraitBold */;
    }
    if (font.isItalic) {
        symbolicTraits |= 1 /* TraitItalic */;
    }
    let fontDescriptorTraits = {
        [UIFontSymbolicTrait]: symbolicTraits,
    };
    // IOS versions below 10 will not return the correct font when UIFontWeightTrait is set
    // In this case - rely on UIFontSymbolicTrait only
    if (SUPPORT_FONT_WEIGHTS) {
        fontDescriptorTraits[UIFontWeightTrait] = nativeWeight;
    }
    for (let i = 0; i < fontFamilies.length; i++) {
        const fontFamily = getFontFamilyRespectingGenericFonts(fontFamilies[i]);
        if (shouldUseSystemFont(fontFamily)) {
            result = getSystemFont(size, nativeWeight, font.isItalic, symbolicTraits);
            break;
        }
        else {
            const fontAttributes = {
                [UIFontDescriptorFamilyAttribute]: fontFamily,
                [UIFontDescriptorTraitsAttribute]: fontDescriptorTraits,
            };
            let descriptor = UIFontDescriptor.fontDescriptorWithFontAttributes(fontAttributes);
            result = UIFont.fontWithDescriptorSize(descriptor, size);
            let actualItalic = result.fontDescriptor.symbolicTraits & 1 /* TraitItalic */;
            if (font.isItalic && !actualItalic && EMULATE_OBLIQUE) {
                // The font we got is not actually italic so emulate that with a matrix
                descriptor = descriptor.fontDescriptorWithMatrix(OBLIQUE_TRANSFORM);
                result = UIFont.fontWithDescriptorSize(descriptor, size);
            }
            // Check if the resolved font has the correct font-family
            // If not - fallback to the next font-family
            if (result.familyName === fontFamily) {
                break;
            }
            else {
                result = null;
            }
        }
    }
    // Couldn't resolve font - fallback to the system font
    if (!result) {
        result = getSystemFont(size, nativeWeight, font.isItalic, symbolicTraits);
    }
    return result;
}
export var ios;
(function (ios) {
    function registerFont(fontFile) {
        let filePath = fs.path.join(fs.knownFolders.currentApp().path, 'fonts', fontFile);
        if (!fs.File.exists(filePath)) {
            filePath = fs.path.join(fs.knownFolders.currentApp().path, fontFile);
        }
        const fontData = NSFileManager.defaultManager.contentsAtPath(filePath);
        if (!fontData) {
            throw new Error('Could not load font from: ' + fontFile);
        }
        const provider = CGDataProviderCreateWithCFData(fontData);
        const font = CGFontCreateWithDataProvider(provider);
        if (!font) {
            throw new Error('Could not load font from: ' + fontFile);
        }
        const error = new interop.Reference();
        if (!CTFontManagerRegisterGraphicsFont(font, error)) {
            if (Trace.isEnabled()) {
                Trace.write('Error occur while registering font: ' + CFErrorCopyDescription(error.value), Trace.categories.Error, Trace.messageType.error);
            }
        }
    }
    ios.registerFont = registerFont;
})(ios || (ios = {}));
function registerFontsInFolder(fontsFolderPath) {
    const fontsFolder = fs.Folder.fromPath(fontsFolderPath);
    fontsFolder.eachEntity((fileEntity) => {
        if (fs.Folder.exists(fs.path.join(fontsFolderPath, fileEntity.name))) {
            return true;
        }
        if (fileEntity instanceof fs.File && (fileEntity.extension === '.ttf' || fileEntity.extension === '.otf')) {
            ios.registerFont(fileEntity.name);
        }
        return true;
    });
}
function registerCustomFonts() {
    const appDir = fs.knownFolders.currentApp().path;
    const fontsDir = fs.path.join(appDir, 'fonts');
    if (fs.Folder.exists(fontsDir)) {
        registerFontsInFolder(fontsDir);
    }
}
registerCustomFonts();
//# sourceMappingURL=font.ios.js.map