import { getNativeApplication, android as androidApp } from '../application';
import { Trace } from '../trace';
// We are using "ad" here to avoid namespace collision with the global android object
export var ad;
(function (ad) {
    let application;
    let applicationContext;
    let contextResources;
    let packageName;
    function getApplicationContext() {
        if (!applicationContext) {
            applicationContext = getApplication().getApplicationContext();
        }
        return applicationContext;
    }
    ad.getApplicationContext = getApplicationContext;
    function getApplication() {
        if (!application) {
            application = getNativeApplication();
        }
        return application;
    }
    ad.getApplication = getApplication;
    function getResources() {
        if (!contextResources) {
            contextResources = getApplication().getResources();
        }
        return contextResources;
    }
    ad.getResources = getResources;
    function getPackageName() {
        if (!packageName) {
            packageName = getApplicationContext().getPackageName();
        }
        return packageName;
    }
    let inputMethodManager;
    function getInputMethodManager() {
        if (!inputMethodManager) {
            inputMethodManager = getApplicationContext().getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
        }
        return inputMethodManager;
    }
    ad.getInputMethodManager = getInputMethodManager;
    function showSoftInput(nativeView) {
        const inputManager = getInputMethodManager();
        if (inputManager && nativeView instanceof android.view.View) {
            inputManager.showSoftInput(nativeView, android.view.inputmethod.InputMethodManager.SHOW_IMPLICIT);
        }
    }
    ad.showSoftInput = showSoftInput;
    function dismissSoftInput(nativeView) {
        const inputManager = getInputMethodManager();
        let windowToken;
        if (nativeView instanceof android.view.View) {
            if (!nativeView.hasFocus()) {
                return;
            }
            windowToken = nativeView.getWindowToken();
        }
        else if (androidApp.foregroundActivity instanceof androidx.appcompat.app.AppCompatActivity) {
            const decorView = androidApp.foregroundActivity.getWindow().getDecorView();
            windowToken = decorView ? decorView.getWindowToken() : null;
        }
        if (inputManager && windowToken) {
            inputManager.hideSoftInputFromWindow(windowToken, 0);
        }
    }
    ad.dismissSoftInput = dismissSoftInput;
    let collections;
    (function (collections) {
        function stringArrayToStringSet(str) {
            const hashSet = new java.util.HashSet();
            if (str !== undefined) {
                for (let element in str) {
                    hashSet.add('' + str[element]);
                }
            }
            return hashSet;
        }
        collections.stringArrayToStringSet = stringArrayToStringSet;
        function stringSetToStringArray(stringSet) {
            const arr = [];
            if (stringSet !== undefined) {
                const it = stringSet.iterator();
                while (it.hasNext()) {
                    const element = '' + it.next();
                    arr.push(element);
                }
            }
            return arr;
        }
        collections.stringSetToStringArray = stringSetToStringArray;
    })(collections = ad.collections || (ad.collections = {}));
    let resources;
    (function (resources_1) {
        let attr;
        const attrCache = new Map();
        function getDrawableId(name) {
            return getId(':drawable/' + name);
        }
        resources_1.getDrawableId = getDrawableId;
        function getStringId(name) {
            return getId(':string/' + name);
        }
        resources_1.getStringId = getStringId;
        function getId(name) {
            const resources = getResources();
            const packageName = getPackageName();
            const uri = packageName + name;
            return resources.getIdentifier(uri, null, null);
        }
        resources_1.getId = getId;
        function getPalleteColor(name, context) {
            return getPaletteColor(name, context);
        }
        resources_1.getPalleteColor = getPalleteColor;
        function getPaletteColor(name, context) {
            if (attrCache.has(name)) {
                return attrCache.get(name);
            }
            let result = 0;
            try {
                if (!attr) {
                    attr = java.lang.Class.forName('androidx.appcompat.R$attr');
                }
                let colorID = 0;
                let field = attr.getField(name);
                if (field) {
                    colorID = field.getInt(null);
                }
                if (colorID) {
                    let typedValue = new android.util.TypedValue();
                    context.getTheme().resolveAttribute(colorID, typedValue, true);
                    result = typedValue.data;
                }
            }
            catch (ex) {
                Trace.write('Cannot get pallete color: ' + name, Trace.categories.Error, Trace.messageType.error);
            }
            attrCache.set(name, result);
            return result;
        }
        resources_1.getPaletteColor = getPaletteColor;
    })(resources = ad.resources || (ad.resources = {}));
    function isRealDevice() {
        const fingerprint = android.os.Build.FINGERPRINT;
        return fingerprint != null && (fingerprint.indexOf('vbox') > -1 || fingerprint.indexOf('generic') > -1);
    }
    ad.isRealDevice = isRealDevice;
})(ad || (ad = {}));
export const iOSNativeHelper = 0;
//# sourceMappingURL=native-helper.android.js.map