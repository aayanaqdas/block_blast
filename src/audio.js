import { gameState } from "./gameStates.js";

const audioCtx = new window.AudioContext({
  latencyHint: "interactive",
});

const soundBuffers = {};

const soundPaths = {
  newGame: "./audio/newGame.mp3",
  blockNew: "./audio/blocknew.mp3",
  blockPlace: "./audio/blockplace.mp3",
  blockWrong: "./audio/blockwrong.mp3",
  blockExplode: "./audio/blockExplode3.mp3",
  click: "./audio/click.mp3",
  over: "./audio/over.mp3",
  newBest: "./audio/newRecord.mp3",
  scoreUpdate: "./audio/scoreUpdate.mp3",
};

let isUnlocked = false;

async function preloadAllAudio() {
  const loadTasks = Object.entries(soundPaths).map(async ([name, path]) => {
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    soundBuffers[name] = await audioCtx.decodeAudioData(arrayBuffer);
  });

  await Promise.all(loadTasks);
  console.log("All audio preloaded");
}

function playSound(name) {
  if (gameState.isSoundOn) {
    audioCtx.resume();

    const buffer = soundBuffers[name];

    if (buffer) {
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start(0);
    }
  }
}

function unlockAudio() {
  if (isUnlocked) return;
  if (audioCtx.state === "suspended") {
    audioCtx.resume().then(() => {
      isUnlocked = true;
      gameState.canvas.removeEventListener("pointerdown", unlockAudio);
      gameState.canvas.removeEventListener("click", unlockAudio);
      gameState.canvas.removeEventListener("touchstart", unlockAudio);
    });
  } else if (audioCtx.state === "running") {
    isUnlocked = true;
  }
}

function initAudioUnlock() {
  if (gameState.canvas) {
    gameState.canvas.addEventListener("pointerdown", unlockAudio, { once: true });
    gameState.canvas.addEventListener("click", unlockAudio, { once: true });
    gameState.canvas.addEventListener("touchstart", unlockAudio, { once: true });
  }
}

export { preloadAllAudio, unlockAudio, initAudioUnlock, playSound };
