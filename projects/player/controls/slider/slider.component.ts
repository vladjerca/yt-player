import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import {
  fromEvent,
  Subject,
} from 'rxjs';
import {
  filter,
  map,
  takeUntil,
  throttleTime,
} from 'rxjs/operators';

@Component({
  selector: 'yt-slider',
  templateUrl: './slider.component.html',
  styleUrls: [
    './slider.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})

export class YtSliderComponent implements OnDestroy {
  @Input()
  public get progress() {
    return this._progress;
  }
  public set progress(value: number) {
    if (isNaN(value)) { return; }

    this._progress = value;
  }

  @Output()
  public progressChange = new EventEmitter<number>();

  @Output()
  public focused = new EventEmitter<number>();

  @Output()
  public blured = new EventEmitter<number>();

  public seekPreivew = 0;

  private _dragging = false;
  private _progress = 0;
  private _slideEl: HTMLElement;

  constructor(
    _ref: ElementRef,
  ) {
    this._slideEl = _ref.nativeElement;
  }

  public updateBy(value: number) {
    this._updateAndEmit(this._progress + value);
  }

  ngOnDestroy() {
    this.progressChange.complete();
    this.focused.complete();
  }

  public updateSeekPreivew(ev: MouseEvent) {
    this.seekPreivew = this._evToProgress(ev);
  }

  public startDrag() {
    this._dragging = true;
    const view = this._slideEl.ownerDocument.defaultView;
    const mouseUp$ = new Subject();

    fromEvent(view, 'mouseup')
      .pipe(
        takeUntil(mouseUp$),
      ).subscribe(() => {
        mouseUp$.next();
        mouseUp$.complete();
        this._dragging = false;
      });

    fromEvent<MouseEvent>(view, 'mousemove')
      .pipe(
        filter(() => !!this._dragging),
        throttleTime(1000 / 60),
        map(this._evToProgress),
        map(this._clampProgress),
        takeUntil(mouseUp$),
      )
      .subscribe(this._updateAndEmit);
  }

  public jumpToProgress(ev: MouseEvent) {
    this._updateAndEmit(this._evToProgress(ev));
  }

  private _evToProgress = (ev: MouseEvent) => {
    const rect = (this._slideEl.getBoundingClientRect() as DOMRect);
    const mouseX = ev.clientX;

    return (mouseX - rect.left) / this._slideEl.clientWidth * 100;
  }

  private _clampProgress = (progress: number) =>
    Math.max(0, Math.min(progress, 100))

  private _updateAndEmit = (value: number) => {
    this.progress = this._clampProgress(value);
    this.progressChange.emit(value);
  }
}
