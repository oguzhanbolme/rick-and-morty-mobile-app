import { Transition } from '.';
export class FadeTransition extends Transition {
    animateIOSTransition(containerView, fromView, toView, operation, completion) {
        let originalToViewAlpha = toView.alpha;
        let originalFromViewAlpha = fromView.alpha;
        toView.alpha = 0.0;
        fromView.alpha = 1.0;
        switch (operation) {
            case 1 /* Push */:
                containerView.insertSubviewAboveSubview(toView, fromView);
                break;
            case 2 /* Pop */:
                containerView.insertSubviewBelowSubview(toView, fromView);
                break;
        }
        let duration = this.getDuration();
        let curve = this.getCurve();
        UIView.animateWithDurationAnimationsCompletion(duration, () => {
            UIView.setAnimationCurve(curve);
            toView.alpha = 1.0;
            fromView.alpha = 0.0;
        }, (finished) => {
            toView.alpha = originalToViewAlpha;
            fromView.alpha = originalFromViewAlpha;
            completion(finished);
        });
    }
}
//# sourceMappingURL=fade-transition.ios.js.map