import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  YtLoopControlComponent,
  YtPlayPauseControlComponent,
  YtSizeControlComponent,
  YtSliderComponent,
  YtVolumeControlComponent,
} from './controls';
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
];

const EXPORTS = [
  YtVideoPlayerComponent,
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
  exports: [
    ...EXPORTS,
  ],
})
export class YtPlayerModule { }
