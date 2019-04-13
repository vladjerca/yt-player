import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  YtPlayPauseControlComponent,
  YtSizeControlComponent,
  YtSliderComponent,
  YtVolumeControlComponent,
} from '../controls';
import { YtPlayerComponent } from './player.component';

const CONTROLS = [
  YtVolumeControlComponent,
  YtPlayPauseControlComponent,
  YtSizeControlComponent,
  YtSliderComponent,
];

const EXPORTS = [
  YtPlayerComponent,
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
