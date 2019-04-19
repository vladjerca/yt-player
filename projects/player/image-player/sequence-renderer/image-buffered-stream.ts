import {
  BehaviorSubject,
  from,
  Subject,
} from 'rxjs';
import {
  concatMap,
  filter,
  finalize,
  tap,
} from 'rxjs/operators';

const srcToStream = (src: string) =>
  from(new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.src = src;
    img.onload = () => res(img);
    img.onerror = (err) => rej(err);
  }));

export class ImageBufferedStream {
  public get duration() {
    return this.length / this._fps;
  }

  public get length() {
    return this._images.length;
  }

  public get bufferedLength() {
    return this.frames.length;
  }

  public get frames() {
    return this._images$.getValue();
  }

  public readonly progress$ = new Subject<number>();
  public readonly medatadata$ = new Subject<HTMLImageElement>();


  private _images$ = new BehaviorSubject<HTMLImageElement[]>([]);

  constructor(
    private _images: string[],
    private _fps: number,
    preload: boolean,
  ) {
    const [firstFrame] = this._images;

    srcToStream(firstFrame)
      .pipe(
        tap((image) => {
          this.medatadata$.next(image);
          this._append(image);
        }),
        filter(() => preload),
        tap(() => this._loadImages()),
      ).subscribe();
  }

  private _loadImages = (skip: number = 0, take: number = this._images.length) => {
    const start = skip;
    const end = skip + take - 1;


    from(this._images.slice(start, end))
      .pipe(
        concatMap(srcToStream),
        tap((image) => {
          this._append(image);
          const percentage = Math.round(this.bufferedLength / this.length * 100);

          if (percentage % 5 === 0) {
            this.progress$.next(this.bufferedLength / this.length * 100);
          }
        }),
        finalize(() => this.progress$.next(100)),
      )
      .subscribe();
  }

  private _append(...images: HTMLImageElement[]) {
    this._images$.next([...this.frames, ...images]);
  }
}
