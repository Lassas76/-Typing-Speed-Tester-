const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice makes perfect in every skill you want to learn.",
  "Coding is both an art and a science that anyone can master.",
  "Stay positive, work hard, and make it happen.",
  "Success is not final; failure is not fatal."
];

const sentenceBox = document.getElementById("sentence");
const inputBox = document.getElementById("inputBox");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const timerDisplay = document.getElementById("timer");
const resultsDisplay = document.getElementById("results");

let currentSentence = "";
let startTime = null;
let timerInterval = null;

// Utility: Calculate WPM
function calculateWPM(timeSeconds, typedText) {
  const words = typedText.trim().split(/\s+/).length;
  return Math.round((words / timeSeconds) * 60);
}

// Utility: Calculate accuracy %
function calculateAccuracy(sentence, typed) {
  let correctChars = 0;
  for(let i = 0; i < typed.length; i++) {
    if(typed[i] === sentence[i]) correctChars++;
  }
  return ((correctChars / sentence.length) * 100).toFixed(2);
}

// Highlight input text with correct and incorrect letters
function highlightInput() {
  const typed = inputBox.value;
  let highlighted = "";

  for(let i = 0; i < typed.length; i++) {
    if(typed[i] === currentSentence[i]) {
      highlighted += `<span class="highlight-correct">${typed[i]}</span>`;
    } else {
      highlighted += `<span class="highlight-wrong">${typed[i]}</span>`;
    }
  }

  // Append remaining characters from sentence as normal (greyed out)
  highlighted += currentSentence.slice(typed.length);
  sentenceBox.innerHTML = highlighted;
}

function startTest() {
  // Reset
  inputBox.value = "";
  resultsDisplay.textContent = "";
  timerDisplay.textContent = "Time: 0s";
  startBtn.disabled = true;
  restartBtn.disabled = false;
  inputBox.disabled = false;
  inputBox.focus();

  // Pick random sentence
  currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
  sentenceBox.textContent = currentSentence;

  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `Time: ${elapsedSeconds}s`;
  }, 1000);
}

function finishTest() {
  clearInterval(timerInterval);
  inputBox.disabled = true;
  startBtn.disabled = false;

  const typedText = inputBox.value.trim();
  const timeTaken = (Date.now() - startTime) / 1000;

  const wpm = calculateWPM(timeTaken, typedText);
  const accuracy = calculateAccuracy(currentSentence, typedText);

  resultsDisplay.innerHTML = `
    <p><strong>Time Taken:</strong> ${timeTaken.toFixed(2)} seconds</p>
    <p><strong>Words Per Minute (WPM):</strong> ${wpm}</p>
    <p><strong>Accuracy:</strong> ${accuracy}%</p>
  `;
}

inputBox.addEventListener("input", () => {
  highlightInput();

  // Auto finish if typed length matches sentence length
  if(inputBox.value.length >= currentSentence.length) {
    finishTest();
  }
});

startBtn.addEventListener("click", startTest);

restartBtn.addEventListener("click", () => {
  inputBox.value = "";
  sentenceBox.textContent = "Click Start to begin the test.";
  resultsDisplay.textContent = "";
  timerDisplay.textContent = "Time: 0s";
  startBtn.disabled = false;
  restartBtn.disabled = true;
  inputBox.disabled = true;
});
