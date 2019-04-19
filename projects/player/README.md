
## Component Usage

`app.module` configuration

```ts
import { YtPlayerModule } from '@vladjerca/yt-player';


@NgModule({
  imports: [
    YtPlayerModule,
  ]
})
export class AppModule { }

### Video Player

```

`markup`

``` html
<!-- Video source file, accepted formats: mp4, ogv, webm. -->
<yt-video-player>
  <yt-source [src]="video.mp4"></yt-source>
  <yt-source [src]="video.ogg"></yt-source>
  <yt-source [src]="video.webm"></yt-source>
</yt-video-player>
```

API:

```ts
@Input()
muted: boolean;

@Input()
preload: PreloadStrategy;

@Input()
autoplay: boolean;

@Input()
loop: boolean;
```

### Video Player

`markup`

``` html
<!-- Video source file, accepted formats: mp4, ogv, webm. -->
<yt-image-player [images]="[
                            'http://localhost/frame01.jpg',
                            'http://localhost/frame02.jpg',
                            'http://localhost/frame03.jpg',
                            'http://localhost/frame04.jpg',
                            'http://localhost/frame05.jpg'
                          ]"
                  [fps]="1">
</yt-image-player>
```

API:

```ts
@Input()
images: string[];

@Input()
fps: number;

@Input()
preload: PreloadStrategy;

@Input()
autoplay: boolean;

@Input()
loop: boolean;
```
