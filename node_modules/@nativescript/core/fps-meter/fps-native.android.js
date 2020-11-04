export class FPSCallback {
    constructor(onFrame) {
        this.running = false;
        this.onFrame = onFrame;
        this.impl = new android.view.Choreographer.FrameCallback({
            doFrame: (nanos) => {
                this.handleFrame(nanos);
            },
        });
    }
    start() {
        if (this.running) {
            return;
        }
        android.view.Choreographer.getInstance().postFrameCallback(this.impl);
        this.running = true;
    }
    stop() {
        if (!this.running) {
            return;
        }
        android.view.Choreographer.getInstance().removeFrameCallback(this.impl);
        this.running = false;
    }
    handleFrame(nanos) {
        if (!this.running) {
            return;
        }
        // divide by 1 000 000 since the parameter is in nanoseconds
        this.onFrame(nanos / 1000000);
        // add the FrameCallback instance again since it is automatically removed from the Choreographer
        android.view.Choreographer.getInstance().postFrameCallback(this.impl);
    }
}
//# sourceMappingURL=fps-native.android.js.map