import { android as androidApp, getNativeApplication } from '../application';
export var connectionType;
(function (connectionType) {
    connectionType[connectionType["none"] = 0] = "none";
    connectionType[connectionType["wifi"] = 1] = "wifi";
    connectionType[connectionType["mobile"] = 2] = "mobile";
    connectionType[connectionType["ethernet"] = 3] = "ethernet";
    connectionType[connectionType["bluetooth"] = 4] = "bluetooth";
    connectionType[connectionType["vpn"] = 5] = "vpn";
})(connectionType || (connectionType = {}));
const wifi = 'wifi';
const mobile = 'mobile';
const ethernet = 'ethernet';
const bluetooth = 'bluetooth';
const vpn = 'vpn';
// Get Connection Type
function getConnectivityManager() {
    return getNativeApplication().getApplicationContext().getSystemService(android.content.Context.CONNECTIVITY_SERVICE);
}
function getActiveNetworkInfo() {
    const connectivityManager = getConnectivityManager();
    if (!connectivityManager) {
        return null;
    }
    return connectivityManager.getActiveNetworkInfo();
}
function getNetworkCapabilities() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const connectivityManager = getConnectivityManager();
    const network = connectivityManager.getActiveNetwork();
    const capabilities = connectivityManager.getNetworkCapabilities(network);
    if (capabilities == null) {
        return connectionType.none;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const NetworkCapabilities = android.net.NetworkCapabilities;
    if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
        return connectionType.wifi;
    }
    if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
        return connectionType.mobile;
    }
    if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)) {
        return connectionType.ethernet;
    }
    if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_BLUETOOTH)) {
        return connectionType.bluetooth;
    }
    if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_VPN)) {
        return connectionType.vpn;
    }
    return connectionType.none;
}
export function getConnectionType() {
    if (android.os.Build.VERSION.SDK_INT >= 28) {
        return getNetworkCapabilities();
    }
    else {
        const activeNetworkInfo = getActiveNetworkInfo();
        if (!activeNetworkInfo || !activeNetworkInfo.isConnected()) {
            return connectionType.none;
        }
        const type = activeNetworkInfo.getTypeName().toLowerCase();
        if (type.indexOf(wifi) !== -1) {
            return connectionType.wifi;
        }
        if (type.indexOf(mobile) !== -1) {
            return connectionType.mobile;
        }
        if (type.indexOf(ethernet) !== -1) {
            return connectionType.ethernet;
        }
        if (type.indexOf(bluetooth) !== -1) {
            return connectionType.bluetooth;
        }
        if (type.indexOf(vpn) !== -1) {
            return connectionType.vpn;
        }
    }
    return connectionType.none;
}
function startMonitoringLegacy(connectionTypeChangedCallback) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onReceiveCallback = function onReceiveCallback(context, intent) {
        const newConnectionType = getConnectionType();
        connectionTypeChangedCallback(newConnectionType);
    };
    const zoneCallback = zonedCallback(onReceiveCallback);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    androidApp.registerBroadcastReceiver(android.net.ConnectivityManager.CONNECTIVITY_ACTION, zoneCallback);
}
let callback;
let networkCallback;
let notifyCallback;
export function startMonitoring(connectionTypeChangedCallback) {
    if (android.os.Build.VERSION.SDK_INT >= 28) {
        const manager = getConnectivityManager();
        if (manager) {
            notifyCallback = () => {
                const newConnectionType = getConnectionType();
                const zoneCallback = zonedCallback(connectionTypeChangedCallback);
                zoneCallback(newConnectionType);
            };
            const ConnectivityManager = android.net.ConnectivityManager;
            if (!networkCallback) {
                var NetworkCallbackImpl = /** @class */ (function (_super) {
    __extends(NetworkCallbackImpl, _super);
    function NetworkCallbackImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    NetworkCallbackImpl.prototype.onAvailable = function (network) {
        if (notifyCallback) {
            notifyCallback();
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    NetworkCallbackImpl.prototype.onCapabilitiesChanged = function (network, networkCapabilities) {
        if (notifyCallback) {
            notifyCallback();
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    NetworkCallbackImpl.prototype.onLost = function (network) {
        if (notifyCallback) {
            notifyCallback();
        }
    };
    NetworkCallbackImpl.prototype.onUnavailable = function () {
        if (notifyCallback) {
            notifyCallback();
        }
    };
    return NetworkCallbackImpl;
}(ConnectivityManager.NetworkCallback));
                networkCallback = NetworkCallbackImpl;
            }
            callback = new networkCallback();
            manager.registerDefaultNetworkCallback(callback);
        }
    }
    else {
        startMonitoringLegacy(connectionTypeChangedCallback);
    }
}
export function stopMonitoring() {
    if (android.os.Build.VERSION.SDK_INT >= 28) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const manager = getConnectivityManager();
        if (manager && callback) {
            manager.unregisterNetworkCallback(callback);
            notifyCallback = null;
            callback = null;
        }
    }
    else {
        androidApp.unregisterBroadcastReceiver(android.net.ConnectivityManager.CONNECTIVITY_ACTION);
    }
}
//# sourceMappingURL=index.android.js.map