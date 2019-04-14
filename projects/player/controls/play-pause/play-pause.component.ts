import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { YtControlComponent } from '../shared';

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
export class YtPlayPauseControlComponent extends YtControlComponent implements OnInit, OnDestroy {
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

  ngOnInit() {
    this.stateChange.emit(this.state);
  }

  public toggle() {
    this.state = this.state === PlayState.Playing ? PlayState.Paused : PlayState.Playing;
  }

  ngOnDestroy() {
    this.stateChange.complete();
    this._destroy();
  }
}
