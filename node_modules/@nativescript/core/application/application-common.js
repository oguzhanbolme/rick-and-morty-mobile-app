// Require globals first so that snapshot takes __extends function.
import '../globals';
import * as bindableResources from '../ui/core/bindable/bindable-resources';
import { CSSUtils } from '../css/system-classes';
import { Enums } from '../ui/enums';
export * from './application-interfaces';
export function hasLaunched() {
    return global.NativeScriptGlobals && global.NativeScriptGlobals.launched;
}
export const launchEvent = 'launch';
export const suspendEvent = 'suspend';
export const displayedEvent = 'displayed';
export const resumeEvent = 'resume';
export const exitEvent = 'exit';
export const lowMemoryEvent = 'lowMemory';
export const uncaughtErrorEvent = 'uncaughtError';
export const discardedErrorEvent = 'discardedError';
export const orientationChangedEvent = 'orientationChanged';
export const systemAppearanceChangedEvent = 'systemAppearanceChanged';
const ORIENTATION_CSS_CLASSES = [`${CSSUtils.CLASS_PREFIX}${Enums.DeviceOrientation.portrait}`, `${CSSUtils.CLASS_PREFIX}${Enums.DeviceOrientation.landscape}`, `${CSSUtils.CLASS_PREFIX}${Enums.DeviceOrientation.unknown}`];
const SYSTEM_APPEARANCE_CSS_CLASSES = [`${CSSUtils.CLASS_PREFIX}${Enums.SystemAppearance.light}`, `${CSSUtils.CLASS_PREFIX}${Enums.SystemAppearance.dark}`];
let cssFile = './app.css';
export function getResources() {
    return bindableResources.get();
}
export function setResources(res) {
    bindableResources.set(res);
}
export let android = undefined;
export let ios = undefined;
export const on = global.NativeScriptGlobals.events.on.bind(global.NativeScriptGlobals.events);
export const off = global.NativeScriptGlobals.events.off.bind(global.NativeScriptGlobals.events);
export const notify = global.NativeScriptGlobals.events.notify.bind(global.NativeScriptGlobals.events);
export const hasListeners = global.NativeScriptGlobals.events.hasListeners.bind(global.NativeScriptGlobals.events);
let app;
export function setApplication(instance) {
    app = instance;
    // signal when the application instance is ready globally
    global.NativeScriptGlobals.appInstanceReady = true;
}
export function livesync(rootView, context) {
    global.NativeScriptGlobals.events.notify({ eventName: 'livesync', object: app });
    const liveSyncCore = global.__onLiveSyncCore;
    let reapplyAppStyles = false;
    // ModuleContext is available only for Hot Module Replacement
    if (context && context.path) {
        const styleExtensions = ['css', 'scss'];
        const appStylesFullFileName = getCssFileName();
        const appStylesFileName = appStylesFullFileName.substring(0, appStylesFullFileName.lastIndexOf('.') + 1);
        reapplyAppStyles = styleExtensions.some((ext) => context.path === appStylesFileName.concat(ext));
    }
    // Handle application styles
    if (rootView && reapplyAppStyles) {
        rootView._onCssStateChange();
    }
    else if (liveSyncCore) {
        liveSyncCore(context);
    }
}
export function setCssFileName(cssFileName) {
    cssFile = cssFileName;
    global.NativeScriptGlobals.events.notify({
        eventName: 'cssChanged',
        object: app,
        cssFile: cssFileName,
    });
}
export function getCssFileName() {
    return cssFile;
}
export function loadAppCss() {
    try {
        global.NativeScriptGlobals.events.notify({
            eventName: 'loadAppCss',
            object: app,
            cssFile: getCssFileName(),
        });
    }
    catch (e) {
        throw new Error(`The app CSS file ${getCssFileName()} couldn't be loaded!`);
    }
}
function addCssClass(rootView, cssClass) {
    CSSUtils.pushToSystemCssClasses(cssClass);
    rootView.cssClasses.add(cssClass);
}
function removeCssClass(rootView, cssClass) {
    CSSUtils.removeSystemCssClass(cssClass);
    rootView.cssClasses.delete(cssClass);
}
function increaseStyleScopeApplicationCssSelectorVersion(rootView) {
    const styleScope = rootView._styleScope || (rootView.currentPage && rootView.currentPage._styleScope);
    if (styleScope) {
        styleScope._increaseApplicationCssSelectorVersion();
    }
}
function applyCssClass(rootView, cssClasses, newCssClass) {
    if (!rootView.cssClasses.has(newCssClass)) {
        cssClasses.forEach((cssClass) => removeCssClass(rootView, cssClass));
        addCssClass(rootView, newCssClass);
        increaseStyleScopeApplicationCssSelectorVersion(rootView);
        rootView._onCssStateChange();
    }
}
export function orientationChanged(rootView, newOrientation) {
    if (!rootView) {
        return;
    }
    const newOrientationCssClass = `${CSSUtils.CLASS_PREFIX}${newOrientation}`;
    applyCssClass(rootView, ORIENTATION_CSS_CLASSES, newOrientationCssClass);
    const rootModalViews = rootView._getRootModalViews();
    rootModalViews.forEach((rootModalView) => {
        applyCssClass(rootModalView, ORIENTATION_CSS_CLASSES, newOrientationCssClass);
    });
}
export let autoSystemAppearanceChanged = true;
export function setAutoSystemAppearanceChanged(value) {
    autoSystemAppearanceChanged = value;
}
export function systemAppearanceChanged(rootView, newSystemAppearance) {
    if (!rootView || !autoSystemAppearanceChanged) {
        return;
    }
    const newSystemAppearanceCssClass = `${CSSUtils.CLASS_PREFIX}${newSystemAppearance}`;
    applyCssClass(rootView, SYSTEM_APPEARANCE_CSS_CLASSES, newSystemAppearanceCssClass);
    const rootModalViews = rootView._getRootModalViews();
    rootModalViews.forEach((rootModalView) => {
        applyCssClass(rootModalView, SYSTEM_APPEARANCE_CSS_CLASSES, newSystemAppearanceCssClass);
    });
}
global.__onUncaughtError = function (error) {
    global.NativeScriptGlobals.events.notify({
        eventName: uncaughtErrorEvent,
        object: app,
        android: error,
        ios: error,
        error: error,
    });
};
global.__onDiscardedError = function (error) {
    global.NativeScriptGlobals.events.notify({
        eventName: discardedErrorEvent,
        object: app,
        error: error,
    });
};
//# sourceMappingURL=application-common.js.map