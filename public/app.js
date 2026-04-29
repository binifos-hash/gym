const days = [
  "lunedi",
  "martedi",
  "mercoledi",
  "giovedi",
  "venerdi",
  "sabato",
  "domenica"
];

const dayLabels = {
  lunedi: "Lunedì",
  martedi: "Martedì",
  mercoledi: "Mercoledì",
  giovedi: "Giovedì",
  venerdi: "Venerdì",
  sabato: "Sabato",
  domenica: "Domenica"
};

const dayLabelsShort = {
  lunedi: "LUN",
  martedi: "MAR",
  mercoledi: "MER",
  giovedi: "GIO",
  venerdi: "VEN",
  sabato: "SAB",
  domenica: "DOM"
};

let state = null;
let openCard = null;

const weekContainerEl = document.getElementById("weekContainer");
const freeWeightListEl = document.getElementById("freeWeightList");
const toorxListEl = document.getElementById("toorxList");
const editorDaySelectEl = document.getElementById("editorDaySelect");
const libraryPickerEl = document.getElementById("libraryPicker");
const dayExerciseListEl = document.getElementById("dayExerciseList");
const saveWeekBtn = document.getElementById("saveWeekBtn");
const weekNumEl = document.getElementById("weekNum");
const dayCountEl = document.getElementById("dayCount");
const exerciseCountEl = document.getElementById("exerciseCount");

function getMonday(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);

  return d;
}

function formatDate(date) {
  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit"
  });
}

function getWeekContext() {
  const monday = getMonday(new Date());
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    monday,
    sunday,
    weekKey: monday.toISOString().slice(0, 10)
  };
}

async function loadState() {
  const res = await fetch("/api/state");
  state = await res.json();
}

async function saveWeekTemplate() {
  const res = await fetch("/api/week-template", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weekTemplate: state.weekTemplate })
  });

  if (!res.ok) {
    alert("Errore nel salvataggio settimana");
    return;
  }

  alert("Settimana salvata con successo");
}

async function saveExerciseProgress(day, exercise, completed) {
  const { weekKey } = getWeekContext();

  const res = await fetch("/api/progress", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weekKey, day, exercise, completed })
  });

  if (!res.ok) {
    alert("Errore nel salvataggio progress");
  }
}

function updateStats() {
  const totalExercises = days.reduce((sum, day) => {
    return sum + (state.weekTemplate[day] || []).length;
  }, 0);

  weekNumEl.textContent = getWeekNum();
  dayCountEl.textContent = days.filter(d => (state.weekTemplate[d] || []).length > 0).length;
  exerciseCountEl.textContent = totalExercises;
}

function getWeekNum() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek) + 1;
}

function renderLibrarySection() {
  freeWeightListEl.innerHTML = "";
  toorxListEl.innerHTML = "";

  state.exerciseLibrary.bench_dumbbell_barbell.forEach((exercise) => {
    const li = document.createElement("li");
    li.textContent = exercise;
    freeWeightListEl.appendChild(li);
  });

  state.exerciseLibrary.toorx_msx50.forEach((exercise) => {
    const li = document.createElement("li");
    li.textContent = exercise;
    toorxListEl.appendChild(li);
  });
}

function renderWeekCards() {
  const { monday, weekKey } = getWeekContext();
  weekContainerEl.innerHTML = "";

  days.forEach((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    const dayExercises = state.weekTemplate[day] || [];
    const dayProgress = (state.progress[weekKey] && state.progress[weekKey][day]) || {};
    const isOpen = openCard === day;

    const card = document.createElement("div");
    card.className = `day-card ${isOpen ? "open" : ""}`;

    const header = document.createElement("div");
    header.className = "day-header";
    header.addEventListener("click", () => {
      openCard = openCard === day ? null : day;
      renderWeekCards();
    });

    const dayLeft = document.createElement("div");
    dayLeft.className = "day-left";

    const dayNum = document.createElement("div");
    dayNum.className = "day-num";
    dayNum.textContent = dayLabelsShort[day];

    const dayInfo = document.createElement("div");

    const dayTitle = document.createElement("div");
    dayTitle.className = "day-title";
    dayTitle.textContent = dayLabels[day];

    const dayFocus = document.createElement("div");
    dayFocus.className = "day-focus";
    dayFocus.textContent = dayExercises.length > 0 ? `${dayExercises.length} esercizi` : "riposo";

    dayInfo.appendChild(dayTitle);
    dayInfo.appendChild(dayFocus);
    dayLeft.appendChild(dayNum);
    dayLeft.appendChild(dayInfo);

    const rightContainer = document.createElement("div");
    rightContainer.style.display = "flex";
    rightContainer.style.alignItems = "center";
    rightContainer.style.gap = "10px";

    if (dayExercises.length > 0) {
      const badge = document.createElement("span");
      badge.className = "day-badge badge-upper";
      badge.textContent = "ALLENAMENTO";
      rightContainer.appendChild(badge);
    }

    const chevron = document.createElement("span");
    chevron.className = "chevron";
    chevron.textContent = "▾";
    rightContainer.appendChild(chevron);

    header.appendChild(dayLeft);
    header.appendChild(rightContainer);

    const body = document.createElement("div");
    body.className = "day-body";

    const exercises = document.createElement("div");
    exercises.className = "exercises";

    dayExercises.forEach((exercise) => {
      const done = !!dayProgress[exercise];
      const ex = document.createElement("div");
      ex.className = "ex";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "ex-check";
      checkbox.checked = done;

      const exContent = document.createElement("div");

      const exName = document.createElement("div");
      exName.className = "ex-name";
      exName.textContent = exercise;

      exContent.appendChild(exName);

      const sets = document.createElement("div");
      sets.className = "ex-sets";

      const setsMain = document.createElement("div");
      setsMain.className = "sets-main";
      setsMain.textContent = "3×10";

      const setsLabel = document.createElement("div");
      setsLabel.className = "sets-label";
      setsLabel.textContent = "serie×rip.";

      sets.appendChild(setsMain);
      sets.appendChild(setsLabel);

      checkbox.addEventListener("change", async () => {
        if (!state.progress[weekKey]) {
          state.progress[weekKey] = {};
        }
        if (!state.progress[weekKey][day]) {
          state.progress[weekKey][day] = {};
        }
        state.progress[weekKey][day][exercise] = checkbox.checked;
        await saveExerciseProgress(day, exercise, checkbox.checked);
        renderWeekCards();
      });

      ex.appendChild(checkbox);
      ex.appendChild(exContent);
      ex.appendChild(sets);
      exercises.appendChild(ex);
    });

    if (dayExercises.length === 0) {
      const noExercises = document.createElement("div");
      noExercises.style.padding = "12px 16px";
      noExercises.style.color = "var(--muted)";
      noExercises.style.fontSize = "12px";
      noExercises.textContent = "Nessun esercizio pianificato. Aggiungine uno nella sezione modifica.";
      exercises.appendChild(noExercises);
    }

    body.appendChild(exercises);
    card.appendChild(header);
    card.appendChild(body);
    weekContainerEl.appendChild(card);
  });
}

function renderEditorDaySelect() {
  editorDaySelectEl.innerHTML = "";

  days.forEach((day) => {
    const option = document.createElement("option");
    option.value = day;
    option.textContent = day.charAt(0).toUpperCase() + day.slice(1);
    editorDaySelectEl.appendChild(option);
  });
}

function getAllExercises() {
  return [
    ...state.exerciseLibrary.bench_dumbbell_barbell,
    ...state.exerciseLibrary.toorx_msx50
  ];
}

function renderEditor() {
  const currentDay = editorDaySelectEl.value || days[0];
  const daySet = new Set(state.weekTemplate[currentDay] || []);
  const allExercises = getAllExercises();

  libraryPickerEl.innerHTML = "";
  allExercises.forEach((exercise) => {
    const item = document.createElement("div");
    item.className = "picker-item";

    const span = document.createElement("span");
    span.textContent = exercise;

    const addBtn = document.createElement("button");
    addBtn.textContent = daySet.has(exercise) ? "Aggiunto" : "+ Aggiungi";
    addBtn.disabled = daySet.has(exercise);

    addBtn.addEventListener("click", () => {
      state.weekTemplate[currentDay].push(exercise);
      renderEditor();
      renderWeekCards();
      updateStats();
    });

    item.appendChild(span);
    item.appendChild(addBtn);
    libraryPickerEl.appendChild(item);
  });

  dayExerciseListEl.innerHTML = "";
  (state.weekTemplate[currentDay] || []).forEach((exercise) => {
    const li = document.createElement("li");
    
    const span = document.createElement("span");
    span.textContent = exercise;
    li.appendChild(span);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Rimuovi";

    removeBtn.addEventListener("click", () => {
      state.weekTemplate[currentDay] = state.weekTemplate[currentDay].filter(
        (item) => item !== exercise
      );
      renderEditor();
      renderWeekCards();
      updateStats();
    });

    li.appendChild(removeBtn);
    dayExerciseListEl.appendChild(li);
  });
}

async function init() {
  await loadState();

  updateStats();
  renderLibrarySection();
  renderEditorDaySelect();
  renderWeekCards();
  renderEditor();

  editorDaySelectEl.addEventListener("change", renderEditor);
  saveWeekBtn.addEventListener("click", async () => {
    await saveWeekTemplate();
    updateStats();
  });
}

init();
