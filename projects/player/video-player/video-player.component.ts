import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

import {
  PlayerComponent,
  YtPlayer,
} from '../shared';
import { YtSourceDirective } from './source/source.directive';

@Component({
  selector: 'yt-video-player',
  templateUrl: '../shared/player.component.html',
  styleUrls: ['./video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class YtVideoPlayerComponent extends PlayerComponent implements OnDestroy {
  @ContentChildren(YtSourceDirective)
  public set sources(sources: QueryList<YtSourceDirective>) {
    const sourceList = sources ? sources.toArray() : [];
    sourceList.forEach(source =>
      this._renderer
        .appendChild(this._video, source.srcEl),
    );
  }

  @Input()
  public set muted(value: boolean) {
    if (value == null) { return; }

    this.player.mute = !!value;
  }

  public player: YtPlayer;

  private _video: HTMLVideoElement;

  constructor(
    private _renderer: Renderer2,
    private _ref: ElementRef,
  ) {
    super(_ref);

    this._video = _renderer.createElement('video');
    this._renderer.setProperty(this._video, 'controls', false);
    this._renderer.setAttribute(this._video, 'class', 'yt-video');

    this._renderer.appendChild(this._ref.nativeElement, this._video);
    this.player = new YtPlayer(this._video, this._ref.nativeElement);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.player.destroy();
  }
}
