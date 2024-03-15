import type Metronome from "./metronome.ts";

export default class EventQueue implements Metronome {
  #isPlaying = false;
  #audioContext = new AudioContext();
  #queue: OscillatorNode[] = [];
  #nextOscillationTime = 0;
  #secondsPerBeat = 60 / 135;

  async play() {
    if (this.#isPlaying) {
      return;
    }

    await this.#audioContext.resume();

    this.#nextOscillationTime = this.#audioContext.currentTime;
    this.#populate();

    this.#isPlaying = true;
  }

  async pause() {
    if (!this.#isPlaying) {
      return;
    }

    await this.#audioContext.suspend();

    this.#clear();

    this.#isPlaying = false;
  }

  updateBpm(bpm: number) {
    this.#secondsPerBeat = 60 / bpm;

    if (this.#isPlaying) {
      this.#clear();
      this.#nextOscillationTime =
        this.#audioContext.currentTime + this.#secondsPerBeat;
      this.#populate();
    }
  }

  #populate() {
    for (let i = 0; i < 4; i++) {
      this.#enqueue();
    }
  }

  #enqueue() {
    const oscillatorNode = new OscillatorNode(this.#audioContext, {
      // E4
      frequency: 330
    });
    const gainNode = new GainNode(this.#audioContext);

    gainNode.gain.linearRampToValueAtTime(1, this.#nextOscillationTime);
    gainNode.gain.linearRampToValueAtTime(0, this.#nextOscillationTime + 0.03);

    oscillatorNode.connect(gainNode);
    gainNode.connect(this.#audioContext.destination);

    oscillatorNode.start(this.#nextOscillationTime);
    oscillatorNode.stop(this.#nextOscillationTime + 0.03);

    oscillatorNode.onended = () => {
      this.#enqueue();
      this.#queue.shift();

      oscillatorNode.onended = null;
    };

    this.#queue.push(oscillatorNode);
    this.#nextOscillationTime += this.#secondsPerBeat;
  }

  #clear() {
    for (const item of this.#queue) {
      item.stop(this.#audioContext.currentTime);
      item.onended = null;
    }

    this.#queue = [];
  }
}
