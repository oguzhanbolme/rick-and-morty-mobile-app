// Types.
import { _resolveAnimationCurve } from '../animation';
import lazy from '../../utils/lazy';
const _defaultInterpolator = lazy(() => new android.view.animation.AccelerateDecelerateInterpolator());
export var AndroidTransitionType;
(function (AndroidTransitionType) {
    AndroidTransitionType.enter = 'enter';
    AndroidTransitionType.exit = 'exit';
    AndroidTransitionType.popEnter = 'popEnter';
    AndroidTransitionType.popExit = 'popExit';
})(AndroidTransitionType || (AndroidTransitionType = {}));
let transitionId = 0;
export class Transition {
    constructor(duration, curve) {
        this._duration = duration;
        this._interpolator = curve ? _resolveAnimationCurve(curve) : _defaultInterpolator();
        this._id = transitionId++;
    }
    getDuration() {
        return this._duration;
    }
    getCurve() {
        return this._interpolator;
    }
    animateIOSTransition(containerView, fromView, toView, operation, completion) {
        throw new Error('Abstract method call');
    }
    createAndroidAnimator(transitionType) {
        throw new Error('Abstract method call');
    }
    toString() {
        return `Transition@${this._id}`;
    }
}
//# sourceMappingURL=index.android.js.map