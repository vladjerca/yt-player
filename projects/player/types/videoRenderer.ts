import { PreloadStrategy } from '../types';

export type IVideoRendererHandler = (ev?: {}) => void;

export type PlayerEventName = 'loadeddata' | 'ended' | 'waiting' | 'playing';

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

  addEventListener: (ev: PlayerEventName, handler: IVideoRendererHandler) => void;
  removeEventListener: (ev: PlayerEventName, handler: IVideoRendererHandler) => void;

  play(): Promise<void>;
  pause(): void;
}
