## Component Usage

At the moment the API offers basic functionality, so not a lot of options (for now 😉).

`app.module` configuration

```ts
import { YtPlayerModule } from '@vladjerca/yt-player';


@NgModule({
  imports: [
    YtPlayerModule,
  ]
})
export class AppModule { }

```

`markup`

``` html
<!-- Video source file, accepted formats: mp4, ogv, webm. -->
<yt-player>
  <yt-source [src]="video.mp4"></yt-source>
  <yt-source [src]="video.ogg"></yt-source>
  <yt-source [src]="video.webm"></yt-source>
</yt-player>
```

API:

```ts
@Input()
muted: boolean;

@Input()
preload: PreloadStrategy;

@Input()
autoplay: boolean;
```
