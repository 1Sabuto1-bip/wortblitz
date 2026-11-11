// Schreibwege nach den vier eingescannten Buchstabenkarten.
// Jede Kurve ist ein Zug. Die Reihenfolge im Array ist die Zugreihenfolge.
const WRITING_LETTERS = {
  D: ["M98 46 L98 250", "M98 46 C169 46 230 61 230 148 C230 232 167 250 98 250"],
  d: ["M190 178 C166 158 128 170 126 209 C124 250 174 262 190 224 L190 46 L190 250"],
  C: ["M229 73 C184 30 99 55 95 147 C90 237 172 273 229 222"],
  c: ["M205 179 C171 151 128 169 126 207 C123 247 175 265 207 234"],
  B: ["M102 46 L102 250", "M102 46 C165 43 204 52 204 99 C204 137 171 148 102 148 C179 144 217 160 217 201 C217 237 175 250 102 250"],
  b: ["M119 46 L119 250 L119 179 C144 151 195 159 197 202 C198 242 156 263 119 226 L119 250"],
  P: ["M103 46 L103 250", "M103 46 C166 45 212 51 212 100 C212 147 168 155 103 155"],
  p: ["M119 157 L119 300 L119 179 C139 153 191 157 198 198 C206 241 166 259 119 224"]
};
const WRITING_CARDS = [
  { key: "D", name: "Dinosaurier" },
  { key: "C", name: "Computer" },
  { key: "B", name: "Baum" },
  { key: "P", name: "Pinguin" }
];
const SVG_NS = "http://www.w3.org/2000/svg";
const writing = {
  selected: WRITING_CARDS.map((card) => card.key),
  letters: [], index: 0, streak: 0, stroke: 0,
  paths: [], lengths: [], progress: 0, active: null, waiting: false
};

function writingElement(tag, attrs = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function renderWritingChoices() {
  const container = document.querySelector("#writingCards");
  WRITING_CARDS.forEach(({ key, name }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "writing-card-option";
    button.innerHTML = `<img src="writing-cards/${key.toLowerCase()}.jpg" alt=""><span><strong>${key} ${key.toLowerCase()}</strong><small>${name}</small></span>`;
    button.addEventListener("click", () => startWriting([key]));
    container.append(button);
  });
}

function startWriting(cards = writing.selected) {
  writing.selected = cards;
  writing.letters = cards.flatMap((letter) => [letter, letter.toLowerCase()]);
  writing.index = 0;
  state.game = "writing";
  showScreen("writing-play");
  renderWritingLetter();
}

function writingFeedback(message, kind = "") {
  const feedback = document.querySelector("#writingFeedback");
  feedback.textContent = message;
  feedback.className = `feedback-line ${kind}`;
}

function renderWritingLetter() {
  writing.streak = 0;
  writing.stroke = 0;
  writing.progress = 0;
  writing.waiting = false;
  const letter = writing.letters[writing.index];
  document.querySelector("#writingRoundLabel").textContent =
    `Buchstabe ${writing.index + 1} von ${writing.letters.length}`;
  document.querySelector("#writingProgress").style.width =
    `${100 * writing.index / writing.letters.length}%`;
  document.querySelector("#writingLetterLabel").textContent = letter;
  document.querySelector("#writingCardImage").src = `writing-cards/${letter.toLowerCase()}.jpg`;
  document.querySelector("#writingCardImage").alt = `Vorlage für ${letter.toUpperCase()} und ${letter.toLowerCase()}`;
  writingFeedback("Beginne am blauen Punkt und folge der Richtung.");
  renderWritingTrace();
}

function renderWritingTrace() {
  const letter = writing.letters[writing.index];
  const paths = WRITING_LETTERS[letter];
  const svg = document.querySelector("#writingSurface");
  svg.replaceChildren();
  svg.append(
    writingElement("rect", { x: 1, y: 1, width: 318, height: 318, rx: 18, fill: "#fffdf8" }),
    writingElement("rect", { x: 1, y: 158, width: 318, height: 92, fill: "#fff5d9" })
  );
  [46, 158, 250, 300].forEach((y, index) => {
    svg.append(writingElement("line", {
      x1: 1, y1: y, x2: 319, y2: y,
      stroke: index === 2 ? "#d9ae36" : "#e4cb85",
      "stroke-width": index === 2 ? 2.5 : 1.5
    }));
  });
  writing.paths = paths.map((d, index) => {
    const guide = writingElement("path", { d, class: index === writing.stroke ? "writing-guide is-active" : "writing-guide" });
    svg.append(guide);
    if (index < writing.stroke) svg.append(writingElement("path", { d, class: "writing-completed" }));
    return guide;
  });
  writing.lengths = writing.paths.map((path) => path.getTotalLength());
  const active = writing.paths[writing.stroke];
  const length = writing.lengths[writing.stroke];
  const ink = writingElement("path", { d: paths[writing.stroke], class: "writing-ink" });
  ink.style.strokeDasharray = `${writing.progress} ${length + 1}`;
  svg.append(ink);
  const start = active.getPointAtLength(0);
  const ahead = active.getPointAtLength(Math.min(22, length));
  const angle = Math.atan2(ahead.y - start.y, ahead.x - start.x);
  const arrowAt = active.getPointAtLength(Math.min(31, length));
  const arrow = writingElement("path", {
    d: "M -9 -6 L 0 0 L -9 6", fill: "none", stroke: "#2869aa",
    "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round",
    transform: `translate(${arrowAt.x} ${arrowAt.y}) rotate(${angle * 180 / Math.PI})`
  });
  svg.append(arrow, writingElement("circle", {
    cx: start.x, cy: start.y, r: 9, fill: "#176ac6", stroke: "white", "stroke-width": 3
  }));
  document.querySelector("#writingStreak").textContent = `${writing.streak}/3`;
  document.querySelector("#writingInstruction").textContent =
    paths.length > 1
      ? `Zug ${writing.stroke + 1} von ${paths.length}: Starte am Punkt und folge dem Pfeil.`
      : "Starte am blauen Punkt und folge dem Pfeil.";
  writing.ink = ink;
}

function writingPoint(event) {
  const svg = document.querySelector("#writingSurface");
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(svg.getScreenCTM().inverse());
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function writingDown(event) {
  if (writing.waiting || writing.active || document.querySelector("[data-screen='writing-play']").hidden) return;
  const point = writingPoint(event);
  const start = writing.paths[writing.stroke].getPointAtLength(0);
  if (distance(point, start) > 27) {
    writingFeedback("Setze den Finger auf den blauen Punkt.", "try");
    return;
  }
  event.preventDefault();
  document.querySelector("#writingSurface").setPointerCapture(event.pointerId);
  writing.active = { id: event.pointerId, last: point };
  writingFeedback("");
}

function writingMove(event) {
  if (!writing.active || writing.active.id !== event.pointerId) return;
  event.preventDefault();
  const point = writingPoint(event);
  const start = writing.active.last;
  const steps = Math.max(1, Math.ceil(distance(start, point) / 5));
  const path = writing.paths[writing.stroke];
  const length = writing.lengths[writing.stroke];
  let previous = start;
  for (let i = 1; i <= steps; i += 1) {
    const current = { x: start.x + (point.x - start.x) * i / steps, y: start.y + (point.y - start.y) * i / steps };
    let nearest = Infinity;
    let candidate = writing.progress;
    for (let at = writing.progress; at <= Math.min(length, writing.progress + 23); at += 2) {
      const gap = distance(current, path.getPointAtLength(at));
      if (gap < nearest) { nearest = gap; candidate = at; }
    }
    const endGap = distance(current, path.getPointAtLength(length));
    if (length - writing.progress <= 23 && endGap < nearest) { nearest = endGap; candidate = length; }
    if (nearest > 26) return failWriting();
    writing.progress = Math.min(candidate, writing.progress + distance(previous, current) * 1.7 + 1);
    previous = current;
  }
  writing.active.last = point;
  writing.ink.style.strokeDasharray = `${writing.progress} ${length + 1}`;
}

function writingUp(event) {
  if (!writing.active || writing.active.id !== event.pointerId) return;
  writingMove(event);
  if (!writing.active) return;
  writing.active = null;
  if (writing.lengths[writing.stroke] - writing.progress > 18) return failWriting();
  if (++writing.stroke < writing.paths.length) {
    writing.progress = 0;
    writingFeedback("Gut! Jetzt der nächste Zug.", "good");
    renderWritingTrace();
    return;
  }
  writing.waiting = true;
  writing.streak += 1;
  document.querySelector("#writingStreak").textContent = `${writing.streak}/3`;
  beep(true);
  if (writing.streak < 3) {
    writingFeedback(`Richtig! ${writing.streak} von 3 hintereinander.`, "good");
    later(() => {
      writing.stroke = 0;
      writing.progress = 0;
      writing.waiting = false;
      renderWritingTrace();
    }, 650);
    return;
  }
  addBonusPoints(1);
  writingFeedback("Dreimal richtig! Weiter zum nächsten Buchstaben.", "good");
  later(() => {
    writing.index += 1;
    if (writing.index < writing.letters.length) renderWritingLetter();
    else finishWriting();
  }, 950);
}

function failWriting() {
  writing.active = null;
  writing.streak = 0;
  writing.stroke = 0;
  writing.progress = 0;
  beep(false);
  renderWritingTrace();
  writingFeedback("Versuche es noch einmal vom Punkt aus. Die Dreierfolge beginnt neu.", "try");
}

function finishWriting() {
  document.querySelector("#resultGame").textContent = "Schreiben · Buchstaben nachspuren";
  document.querySelector("#resultTitle").textContent = "Prima geschrieben!";
  document.querySelector("#resultScore").textContent = writing.letters.length;
  document.querySelector("#resultTotal").textContent = `von ${writing.letters.length} Buchstaben geschafft`;
  ["speedSummary", "sentenceSummary", "chainSummary", "swingSummary"].forEach((id) => {
    document.getElementById(id).hidden = true;
  });
  showScreen("result");
}

document.querySelector("#writingAll").addEventListener("click", () => startWriting(WRITING_CARDS.map((card) => card.key)));
document.querySelector("#writingReset").addEventListener("click", () => {
  clearPendingTimers();
  writing.active = null;
  writing.streak = 0;
  writing.stroke = 0;
  writing.progress = 0;
  writing.waiting = false;
  renderWritingTrace();
  writingFeedback("Beginne noch einmal am blauen Punkt.");
});
const writingSurface = document.querySelector("#writingSurface");
writingSurface.addEventListener("pointerdown", writingDown);
writingSurface.addEventListener("pointermove", writingMove);
writingSurface.addEventListener("pointerup", writingUp);
writingSurface.addEventListener("pointercancel", () => {
  if (writing.active) failWriting();
});
renderWritingChoices();
