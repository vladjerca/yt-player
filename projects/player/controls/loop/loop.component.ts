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
  selector: 'yt-control-loop',
  templateUrl: './loop.component.html',
  styleUrls: [
    './loop.component.scss',
    '../styles/_control-common.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class YtLoopControlComponent extends YtControlComponent implements OnDestroy {
  @Input()
  public get loop() {
    return this._loop;
  }
  public set loop(value: boolean) {
    this._loop = value;
    this.loopChange.emit(value);
  }

  @Output()
  public loopChange = new EventEmitter<boolean>();

  private _loop;

  ngOnDestroy() {
    this.loopChange.complete();
    this._destroy();
  }
}
