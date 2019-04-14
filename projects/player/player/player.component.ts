import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewEncapsulation,
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
import {
  PreloadStrategy,
  YtPlayer,
} from './player';
import { YtSourceDirective } from './source/source.directive';

const enum MouseState {
  Idle,
  Moving,
}

@Component({
  selector: 'yt-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class YtPlayerComponent implements OnDestroy {

  @ContentChildren(YtSourceDirective)
  public set sources(sources: QueryList<YtSourceDirective>) {
    const sourceList = sources ? sources.toArray() : [];
    sourceList.forEach(source =>
      this._renderer
        .appendChild(this._video, source.srcEl),
    );
  }

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
    return this.player.state === PlayState.Paused;
  }

  @HostBinding('class.yt-player-view-state-fullscreen')
  public get viewStateFullscreen() {
    return this.player.fullscreen;
  }
  public player: YtPlayer;

  @Input()
  public set muted(value: boolean) {
    if (value == null) { return; }

    this.player.mute = !!value;
  }

  @Input()
  public set preload(value: PreloadStrategy) {
    this.player.preload = value;
  }

  @Input()
  public set autoplay(value: boolean) {
    this.player.autoplay = !!value;
  }

  public readonly focusedControl$ = new Subject();

  private _video: HTMLVideoElement;
  private _destroyed$ = new Subject();
  private _mouseState = MouseState.Idle;

  constructor(
    private _renderer: Renderer2,
    private _ref: ElementRef,
  ) {
    this._video = _renderer.createElement('video');
    this._renderer.setProperty(this._video, 'controls', false);
    this._renderer.setAttribute(this._video, 'class', 'yt-video');

    this._renderer.appendChild(this._ref.nativeElement, this._video);
    this.player = new YtPlayer(this._video, this._ref.nativeElement);

    const move$ = fromEvent(this._ref.nativeElement, 'mousemove')
      .pipe(
        share(),
        auditTime(250),
      );

    const activity$ = merge(
      this.focusedControl$.pipe(map(() => MouseState.Idle)),
      move$,
    )
      .pipe(map(() => MouseState.Moving));

    const out$ = fromEvent(this._ref.nativeElement, 'mouseout')
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
    this.player.destroy();
  }

  @HostListener('click', ['$event'])
  @HostListener('keyup.enter', ['$event'])
  @HostListener('keyup.space', ['$event'])
  public togglePlay(ev: Event) {
    if ((ev.target as Element).classList.contains('yt-control')) { return; }

    this.player.togglePlay();
  }
}
