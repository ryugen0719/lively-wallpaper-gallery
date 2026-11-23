import type { CSSProperties, HTMLAttributes, MutableRefObject } from 'react';

export interface BeamsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  color?: string;
  beamWidth?: number;
  rotation?: number;
  speed?: number;
  waveLength?: number;
  depth?: number;
  sharpness?: number;
  twist?: number;
  fillLight?: number;
  glow?: number;
  brightness?: number;
  variation?: number;
  grain?: number;
  quality?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  intro?: boolean;
  fade?: number;
  opacity?: number;
  lightMode?: boolean;
  backgroundColor?: string;
  paused?: boolean;
  dpr?: number;
  clockRef?: MutableRefObject<number>;
  className?: string;
  style?: CSSProperties;
}

export interface BeamsSnapshotOptions {
  width: number;
  height: number;
  clock?: number;
  color?: string;
  beamWidth?: number;
  rotation?: number;
  waveLength?: number;
  depth?: number;
  sharpness?: number;
  twist?: number;
  fillLight?: number;
  glow?: number;
  brightness?: number;
  variation?: number;
  grain?: number;
  fade?: number;
  opacity?: number;
  lightMode?: boolean;
  backgroundColor?: string;
}

export declare const Beams: (props: BeamsProps) => React.JSX.Element;
export declare function renderBeamsSnapshot(options: BeamsSnapshotOptions): HTMLCanvasElement;
export default Beams;
