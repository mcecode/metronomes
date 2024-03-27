import type Metronome from "./metronome.ts";

export default class WorkerTimer implements Metronome {
  #isPlaying = false;
  #audio = new Audio("/audio.mp3");
  #worker = new Worker(new URL("./worker.ts", import.meta.url));

  constructor() {
    this.#worker.onmessage = (e) => {
      if (e.data === "tick") {
        this.#audio.currentTime = 0;
        this.#audio.play();
      }
    };
  }

  play() {
    if (this.#isPlaying) {
      return;
    }

    this.#worker.postMessage("start");
    this.#isPlaying = true;
  }

  pause() {
    if (!this.#isPlaying) {
      return;
    }

    this.#worker.postMessage("stop");
    this.#isPlaying = false;
  }

  updateBpm(bpm: number) {
    this.#worker.postMessage(60_000 / bpm);
  }
}
