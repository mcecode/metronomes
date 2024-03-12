export default interface Metronome {
  play(): Promise<void> | void;
  pause(): Promise<void> | void;
  updateBpm(bpm: number): void;
}
