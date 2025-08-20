const startBtn = document.getElementById("startBtn");
const gameContainer = document.getElementById("gameContainer");
const levelDisplay = document.getElementById("levelDisplay");

let level = 1;
let maxLevels = 100;
let tubes = [];
let selectedTube = null;

const colors = [
  "red", "blue", "green", "orange", "purple", "cyan", "pink", "yellow",
  "lime", "magenta", "teal", "brown", "gold", "silver", "coral", "violet",
  "navy", "khaki", "plum", "turquoise", "salmon", "indigo", "crimson", "beige", "chocolate", "orchid", "tan", "aqua"
];

startBtn.onclick = () => {
  level = 1;
  startLevel(level);
};

function startLevel(lvl) {
  levelDisplay.textContent = `Level: ${lvl}`;
  gameContainer.innerHTML = "";
  document.getElementById("popup").style.display = "none";
  tubes = generateLevel(lvl);

  tubes.forEach((tube, index) => {
    const tubeDiv = document.createElement("div");
    tubeDiv.className = "tube";
    tubeDiv.dataset.index = index;
    updateTubeDisplay(tubeDiv, tube);
    tubeDiv.onclick = () => handleTubeClick(index);
    gameContainer.appendChild(tubeDiv);
  });
}

function generateLevel(lvl) {
  const numColors = Math.min(4 + Math.floor(lvl / 5), colors.length);
  const colorSet = colors.slice(0, numColors);
  const tubes = [];

  let colorBlocks = [];
  colorSet.forEach(c => {
    for (let i = 0; i < 4; i++) colorBlocks.push(c);
  });

  shuffleArray(colorBlocks);

  let numTubes = Math.floor(colorBlocks.length / 4) + 2;
  for (let i = 0; i < numTubes; i++) tubes.push([]);

  let index = 0;
  for (let i = 0; i < colorBlocks.length; i++) {
    tubes[index].push(colorBlocks[i]);
    if (tubes[index].length >= 4) index++;
  }

  return tubes;
}

function updateTubeDisplay(tubeDiv, tube) {
  tubeDiv.innerHTML = "";
  tube.forEach(color => {
    const block = document.createElement("div");
    block.className = "color-block";
    block.style.backgroundColor = color;
    tubeDiv.appendChild(block);
  });
}

function handleTubeClick(index) {
  const clickedTubeDiv = gameContainer.children[index];
  
  if (selectedTube === null) {
    selectedTube = index;
    clickedTubeDiv.classList.add("selected");
  } else {
    gameContainer.children[selectedTube].classList.remove("selected");
    if (selectedTube !== index) {
      moveLiquid(selectedTube, index);
    }
    selectedTube = null;
  }
}

function moveLiquid(fromIdx, toIdx) {
  const from = tubes[fromIdx];
  const to = tubes[toIdx];

  if (from.length === 0 || to.length >= 4) return;

  let movingColor = from[from.length - 1];
  let count = 1;

  for (let i = from.length - 2; i >= 0; i--) {
    if (from[i] === movingColor) count++;
    else break;
  }

  let toColor = to[to.length - 1];
  if (to.length === 0 || toColor === movingColor) {
    for (let i = 0; i < count; i++) {
      if (to.length < 4) {
        to.push(from.pop());
      }
    }
    updateTubeDisplay(gameContainer.children[fromIdx], from);
    updateTubeDisplay(gameContainer.children[toIdx], to);
    checkLevelComplete();
  }
}

function checkLevelComplete() {
  const complete = tubes.every(tube => {
    return tube.length === 0 || (tube.length === 4 && new Set(tube).size === 1);
  });

  if (complete) {
    setTimeout(() => {
      document.getElementById("popup").style.display = "flex";
    }, 500);
  }
}

function nextLevel() {
  document.getElementById("popup").style.display = "none";
  if (level < maxLevels) {
    level++;
    startLevel(level);
  } else {
    alert("🎉 You completed all 100 hard levels!");
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
