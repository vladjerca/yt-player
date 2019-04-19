import {
  fromEvent,
  interval,
  merge,
  Observable,
  Subject,
} from 'rxjs';
import {
  filter,
  map,
  share,
  startWith,
  takeUntil,
} from 'rxjs/operators';

import { PlayState } from '../controls';
import {
  IVideoRenderer,
  PreloadStrategy,
} from '../types';

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
      (async () => {
        await this._video.play();
      })();
    }

    if (
      !this._video.paused &&
      value === PlayState.Paused
    ) {
      this._video.pause();
    }

    this._stateChange$.next();
  }

  public get loop() {
    return this._video.loop;
  }
  public set loop(value: boolean) {
    this._video.loop = !!value;
  }

  public set preload(value: PreloadStrategy) {
    this._video.preload = value;
  }

  public set autoplay(value: boolean) {
    this._video.autoplay = value;
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

  public get hasAudio() {
    return this._video instanceof HTMLVideoElement;
  }

  public readonly progress$: Observable<number>;
  public readonly size$: Observable<ISize>;
  public readonly currentTime$: Observable<Date>;
  public readonly totalTime$: Observable<Date>;
  public readonly loading$: Observable<boolean>;


  private _stateChange$ = new Subject();
  private _fullscreen = false;
  private _destroyed$ = new Subject();

  constructor(
    private _video: IVideoRenderer,
    private _container: HTMLElement,
  ) {
    const loaded$ = fromEvent(this._video, 'loadeddata')
      .pipe(share());

    this.loading$ = merge(
      fromEvent(this._video, 'waiting').pipe(map(() => true)),
      fromEvent(this._video, 'playing').pipe(map(() => false)),
    );

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

    const timeTrigger$ = merge(
      interval$,
      this._stateChange$,
    );

    this.progress$ = timeTrigger$.pipe(
      map(() => this._video.currentTime / this._video.duration * 100),
      startWith(0),
    );

    this.currentTime$ = timeTrigger$
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

  public seekProgress(percentage: number) {
    if (isNaN(this._video.duration)) { return; }

    this._video.currentTime = this._video.duration * percentage / 100;
    this._stateChange$.next();
  }

  public destroy() {
    this._stateChange$.complete();
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
