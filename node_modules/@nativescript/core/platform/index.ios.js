/* tslint:disable:class-name */
export const platformNames = {
    android: 'Android',
    ios: 'iOS',
};
class DeviceRef {
    get manufacturer() {
        return 'Apple';
    }
    get os() {
        return platformNames.ios;
    }
    get osVersion() {
        if (!this._osVersion) {
            this._osVersion = UIDevice.currentDevice.systemVersion;
        }
        return this._osVersion;
    }
    get model() {
        if (!this._model) {
            this._model = UIDevice.currentDevice.model;
        }
        return this._model;
    }
    get sdkVersion() {
        if (!this._sdkVersion) {
            this._sdkVersion = UIDevice.currentDevice.systemVersion;
        }
        return this._sdkVersion;
    }
    get deviceType() {
        if (!this._deviceType) {
            if (UIDevice.currentDevice.userInterfaceIdiom === 0 /* Phone */) {
                this._deviceType = 'Phone';
            }
            else {
                this._deviceType = 'Tablet';
            }
        }
        return this._deviceType;
    }
    get uuid() {
        const userDefaults = NSUserDefaults.standardUserDefaults;
        const uuid_key = 'TNSUUID';
        let app_uuid = userDefaults.stringForKey(uuid_key);
        if (!app_uuid) {
            app_uuid = NSUUID.UUID().UUIDString;
            userDefaults.setObjectForKey(app_uuid, uuid_key);
            userDefaults.synchronize();
        }
        return app_uuid;
    }
    get language() {
        if (!this._language) {
            const languages = NSLocale.preferredLanguages;
            this._language = languages[0];
        }
        return this._language;
    }
    get region() {
        if (!this._region) {
            this._region = NSLocale.currentLocale.objectForKey(NSLocaleCountryCode);
        }
        return this._region;
    }
}
class MainScreen {
    get screen() {
        if (!this._screen) {
            this._screen = UIScreen.mainScreen;
        }
        return this._screen;
    }
    get widthPixels() {
        return this.widthDIPs * this.scale;
    }
    get heightPixels() {
        return this.heightDIPs * this.scale;
    }
    get scale() {
        return this.screen.scale;
    }
    get widthDIPs() {
        return this.screen.bounds.size.width;
    }
    get heightDIPs() {
        return this.screen.bounds.size.height;
    }
}
export const Device = new DeviceRef();
export class Screen {
}
Screen.mainScreen = new MainScreen();
export const isAndroid = global.isAndroid;
export const isIOS = global.isIOS;
//# sourceMappingURL=index.ios.js.map