import { PreloadStrategy } from '../types';

export type IVideoRendererHandler = (ev?: {}) => void;

export interface IVideoRenderer {
  volume: number;
  muted: boolean;
  paused: boolean;
  loop: boolean;
  preload: PreloadStrategy | string;
  autoplay: boolean;
  ownerDocument: Document;
  videoWidth: number;
  videoHeight: number;
  duration: number;
  currentTime: number;

  addEventListener: (ev: 'loadeddata' | 'ended', handler: IVideoRendererHandler) => void;
  removeEventListener: (ev: 'loadeddata' | 'ended', handler: IVideoRendererHandler) => void;

  play(): Promise<void>;
  pause(): void;
}
