import {
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

export abstract class YtControlComponent {

  @HostBinding('class.yt-control-click-focus')
  public get isClickFocused() {
    return this._isClickFocused;
  }

  @Output()
  public focused = new EventEmitter();

  private _isClickFocused: boolean;

  @HostListener('mousedown')
  public markClickFocus() {
    this._isClickFocused = true;
  }

  @HostListener('window:keydown.tab')
  public unmarkClickFocus() {
    this._isClickFocused = false;
  }

  protected _destroy() {
    this.focused.complete();
  }
}
