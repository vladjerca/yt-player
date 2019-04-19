import {
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
} from '@angular/core';

import {
  fromEvent,
  merge,
  of,
  Subject,
} from 'rxjs';
import {
  auditTime,
  delay,
  map,
  share,
  switchMapTo,
  takeUntil,
} from 'rxjs/operators';

import { PlayState } from '../controls';
import { PreloadStrategy } from '../types';
import { YtPlayer } from './player';

const enum MouseState {
  Idle,
  Moving,
}

export abstract class PlayerComponent implements OnDestroy {
  @HostBinding('class.yt-player-state-playing')
  public get statePlaying() {
    return this.player.state === PlayState.Playing;
  }

  @HostBinding('class.yt-player-mouse-state-idle')
  public get statePlayingIdle() {
    return this._mouseState === MouseState.Idle;
  }

  @HostBinding('class.yt-player-state-paused')
  public get statePaused() {
    if (!this.player) { return; }

    return this.player.state === PlayState.Paused;
  }

  @HostBinding('class.yt-player-view-state-fullscreen')
  public get viewStateFullscreen() {
    if (!this.player) { return; }

    return this.player.fullscreen;
  }
  public abstract player: YtPlayer;

  @Input()
  public get preload() {
    return this._preload;
  }
  public set preload(value: PreloadStrategy) {
    this._preload = value;
    if (!this.player) { return; }

    this.player.preload = value;
  }

  @Input()
  public get autoplay() {
    return this._autoplay;
  }
  public set autoplay(value: boolean) {
    this._autoplay = value;
    if (!this.player) { return; }

    this.player.autoplay = !!value;
  }

  @Input()
  public get loop() {
    return this._loop;
  }
  public set loop(value: boolean) {
    this._loop = value;
    if (!this.player) { return; }

    this.player.loop = !!value;
  }

  public readonly focusedControl$ = new Subject();

  private _mouseState = MouseState.Idle;
  private _destroyed$ = new Subject();
  private _autoplay: boolean;
  private _preload: PreloadStrategy;
  private _loop: boolean;

  constructor(
    ref: ElementRef,
  ) {
    const move$ = fromEvent(ref.nativeElement, 'mousemove')
      .pipe(
        share(),
        auditTime(250),
      );

    const activity$ = merge(
      this.focusedControl$.pipe(map(() => MouseState.Idle)),
      move$,
    )
      .pipe(map(() => MouseState.Moving));

    const out$ = fromEvent(ref.nativeElement, 'mouseout')
      .pipe(
        map(() => MouseState.Idle),
      );

    const idle$ = merge(
      out$,
      activity$
        .pipe(
          switchMapTo(of(MouseState.Idle).pipe(delay(1000))),
        ),
    );

    merge(
      activity$,
      idle$,
    )
      .pipe(
        takeUntil(this._destroyed$),
      )
      .subscribe(state => this._mouseState = state);
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  @HostListener('click', ['$event'])
  @HostListener('keyup.enter', ['$event'])
  @HostListener('keyup.space', ['$event'])
  public togglePlay(ev: Event) {
    if ((ev.target as Element).classList.contains('yt-control')) { return; }

    this.player.togglePlay();
  }
}
