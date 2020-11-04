export declare module AndroidTransitionType {
    const enter = "enter";
    const exit = "exit";
    const popEnter = "popEnter";
    const popExit = "popExit";
}
export declare class Transition {
    private _duration;
    private _interpolator;
    private _id;
    constructor(duration: number, curve: any);
    getDuration(): number;
    getCurve(): android.view.animation.Interpolator;
    animateIOSTransition(containerView: any, fromView: any, toView: any, operation: any, completion: (finished: boolean) => void): void;
    createAndroidAnimator(transitionType: string): android.animation.Animator;
    toString(): string;
}
