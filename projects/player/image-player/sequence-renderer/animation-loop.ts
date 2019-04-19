export interface LoopEvent {
  frame: number;
}

type LoopHandler = (ev: LoopEvent) => void;

export class AnimationLoop {
  private _events: { frame: LoopHandler[] } = { frame: [] };
  private _rendererHandle: number;
  private _frame = 0;
  private _cancelled = false;

  constructor(public fps: number) { }

  public addEventListener(type: 'frame', delegate: LoopHandler) {
    this._events[type].push(delegate);
  }

  public removeEventListener(event: 'frame', delegate: LoopHandler) {
    const index = this._events[event].indexOf(delegate);

    if (index !== -1) {
      this._events[event].splice(index, 1);
    }
  }

  public seek(frame: number) {
    this._frame = frame;
  }

  public play() {
    this._cancelled = false;
    this._rendererHandle = requestAnimationFrame((start) => {
      this._draw(start, null);
    });
  }

  public reset() {
    this._frame = 0;
  }

  public pause() {
    this._cancelled = true;
    cancelAnimationFrame(this._rendererHandle);
  }

  private _draw(start, current) {
    const elapsed = current - start;

    if (elapsed > 1000 / this.fps) {
      this._events.frame.forEach(delegate => delegate({ frame: this._frame++ }));
      start = current;
    }

    if (this._cancelled) { return; }

    this._rendererHandle = requestAnimationFrame((timestamp) => this._draw(start, timestamp));
  }
}
