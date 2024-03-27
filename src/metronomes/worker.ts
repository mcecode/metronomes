let isOn = false;
let intervalId = 0;
let timeInterval = 60_000 / 135;

function tick() {
  postMessage("tick");
}

onmessage = (e) => {
  // BPM change
  if (typeof e.data === "number") {
    timeInterval = e.data;

    if (isOn) {
      clearInterval(intervalId);
      intervalId = setInterval(tick, timeInterval);
    }

    return;
  }

  if (e.data === "start") {
    intervalId = setInterval(tick, timeInterval);
    isOn = true;
    return;
  }

  if (e.data === "stop") {
    clearInterval(intervalId);
    isOn = false;
  }
};
