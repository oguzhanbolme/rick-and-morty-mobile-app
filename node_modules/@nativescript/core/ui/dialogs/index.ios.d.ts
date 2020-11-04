import { PromptResult, LoginResult } from './dialogs-common';
export * from './dialogs-common';
export declare function alert(arg: any): Promise<void>;
export declare function confirm(arg: any): Promise<boolean>;
export declare function prompt(arg: any): Promise<PromptResult>;
export declare function login(...args: any[]): Promise<LoginResult>;
export declare function action(): Promise<string>;
/**
 * Singular rollup for convenience of all dialog methods
 */
export declare const Dialogs: {
    alert: typeof alert;
    confirm: typeof confirm;
    prompt: typeof prompt;
    login: typeof login;
    action: typeof action;
};
