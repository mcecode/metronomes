export default interface Metronome {
  play(): Promise<void> | void;
  pause(): Promise<void> | void;
  updateBpm(bpm: number): void;
}

export const defaults = {
  bpm: +import.meta.env.VITE_DEFAULT_BPM,
  frequency: +import.meta.env.VITE_DEFAULT_FREQUENCY
};
