import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

import {
  fromEvent,
  merge,
  Subject,
} from 'rxjs';
import {
  filter,
  map,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

import {
  IVideoRenderer,
  IVideoRendererHandler,
  PlayerEventName,
  PreloadStrategy,
} from '../../types';
import { AnimationLoop } from './animation-loop';
import { ImageBufferedStream } from './image-buffered-stream';

@Component({
  selector: 'yt-sequence-renderer',
  template: '',
  styleUrls: ['./sequence-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class YtSequenceRendererComponent implements IVideoRenderer, OnInit, OnDestroy {

  public get ownerDocument() {
    return this._container.ownerDocument;
  }

  public videoWidth = 0;
  public videoHeight = 0;

  public get currentTime() {
    return this._currentTime;
  }

  public set currentTime(value: number) {
    this._animationLoop.seek(Math.floor(value * this.fps));

    this._currentTime = value;
  }

  public get duration() {
    return this.images.length / this.fps;
  }

  public readonly volume = null;
  public readonly muted = null;
  public readonly preload: PreloadStrategy = 'auto';

  public paused: boolean;
  public loop = false;
  public autoplay = false;

  @Input()
  public images: string[] = [];

  @Input()
  public fps: number;

  private _destroyed$ = new Subject();
  private _resize$ = new Subject();
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private _container: HTMLElement;
  private _currentTime = 0;
  private _animationLoop: AnimationLoop;
  private _imageStream: ImageBufferedStream;
  private _poster: HTMLImageElement;
  private _events: {
    loadeddata: IVideoRendererHandler[],
    ended: IVideoRendererHandler[],
    waiting: IVideoRendererHandler[],
    playing: IVideoRendererHandler[],
  } = {
      loadeddata: [],
      ended: [],
      waiting: [],
      playing: [],
    };

  constructor(
    private _renderer: Renderer2,
    _ref: ElementRef,
  ) {
    this.paused = !this.autoplay;
    this._container = _ref.nativeElement;
    this._canvas = this._renderer.createElement('canvas');
    this._context = this._canvas.getContext('2d');

    this._renderer.appendChild(this._container, this._canvas);
  }

  async ngOnInit() {
    this._animationLoop = new AnimationLoop(this.fps);

    this._imageStream = new ImageBufferedStream(
      this.images,
      this.fps,
      this.preload === 'auto',
    );

    merge(
      fromEvent(this.ownerDocument.defaultView, 'resize'),
      this._resize$,
    ).pipe(
      takeUntil(this._destroyed$),
    ).subscribe(() => {
      this._resizeCanvas();
      /**
       * For whatever reason, computed width is offset by a couple of pixels on the first resize,
       * Resizing the canvas a second time renders the correct coputed values
       */
      this._resizeCanvas();

      if (!this.paused) { return; }

      if (!this._poster) {
        this._fill();
      } else {
        this._draw(this._poster);
      }
    });

    this._imageStream.medatadata$
      .pipe(
        tap(({ width, height }) => {
          this.videoWidth = width;
          this.videoHeight = height;
        }),
        tap(() => this._emit('loadeddata')),
        tap(() => this._resize$.next()),
        tap(image => this._draw(image)),
        tap(image => this._poster = image),
        takeUntil(this._destroyed$),
      ).subscribe();

    await this._playWhenReadyIf(this.autoplay);

    fromEvent(this._animationLoop, 'frame')
      .pipe(takeUntil(this._destroyed$))
      .subscribe(async (ev) => {
        if (ev.frame === this._imageStream.length) {
          if (this.loop) {
            this._animationLoop.reset();
          } else {
            this.pause();
            this._emit('ended');
          }
          return;
        }

        if (ev.frame >= this._imageStream.bufferedLength) {
          this.pause();
          await this._playWhenReadyIf(true);
          this._emit('waiting');
          return;
        }

        this._currentTime = (ev.frame + 1) / this.fps;
        this._draw(this._imageStream.frames[ev.frame]);
      });
  }

  ngOnDestroy() {
    this._animationLoop.pause();
    this._destroyed$.next();
  }

  public addEventListener(event: PlayerEventName, handler: IVideoRendererHandler) {
    this._events[event].push(handler);
  }

  public removeEventListener(event: PlayerEventName, handler: IVideoRendererHandler) {
    const index = this._events[event].indexOf(handler);

    if (index !== -1) {
      this._events[event].splice(index, 1);
    }
  }

  public play() {
    if (this._currentTime === this.duration) {
      this._animationLoop.reset();
    }

    return new Promise<void>((resolve) => {
      this.paused = false;
      this._animationLoop.play();
      resolve(void 0);
    });
  }

  public pause() {
    this.paused = true;
    this._animationLoop.pause();
  }

  private _emit(event: PlayerEventName) {
    this._events[event].forEach(handler => handler());
  }

  private _fill() {
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }

  private _resizeCanvas() {
    let width = this._container.clientWidth;
    let scale = width / this.videoWidth;

    this._canvas.width = this.videoWidth * scale - 1;
    this._canvas.height = this.videoHeight * scale - 1;
  }

  private _playWhenReadyIf = (condition) => {
    return this._imageStream.progress$
      .pipe(
        take(1),
        filter(() => condition),
        tap(() => this.play),
        tap(() => this._emit('playing')),
        map(() => void 0),
      ).subscribe();
  }

  private _draw = (image: HTMLImageElement) =>
    this._context.drawImage(image, 0, 0, this._canvas.width, this._canvas.height)
}
