import type Metronome from "./metronome.ts";

export default class LookaheadTimer implements Metronome {
  #isPlaying = false;
  #audioContext = new AudioContext();
  #intervalId = 0;
  #nextNoteTime = 0;
  #secondsPerBeat = 60 / 135;

  async play() {
    if (this.#isPlaying) {
      return;
    }

    await this.#audioContext.resume();

    this.#nextNoteTime = this.#audioContext.currentTime;
    this.#oscillate();
    setInterval(this.#schedule, 25);

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
    this.#secondsPerBeat = 60 / bpm;
  }

  // Uses the arrow function syntax so that 'this' still works when it is passed
  // to 'setInterval' as a callback.
  #schedule = () => {
    // Schedule all oscillations that should happen within the next 100ms.
    while (this.#nextNoteTime < this.#audioContext.currentTime + 0.1) {
      this.#oscillate();
      this.#nextNoteTime += this.#secondsPerBeat;
    }
  };

  #oscillate() {
    const oscillatorNode = new OscillatorNode(this.#audioContext, {
      // E4
      frequency: 330
    });
    const gainNode = new GainNode(this.#audioContext);

    gainNode.gain.linearRampToValueAtTime(1, this.#nextNoteTime);
    gainNode.gain.linearRampToValueAtTime(0, this.#nextNoteTime + 0.03);

    oscillatorNode.connect(gainNode);
    gainNode.connect(this.#audioContext.destination);

    oscillatorNode.start(this.#nextNoteTime);
    oscillatorNode.stop(this.#nextNoteTime + 0.03);
  }
}
