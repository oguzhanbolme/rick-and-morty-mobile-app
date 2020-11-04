export function dispatchToMainThread(func) {
    new android.os.Handler(android.os.Looper.getMainLooper()).post(new java.lang.Runnable({
        run: func,
    }));
}
export function isMainThread() {
    return android.os.Looper.myLooper() === android.os.Looper.getMainLooper();
}
//# sourceMappingURL=mainthread-helper.android.js.map