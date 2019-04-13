import { PlayState } from '@yt/player';

import {
  fromEvent,
  interval,
  Observable,
  Subject,
} from 'rxjs';
import {
  filter,
  map,
  share,
  startWith,
  takeUntil,
  tap,
} from 'rxjs/operators';

const gcd = (width: number, height: number) =>
  (height === 0) ? width : gcd(height, width % height);

interface ISize {
  width: number;
  height: number;
}

export class YtPlayer {
  public get volume() {
    return this._video.volume;
  }
  public set volume(value: number) {
    this._video.volume = value;
  }

  public get fullscreen() {
    return this._fullscreen;
  }

  public set fullscreen(value: boolean) {
    if (
      this.fullscreen &&
      value === false
    ) {
      this._exitFullscreen();
    }

    if (
      !this.fullscreen &&
      value === true
    ) {
      this._enterFullscreen();
    }

    this._fullscreen = value;
  }

  public get mute() {
    return this._video.muted;
  }
  public set mute(value: boolean) {
    this._video.muted = value;
  }

  public get state() {
    return this._video.paused ? PlayState.Paused : PlayState.Playing;
  }
  public set state(value: PlayState) {
    if (
      this._video.paused &&
      value === PlayState.Playing
    ) {
      this._video.play();
    }

    if (
      !this._video.paused &&
      value === PlayState.Paused
    ) {
      this._video.pause();
    }
  }

  public get isFullscreenEnabled() {
    const doc = this._video.ownerDocument as Document;

    return !!(
      doc.fullscreenEnabled ||
      doc['mozFullScreenEnabled'] ||
      doc['msFullscreenEnabled'] ||
      doc['webkitSupportsFullscreen'] ||
      doc['webkitFullscreenEnabled']
    );
  }

  public readonly progress$: Observable<number>;
  public readonly size$: Observable<ISize>;
  public readonly currentTime$: Observable<Date>;
  public readonly totalTime$: Observable<Date>;

  private _fullscreen = false;
  private _destroyed$ = new Subject();

  constructor(
    private _video: HTMLVideoElement,
    private _container: HTMLElement,
  ) {
    const loaded$ = fromEvent(this._video, 'loadeddata')
      .pipe(share());

    this.size$ = loaded$
      .pipe(
        map(
          () => ({
            width: this._video.videoWidth,
            height: this._video.videoHeight,
          }),
        ),
      );

    fromEvent(this._video, 'ended')
      .pipe(takeUntil(this._destroyed$))
      .subscribe(() => this.state = PlayState.Paused);

    const interval$ = interval(1000)
      .pipe(
        share(),
        filter(() => this.state === PlayState.Playing),
      );

    this.progress$ = interval$.pipe(
      map(() => this._video.currentTime / this._video.duration * 100),
      tap(progress => console.log({ progress, duration: this._video.duration, current: this._video.currentTime })),
      startWith(0),
    );

    this.currentTime$ = interval$
      .pipe(
        startWith(0),
        map(() => this._secondsToDate(this._video.currentTime)),
      );

    this.totalTime$ = loaded$
      .pipe(
        startWith(-1),
        map(() => this._secondsToDate(this._video.duration)),
      );
  }

  public togglePlay() {
    this.state = this.state === PlayState.Playing ?
      PlayState.Paused :
      PlayState.Playing;
  }

  public destroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  private _exitFullscreen() {
    const doc = this._video.ownerDocument;

    const exitFullscreen: () => void = (
      doc['exitFullscreen'] ||
      doc['mozCancelFullScreen'] ||
      doc['webkitCancelFullScreen'] ||
      doc['msExitFullscreen']
    ).bind(doc);

    exitFullscreen();
  }

  private _secondsToDate = (seconds: number) => {
    const date = new Date(1970, 0, 1);
    date.setSeconds(seconds);
    return date;
  }

  private _enterFullscreen() {
    const parent = this._container;

    const enterFullscreen: () => void = (
      parent['requestFullscreen'] ||
      parent['mozRequestFullScreen'] ||
      parent['webkitRequestFullScreen'] ||
      parent['msRequestFullscreen']
    ).bind(parent);

    enterFullscreen();
  }
}
