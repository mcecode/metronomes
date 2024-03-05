import type Metronome from "./metronome.ts";

export default class EventQueue implements Metronome {
  #isPlaying: boolean = false;
  #bpm: number = 135;

  constructor() {
    // TODO
  }

  play() {
    if (this.#isPlaying) {
      return;
    }

    // TODO

    this.#isPlaying = true;
  }

  pause() {
    if (!this.#isPlaying) {
      return;
    }

    // TODO

    this.#isPlaying = false;
  }

  updateBpm(bpm: number) {
    this.#bpm = bpm;
  }
}
