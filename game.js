const screens = {
  start: document.getElementById('start-screen'),
  game: document.getElementById('game-screen'),
  end: document.getElementById('end-screen')
};

const playBtn = document.getElementById('play-btn');
const restartBtn = document.getElementById('restart-btn');
const finishBtn = document.getElementById('finish-btn');
const dialogueEl = document.getElementById('dialogue');
const finalDialogueEl = document.getElementById('final-dialogue');
const finalScoreEl = document.getElementById('final-score');
const stageNameEl = document.getElementById('stage-name');
const ribQualityEl = document.getElementById('rib-quality');
const chipQualityEl = document.getElementById('chip-quality');
const hypeEl = document.getElementById('hype');

const state = {
  ribQuality: 0,
  chipQuality: 0,
  hype: 0,
  stage: 'Prep',
  stepsDone: new Set()
};

const dialogues = {
  start: "Alex: 'Basement grill is hot. Tonight we feed the whole street.'",
  season: "Alex: 'Rubbed and ready. Flavor starts now.'",
  sear: "Sizzle! 'Get that crust locked in,' Alex says.",
  sauce: "Alex: 'Sweet heat glaze activated.'",
  rest: "Alex: 'Let the juices settle before slicing.'",
  slice: "Alex: 'Thin chips fry crisp and fast.'",
  fry: "Oil crackles. 'Golden, not burnt,' Alex whispers.",
  salt: "Alex: 'Hit it with salt while they're hot.'",
  bowl: "Alex: 'Chips are in the bowl right next to the ribs.'",
  plate: "Alex: 'Plate looks clean. Smells dangerous.'",
  street: "Crowd gathers in the middle of the street for first bite.",
  finish: "The critic arrives for the final score..."
};

function switchScreen(screenKey) {
  Object.values(screens).forEach((screen) => screen.classList.remove('active'));
  screens[screenKey].classList.add('active');
}

function updateUI() {
  ribQualityEl.textContent = Math.min(100, state.ribQuality);
  chipQualityEl.textContent = Math.min(100, state.chipQuality);
  hypeEl.textContent = Math.min(100, state.hype);
  stageNameEl.textContent = state.stage;

  const readyToFinish =
    ['season', 'sear', 'sauce', 'rest', 'slice', 'fry', 'salt', 'bowl', 'plate', 'street']
      .every((step) => state.stepsDone.has(step));

  finishBtn.disabled = !readyToFinish;
}

function bump(points, type = 'all') {
  if (type === 'ribs' || type === 'all') state.ribQuality += points;
  if (type === 'chips' || type === 'all') state.chipQuality += points;
  state.hype += Math.max(5, Math.floor(points * 0.75));
}

function handleAction(action) {
  if (state.stepsDone.has(action)) {
    dialogueEl.textContent = 'You already did that step. Keep moving!';
    return;
  }

  switch (action) {
    case 'season':
      bump(14, 'ribs');
      state.stage = 'Seasoning';
      break;
    case 'sear':
      if (!state.stepsDone.has('season')) return warnOrder('Season ribs first.');
      bump(20, 'ribs');
      state.stage = 'Searing';
      break;
    case 'sauce':
      if (!state.stepsDone.has('sear')) return warnOrder('Sear before adding sauce.');
      bump(16, 'ribs');
      state.stage = 'Glazing';
      break;
    case 'rest':
      if (!state.stepsDone.has('sauce')) return warnOrder('Glaze first, then rest.');
      bump(12, 'ribs');
      state.stage = 'Resting';
      break;
    case 'slice':
      bump(12, 'chips');
      state.stage = 'Prep Chips';
      break;
    case 'fry':
      if (!state.stepsDone.has('slice')) return warnOrder('Slice potatoes first.');
      bump(22, 'chips');
      state.stage = 'Frying Chips';
      break;
    case 'salt':
      if (!state.stepsDone.has('fry')) return warnOrder('Fry chips before salting.');
      bump(14, 'chips');
      state.stage = 'Seasoning Chips';
      break;
    case 'bowl':
      if (!state.stepsDone.has('salt')) return warnOrder('Season chips before placing in bowl.');
      bump(10, 'chips');
      state.stage = 'Bowl Ready';
      break;
    case 'plate':
      if (!state.stepsDone.has('rest') || !state.stepsDone.has('bowl')) {
        return warnOrder('Finish ribs and chips before plating.');
      }
      bump(8, 'all');
      state.stage = 'Plated';
      break;
    case 'street':
      if (!state.stepsDone.has('plate')) return warnOrder('Plate first, then serve.');
      bump(8, 'all');
      state.stage = 'Street Service';
      break;
    default:
      break;
  }

  state.stepsDone.add(action);
  dialogueEl.textContent = dialogues[action];
  updateUI();
}

function warnOrder(message) {
  dialogueEl.textContent = `Objective reminder: ${message}`;
}

function gradeFromScore(score) {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 63) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
}

function finishGame() {
  const rawScore = Math.round(state.ribQuality * 0.55 + state.chipQuality * 0.35 + state.hype * 0.1);
  const score = Math.max(0, Math.min(100, rawScore));
  const letter = gradeFromScore(score);

  finalDialogueEl.textContent =
    score >= 90
      ? "Critic: 'Alex, this is unexpectedly incredible. Basement to boulevard perfection.'"
      : score >= 75
        ? "Critic: 'Solid execution. Next time, push the sear and crunch further.'"
        : "Critic: 'The vision is there, but your timing needs work. Keep cooking.'";

  finalScoreEl.textContent = `Final Grade: ${score}/100 (${letter})`;
  dialogueEl.textContent = dialogues.finish;
  switchScreen('end');
}

function resetGame() {
  state.ribQuality = 0;
  state.chipQuality = 0;
  state.hype = 0;
  state.stage = 'Prep';
  state.stepsDone = new Set();

  dialogueEl.textContent = dialogues.start;
  updateUI();
}

playBtn.addEventListener('click', () => {
  resetGame();
  switchScreen('game');
});

restartBtn.addEventListener('click', () => {
  switchScreen('start');
});

finishBtn.addEventListener('click', finishGame);

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', () => handleAction(button.dataset.action));
});
