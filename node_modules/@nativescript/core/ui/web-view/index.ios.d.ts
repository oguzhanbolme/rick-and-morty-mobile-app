import { WebViewBase } from './web-view-common';
export * from './web-view-common';
export declare class WebView extends WebViewBase {
    nativeViewProtected: WKWebView;
    private _delegate;
    createNativeView(): WKWebView;
    initNativeView(): void;
    onLoaded(): void;
    onUnloaded(): void;
    get ios(): WKWebView;
    stopLoading(): void;
    _loadUrl(src: string): void;
    _loadData(content: string): void;
    get canGoBack(): boolean;
    get canGoForward(): boolean;
    goBack(): void;
    goForward(): void;
    reload(): void;
}
