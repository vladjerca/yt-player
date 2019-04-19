import {
  Directive,
  Input,
  Renderer2,
} from '@angular/core';

const enum VideoMimeType {
  Mp4 = 'video/mp4',
  WebM = 'video/webm',
  Ogg = 'video/ogg',
}

const enum VideoExtension {
  Mp4 = 'mp4',
  WebM = 'webm',
  Ogg = 'ogg',
}

const VideoExtensionMime: Record<VideoExtension, VideoMimeType> = {
  [VideoExtension.Mp4]: VideoMimeType.Mp4,
  [VideoExtension.WebM]: VideoMimeType.WebM,
  [VideoExtension.Ogg]: VideoMimeType.Ogg,
};


@Directive({
  selector: '[ytSource], yt-source',
})
export class YtSourceDirective {
  @Input()
  public set src(value: string) {
    const [extension] = value.toLocaleLowerCase().split('.').reverse();

    const mimeType = VideoExtensionMime[extension];

    if (!mimeType) { throw new Error(`The video type ${extension} is not supported!`); }

    this._renderer.setProperty(this._source, 'src', value);
    this._renderer.setProperty(this._source, 'type', mimeType);
  }

  public get srcEl() {
    return this._source;
  }

  private _source: HTMLSourceElement;

  constructor(
    private _renderer: Renderer2,
  ) {
    this._source = HTMLSourceElement = this._renderer.createElement('source');
  }
}
