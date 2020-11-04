export declare namespace iOSNativeHelper {
    function getter<T>(_this: any, property: T | {
        (): T;
    }): T;
    namespace collections {
        function jsArrayToNSArray(str: string[]): NSArray<any>;
        function nsArrayToJSArray(a: NSArray<any>): Array<Object>;
    }
    function isLandscape(): boolean;
    const MajorVersion: number;
    function openFile(filePath: string): boolean;
    function getCurrentAppPath(): string;
    function joinPaths(...paths: string[]): string;
    function getVisibleViewController(rootViewController: UIViewController): UIViewController;
    function applyRotateTransform(transform: CATransform3D, x: number, y: number, z: number): CATransform3D;
    function createUIDocumentInteractionControllerDelegate(): NSObject;
    function isRealDevice(): true | NSArray<string>;
}
