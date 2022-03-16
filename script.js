//global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue

//Global Variables
var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var mistakes;


function startGame() {
  progress = []
  //initialize game variables
  mistakes = 0;
  clueHoldTime = 1000
  progress = 0;
  gamePlaying = true;
  document.getElementById("average_mem").classList.add("hidden")
  document.getElementById("bad_mem").classList.add("hidden")
  document.getElementById("amazing_mem").classList.add("hidden")
  
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  random();
  console.log(pattern)
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime;
  clueHoldTime= clueHoldTime-70
  console.log("clueHoldTime: " + clueHoldTime)
  for (let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame(progress) {
  stopGame();
  if (progress < 3){
    document.getElementById("bad_mem").classList.remove("hidden")
  }
  if (progress > 4){
    document.getElementById("average_mem").classList.remove("hidden")
  }
  alert("Game Over! You lost.");
}

function winGame() {
  stopGame();
  document.getElementById("amazing_mem").classList.remove("hidden")
  alert("You correctly guessed the pattern! Game Over. You win!");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  } else {
    if (pattern[guessCounter] == btn) {
      //Correct guess
      if (guessCounter == progress) {
        if (progress == pattern.length - 1) {
          winGame();
        } else {
          //Correct pattern
          progress += 1;
          playClueSequence();
        }
      } else {
        guessCounter++;
      }
    } 
    else if(mistakes < 2){
      mistakes+=1
    }
    else {
      loseGame(progress);
    }
  }
}

function random(){
  pattern = Array.from({length: 8}, () => Math.floor(Math.random() * 9));
}

// Sound Synthesis Functions
const freqMap = {
  1: 161.6,
  2: 216,
  3: 270,
  4: 320,
  5: 390,
  6: 430,
  7: 480,
  8: 510,
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
