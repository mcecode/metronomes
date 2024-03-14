import type Metronome from "./metronome.ts";

export default class CustomTimer implements Metronome {
  #isPlaying = false;
  #audio = new Audio("/audio.mp3");
  #timer = new SelfCorrectingTimer(60_000 / 135, () => {
    this.#audio.currentTime = 0;
    this.#audio.play();
  });

  play() {
    if (this.#isPlaying) {
      return;
    }

    this.#timer.start();
    this.#isPlaying = true;
  }

  pause() {
    if (!this.#isPlaying) {
      return;
    }

    this.#timer.stop();
    this.#isPlaying = false;
  }

  updateBpm(bpm: number) {
    this.#timer.updateTimeInterval(60_000 / bpm);
  }
}

class SelfCorrectingTimer {
  #timeInterval: number;
  #callback: () => void;

  #isOn = false;
  #timeoutId = 0;
  #nextCallbackFireTime = 0;

  constructor(timeInterval: number, callback: () => void) {
    this.#timeInterval = timeInterval;
    this.#callback = callback;
  }

  start() {
    if (this.#isOn) {
      return;
    }

    this.#callback();

    this.#timeoutId = setTimeout(this.#internalCallback, this.#timeInterval);
    this.#nextCallbackFireTime = performance.now() + this.#timeInterval;

    this.#isOn = true;
  }

  stop() {
    if (!this.#isOn) {
      return;
    }

    clearTimeout(this.#timeoutId);
    this.#isOn = false;
  }

  updateTimeInterval(timeInterval: number) {
    this.#timeInterval = timeInterval;
  }

  // Uses the arrow function syntax so that 'this' still works when it is passed
  // to 'setTimeout' as a callback.
  #internalCallback = () => {
    this.#callback();

    this.#timeoutId = setTimeout(
      this.#internalCallback,
      // Take into account drift when setting the new timeout.
      this.#timeInterval - (performance.now() - this.#nextCallbackFireTime)
    );
    this.#nextCallbackFireTime += this.#timeInterval;
  };
}
