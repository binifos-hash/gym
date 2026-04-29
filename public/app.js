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
  lunedi: "Lun",
  martedi: "Mar",
  mercoledi: "Mer",
  giovedi: "Gio",
  venerdi: "Ven",
  sabato: "Sab",
  domenica: "Dom"
};

let state = null;
let selectedDay = null;

const weekRangeEl = document.getElementById("weekRange");
const dayButtonsEl = document.getElementById("dayButtons");
const dailyExercisesEl = document.getElementById("dailyExercises");
const freeWeightListEl = document.getElementById("freeWeightList");
const toorxListEl = document.getElementById("toorxList");
const editorDaySelectEl = document.getElementById("editorDaySelect");
const libraryPickerEl = document.getElementById("libraryPicker");
const dayExerciseListEl = document.getElementById("dayExerciseList");
const saveWeekBtn = document.getElementById("saveWeekBtn");

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

function renderWeekHeader() {
  const { monday, sunday } = getWeekContext();
  weekRangeEl.textContent = `Settimana corrente: ${formatDate(monday)} - ${formatDate(sunday)}`;
}

function renderDayButtons() {
  const { monday } = getWeekContext();
  dayButtonsEl.innerHTML = "";

  days.forEach((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    const button = document.createElement("button");
    button.className = `day-btn ${selectedDay === day ? "active" : ""}`;
    button.innerHTML = `${dayLabels[day]}<br>${formatDate(date)}`;

    button.addEventListener("click", () => {
      selectedDay = day;
      renderDayButtons();
      renderDailyExercises();
    });

    dayButtonsEl.appendChild(button);
  });
}

function renderDailyExercises() {
  if (!selectedDay) {
    dailyExercisesEl.innerHTML = "";
    return;
  }

  const { weekKey } = getWeekContext();
  const dayExercises = state.weekTemplate[selectedDay] || [];
  const dayProgress = (state.progress[weekKey] && state.progress[weekKey][selectedDay]) || {};

  if (!dayExercises.length) {
    dailyExercisesEl.innerHTML = "<p>Nessun esercizio pianificato.</p>";
    return;
  }

  dailyExercisesEl.innerHTML = "";

  dayExercises.forEach((exercise) => {
    const done = !!dayProgress[exercise];
    const row = document.createElement("div");
    row.className = `exercise-row ${done ? "done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = done;

    const label = document.createElement("label");
    label.textContent = exercise;

    checkbox.addEventListener("change", async () => {
      if (!state.progress[weekKey]) {
        state.progress[weekKey] = {};
      }

      if (!state.progress[weekKey][selectedDay]) {
        state.progress[weekKey][selectedDay] = {};
      }

      state.progress[weekKey][selectedDay][exercise] = checkbox.checked;
      row.className = `exercise-row ${checkbox.checked ? "done" : ""}`;

      await saveExerciseProgress(selectedDay, exercise, checkbox.checked);
    });

    row.appendChild(checkbox);
    row.appendChild(label);
    dailyExercisesEl.appendChild(row);
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
      if (selectedDay === currentDay) {
        renderDailyExercises();
      }
    });

    item.appendChild(span);
    item.appendChild(addBtn);
    libraryPickerEl.appendChild(item);
  });

  dayExerciseListEl.innerHTML = "";
  (state.weekTemplate[currentDay] || []).forEach((exercise) => {
    const li = document.createElement("li");
    li.textContent = exercise;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Rimuovi";

    removeBtn.addEventListener("click", () => {
      state.weekTemplate[currentDay] = state.weekTemplate[currentDay].filter(
        (item) => item !== exercise
      );
      renderEditor();
      if (selectedDay === currentDay) {
        renderDailyExercises();
      }
    });

    li.appendChild(document.createTextNode(" "));
    li.appendChild(removeBtn);
    dayExerciseListEl.appendChild(li);
  });
}

function getTodayDayKey() {
  const index = (new Date().getDay() + 6) % 7;
  return days[index];
}

async function init() {
  await loadState();

  selectedDay = getTodayDayKey();

  renderWeekHeader();
  renderLibrarySection();
  renderEditorDaySelect();
  renderDayButtons();
  renderDailyExercises();
  renderEditor();

  editorDaySelectEl.addEventListener("change", renderEditor);
  saveWeekBtn.addEventListener("click", saveWeekTemplate);
}

init();
