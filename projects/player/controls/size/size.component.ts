import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'yt-control-size',
  templateUrl: './size.component.html',
  styleUrls: [
    '../styles/_control-common.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class YtSizeControlComponent implements OnDestroy {
  @Input()
  public get fullscreen() {
    return !!this._fullscreen;
  }
  public set fullscreen(value: boolean) {
    this._fullscreen = !!value;
    this.fullscreenChange.emit(!!value);
  }

  @Output()
  public fullscreenChange = new EventEmitter<boolean>();

  private _fullscreen: boolean;

  ngOnDestroy() {
    this.fullscreenChange.complete();
  }
}
