import * as definition from './fps-native';
export declare class FPSCallback implements definition.FPSCallback {
    private impl;
    private onFrame;
    running: boolean;
    constructor(onFrame: (currentTimeMillis: number) => void);
    start(): void;
    stop(): void;
    private handleFrame;
}
