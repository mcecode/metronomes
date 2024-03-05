import "./main.css";

import type Metronome from "./metronomes/metronome.ts";

import AudioLoop from "./metronomes/audio-loop.ts";
import CustomTimer from "./metronomes/custom-timer.ts";
import EventQueue from "./metronomes/event-queue.ts";
import LookaheadTimer from "./metronomes/lookahead-timer.ts";

// Available metronomes
const metronomeLookup: { [name: string]: Metronome } = {
  "audio-loop": new AudioLoop(),
  "custom-timer": new CustomTimer(),
  "event-queue": new EventQueue(),
  "lookahead-timer": new LookaheadTimer()
};
// Metronome chooser
const metronomeDropdown = document.getElementById(
  "metronome-dropdown"
) as HTMLSelectElement;
// Play button
const metronomePlay = document.getElementById(
  "metronome-play"
) as HTMLButtonElement;
const metronomePlayTitle = document.getElementById(
  "metronome-play-title"
) as HTMLTitleElement & { textContent: "Play" | "Pause" };
const svgPlay = document.getElementById("svg-play") as unknown as SVGGElement;
const svgPause = document.getElementById("svg-pause") as unknown as SVGGElement;
// BPM controls
const bpmDec = document.getElementById("bpm-dec") as HTMLButtonElement;
const bpmInc = document.getElementById("bpm-inc") as HTMLButtonElement;
const bpmRange = document.getElementById("bpm-range") as HTMLInputElement;
// BPM indicator
const bpmValue = document.getElementById("bpm-value") as HTMLParagraphElement;

// BPM helpers

function updateMetronomeBpm() {
  metronomeLookup[currentMetronome].updateBpm(+bpmRange.value);
}

let updateBpmTimeoutId: number;
function updateBpm() {
  bpmValue.textContent = `${bpmRange.value} BPM`;

  if (updateBpmTimeoutId) {
    clearTimeout(updateBpmTimeoutId);
  }

  // Actually updating the metronome BPM could be expensive, so debounce it.
  updateBpmTimeoutId = setTimeout(updateMetronomeBpm, 750);
}

function stepDownBpm() {
  bpmRange.stepDown();
  updateBpm();
}

function stepUpBpm() {
  bpmRange.stepUp();
  updateBpm();
}

// Setup and event listeners

let currentMetronome = metronomeDropdown.value;

updateBpm();

metronomeDropdown.addEventListener("change", () => {
  metronomeLookup[currentMetronome].pause();
  currentMetronome = metronomeDropdown.value;
  updateMetronomeBpm();
});

metronomePlay.addEventListener("click", () => {
  svgPlay.classList.toggle("hidden");
  svgPause.classList.toggle("hidden");

  if (metronomePlayTitle.textContent === "Play") {
    metronomeLookup[currentMetronome].play();
    metronomePlayTitle.textContent = "Pause";
    return;
  }

  metronomeLookup[currentMetronome].pause();
  metronomePlayTitle.textContent = "Play";
});

bpmDec.addEventListener("click", stepDownBpm);
bpmInc.addEventListener("click", stepUpBpm);
bpmRange.addEventListener("input", updateBpm);
bpmRange.addEventListener("wheel", (e) => {
  if (e.deltaY > 0) {
    stepDownBpm();
    return;
  }

  stepUpBpm();
});
