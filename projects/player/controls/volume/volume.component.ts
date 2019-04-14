import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { YtControlComponent } from '../shared';

@Component({
  selector: 'yt-control-volume',
  templateUrl: './volume.component.html',
  styleUrls: [
    '../styles/_control-common.scss',
    './volume.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class YtVolumeControlComponent extends YtControlComponent implements OnDestroy {
  @Input()
  public get volume() {
    return this._mute ? 0 : this._volume;
  }
  public set volume(value: number) {
    if (isNaN(value)) { return; }

    this._volume = value;
    this.volumeChange.emit(this._volume);
  }

  @Input()
  public set mute(value: boolean) {
    this._mute = !!value;
    this.muteChange.emit(!!value);
  }
  public get mute() {
    return this._mute;
  }

  @Output()
  public volumeChange = new EventEmitter<number>();

  @Output()
  public muteChange = new EventEmitter<boolean>();

  public isVolumeSliderFocused: boolean;

  private _mute: boolean;
  private _volume: number;

  ngOnDestroy() {
    this.muteChange.complete();
    this.volumeChange.complete();
    this._destroy();
  }
}
