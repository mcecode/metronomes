import type Metronome from "./metronome.ts";

import { defaults } from "./metronome.ts";

export default class LookaheadTimer implements Metronome {
  #isPlaying = false;
  #audioContext = new AudioContext();
  #intervalId = 0;
  #nextOscillationTime = 0;
  #bpmInSeconds = 60 / defaults.bpm;

  async play() {
    if (this.#isPlaying) {
      return;
    }

    await this.#audioContext.resume();

    this.#nextOscillationTime = this.#audioContext.currentTime;
    this.#scheduleOscillation();
    setInterval(this.#scheduleTicks, 25);

    this.#isPlaying = true;
  }

  async pause() {
    if (!this.#isPlaying) {
      return;
    }

    await this.#audioContext.suspend();

    clearInterval(this.#intervalId);

    this.#isPlaying = false;
  }

  updateBpm(bpm: number) {
    this.#bpmInSeconds = 60 / bpm;
  }

  // Uses the arrow function syntax so that 'this' still works when it is passed
  // to 'setInterval' as a callback.
  #scheduleTicks = () => {
    // Schedule all oscillations that should happen within the next 100ms.
    while (this.#nextOscillationTime < this.#audioContext.currentTime + 0.1) {
      this.#scheduleOscillation();
      this.#nextOscillationTime += this.#bpmInSeconds;
    }
  };

  #scheduleOscillation() {
    const oscillatorNode = new OscillatorNode(this.#audioContext, {
      frequency: defaults.frequency
    });
    const gainNode = new GainNode(this.#audioContext);

    gainNode.gain.linearRampToValueAtTime(1, this.#nextOscillationTime);
    gainNode.gain.linearRampToValueAtTime(0, this.#nextOscillationTime + 0.03);

    oscillatorNode.connect(gainNode);
    gainNode.connect(this.#audioContext.destination);

    oscillatorNode.start(this.#nextOscillationTime);
    oscillatorNode.stop(this.#nextOscillationTime + 0.03);
  }
}
