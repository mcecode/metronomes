import type Metronome from "./metronome.ts";

export default class EventQueue implements Metronome {
  #isPlaying = false;
  #audioContext = new AudioContext();
  #oscillatorNode: OscillatorNode | null = null;
  #nextNoteStart = 0;
  #bpmInSeconds = 60 / 135;

  async play() {
    if (this.#isPlaying) {
      return;
    }

    await this.#audioContext.resume();

    this.#nextNoteStart = this.#audioContext.currentTime;
    this.#oscillate();

    this.#isPlaying = true;
  }

  async pause() {
    if (!this.#isPlaying) {
      return;
    }

    await this.#audioContext.suspend();

    if (this.#oscillatorNode) {
      this.#oscillatorNode.stop(this.#audioContext.currentTime);
      this.#oscillatorNode.onended = null;
      this.#oscillatorNode = null;
    }

    this.#isPlaying = false;
  }

  updateBpm(bpm: number) {
    this.#bpmInSeconds = 60 / bpm;
  }

  #oscillate() {
    const oscillatorNode = new OscillatorNode(this.#audioContext, {
      // E4
      frequency: 330
    });
    const gainNode = new GainNode(this.#audioContext);

    gainNode.gain.linearRampToValueAtTime(1, this.#nextNoteStart);
    gainNode.gain.linearRampToValueAtTime(0, this.#nextNoteStart + 0.03);

    oscillatorNode.connect(gainNode);
    gainNode.connect(this.#audioContext.destination);

    oscillatorNode.start(this.#nextNoteStart);
    oscillatorNode.stop(this.#nextNoteStart + 0.03);

    oscillatorNode.onended = () => {
      this.#oscillate();
      oscillatorNode.onended = null;
    };

    this.#oscillatorNode = oscillatorNode;
    this.#nextNoteStart += this.#bpmInSeconds;
  }
}
