"use strict";

const WORDS = [
  "aber", "alle", "also", "andere", "auch", "auf", "aus", "bei", "beide", "beim",
  "dann", "darum", "das", "davon", "deine", "dieser", "doch", "dort", "durch", "eigentlich",
  "einfach", "einmal", "etwas", "fast", "finden", "früher", "ganz", "gegen", "genau", "gestern",
  "gleich", "groß", "haben", "heute", "hinter", "immer", "jetzt", "klein", "können", "lange",
  "manchmal", "mehr", "mein", "mit", "müssen", "nach", "nicht", "noch", "nur", "oder",
  "plötzlich", "schon", "sehr", "sein", "seit", "später", "über", "unter", "vielleicht", "vorher",
  "warum", "weiter", "welche", "wenn", "wieder", "wirklich", "wollen", "zwischen", "Abenteuer", "Fenster",
  "Freundschaft", "Gedanke", "Geschichte", "Geheimnis", "Morgen", "Schlüssel", "Schule", "Stunde", "Tasche", "Wasser"
];

const MADE_UP = [
  "Flinter", "Bramel", "Korstig", "Taspel", "Wumper", "Glaspen", "Finterei", "Schlummerich", "Wolkigel", "Kreiselmut",
  "Dinter", "Pflasum", "Morgsel", "Lumpfen", "Schreubel", "Knistel", "Blauder", "Funkerin", "Zappelich", "Träumelei",
  "Brenzel", "Kleuster", "Rimpfen", "Pluder", "Schnabelig", "Dunkerei", "Frindel", "Wandrig", "Kuspert", "Zimmrig",
  "Glimmerich", "Haufel", "Raschung", "Flüsterling", "Klunkern", "Wuseligkeit", "Tromsel", "Hellerich", "Drübenheit", "Schlüsselung"
];

const TOTALS = { flash: 10, chain: 10, real: 12 };
const screens = [...document.querySelectorAll("[data-screen]")];
const state = {
  sound: localStorage.getItem("wortblitz-sound") !== "off",
  flashSpeed: 900,
  game: null,
  index: 0,
  score: 0,
  current: null,
  searchStarted: 0,
  times: [],
  chainWords: [],
  realItems: [],
  locked: false
};

let stats = loadStats();
let pendingTimers = [];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function localDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadStats() {
  try {
    const saved = JSON.parse(localStorage.getItem("wortblitz-stats") || "{}");
    const today = localDateKey();
    if (saved.date !== today) return { date: today, correct: 0, stars: 0 };
    return { date: today, correct: Number(saved.correct) || 0, stars: Number(saved.stars) || 0 };
  } catch {
    return { date: localDateKey(), correct: 0, stars: 0 };
  }
}

function saveStats() {
  localStorage.setItem("wortblitz-stats", JSON.stringify(stats));
  updateStatsView();
}

function updateStatsView() {
  $("#starCount").textContent = stats.stars;
  $("#todayCorrect").textContent = stats.correct;
}

function addCorrect() {
  stats.correct += 1;
  stats.stars += 1;
  saveStats();
}

function showScreen(name) {
  clearPendingTimers();
  screens.forEach((screen) => { screen.hidden = screen.dataset.screen !== name; });
  $("#app").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function clearPendingTimers() {
  pendingTimers.forEach(clearTimeout);
  pendingTimers = [];
}

function later(fn, delay) {
  const timer = setTimeout(fn, delay);
  pendingTimers.push(timer);
  return timer;
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function sample(items, count, excluded = []) {
  return shuffle(items.filter((item) => !excluded.includes(item))).slice(0, count);
}

function formatTime(ms) {
  return `${(ms / 1000).toFixed(2).replace(".", ",")} s`;
}

function beep(success = true) {
  if (!state.sound) return;
  try {
    const Context = window.AudioContext || window.webkitAudioContext;
    const context = new Context();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = success ? 660 : 220;
    gain.gain.setValueAtTime(.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .16);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + .16);
  } catch { /* Audio is optional. */ }
}

function setSoundButton() {
  const button = $("#soundButton");
  button.textContent = state.sound ? "🔊" : "🔇";
  button.setAttribute("aria-pressed", String(state.sound));
  button.setAttribute("aria-label", state.sound ? "Ton ausschalten" : "Ton einschalten");
}

function updateRound(prefix, total) {
  $(`#${prefix}RoundLabel`).textContent = prefix === "chain" ? `Glied ${state.index + 1} von ${total}` : `Wort ${state.index + 1} von ${total}`;
  $(`#${prefix}Progress`).style.width = `${(state.index / total) * 100}%`;
  $(`#${prefix}Score`).textContent = state.score;
}

function createChoiceButton(word, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice-button";
  button.textContent = word;
  button.addEventListener("click", () => onClick(button, word));
  return button;
}

function distractorsFor(word, count) {
  const sameLength = WORDS.filter((candidate) => candidate !== word && Math.abs(candidate.length - word.length) <= 2);
  const pool = sameLength.length >= count ? sameLength : WORDS.filter((candidate) => candidate !== word);
  return sample(pool, count);
}

function openGame(game) {
  state.game = game;
  if (game === "flash") showScreen("flash-setup");
  if (game === "chain") startChain();
  if (game === "real") startReal();
}

function startFlash() {
  Object.assign(state, { game: "flash", index: 0, score: 0, times: [], locked: false });
  showScreen("flash-play");
  nextFlash();
}

function nextFlash() {
  if (state.index >= TOTALS.flash) return finishGame("flash");
  state.locked = true;
  state.current = sample(WORDS, 1)[0];
  updateRound("flash", TOTALS.flash);
  $("#flashInstruction").textContent = "Mach dich bereit …";
  $("#flashWord").classList.remove("is-hidden");
  $("#flashWord").removeAttribute("aria-hidden");
  $("#flashWord").textContent = "•";
  $("#flashChoices").hidden = true;
  $("#flashChoices").replaceChildren();
  $("#flashTime").textContent = "";
  $("#flashTime").className = "time-result";

  later(() => {
    $("#flashInstruction").textContent = "Merke dir das Wort!";
    $("#flashWord").textContent = state.current;
    later(() => {
      // Das Blitzwort vor der Auswahl vollständig aus dem Dokument entfernen.
      // Die zusätzliche Klasse ist absichtlich unabhängig vom HTML-hidden-Attribut,
      // weil ältere Safari/WebView-Versionen display:grid sonst sichtbar lassen können.
      $("#flashWord").textContent = "";
      $("#flashWord").classList.add("is-hidden");
      $("#flashWord").setAttribute("aria-hidden", "true");
      $("#flashInstruction").textContent = "Wo ist das Blitzwort?";
      const choices = shuffle([state.current, ...distractorsFor(state.current, 3)]);
      choices.forEach((word) => $("#flashChoices").append(createChoiceButton(word, answerFlash)));
      // Ein kurzer leerer Moment trennt das Merken klar vom Wiedererkennen.
      later(() => {
        $("#flashChoices").hidden = false;
        state.searchStarted = performance.now();
        state.locked = false;
      }, 180);
    }, state.flashSpeed);
  }, 650);
}

function answerFlash(button, word) {
  if (state.locked) return;
  state.locked = true;
  const elapsed = Math.round(performance.now() - state.searchStarted);
  const isCorrect = word === state.current;
  if (isCorrect) {
    button.classList.add("correct");
    state.score += 1;
    state.times.push(elapsed);
    addCorrect();
    beep(true);
    $("#flashTime").textContent = `Gefunden in ${formatTime(elapsed)}`;
    $("#flashTime").classList.add("good");
  } else {
    button.classList.add("wrong");
    const correct = [...$("#flashChoices").children].find((item) => item.textContent === state.current);
    if (correct) correct.classList.add("correct");
    beep(false);
    $("#flashTime").textContent = `Das Blitzwort war „${state.current}“.`;
  }
  $("#flashScore").textContent = state.score;
  state.index += 1;
  later(nextFlash, 1200);
}

function startChain() {
  Object.assign(state, { game: "chain", index: 0, score: 0, chainWords: sample(WORDS, TOTALS.chain), locked: false });
  showScreen("chain-play");
  $("#chainVisual").replaceChildren();
  nextChain();
}

function nextChain() {
  if (state.index >= TOTALS.chain) return finishGame("chain");
  state.locked = false;
  state.current = state.chainWords[state.index];
  updateRound("chain", TOTALS.chain);
  $("#chainTarget").textContent = state.current;
  $("#chainFeedback").textContent = "";
  $("#chainFeedback").className = "feedback-line";
  const choices = shuffle([state.current, ...distractorsFor(state.current, 5)]);
  const container = $("#chainChoices");
  container.replaceChildren();
  choices.forEach((word) => container.append(createChoiceButton(word, answerChain)));
}

function answerChain(button, word) {
  if (state.locked) return;
  if (word !== state.current) {
    button.classList.add("wrong");
    $("#chainFeedback").textContent = "Schau noch einmal genau hin.";
    $("#chainFeedback").className = "feedback-line try";
    beep(false);
    later(() => button.classList.remove("wrong"), 430);
    return;
  }
  state.locked = true;
  button.classList.add("correct");
  state.score += 1;
  addCorrect();
  beep(true);
  $("#chainScore").textContent = state.score;
  $("#chainFeedback").textContent = "Passt! Deine Kette wird länger.";
  $("#chainFeedback").className = "feedback-line good";
  const link = document.createElement("span");
  link.className = "chain-link";
  link.setAttribute("aria-hidden", "true");
  $("#chainVisual").append(link);
  state.index += 1;
  later(nextChain, 850);
}

function startReal() {
  const realWords = sample(WORDS.filter((word) => word.length > 4), TOTALS.real / 2).map((word) => ({ word, real: true }));
  const madeWords = sample(MADE_UP, TOTALS.real / 2).map((word) => ({ word, real: false }));
  Object.assign(state, { game: "real", index: 0, score: 0, realItems: shuffle([...realWords, ...madeWords]), locked: false });
  showScreen("real-play");
  nextReal();
}

function nextReal() {
  if (state.index >= TOTALS.real) return finishGame("real");
  state.locked = false;
  state.current = state.realItems[state.index];
  updateRound("real", TOTALS.real);
  $("#judgeWord").textContent = state.current.word;
  $("#realFeedback").textContent = "";
  $("#realFeedback").className = "feedback-line";
  [$("#answerReal"), $("#answerMade")].forEach((button) => button.classList.remove("correct", "wrong"));
}

function answerReal(answer) {
  if (state.locked) return;
  state.locked = true;
  const isCorrect = answer === state.current.real;
  const chosen = answer ? $("#answerReal") : $("#answerMade");
  const correct = state.current.real ? $("#answerReal") : $("#answerMade");
  if (isCorrect) {
    chosen.classList.add("correct");
    state.score += 1;
    addCorrect();
    beep(true);
    $("#realFeedback").textContent = state.current.real ? "Richtig – dieses Wort gibt es." : "Richtig erkannt – dieses Wort ist erfunden.";
    $("#realFeedback").className = "feedback-line good";
  } else {
    chosen.classList.add("wrong");
    correct.classList.add("correct");
    beep(false);
    $("#realFeedback").textContent = state.current.real ? `„${state.current.word}“ ist ein echtes Wort.` : `„${state.current.word}“ ist erfunden.`;
    $("#realFeedback").className = "feedback-line try";
  }
  $("#realScore").textContent = state.score;
  state.index += 1;
  later(nextReal, 1200);
}

function finishGame(game) {
  const total = TOTALS[game];
  const titles = { flash: "Blitzwort", chain: "Lesekette", real: "Richtig oder erfunden?" };
  $("#resultGame").textContent = `${titles[game]} geschafft`;
  $("#resultTitle").textContent = state.score === total ? "Starke Runde!" : state.score >= total * .7 ? "Prima gelesen!" : "Gut geübt!";
  $("#resultScore").textContent = state.score;
  $("#resultTotal").textContent = `von ${total} richtig`;
  $("#speedSummary").hidden = game !== "flash";
  if (game === "flash") {
    const average = state.times.length ? state.times.reduce((sum, time) => sum + time, 0) / state.times.length : 0;
    const best = state.times.length ? Math.min(...state.times) : 0;
    $("#averageTime").textContent = average ? formatTime(average) : "–";
    $("#bestTime").textContent = best ? formatTime(best) : "–";
  }
  showScreen("result");
}

function replay() {
  if (state.game === "flash") startFlash();
  if (state.game === "chain") startChain();
  if (state.game === "real") startReal();
}

$$('[data-open-game]').forEach((button) => button.addEventListener("click", () => openGame(button.dataset.openGame)));
$$('[data-back-home]').forEach((button) => button.addEventListener("click", () => showScreen("home")));
$("#homeButton").addEventListener("click", () => showScreen("home"));
$("#startFlash").addEventListener("click", startFlash);
$("#playAgain").addEventListener("click", replay);
$("#answerReal").addEventListener("click", () => answerReal(true));
$("#answerMade").addEventListener("click", () => answerReal(false));

$$('[data-flash-speed]').forEach((button) => {
  button.addEventListener("click", () => {
    $$('[data-flash-speed]').forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    state.flashSpeed = Number(button.dataset.flashSpeed);
  });
});

$("#soundButton").addEventListener("click", () => {
  state.sound = !state.sound;
  localStorage.setItem("wortblitz-sound", state.sound ? "on" : "off");
  setSoundButton();
  if (state.sound) beep(true);
});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(() => {}));
}

updateStatsView();
setSoundButton();
