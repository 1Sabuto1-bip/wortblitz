"use strict";

const DEFAULT_WORDS_BY_GRADE = {
  "2": [
    "aber", "alle", "als", "am", "an", "auch", "auf", "aus", "bei", "bin", "bis", "da", "das", "dein", "der", "die",
    "du", "ein", "eine", "er", "es", "für", "ganz", "hat", "heute", "hier", "ich", "im", "in", "ist", "ja", "kann",
    "kein", "klein", "kommt", "machen", "man", "mehr", "mein", "mit", "muss", "nach", "nein", "nicht", "noch", "nur", "oder",
    "schon", "sehr", "sie", "sind", "so", "über", "um", "und", "unser", "vom", "von", "vor", "war", "was", "weil", "wenn",
    "wie", "wir", "wo", "zu", "zum", "Apfel", "Auto", "Ball", "Baum", "Buch", "Fenster", "Freund", "Garten", "Haus", "Hund",
    "Kind", "Katze", "Schule", "Sonne", "Spiel", "Tag", "Wasser"
  ],
  "3": [
    "aber", "alle", "also", "andere", "auch", "auf", "aus", "bei", "beide", "beim",
    "dann", "darum", "das", "davon", "deine", "dieser", "doch", "dort", "durch", "eigentlich",
    "einfach", "einmal", "etwas", "fast", "finden", "früher", "ganz", "gegen", "genau", "gestern",
    "gleich", "groß", "haben", "heute", "hinter", "immer", "jetzt", "klein", "können", "lange",
    "manchmal", "mehr", "mein", "mit", "müssen", "nach", "nicht", "noch", "nur", "oder",
    "plötzlich", "schon", "sehr", "sein", "seit", "später", "über", "unter", "vielleicht", "vorher",
    "warum", "weiter", "welche", "wenn", "wieder", "wirklich", "wollen", "zwischen", "Abenteuer", "Fenster",
    "Freundschaft", "Gedanke", "Geschichte", "Geheimnis", "Morgen", "Schlüssel", "Schule", "Stunde", "Tasche", "Wasser"
  ],
  "4": [
    "allerdings", "anschließend", "außerdem", "bereits", "besonders", "dadurch", "dagegen", "darüber", "darunter", "deshalb",
    "dennoch", "eigentlich", "erneut", "gerade", "genauso", "gemeinsam", "häufig", "innerhalb", "inzwischen", "jedoch",
    "manchmal", "meistens", "nämlich", "niemals", "obwohl", "plötzlich", "schließlich", "sobald", "sondern", "später",
    "trotzdem", "ungefähr", "unterdessen", "vielleicht", "wahrscheinlich", "während", "wenigstens", "wirklich", "zuerst", "zuletzt",
    "zwischen", "Aufgabe", "Bedeutung", "Beispiel", "Beobachtung", "Bewegung", "Entscheidung", "Entdeckung", "Erfahrung", "Ergebnis",
    "Erklärung", "Gemeinschaft", "Geschwindigkeit", "Gespräch", "Information", "Möglichkeit", "Oberfläche", "Richtung", "Temperatur", "Umwelt",
    "Unterschied", "Vergangenheit", "Verantwortung", "Zukunft", "Zusammenhang", "Abenteuer", "Gedanke", "Geheimnis", "Geschichte", "Schlüssel"
  ]
};

const emptyCustomWordLists = () => ({ "2": [], "3": [], "4": [] });
let customWordsByGrade = emptyCustomWordLists();
let WORDS = [...DEFAULT_WORDS_BY_GRADE["3"]];

const MADE_UP = [
  "Flinter", "Bramel", "Korstig", "Taspel", "Wumper", "Glaspen", "Finterei", "Schlummerich", "Wolkigel", "Kreiselmut",
  "Dinter", "Pflasum", "Morgsel", "Lumpfen", "Schreubel", "Knistel", "Blauder", "Funkerin", "Zappelich", "Träumelei",
  "Brenzel", "Kleuster", "Rimpfen", "Pluder", "Schnabelig", "Dunkerei", "Frindel", "Wandrig", "Kuspert", "Zimmrig",
  "Glimmerich", "Haufel", "Raschung", "Flüsterling", "Klunkern", "Wuseligkeit", "Tromsel", "Hellerich", "Drübenheit", "Schlüsselung"
];

const SENTENCES = {
  easy: [
    "Heute scheint die Sonne.",
    "Mia findet einen Stein.",
    "Der Hund wartet draußen.",
    "Wir lesen eine Geschichte.",
    "Plötzlich klingelt das Telefon.",
    "Draußen fliegen viele Vögel.",
    "Papa kocht eine Suppe.",
    "Das Wasser ist kalt."
  ],
  medium: [
    "Heute scheint die Sonne besonders warm.",
    "Mia findet einen bunten Stein im Garten.",
    "Nach der Pause lesen wir eine Geschichte.",
    "Plötzlich klopft jemand laut an die Tür.",
    "Unser Ausflug beginnt morgen nach dem Frühstück.",
    "Im Winter tragen viele Kinder warme Jacken.",
    "Auf dem Schulhof wächst ein großer Baum.",
    "Die Freunde bauen gemeinsam eine lange Brücke.",
    "Abends leuchten viele Sterne über unserem Haus.",
    "Vielleicht finden wir später einen geheimen Weg."
  ],
  hard: [
    "Der kleine Hund wartet geduldig vor seiner roten Tür.",
    "Jonas versteckt den alten Schlüssel unter seiner schweren Tasche.",
    "Nach dem Unterricht spielen die Kinder gemeinsam auf dem Schulhof.",
    "Plötzlich entdeckt Mia einen geheimen Weg zwischen den hohen Bäumen.",
    "Am frühen Morgen beginnt unsere lange Reise durch die Berge.",
    "Die mutige Katze klettert vorsichtig über das nasse Garagendach.",
    "Vor dem Frühstück liest mein Bruder eine spannende Geschichte.",
    "Im dunklen Keller finden wir eine Kiste voller alter Bücher."
  ]
};

const TOTALS = { flash: 20, chain: 10, real: 12, sentence: 5 };
const screens = [...document.querySelectorAll("[data-screen]")];
const state = {
  sound: localStorage.getItem("wortblitz-sound") !== "off",
  flashSpeed: 900,
  flashChoiceCount: 4,
  sentenceLevel: "medium",
  game: null,
  index: 0,
  score: 0,
  current: null,
  searchStarted: 0,
  times: [],
  flashWords: [],
  chainWords: [],
  chainFailures: 0,
  chainBestIndex: 0,
  realItems: [],
  sentenceSet: [],
  sentenceIndex: 0,
  sentenceWordIndex: 0,
  sentenceWordScore: 0,
  sentenceTotalWords: 0,
  sentenceFirstTry: 0,
  sentenceAttempts: 0,
  sentenceBank: [],
  sentenceBuilt: [],
  adminSession: null,
  locked: false
};

let profile = loadProfile();
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

function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem("wortblitz-profile") || "null");
    if (!saved?.name) return null;
    const grade = [2, 3, 4].includes(Number(saved.grade)) ? Number(saved.grade) : 3;
    return { name: String(saved.name).slice(0, 24), points: Number(saved.points) || 0, grade };
  } catch {
    return null;
  }
}

function saveProfile() {
  if (profile) localStorage.setItem("wortblitz-profile", JSON.stringify(profile));
  updateStatsView();
}

function loadStats() {
  try {
    const saved = JSON.parse(localStorage.getItem("wortblitz-stats") || "{}");
    const today = localDateKey();
    if (saved.date !== today) return { date: today, correct: 0 };
    return { date: today, correct: Number(saved.correct) || 0 };
  } catch {
    return { date: localDateKey(), correct: 0 };
  }
}

function saveStats() {
  localStorage.setItem("wortblitz-stats", JSON.stringify(stats));
  updateStatsView();
}

function updateStatsView() {
  $("#starCount").textContent = profile?.points || 0;
  $("#todayCorrect").textContent = stats.correct;
  $("#playerGreeting").textContent = profile ? `Hallo, ${profile.name}!` : "Wähle ein Spiel";
  $("#playerGradeLabel").textContent = profile?.grade || 3;
}

function activeGrade() {
  return String(profile?.grade || 3);
}

function applyActiveWordPool() {
  const grade = activeGrade();
  WORDS = [...DEFAULT_WORDS_BY_GRADE[grade], ...customWordsByGrade[grade]];
}

function addCorrect() {
  stats.correct += 1;
  if (profile) profile.points += 1;
  saveProfile();
  saveStats();
}

function addBonusPoints(amount) {
  if (!profile) return;
  profile.points += amount;
  saveProfile();
}

function goHome() {
  showScreen(profile ? "home" : "profile");
}

function startPlayerProfile(event) {
  event.preventDefault();
  const name = $("#playerName").value.trim().replace(/\s+/g, " ");
  if (name.length < 2) {
    $("#playerName").focus();
    return;
  }
  const grade = Number($("#playerGradeSelect").value);
  profile = { name: name.slice(0, 24), points: 0, grade: [2, 3, 4].includes(grade) ? grade : 3 };
  stats = { date: localDateKey(), correct: 0 };
  applyActiveWordPool();
  saveProfile();
  saveStats();
  $("#playerName").value = "";
  showScreen("home");
}

function resetPlayerProfile() {
  if (!profile) return showScreen("profile");
  if (!confirm(`Profil und Punkte von ${profile.name} wirklich zurücksetzen?`)) return;
  localStorage.removeItem("wortblitz-profile");
  localStorage.removeItem("wortblitz-stats");
  profile = null;
  stats = { date: localDateKey(), correct: 0 };
  applyActiveWordPool();
  updateStatsView();
  showScreen("profile");
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
  const score = $(`#${prefix}Score`);
  if (score) score.textContent = state.score;
  if (prefix === "chain") $("#chainFailures").textContent = state.chainFailures;
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

function sentenceDistractorsFor(token, count) {
  const punctuation = token.match(/[.!?]$/)?.[0] || "";
  const plain = token.replace(/[.!?]$/, "");
  const startsUppercase = plain.charAt(0) === plain.charAt(0).toUpperCase();
  const normalized = plain.toLowerCase();
  const available = WORDS.filter((candidate) => candidate.toLowerCase() !== normalized);
  const similar = available.filter((candidate) => Math.abs(candidate.length - plain.length) <= 2);
  const candidates = sample(similar.length >= count ? similar : available, count);
  return candidates.map((candidate) => {
    const adjusted = startsUppercase ? candidate.charAt(0).toUpperCase() + candidate.slice(1) : candidate.toLowerCase();
    return `${adjusted}${punctuation}`;
  });
}

function openGame(game) {
  state.game = game;
  if (game === "flash") showScreen("flash-setup");
  if (game === "chain") startChain();
  if (game === "real") startReal();
  if (game === "sentence") showScreen("sentence-setup");
}

function startFlash() {
  Object.assign(state, { game: "flash", index: 0, score: 0, times: [], flashWords: sample(WORDS, TOTALS.flash), locked: false });
  showScreen("flash-play");
  nextFlash();
}

function nextFlash() {
  if (state.index >= TOTALS.flash) return finishGame("flash");
  state.locked = true;
  state.current = state.flashWords[state.index];
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
      const choices = shuffle([state.current, ...distractorsFor(state.current, state.flashChoiceCount - 1)]);
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
  Object.assign(state, { game: "chain", index: 0, score: 0, chainFailures: 0, chainBestIndex: 0, chainWords: sample(WORDS, TOTALS.chain), locked: false });
  showScreen("chain-play");
  $("#chainVisual").replaceChildren();
  $("#chainFailures").textContent = "0";
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
  const choices = shuffle([state.current, ...distractorsFor(state.current, 11)]);
  const container = $("#chainChoices");
  container.replaceChildren();
  choices.forEach((word) => container.append(createChoiceButton(word, answerChain)));
}

function answerChain(button, word) {
  if (state.locked) return;
  if (word !== state.current) {
    state.locked = true;
    state.chainFailures += 1;
    $("#chainFailures").textContent = state.chainFailures;
    button.classList.add("wrong");
    const correct = [...$("#chainChoices").children].find((item) => item.textContent === state.current);
    if (correct) correct.classList.add("correct");
    $("#chainFeedback").textContent = "Nicht ganz – die Kette beginnt wieder von vorn.";
    $("#chainFeedback").className = "feedback-line try";
    beep(false);
    later(() => {
      state.index = 0;
      state.score = 0;
      $("#chainVisual").replaceChildren();
      nextChain();
    }, 1200);
    return;
  }
  state.locked = true;
  button.classList.add("correct");
  state.score += 1;
  if (state.index >= state.chainBestIndex) {
    state.chainBestIndex = state.index + 1;
    addCorrect();
  }
  beep(true);
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

function startSentence() {
  const sentenceSet = sample(SENTENCES[state.sentenceLevel], TOTALS.sentence);
  const sentenceTotalWords = sentenceSet.reduce((total, sentence) => total + sentence.split(" ").length, 0);
  Object.assign(state, {
    game: "sentence",
    sentenceSet,
    sentenceIndex: 0,
    sentenceWordIndex: 0,
    sentenceWordScore: 0,
    sentenceTotalWords,
    sentenceFirstTry: 0,
    sentenceAttempts: 0,
    sentenceBank: [],
    sentenceBuilt: [],
    locked: false
  });
  showScreen("sentence-play");
  nextSentenceWord();
}

function currentSentenceTokens() {
  return state.sentenceSet[state.sentenceIndex].split(" ");
}

function updateSentenceHeader() {
  const tokens = currentSentenceTokens();
  const wordNumber = Math.min(state.sentenceWordIndex + 1, tokens.length);
  const progress = ((state.sentenceIndex + Math.min(state.sentenceWordIndex / tokens.length, 1)) / TOTALS.sentence) * 100;
  $("#sentenceRoundLabel").textContent = `Satz ${state.sentenceIndex + 1} von ${TOTALS.sentence} · Wort ${wordNumber} von ${tokens.length}`;
  $("#sentenceCounter").textContent = `Wort ${wordNumber} von ${tokens.length}`;
  $("#sentenceProgress").style.width = `${progress}%`;
  $("#sentenceScore").textContent = state.sentenceWordScore;
}

function nextSentenceWord() {
  if (state.sentenceIndex >= TOTALS.sentence) return finishGame("sentence");
  const tokens = currentSentenceTokens();
  if (state.sentenceWordIndex >= tokens.length) return startSentenceOrdering();

  state.locked = true;
  state.current = tokens[state.sentenceWordIndex];
  updateSentenceHeader();
  $("#sentenceOrderStage").hidden = true;
  $("#sentenceRecognitionStage").hidden = false;
  $("#sentenceInstruction").textContent = "Mach dich bereit …";
  $("#sentenceWord").classList.remove("is-hidden");
  $("#sentenceWord").removeAttribute("aria-hidden");
  $("#sentenceWord").textContent = "•";
  $("#sentenceChoices").hidden = true;
  $("#sentenceChoices").replaceChildren();
  $("#sentenceFeedback").textContent = "";
  $("#sentenceFeedback").className = "feedback-line";

  later(() => {
    $("#sentenceInstruction").textContent = "Merke dir das Wort!";
    $("#sentenceWord").textContent = state.current;
    later(() => {
      $("#sentenceWord").textContent = "";
      $("#sentenceWord").classList.add("is-hidden");
      $("#sentenceWord").setAttribute("aria-hidden", "true");
      $("#sentenceInstruction").textContent = "Welches Wort hast du gesehen?";
      const choices = shuffle([state.current, ...sentenceDistractorsFor(state.current, 3)]);
      choices.forEach((word) => $("#sentenceChoices").append(createChoiceButton(word, answerSentenceWord)));
      later(() => {
        $("#sentenceChoices").hidden = false;
        state.locked = false;
      }, 180);
    }, 1100);
  }, 600);
}

function answerSentenceWord(button, word) {
  if (state.locked) return;
  state.locked = true;
  const isCorrect = word === state.current;
  if (isCorrect) {
    button.classList.add("correct");
    state.sentenceWordScore += 1;
    addCorrect();
    beep(true);
    $("#sentenceFeedback").textContent = "Richtig erkannt!";
    $("#sentenceFeedback").className = "feedback-line good";
  } else {
    button.classList.add("wrong");
    const correct = [...$("#sentenceChoices").children].find((item) => item.textContent === state.current);
    if (correct) correct.classList.add("correct");
    beep(false);
    $("#sentenceFeedback").textContent = `Das Wort war „${state.current}“.`;
    $("#sentenceFeedback").className = "feedback-line try";
  }
  $("#sentenceScore").textContent = state.sentenceWordScore;
  state.sentenceWordIndex += 1;
  later(nextSentenceWord, 1050);
}

function startSentenceOrdering() {
  const tokens = currentSentenceTokens();
  state.locked = false;
  state.sentenceAttempts = 0;
  state.sentenceBuilt = [];
  state.sentenceBank = shuffle(tokens.map((word, id) => ({ id, word })));
  updateSentenceHeader();
  $("#sentenceRecognitionStage").hidden = true;
  $("#sentenceOrderStage").hidden = false;
  $("#sentenceOrderStage").classList.remove("is-correct");
  $("#sentenceOrderFeedback").textContent = "";
  $("#sentenceOrderFeedback").className = "feedback-line";
  renderSentenceOrder();
}

function makeSentenceChip(item, fromBank) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "sentence-chip";
  button.textContent = item.word;
  button.setAttribute("aria-label", fromBank ? `${item.word} in den Satz setzen` : `${item.word} zurücklegen`);
  button.addEventListener("click", () => moveSentenceWord(item.id, fromBank));
  return button;
}

function renderSentenceOrder() {
  const build = $("#sentenceBuild");
  const bank = $("#sentenceBank");
  build.replaceChildren();
  bank.replaceChildren();
  state.sentenceBuilt.forEach((item) => build.append(makeSentenceChip(item, false)));
  state.sentenceBank.forEach((item) => bank.append(makeSentenceChip(item, true)));
  $("#checkSentence").disabled = state.sentenceBank.length !== 0 || state.locked;
}

function moveSentenceWord(id, fromBank) {
  if (state.locked) return;
  const source = fromBank ? state.sentenceBank : state.sentenceBuilt;
  const destination = fromBank ? state.sentenceBuilt : state.sentenceBank;
  const index = source.findIndex((item) => item.id === id);
  if (index < 0) return;
  destination.push(source.splice(index, 1)[0]);
  $("#sentenceOrderFeedback").textContent = "";
  renderSentenceOrder();
}

function checkSentenceOrder() {
  if (state.locked || state.sentenceBank.length !== 0) return;
  const isCorrect = state.sentenceBuilt.every((item, index) => item.id === index);
  if (isCorrect) {
    state.locked = true;
    if (state.sentenceAttempts === 0) state.sentenceFirstTry += 1;
    addBonusPoints(2);
    beep(true);
    $("#sentenceOrderStage").classList.add("is-correct");
    $("#sentenceOrderFeedback").textContent = state.sentenceSet[state.sentenceIndex];
    $("#sentenceOrderFeedback").className = "feedback-line good";
    renderSentenceOrder();
    state.sentenceIndex += 1;
    state.sentenceWordIndex = 0;
    later(nextSentenceWord, 1500);
    return;
  }

  state.locked = true;
  state.sentenceAttempts += 1;
  beep(false);
  $("#sentenceOrderFeedback").textContent = "Noch nicht ganz. Versuche es noch einmal.";
  $("#sentenceOrderFeedback").className = "feedback-line try";
  renderSentenceOrder();
  later(() => {
    state.sentenceBank = shuffle([...state.sentenceBuilt]);
    state.sentenceBuilt = [];
    state.locked = false;
    renderSentenceOrder();
  }, 1000);
}

function finishGame(game) {
  const total = game === "sentence" ? state.sentenceTotalWords : TOTALS[game];
  const score = game === "sentence" ? state.sentenceWordScore : state.score;
  const titles = { flash: "Blitzwort", chain: "Lesekette", real: "Richtig oder erfunden?", sentence: "Satzblitz" };
  const sentenceLevels = { easy: "kurz", medium: "mittel", hard: "lang" };
  $("#resultGame").textContent = game === "sentence" ? `${titles[game]} · ${sentenceLevels[state.sentenceLevel]}` : `${titles[game]} geschafft`;
  let resultTitle = score === total ? "Starke Runde!" : score >= total * .7 ? "Prima gelesen!" : "Gut geübt!";
  if (game === "chain") {
    resultTitle = state.chainFailures === 0 ? "Wow! Beim ersten Versuch!" : state.chainFailures <= 2 ? "Geschafft!" : "Du musst noch etwas üben.";
  }
  $("#resultTitle").textContent = resultTitle;
  $("#resultScore").textContent = score;
  $("#resultTotal").textContent = `von ${total} richtig`;
  $("#speedSummary").hidden = game !== "flash";
  $("#sentenceSummary").hidden = game !== "sentence";
  $("#chainSummary").hidden = game !== "chain";
  if (game === "flash") {
    const average = state.times.length ? state.times.reduce((sum, time) => sum + time, 0) / state.times.length : 0;
    const best = state.times.length ? Math.min(...state.times) : 0;
    $("#averageTime").textContent = average ? formatTime(average) : "–";
    $("#bestTime").textContent = best ? formatTime(best) : "–";
  }
  if (game === "sentence") {
    $("#sentenceWordsResult").textContent = `${state.sentenceWordScore} von ${state.sentenceTotalWords}`;
    $("#sentenceFirstTryResult").textContent = `${state.sentenceFirstTry} von ${TOTALS.sentence}`;
  }
  if (game === "chain") $("#chainFailureResult").textContent = state.chainFailures;
  showScreen("result");
}

function replay() {
  if (state.game === "flash") startFlash();
  if (state.game === "chain") startChain();
  if (state.game === "real") startReal();
  if (state.game === "sentence") startSentence();
}

const ADMIN_STORAGE_KEY = "wortblitz-admin-config-v1";

function normalizeCustomWords(words, grade) {
  const defaultKeys = new Set(DEFAULT_WORDS_BY_GRADE[grade].map((word) => word.toLocaleLowerCase("de")));
  const seen = new Set();
  return (Array.isArray(words) ? words : [])
    .map((word) => String(word).trim())
    .filter((word) => word && /^[A-Za-zÄÖÜäöüß-]+$/.test(word))
    .filter((word) => {
      const key = word.toLocaleLowerCase("de");
      if (defaultKeys.has(key) || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.localeCompare(b, "de"));
}

function normalizeCustomWordData(data) {
  const source = data?.customWordsByGrade && typeof data.customWordsByGrade === "object"
    ? data.customWordsByGrade
    : { "2": [], "3": Array.isArray(data?.customWords) ? data.customWords : Array.isArray(data) ? data : [], "4": [] };
  return {
    "2": normalizeCustomWords(source["2"], "2"),
    "3": normalizeCustomWords(source["3"], "3"),
    "4": normalizeCustomWords(source["4"], "4")
  };
}

function setCustomWordData(data) {
  customWordsByGrade = normalizeCustomWordData(data);
  applyActiveWordPool();
  if (!$("#adminManagePanel").hidden) renderCustomWords();
}

async function loadSharedWords() {
  try {
    const response = await fetch("words.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Wortliste nicht erreichbar");
    const data = await response.json();
    setCustomWordData(data);
  } catch {
    // Offline bleibt die zuletzt geladene Wortliste aktiv.
  }
}

function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function textToBase64(value) {
  return bytesToBase64(new TextEncoder().encode(value));
}

function base64ToText(value) {
  return new TextDecoder().decode(base64ToBytes(value.replace(/\s/g, "")));
}

async function deriveAdminKey(pin, salt, usage) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    [usage]
  );
}

async function encryptAdminConfig(config, pin) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAdminKey(pin, salt, "encrypt");
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(config)));
  return JSON.stringify({ salt: bytesToBase64(salt), iv: bytesToBase64(iv), data: bytesToBase64(new Uint8Array(encrypted)) });
}

async function decryptAdminConfig(stored, pin) {
  const payload = JSON.parse(stored);
  const salt = base64ToBytes(payload.salt);
  const iv = base64ToBytes(payload.iv);
  const key = await deriveAdminKey(pin, salt, "decrypt");
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, base64ToBytes(payload.data));
  return JSON.parse(new TextDecoder().decode(decrypted));
}

function inferredRepository() {
  const githubHost = location.hostname.match(/^([^.]+)\.github\.io$/i);
  const pathPart = location.pathname.split("/").filter(Boolean)[0] || "";
  return { owner: githubHost?.[1] || "", repo: pathPart };
}

function showAdminPanel(panel) {
  $("#adminSetupPanel").hidden = panel !== "setup";
  $("#adminLoginPanel").hidden = panel !== "login";
  $("#adminManagePanel").hidden = panel !== "manage";
  $("#adminStatus").textContent = "";
  $("#adminStatus").className = "sync-status";
  if (panel === "setup") {
    const inferred = inferredRepository();
    if (!$("#adminOwner").value) $("#adminOwner").value = inferred.owner;
    if (!$("#adminRepo").value) $("#adminRepo").value = inferred.repo;
  }
  if (panel === "login") {
    $("#adminLoginPanel").querySelector(".admin-intro").textContent = "Gib deine PIN ein, um die gemeinsame Wortliste zu bearbeiten.";
  }
  if (panel === "manage") {
    $("#customGradeSelect").value = activeGrade();
    renderCustomWords();
  }
}

function openAdmin() {
  showScreen("admin");
  if (state.adminSession) return showAdminPanel("manage");
  showAdminPanel(localStorage.getItem(ADMIN_STORAGE_KEY) ? "login" : "setup");
}

function setAdminStatus(message, type = "") {
  $("#adminStatus").textContent = message;
  $("#adminStatus").className = `sync-status ${type}`.trim();
}

function githubHeaders(config) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${config.token}`,
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

function githubWordsUrl(config) {
  return `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/words.json`;
}

async function readGithubWords(config) {
  const response = await fetch(`${githubWordsUrl(config)}?ref=${encodeURIComponent(config.branch)}`, { headers: githubHeaders(config) });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.message || `GitHub-Fehler ${response.status}`);
  }
  const file = await response.json();
  const data = JSON.parse(base64ToText(file.content));
  return { sha: file.sha, lists: normalizeCustomWordData(data) };
}

async function writeGithubWords(config, lists) {
  const current = await readGithubWords(config);
  const normalizedLists = normalizeCustomWordData({ customWordsByGrade: lists });
  const content = `${JSON.stringify({ customWordsByGrade: normalizedLists }, null, 2)}\n`;
  const response = await fetch(githubWordsUrl(config), {
    method: "PUT",
    headers: { ...githubHeaders(config), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Gemeinsame Wortliste aktualisiert",
      content: textToBase64(content),
      sha: current.sha,
      branch: config.branch
    })
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.message || `GitHub-Fehler ${response.status}`);
  }
  setCustomWordData({ customWordsByGrade: normalizedLists });
}

function renderCustomWords() {
  const grade = $("#customGradeSelect").value || activeGrade();
  const words = customWordsByGrade[grade];
  $("#customWordCount").textContent = `${words.length} ${words.length === 1 ? "eigenes Wort" : "eigene Wörter"} · Klasse ${grade}`;
  const list = $("#customWordList");
  list.replaceChildren();
  words.forEach((word) => {
    const item = document.createElement("span");
    item.className = "custom-word-item";
    item.append(document.createTextNode(word));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `${word} löschen`);
    remove.addEventListener("click", () => removeCustomWord(word, grade));
    item.append(remove);
    list.append(item);
  });
}

async function saveAdminSetup() {
  const owner = $("#adminOwner").value.trim();
  const repo = $("#adminRepo").value.trim();
  const branch = $("#adminBranch").value.trim() || "main";
  const token = $("#adminToken").value.trim();
  const pin = $("#adminPinSetup").value;
  const confirmation = $("#adminPinConfirm").value;
  if (!owner || !repo || !token) return setAdminStatus("Bitte fülle alle GitHub-Felder aus.", "error");
  if (!/^\d{6,12}$/.test(pin)) return setAdminStatus("Die PIN muss aus 6 bis 12 Ziffern bestehen.", "error");
  if (pin !== confirmation) return setAdminStatus("Die beiden PIN-Eingaben stimmen nicht überein.", "error");
  if (!crypto?.subtle) return setAdminStatus("Die verschlüsselte Speicherung wird von diesem Browser nicht unterstützt.", "error");

  const config = { owner, repo, branch, token };
  setAdminStatus("Verbindung wird geprüft …");
  try {
    const remote = await readGithubWords(config);
    const encrypted = await encryptAdminConfig(config, pin);
    localStorage.setItem(ADMIN_STORAGE_KEY, encrypted);
    state.adminSession = config;
    setCustomWordData({ customWordsByGrade: remote.lists });
    $("#adminToken").value = "";
    $("#adminPinSetup").value = "";
    $("#adminPinConfirm").value = "";
    showAdminPanel("manage");
    setAdminStatus("Adminzugang ist eingerichtet.", "good");
  } catch (error) {
    setAdminStatus(`Verbindung fehlgeschlagen: ${error.message}`, "error");
  }
}

async function loginAdmin() {
  const pin = $("#adminPinLogin").value;
  const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
  if (!stored) return showAdminPanel("setup");
  try {
    const config = await decryptAdminConfig(stored, pin);
    state.adminSession = config;
    const remote = await readGithubWords(config);
    setCustomWordData({ customWordsByGrade: remote.lists });
    $("#adminPinLogin").value = "";
    showAdminPanel("manage");
    setAdminStatus("Wortliste ist aktuell.", "good");
  } catch {
    state.adminSession = null;
    $("#adminPinLogin").value = "";
    $("#adminPinLogin").focus();
    setAdminStatus("PIN falsch oder Verbindung nicht möglich. Bitte versuche es erneut.", "error");
  }
}

async function addCustomWord(event) {
  event.preventDefault();
  if (!state.adminSession) return;
  const word = $("#newWord").value.trim();
  const grade = $("#customGradeSelect").value;
  if (!word || !/^[A-Za-zÄÖÜäöüß-]+$/.test(word)) return setAdminStatus("Bitte gib genau ein Wort ohne Leerzeichen ein.", "error");
  const gradeWords = [...DEFAULT_WORDS_BY_GRADE[grade], ...customWordsByGrade[grade]];
  if (gradeWords.some((existing) => existing.toLocaleLowerCase("de") === word.toLocaleLowerCase("de"))) return setAdminStatus(`Dieses Wort ist in Klasse ${grade} bereits vorhanden.`, "error");
  setAdminStatus("Wort wird gespeichert …");
  try {
    const next = { ...customWordsByGrade, [grade]: [...customWordsByGrade[grade], word] };
    await writeGithubWords(state.adminSession, next);
    $("#newWord").value = "";
    setAdminStatus("Gespeichert. Auf den Tablets erscheint das Wort nach der nächsten Aktualisierung.", "good");
  } catch (error) {
    setAdminStatus(`Speichern fehlgeschlagen: ${error.message}`, "error");
  }
}

async function removeCustomWord(word, grade) {
  if (!state.adminSession || !confirm(`„${word}“ wirklich aus der gemeinsamen Liste löschen?`)) return;
  setAdminStatus("Wort wird gelöscht …");
  try {
    const next = { ...customWordsByGrade, [grade]: customWordsByGrade[grade].filter((item) => item !== word) };
    await writeGithubWords(state.adminSession, next);
    setAdminStatus("Wort gelöscht. Die Tablets übernehmen die Änderung automatisch.", "good");
  } catch (error) {
    setAdminStatus(`Löschen fehlgeschlagen: ${error.message}`, "error");
  }
}

function parseCsvLine(line, delimiter) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === delimiter && !quoted) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += character;
    }
  }
  cells.push(cell.trim());
  return cells;
}

function parseCsvRows(text) {
  const lines = String(text).replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (!lines.length) return [];
  const candidates = [";", ",", "\t"];
  const delimiter = candidates.sort((a, b) => (lines[0].split(b).length - lines[0].split(a).length))[0];
  return lines.map((line) => parseCsvLine(line, delimiter));
}

async function importCsvWords() {
  if (!state.adminSession) return;
  const file = $("#csvFile").files[0];
  if (!file) return setAdminStatus("Bitte wähle zuerst eine CSV-Datei aus.", "error");
  let rows;
  try {
    rows = parseCsvRows(await file.text());
  } catch {
    return setAdminStatus("Die CSV-Datei konnte nicht gelesen werden.", "error");
  }
  if (!rows.length) return setAdminStatus("Die CSV-Datei ist leer.", "error");

  const header = rows[0].map((cell) => cell.toLocaleLowerCase("de").trim());
  const wordIndex = header.findIndex((cell) => ["wort", "word"].includes(cell));
  const gradeIndex = header.findIndex((cell) => ["klasse", "klassenstufe", "jahrgang", "grade"].includes(cell));
  const hasHeader = wordIndex >= 0 || gradeIndex >= 0;
  const selectedGrade = $("#customGradeSelect").value;
  const next = { "2": [...customWordsByGrade["2"]], "3": [...customWordsByGrade["3"]], "4": [...customWordsByGrade["4"]] };
  const added = { "2": 0, "3": 0, "4": 0 };

  rows.slice(hasHeader ? 1 : 0).forEach((row) => {
    const detectedGrade = hasHeader && gradeIndex >= 0 ? row[gradeIndex] : (!hasHeader && /^[234]$/.test(row[0] || "") && row.length > 1 ? row[0] : selectedGrade);
    const grade = String(detectedGrade || "").match(/[234]/)?.[0];
    const word = String(hasHeader && wordIndex >= 0 ? row[wordIndex] : (!hasHeader && /^[234]$/.test(row[0] || "") && row.length > 1 ? row[1] : row[0]) || "").trim();
    if (!grade || !/^[A-Za-zÄÖÜäöüß-]+$/.test(word)) return;
    const existing = [...DEFAULT_WORDS_BY_GRADE[grade], ...next[grade]].some((item) => item.toLocaleLowerCase("de") === word.toLocaleLowerCase("de"));
    if (!existing) {
      next[grade].push(word);
      added[grade] += 1;
    }
  });

  const total = added["2"] + added["3"] + added["4"];
  if (!total) return setAdminStatus("Keine neuen gültigen Wörter gefunden. Bitte prüfe Aufbau und Duplikate.", "error");
  setAdminStatus(`${total} Wörter werden gespeichert …`);
  try {
    await writeGithubWords(state.adminSession, next);
    $("#csvFile").value = "";
    const details = ["2", "3", "4"].filter((grade) => added[grade]).map((grade) => `Klasse ${grade}: ${added[grade]}`).join(" · ");
    setAdminStatus(`${total} Wörter importiert (${details}).`, "good");
  } catch (error) {
    setAdminStatus(`Import fehlgeschlagen: ${error.message}`, "error");
  }
}

function downloadCsvTemplate() {
  const content = "Klasse;Wort\n2;Beispielwort\n3;aufmerksam\n4;außergewöhnlich\n";
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "wortblitz-vorlage.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function resetAdminSetup() {
  if (!confirm("Die lokale Adminverbindung wirklich zurücksetzen? Die gemeinsame Wortliste bleibt erhalten.")) return;
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  state.adminSession = null;
  showAdminPanel("setup");
}

$$('[data-open-game]').forEach((button) => button.addEventListener("click", () => openGame(button.dataset.openGame)));
$$('[data-back-home]').forEach((button) => button.addEventListener("click", goHome));
$("#homeButton").addEventListener("click", goHome);
$("#profileForm").addEventListener("submit", startPlayerProfile);
$("#resetProfileButton").addEventListener("click", resetPlayerProfile);
$("#adminButton").addEventListener("click", openAdmin);
$("#startFlash").addEventListener("click", startFlash);
$("#startSentence").addEventListener("click", startSentence);
$("#playAgain").addEventListener("click", replay);
$("#answerReal").addEventListener("click", () => answerReal(true));
$("#answerMade").addEventListener("click", () => answerReal(false));
$("#checkSentence").addEventListener("click", checkSentenceOrder);
$("#saveAdminSetup").addEventListener("click", saveAdminSetup);
$("#adminLogin").addEventListener("click", loginAdmin);
$("#adminPinLogin").addEventListener("keydown", (event) => { if (event.key === "Enter") loginAdmin(); });
$("#addWordForm").addEventListener("submit", addCustomWord);
$("#customGradeSelect").addEventListener("change", renderCustomWords);
$("#importCsvButton").addEventListener("click", importCsvWords);
$("#downloadCsvTemplate").addEventListener("click", downloadCsvTemplate);
$("#adminLogout").addEventListener("click", () => { state.adminSession = null; showAdminPanel("login"); });
$("#resetAdminSetup").addEventListener("click", resetAdminSetup);

$$('[data-flash-speed]').forEach((button) => {
  button.addEventListener("click", () => {
    $$('[data-flash-speed]').forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    state.flashSpeed = Number(button.dataset.flashSpeed);
    state.flashChoiceCount = Number(button.dataset.flashChoices);
  });
});

$$('[data-sentence-level]').forEach((button) => {
  button.addEventListener("click", () => {
    $$('[data-sentence-level]').forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    state.sentenceLevel = button.dataset.sentenceLevel;
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

applyActiveWordPool();
updateStatsView();
setSoundButton();
loadSharedWords();
window.setInterval(loadSharedWords, 60000);
showScreen(profile ? "home" : "profile");
