import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { YtPlayerModule } from '@yt/player';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    YtPlayerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
