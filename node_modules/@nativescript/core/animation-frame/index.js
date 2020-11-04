import { FPSCallback } from '../fps-meter/fps-native';
import { getTimeInFrameBase } from './animation-native';
let animationId = 0;
let nextFrameAnimationCallbacks = {};
let shouldStop = true;
let inAnimationFrame = false;
let fpsCallback;
let lastFrameTime = 0;
function getNewId() {
    return animationId++;
}
function ensureNative() {
    if (fpsCallback) {
        return;
    }
    fpsCallback = new FPSCallback(doFrame);
}
function doFrame(currentTimeMillis) {
    lastFrameTime = currentTimeMillis;
    shouldStop = true;
    const thisFrameCbs = nextFrameAnimationCallbacks;
    nextFrameAnimationCallbacks = {};
    inAnimationFrame = true;
    for (const animationId in thisFrameCbs) {
        if (thisFrameCbs[animationId]) {
            thisFrameCbs[animationId](lastFrameTime);
        }
    }
    inAnimationFrame = false;
    if (shouldStop) {
        fpsCallback.stop(); // TODO: check performance without stopping to allow consistent frame times
    }
}
export function requestAnimationFrame(cb) {
    if (!inAnimationFrame) {
        inAnimationFrame = true;
        zonedCallback(cb)(getTimeInFrameBase()); // TODO: store and use lastFrameTime
        inAnimationFrame = false;
        return getNewId();
    }
    ensureNative();
    const animId = getNewId();
    nextFrameAnimationCallbacks[animId] = zonedCallback(cb);
    shouldStop = false;
    fpsCallback.start();
    return animId;
}
export function cancelAnimationFrame(id) {
    delete nextFrameAnimationCallbacks[id];
}
//# sourceMappingURL=index.js.map