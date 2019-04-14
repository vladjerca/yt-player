YT Player
=======
<a href="https://badge.fury.io/js/%40vladjerca%2Fyt-player">
  <img class="retina-badge" src="https://badge.fury.io/js/%40vladjerca%2Fyt-player.svg">
</a>

## Development Notes

1. Install `npm i @vladjerca/yt-player`


## Themeing

Just import the theming file in your main `scss`.

```scss
@import "~@vladjerca/player/theming";

$theme: (
  player: (
    progress: #c0392b
  )
);

@include yt-theme($theme);

```

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

## Preview

![](yt-player.gif)
