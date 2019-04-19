import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
    .video-player-container {
      width: 50%;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      margin-top: 40px;
    }
  `],
})
export class AppComponent {
  public video = {
    mp4: 'http://iandevlin.github.io/mdn/video-player/video/tears-of-steel-battle-clip-medium.mp4',
    ogg: 'http://iandevlin.github.io/mdn/video-player/video/tears-of-steel-battle-clip-medium.ogg',
    webm: 'http://iandevlin.github.io/mdn/video-player/video/tears-of-steel-battle-clip-medium.webm',
  };

  public images = Array(240).fill(0).map((_, idx) => `/assets/frame${(idx + 1).toString().padStart(4, '0')}.jpg`);
}
