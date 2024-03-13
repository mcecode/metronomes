import type Metronome from "./metronome.ts";

export default class AudioLoop implements Metronome {
  #isPlaying = false;
  #audioContext = new AudioContext();
  #sourceNode = new AudioBufferSourceNode(this.#audioContext, {
    loop: true,
    loopEnd: 60 / 135
  });

  constructor() {
    this.#init();
  }
  async #init() {
    const offlineAudioContext = new OfflineAudioContext({
      numberOfChannels: 1,
      length: this.#audioContext.sampleRate * 2,
      sampleRate: this.#audioContext.sampleRate
    });
    const oscillatorNode = new OscillatorNode(offlineAudioContext, {
      // E4
      frequency: 330
    });
    const gainNode = new GainNode(offlineAudioContext);

    gainNode.gain.linearRampToValueAtTime(1, 0);
    gainNode.gain.linearRampToValueAtTime(0, 0.03);

    oscillatorNode.connect(gainNode);
    gainNode.connect(offlineAudioContext.destination);

    oscillatorNode.start(0);
    oscillatorNode.stop(0.03);

    this.#sourceNode.buffer = await offlineAudioContext.startRendering();
    this.#sourceNode.connect(this.#audioContext.destination);
    this.#sourceNode.start();
  }

  async play() {
    if (this.#isPlaying) {
      return;
    }

    await this.#audioContext.resume();
    this.#isPlaying = true;
  }

  async pause() {
    if (!this.#isPlaying) {
      return;
    }

    await this.#audioContext.suspend();
    this.#isPlaying = false;
  }

  updateBpm(bpm: number) {
    this.#sourceNode.loopEnd = 60 / bpm;
  }
}
