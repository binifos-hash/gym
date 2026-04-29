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
  lunedi: "Lunedi",
  martedi: "Martedi",
  mercoledi: "Mercoledi",
  giovedi: "Giovedi",
  venerdi: "Venerdi",
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
const weekRangeEl = document.getElementById("weekRange");

const profileNameEl = document.getElementById("profileName");
const addMetricBtn = document.getElementById("addMetricBtn");
const metricForm = document.getElementById("metricForm");
const metricDateEl = document.getElementById("metricDate");
const metricWeightEl = document.getElementById("metricWeight");
const metricMuscleEl = document.getElementById("metricMuscle");
const metricsChartEl = document.getElementById("metricsChart");
const diaryForm = document.getElementById("diaryForm");
const diaryInputEl = document.getElementById("diaryInput");
const diaryListEl = document.getElementById("diaryList");

const navButtons = [...document.querySelectorAll(".nav-btn")];
const tabPanels = [...document.querySelectorAll(".tab-panel")];

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

function getWeekNum() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now - start) / 86400000) + 1;
  return Math.ceil(dayOfYear / 7);
}

function ensurePersonalDefaults() {
  if (!state.personal || typeof state.personal !== "object") {
    state.personal = {};
  }

  if (!state.personal.profileName) {
    state.personal.profileName = "Paolo Bini";
  }

  if (!Array.isArray(state.personal.metrics)) {
    state.personal.metrics = [];
  }

  if (!Array.isArray(state.personal.diary)) {
    state.personal.diary = [];
  }
}

async function loadState() {
  const res = await fetch("/api/state");
  state = await res.json();
  ensurePersonalDefaults();
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

async function savePersonalState() {
  const res = await fetch("/api/personal", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personal: state.personal })
  });

  if (!res.ok) {
    alert("Errore nel salvataggio sezione personale");
  }
}

function updateStats() {
  const totalExercises = days.reduce((sum, day) => sum + (state.weekTemplate[day] || []).length, 0);
  const { monday, sunday } = getWeekContext();

  weekNumEl.textContent = getWeekNum();
  dayCountEl.textContent = days.filter((d) => (state.weekTemplate[d] || []).length > 0).length;
  exerciseCountEl.textContent = totalExercises;
  weekRangeEl.textContent = `${formatDate(monday)} - ${formatDate(sunday)}`;
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
    dayTitle.textContent = `${dayLabels[day]} ${formatDate(date)}`;

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
      badge.className = "day-badge";
      badge.textContent = "Allenamento";
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

      const exName = document.createElement("div");
      exName.className = "ex-name";
      exName.textContent = exercise;

      const sets = document.createElement("div");
      sets.className = "ex-sets";
      sets.innerHTML = '<div class="sets-main">3x10</div><div class="sets-label">serie x rip.</div>';

      checkbox.addEventListener("change", async () => {
        if (!state.progress[weekKey]) {
          state.progress[weekKey] = {};
        }
        if (!state.progress[weekKey][day]) {
          state.progress[weekKey][day] = {};
        }

        state.progress[weekKey][day][exercise] = checkbox.checked;
        await saveExerciseProgress(day, exercise, checkbox.checked);
      });

      ex.appendChild(checkbox);
      ex.appendChild(exName);
      ex.appendChild(sets);
      exercises.appendChild(ex);
    });

    if (!dayExercises.length) {
      const noExercises = document.createElement("div");
      noExercises.className = "ex";
      noExercises.textContent = "Nessun esercizio pianificato per questo giorno.";
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

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Rimuovi";

    removeBtn.addEventListener("click", () => {
      state.weekTemplate[currentDay] = state.weekTemplate[currentDay].filter((item) => item !== exercise);
      renderEditor();
      renderWeekCards();
      updateStats();
    });

    li.appendChild(span);
    li.appendChild(removeBtn);
    dayExerciseListEl.appendChild(li);
  });
}

function renderPersonal() {
  profileNameEl.textContent = state.personal.profileName;
  renderMetricsChart();
  renderDiary();
}

function renderMetricsChart() {
  const canvas = metricsChartEl;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#131313";
  ctx.fillRect(0, 0, width, height);

  const metrics = [...state.personal.metrics].sort((a, b) => a.date.localeCompare(b.date));

  if (metrics.length < 2) {
    ctx.fillStyle = "#888";
    ctx.font = "14px DM Sans";
    ctx.fillText("Aggiungi almeno 2 misurazioni per visualizzare il grafico", 24, 40);
    return;
  }

  const padding = 36;
  const values = metrics.flatMap((m) => [m.weight, m.muscleMass]);
  const minY = Math.min(...values) - 1;
  const maxY = Math.max(...values) + 1;

  function projectX(index) {
    const span = metrics.length - 1;
    return padding + (index * (width - padding * 2)) / span;
  }

  function projectY(value) {
    const ratio = (value - minY) / (maxY - minY || 1);
    return height - padding - ratio * (height - padding * 2);
  }

  ctx.strokeStyle = "#2a2a2a";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding + (i * (height - padding * 2)) / 4;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  function drawSeries(key, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    metrics.forEach((metric, index) => {
      const x = projectX(index);
      const y = projectY(metric[key]);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    metrics.forEach((metric, index) => {
      const x = projectX(index);
      const y = projectY(metric[key]);
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawSeries("weight", "#e8ff47");
  drawSeries("muscleMass", "#ff5c35");

  ctx.font = "11px DM Sans";
  ctx.fillStyle = "#e8ff47";
  ctx.fillText("Peso", width - 140, 20);
  ctx.fillStyle = "#ff5c35";
  ctx.fillText("Massa muscolare", width - 90, 20);
}

function renderDiary() {
  diaryListEl.innerHTML = "";

  const diary = [...state.personal.diary].sort((a, b) => b.date.localeCompare(a.date));
  if (!diary.length) {
    diaryListEl.innerHTML = '<div class="diary-entry"><div class="diary-text">Nessuna nota ancora.</div></div>';
    return;
  }

  diary.forEach((entry) => {
    const card = document.createElement("div");
    card.className = "diary-entry";

    const date = document.createElement("div");
    date.className = "diary-date";
    date.textContent = entry.date;

    const text = document.createElement("div");
    text.className = "diary-text";
    text.textContent = entry.text;

    card.appendChild(date);
    card.appendChild(text);
    diaryListEl.appendChild(card);
  });
}

function setActiveTab(tabId) {
  tabPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });

  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
}

function bindEvents() {
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });

  editorDaySelectEl.addEventListener("change", renderEditor);

  saveWeekBtn.addEventListener("click", async () => {
    await saveWeekTemplate();
    updateStats();
  });

  addMetricBtn.addEventListener("click", () => {
    metricForm.classList.toggle("hidden");
  });

  metricForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const metric = {
      date: metricDateEl.value,
      weight: Number(metricWeightEl.value),
      muscleMass: Number(metricMuscleEl.value)
    };

    if (!metric.date || Number.isNaN(metric.weight) || Number.isNaN(metric.muscleMass)) {
      return;
    }

    state.personal.metrics.push(metric);
    state.personal.metrics.sort((a, b) => a.date.localeCompare(b.date));

    await savePersonalState();
    metricForm.reset();
    metricForm.classList.add("hidden");
    renderMetricsChart();
  });

  diaryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = diaryInputEl.value.trim();
    if (!text) {
      return;
    }

    state.personal.diary.push({
      date: new Date().toISOString().slice(0, 10),
      text
    });

    await savePersonalState();
    diaryInputEl.value = "";
    renderDiary();
  });
}

async function init() {
  await loadState();

  openCard = days[(new Date().getDay() + 6) % 7];

  updateStats();
  renderLibrarySection();
  renderEditorDaySelect();
  renderWeekCards();
  renderEditor();
  renderPersonal();
  bindEvents();
  setActiveTab("tab-week");
}

init();
