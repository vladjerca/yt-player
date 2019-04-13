import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { PlayState } from '@yt/player';

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

import { YtPlayer } from './player';

const enum VideoMimeType {
  Mp4 = 'video/mp4',
  WebM = 'video/webm',
  Ogg = 'video/ogg',
}

const enum VideoExtension {
  Mp4 = 'mp4',
  WebM = 'webm',
  Ogg = 'ogg',
}

const enum MouseState {
  Idle,
  Moving,
}

const VideoExtensionMime: Record<VideoExtension, VideoMimeType> = {
  [VideoExtension.Mp4]: VideoMimeType.Mp4,
  [VideoExtension.WebM]: VideoMimeType.WebM,
  [VideoExtension.Ogg]: VideoMimeType.Ogg,
};

@Component({
  selector: 'yt-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class YtPlayerComponent implements OnDestroy {
  @Input()
  public set source(value: string) {
    const [extension] = value.toLocaleLowerCase().split('.').reverse();

    const mimeType = VideoExtensionMime[extension];

    if (!mimeType) { throw new Error(`The video type ${extension} is not supported!`); }

    this._renderer.setProperty(this._video, 'innerHtml', '');
    const source: HTMLSourceElement = this._renderer.createElement('source');
    this._renderer.setProperty(source, 'src', value);
    this._renderer.setProperty(source, 'type', mimeType);
    this._renderer.appendChild(this._video, source);
  }

  public player: YtPlayer;

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
        map(() => MouseState.Moving),
      );

    const out$ = fromEvent(this._ref.nativeElement, 'mouseout')
      .pipe(
        map(() => MouseState.Idle),
      );

    const idle$ = merge(
      out$,
      move$
        .pipe(
          switchMapTo(of(MouseState.Idle).pipe(delay(1000))),
        ),
    );

    merge(
      move$,
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

  @HostListener('click')
  public togglePlay() {
    this.player.togglePlay();
  }
}
