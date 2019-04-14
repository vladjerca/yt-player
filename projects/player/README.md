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
<yt-player [source]="video"></yt-player>
```

API:

```ts
@Input()
/**
 * Video source file, accepted formats: mp4, ogv, webm.
*/
source: string;
```
