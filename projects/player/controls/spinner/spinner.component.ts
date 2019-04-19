import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'yt-spinner',
  template: `
  <div [attr.data-width]="strokeWidth"
       [style.width.px]="diameter"
       [style.height.px]="diameter"
       class="yt-spinner">
    <span></span>
  </div>
  `,
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class YtSpinnerComponent implements AfterViewInit {

  @Input()
  public get diameter() {
    return this._diameter;
  }
  public set diameter(value: number) {
    if (isNaN(value)) { return; }

    this._diameter = value;
    this.setClip();
  }

  @Input()
  public clip: boolean;

  @Input()
  public strokeWidth = 7;

  private _diameter = 60;

  constructor(private _ref: ElementRef) { }

  ngAfterViewInit() {
    this.setClip();
  }

  public setClip() {
    if (
      isNaN(this._diameter) ||
      !this.clip
    ) { return; }

    const clip = `rect(${
      this.diameter / 2
      }px, ${
      this.diameter
      }px, ${
      this.diameter
      }px, 0)`;

    const span: HTMLSpanElement = this._ref.nativeElement
      .querySelector('span');

    span.style.clip = clip;
  }
}
