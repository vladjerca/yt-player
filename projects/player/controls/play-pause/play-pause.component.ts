import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';

export enum PlayState {
  Playing,
  Paused,
}

@Component({
  selector: 'yt-control-play-pause',
  templateUrl: './play-pause.component.html',
  styleUrls: ['../styles/_control-common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class YtPlayPauseControlComponent implements OnDestroy {
  // tslint:disable-next-line: naming-convention
  public PlayState = PlayState;

  @Input()
  public get state() {
    return this._state;
  }
  public set state(value: PlayState) {
    this._state = value;
    this.stateChange.emit(value);
  }

  @Output()
  public stateChange = new EventEmitter<PlayState>();

  private _state;

  constructor() {
    this.stateChange.emit(this.state);
  }

  public toggle() {
    this.state = this.state === PlayState.Playing ? PlayState.Paused : PlayState.Playing;
  }

  ngOnDestroy() {
    this.stateChange.complete();
  }
}
