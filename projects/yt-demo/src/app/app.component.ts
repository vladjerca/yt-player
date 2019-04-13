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
  public video = 'http://iandevlin.github.io/mdn/video-player/video/tears-of-steel-battle-clip-medium.mp4';
}
