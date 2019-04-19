import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  PlayerComponent,
  YtPlayer,
} from '../shared';
import { YtSequenceRendererComponent } from './sequence-renderer';

@Component({
  selector: 'yt-image-player',
  templateUrl: '../shared/player.component.html',
  styleUrls: ['./image-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class YtImagePlayerComponent extends PlayerComponent implements OnInit, OnDestroy {
  public player: YtPlayer;

  @ViewChild('container', { read: ViewContainerRef })
  public viewContainer: ViewContainerRef;

  @Input()
  public images: string[];

  @Input()
  public fps: number;

  private _component: YtSequenceRendererComponent;

  constructor(
    private _componentFactory: ComponentFactoryResolver,
    private _ref: ElementRef,
  ) {
    super(_ref);
  }

  ngOnInit() {
    const imageRendererFactory = this._componentFactory.resolveComponentFactory(YtSequenceRendererComponent);
    const componentRef = this.viewContainer.createComponent(imageRendererFactory);
    this._component = componentRef.instance;
    this._component.images = this.images;
    this._component.fps = this.fps;
    this._component.loop = this.loop;
    this._component.autoplay = this.autoplay;

    this.player = new YtPlayer(this._component, this._ref.nativeElement);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.player.destroy();
  }
}
