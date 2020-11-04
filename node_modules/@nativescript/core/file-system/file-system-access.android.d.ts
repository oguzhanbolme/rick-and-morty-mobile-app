export declare class FileSystemAccess {
    private _pathSeparator;
    getLastModified(path: string): Date;
    getFileSize(path: string): number;
    getParent(path: string, onError?: (error: any) => any): {
        path: string;
        name: string;
    };
    getFile(path: string, onError?: (error: any) => any): {
        path: string;
        name: string;
        extension: string;
    };
    getFolder(path: string, onError?: (error: any) => any): {
        path: string;
        name: string;
    };
    eachEntity(path: string, onEntity: (file: {
        path: string;
        name: string;
        extension: string;
    }) => boolean, onError?: (error: any) => any): void;
    getEntities(path: string, onError?: (error: any) => any): Array<{
        path: string;
        name: string;
        extension: string;
    }>;
    fileExists(path: string): boolean;
    folderExists(path: string): boolean;
    deleteFile(path: string, onError?: (error: any) => any): void;
    deleteFolder(path: string, onError?: (error: any) => any): void;
    emptyFolder(path: string, onError?: (error: any) => any): void;
    rename(path: string, newPath: string, onError?: (error: any) => any): void;
    getDocumentsFolderPath(): string;
    getLogicalRootPath(): string;
    getTempFolderPath(): string;
    getCurrentAppPath(): string;
    read: any;
    readAsync(path: string): Promise<number[]>;
    readSync(path: string, onError?: (error: any) => any): any;
    write: any;
    writeAsync(path: string, bytes: native.Array<number>): Promise<void>;
    writeSync(path: string, bytes: native.Array<number>, onError?: (error: any) => any): void;
    readText: any;
    readTextAsync(path: string, encoding?: any): Promise<string>;
    readTextSync(path: string, onError?: (error: any) => any, encoding?: any): string;
    private static _removeUtf8Bom;
    writeText: any;
    writeTextAsync(path: string, content: string, encoding?: any): Promise<void>;
    writeTextSync(path: string, content: string, onError?: (error: any) => any, encoding?: any): void;
    private deleteFolderContent;
    private ensureFile;
    getFileExtension(path: string): string;
    private enumEntities;
    getPathSeparator(): string;
    normalizePath(path: string): string;
    joinPath(left: string, right: string): string;
    joinPaths(paths: string[]): string;
}
