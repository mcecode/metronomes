export default interface Metronome {
  play(): void;
  pause(): void;
  updateBpm(bpm: number): void;
}
