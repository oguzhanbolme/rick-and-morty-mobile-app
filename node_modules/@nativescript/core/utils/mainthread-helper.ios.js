export function dispatchToMainThread(func) {
    NSOperationQueue.mainQueue.addOperationWithBlock(func);
}
export function isMainThread() {
    return NSThread.isMainThread;
}
//# sourceMappingURL=mainthread-helper.ios.js.map