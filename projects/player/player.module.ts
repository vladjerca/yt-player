import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  YtLoopControlComponent,
  YtPlayPauseControlComponent,
  YtSizeControlComponent,
  YtSliderComponent,
  YtVolumeControlComponent,
} from './controls';
import { YtImagePlayerComponent } from './image-player';
import { YtSequenceRendererComponent } from './image-player/sequence-renderer';
import {
  YtSourceDirective,
  YtVideoPlayerComponent,
} from './video-player';

const CONTROLS = [
  YtVolumeControlComponent,
  YtPlayPauseControlComponent,
  YtSizeControlComponent,
  YtLoopControlComponent,
  YtSliderComponent,
  YtSequenceRendererComponent,
];

const EXPORTS = [
  YtVideoPlayerComponent,
  YtImagePlayerComponent,
  YtSourceDirective,
];

@NgModule({
  declarations: [
    ...CONTROLS,
    ...EXPORTS,
  ],
  imports: [
    CommonModule,
  ],
  entryComponents: [YtSequenceRendererComponent],
  exports: [
    ...EXPORTS,
  ],
})
export class YtPlayerModule { }
