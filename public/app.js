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

const trainingTypeOptions = [
  "Spinta",
  "Trazione",
  "Gambe",
  "Core",
  "Cardio",
  "Mobilita",
  "Full Body"
];

let state = null;
let openCard = null;

const weekContainerEl = document.getElementById("weekContainer");
const freeWeightListEl = document.getElementById("freeWeightList");
const toorxListEl = document.getElementById("toorxList");
const editorDaySelectEl = document.getElementById("editorDaySelect");
const editorTypeFilterEl = document.getElementById("editorTypeFilter");
const editorSearchEl = document.getElementById("editorSearch");
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
const metricsChartScrollEl = document.getElementById("metricsChartScroll");
const diaryForm = document.getElementById("diaryForm");
const diaryInputEl = document.getElementById("diaryInput");
const diaryListEl = document.getElementById("diaryList");

const navButtons = [...document.querySelectorAll(".nav-btn")];
const tabPanels = [...document.querySelectorAll(".tab-panel")];
const mainHeaderEl = document.querySelector(".main-header");

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

function inferExerciseMeta(name) {
  const lower = (name || "").toLowerCase();

  const cardioPattern = /(corsa|bike|cyclette|ellittica|cardio|jump|burpee|salto)/;
  const mobilityPattern = /(mobilita|stretch|allung|yoga)/;
  const corePattern = /(plank|crunch|addom|sit up|leg raise|hollow|core)/;
  const legsPattern = /(squat|affondi|leg |polpacci|calf|hip thrust|stacco rumeno)/;
  const pushPattern = /(panca|chest|spinte|military|shoulder press|dip|tricip|push)/;
  const pullPattern = /(rematore|lat|pulldown|pulley|trazioni|curl|face pull|stacco|row)/;
  const bodyweightPattern = /(plank|crunch|sit up|burpee|mountain climber|jumping jack|stretch)/;

  if (cardioPattern.test(lower)) {
    return { category: "Condizionamento", trainingType: "Cardio", supportsWeight: false };
  }

  if (mobilityPattern.test(lower)) {
    return { category: "Recupero", trainingType: "Mobilita", supportsWeight: false };
  }

  if (corePattern.test(lower)) {
    return { category: "Forza", trainingType: "Core", supportsWeight: !bodyweightPattern.test(lower) };
  }

  if (legsPattern.test(lower)) {
    return { category: "Forza", trainingType: "Gambe", supportsWeight: true };
  }

  if (pushPattern.test(lower)) {
    return { category: "Forza", trainingType: "Spinta", supportsWeight: true };
  }

  if (pullPattern.test(lower)) {
    return { category: "Forza", trainingType: "Trazione", supportsWeight: true };
  }

  return { category: "Forza", trainingType: "Full Body", supportsWeight: !bodyweightPattern.test(lower) };
}

function normalizeExerciseEntry(entry) {
  const name = typeof entry === "string" ? entry : (entry && entry.name) || "";
  if (!name) {
    return null;
  }

  const inferred = inferExerciseMeta(name);
  const isObj = entry && typeof entry === "object";
  const supportsWeight = isObj && typeof entry.supportsWeight === "boolean"
    ? entry.supportsWeight
    : inferred.supportsWeight;

  let weight = null;
  if (supportsWeight && isObj && entry.weight !== "" && entry.weight !== undefined && entry.weight !== null) {
    const parsedWeight = Number(entry.weight);
    weight = Number.isNaN(parsedWeight) ? null : parsedWeight;
  }

  return {
    name,
    category: (isObj && entry.category) || inferred.category,
    trainingType: (isObj && entry.trainingType) || inferred.trainingType,
    supportsWeight,
    weight
  };
}

function normalizeWeekTemplate() {
  if (!state.weekTemplate || typeof state.weekTemplate !== "object") {
    state.weekTemplate = {};
  }

  days.forEach((day) => {
    const entries = Array.isArray(state.weekTemplate[day]) ? state.weekTemplate[day] : [];
    state.weekTemplate[day] = entries
      .map(normalizeExerciseEntry)
      .filter(Boolean);
  });
}

function getExerciseProgressKey(exercise) {
  const base = `${exercise.name}|${exercise.trainingType}`;
  if (exercise.supportsWeight && typeof exercise.weight === "number") {
    return `${base}|${exercise.weight}`;
  }
  return base;
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
  normalizeWeekTemplate();
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
  if (!weekNumEl || !dayCountEl || !exerciseCountEl || !weekRangeEl) {
    return;
  }

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
    const meta = inferExerciseMeta(exercise);
    const li = document.createElement("li");
    li.innerHTML = `<strong>${exercise}</strong><span>${meta.trainingType}${meta.supportsWeight ? " · con carico" : " · corpo libero"}</span>`;
    freeWeightListEl.appendChild(li);
  });

  state.exerciseLibrary.toorx_msx50.forEach((exercise) => {
    const meta = inferExerciseMeta(exercise);
    const li = document.createElement("li");
    li.innerHTML = `<strong>${exercise}</strong><span>${meta.trainingType}${meta.supportsWeight ? " · con carico" : " · corpo libero"}</span>`;
    toorxListEl.appendChild(li);
  });
}

function renderWeekCards() {
  const { monday, weekKey } = getWeekContext();
  weekContainerEl.innerHTML = "";

  days.forEach((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    const dayExercises = (state.weekTemplate[day] || []).map(normalizeExerciseEntry).filter(Boolean);
    state.weekTemplate[day] = dayExercises;
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
      const progressKey = getExerciseProgressKey(exercise);
      const done = !!dayProgress[progressKey] || !!dayProgress[exercise.name];

      const ex = document.createElement("div");
      ex.className = "ex";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "ex-check";
      checkbox.checked = done;

      const exName = document.createElement("div");
      exName.className = "ex-name";
      exName.textContent = exercise.name;

      const exMeta = document.createElement("div");
      exMeta.className = "ex-meta";
      exMeta.textContent = `${exercise.trainingType} · ${exercise.category}${exercise.supportsWeight && typeof exercise.weight === "number" ? ` · ${exercise.weight} kg` : ""}`;

      const exInfo = document.createElement("div");
      exInfo.className = "ex-info";
      exInfo.appendChild(exName);
      exInfo.appendChild(exMeta);

      const sets = document.createElement("div");
      sets.className = "ex-sets";
      sets.innerHTML = exercise.supportsWeight && typeof exercise.weight === "number"
        ? `<div class="sets-main">${exercise.weight} kg</div><div class="sets-label">carico</div>`
        : '<div class="sets-main">3x10</div><div class="sets-label">serie x rip.</div>';

      checkbox.addEventListener("change", async () => {
        if (!state.progress[weekKey]) {
          state.progress[weekKey] = {};
        }
        if (!state.progress[weekKey][day]) {
          state.progress[weekKey][day] = {};
        }

        state.progress[weekKey][day][progressKey] = checkbox.checked;
        await saveExerciseProgress(day, progressKey, checkbox.checked);
      });

      ex.appendChild(checkbox);
      ex.appendChild(exInfo);
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
  const freeWeights = state.exerciseLibrary.bench_dumbbell_barbell.map((name) => ({
    ...normalizeExerciseEntry(name),
    source: "Pesi liberi"
  }));

  const machine = state.exerciseLibrary.toorx_msx50.map((name) => ({
    ...normalizeExerciseEntry(name),
    source: "Toorx MSX-50"
  }));

  return [...freeWeights, ...machine];
}

function renderEditor() {
  const currentDay = editorDaySelectEl.value || days[0];
  const plannedExercises = (state.weekTemplate[currentDay] || []).map(normalizeExerciseEntry).filter(Boolean);
  state.weekTemplate[currentDay] = plannedExercises;
  const daySet = new Set(plannedExercises.map((exercise) => exercise.name));
  const allExercises = getAllExercises();
  const selectedType = editorTypeFilterEl ? editorTypeFilterEl.value : "all";
  const searchText = editorSearchEl ? editorSearchEl.value.trim().toLowerCase() : "";

  const filteredExercises = allExercises.filter((exercise) => {
    const matchesType = selectedType === "all" || exercise.trainingType === selectedType;
    const matchesSearch = !searchText || exercise.name.toLowerCase().includes(searchText);
    return matchesType && matchesSearch;
  });

  libraryPickerEl.innerHTML = "";
  filteredExercises.forEach((exercise) => {
    const item = document.createElement("div");
    item.className = "picker-item";

    const info = document.createElement("div");
    info.className = "picker-info";

    const title = document.createElement("span");
    title.className = "picker-title";
    title.textContent = exercise.name;

    const meta = document.createElement("span");
    meta.className = "picker-meta";
    meta.textContent = `${exercise.trainingType} · ${exercise.source}${exercise.supportsWeight ? " · con carico" : " · corpo libero"}`;

    info.appendChild(title);
    info.appendChild(meta);

    const addBtn = document.createElement("button");
    addBtn.textContent = daySet.has(exercise.name) ? "Aggiunto" : "+ Aggiungi";
    addBtn.disabled = daySet.has(exercise.name);

    addBtn.addEventListener("click", () => {
      state.weekTemplate[currentDay].push({
        name: exercise.name,
        category: exercise.category,
        trainingType: exercise.trainingType,
        supportsWeight: exercise.supportsWeight,
        weight: null
      });
      renderEditor();
      renderWeekCards();
      updateStats();
    });

    item.appendChild(info);
    item.appendChild(addBtn);
    libraryPickerEl.appendChild(item);
  });

  if (!filteredExercises.length) {
    libraryPickerEl.innerHTML = '<div class="picker-empty">Nessun esercizio trovato con questi filtri.</div>';
  }

  dayExerciseListEl.innerHTML = "";
  plannedExercises.forEach((exercise, exerciseIndex) => {
    const li = document.createElement("li");

    const rowTop = document.createElement("div");
    rowTop.className = "day-ex-top";

    const name = document.createElement("span");
    name.className = "day-ex-name";
    name.textContent = exercise.name;

    const meta = document.createElement("span");
    meta.className = "day-ex-meta";
    meta.textContent = `${exercise.category} · ${exercise.supportsWeight ? "con carico" : "corpo libero"}`;

    rowTop.appendChild(name);
    rowTop.appendChild(meta);

    const controls = document.createElement("div");
    controls.className = "day-ex-controls";

    const typeSelect = document.createElement("select");
    trainingTypeOptions.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      option.selected = exercise.trainingType === type;
      typeSelect.appendChild(option);
    });

    typeSelect.addEventListener("change", () => {
      exercise.trainingType = typeSelect.value;
      renderWeekCards();
    });

    controls.appendChild(typeSelect);

    if (exercise.supportsWeight) {
      const weightInput = document.createElement("input");
      weightInput.type = "number";
      weightInput.step = "0.5";
      weightInput.min = "0";
      weightInput.placeholder = "Peso kg";
      weightInput.value = typeof exercise.weight === "number" ? String(exercise.weight) : "";

      weightInput.addEventListener("input", () => {
        if (weightInput.value === "") {
          exercise.weight = null;
        } else {
          const value = Number(weightInput.value);
          exercise.weight = Number.isNaN(value) ? null : value;
        }
        renderWeekCards();
      });

      controls.appendChild(weightInput);
    }

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Rimuovi";

    removeBtn.addEventListener("click", () => {
      state.weekTemplate[currentDay] = state.weekTemplate[currentDay].filter((_, index) => index !== exerciseIndex);
      renderEditor();
      renderWeekCards();
      updateStats();
    });

    controls.appendChild(removeBtn);

    li.appendChild(rowTop);
    li.appendChild(controls);
    dayExerciseListEl.appendChild(li);
  });

  if (!plannedExercises.length) {
    dayExerciseListEl.innerHTML = '<li class="day-ex-empty">Nessun esercizio nel giorno selezionato.</li>';
  }
}

function renderPersonal() {
  profileNameEl.textContent = state.personal.profileName;
  renderMetricsChart();
  renderDiary();
}

function renderMetricsChart() {
  const canvas = metricsChartEl;
  const ctx = canvas.getContext("2d");
  const metrics = [...state.personal.metrics].sort((a, b) => a.date.localeCompare(b.date));

  const viewportWidth = (metricsChartScrollEl && metricsChartScrollEl.clientWidth) || 860;
  const spacing = 84;
  const padding = 44;
  const height = 300;
  const width = Math.max(viewportWidth, (Math.max(metrics.length, 2) - 1) * spacing + padding * 2);

  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  const chartBg = ctx.createLinearGradient(0, 0, 0, height);
  chartBg.addColorStop(0, "#171717");
  chartBg.addColorStop(1, "#0f0f0f");
  ctx.fillStyle = chartBg;
  ctx.fillRect(0, 0, width, height);

  if (metrics.length < 2) {
    ctx.fillStyle = "#8d8d8d";
    ctx.font = "14px DM Sans";
    ctx.fillText("Aggiungi almeno 2 misurazioni per visualizzare il grafico", 24, 40);
    return;
  }

  const parsedMetrics = metrics.map((metric) => ({
    ...metric,
    dateObj: new Date(`${metric.date}T00:00:00`)
  }));

  const values = metrics.flatMap((m) => [m.weight, m.muscleMass]);
  const minY = Math.floor(Math.min(...values) - 1);
  const maxY = Math.ceil(Math.max(...values) + 1);

  function projectX(index) {
    const span = parsedMetrics.length - 1;
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

    const value = (maxY - ((maxY - minY) * i) / 4).toFixed(1);
    ctx.fillStyle = "#737373";
    ctx.font = "10px DM Sans";
    ctx.fillText(value, 8, y + 3);
  }

  function formatShortDate(dateObj) {
    return dateObj.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" });
  }

  const labelStep = Math.max(1, Math.ceil(parsedMetrics.length / 8));
  parsedMetrics.forEach((metric, index) => {
    if (index % labelStep !== 0 && index !== parsedMetrics.length - 1) {
      return;
    }

    const x = projectX(index);
    ctx.fillStyle = "#707070";
    ctx.font = "10px DM Sans";
    ctx.textAlign = "center";
    ctx.fillText(formatShortDate(metric.dateObj), x, height - 14);
  });

  ctx.textAlign = "left";

  function drawArea(key, colorStart, colorEnd) {
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);

    ctx.beginPath();
    parsedMetrics.forEach((metric, index) => {
      const x = projectX(index);
      const y = projectY(metric[key]);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(projectX(parsedMetrics.length - 1), height - padding);
    ctx.lineTo(projectX(0), height - padding);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();
  }

  drawArea("weight", "rgba(232, 255, 71, 0.16)", "rgba(232, 255, 71, 0.02)");
  drawArea("muscleMass", "rgba(255, 92, 53, 0.14)", "rgba(255, 92, 53, 0.02)");

  function drawSeries(key, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    parsedMetrics.forEach((metric, index) => {
      const x = projectX(index);
      const y = projectY(metric[key]);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    parsedMetrics.forEach((metric, index) => {
      const x = projectX(index);
      const y = projectY(metric[key]);
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawSeries("weight", "#e8ff47");
  drawSeries("muscleMass", "#ff5c35");

  ctx.font = "11px DM Sans";
  ctx.fillStyle = "#e8ff47";
  ctx.fillText("Peso", width - 140, 20);
  ctx.fillStyle = "#ff5c35";
  ctx.fillText("Massa muscolare", width - 95, 20);

  if (metricsChartScrollEl && parsedMetrics.length) {
    const latestDate = parsedMetrics[parsedMetrics.length - 1].dateObj;
    const monthStart = new Date(latestDate);
    monthStart.setDate(monthStart.getDate() - 30);

    let firstVisibleIndex = parsedMetrics.findIndex((metric) => metric.dateObj >= monthStart);
    if (firstVisibleIndex < 0) {
      firstVisibleIndex = Math.max(0, parsedMetrics.length - 6);
    }

    const targetX = projectX(firstVisibleIndex);
    const targetScroll = Math.max(0, targetX - padding);
    metricsChartScrollEl.scrollLeft = targetScroll;
  }
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

  if (mainHeaderEl) {
    mainHeaderEl.style.display = tabId === "tab-week" ? "block" : "none";
  }
}

function bindEvents() {
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });

  editorDaySelectEl.addEventListener("change", renderEditor);

  if (editorTypeFilterEl) {
    editorTypeFilterEl.addEventListener("change", renderEditor);
  }

  if (editorSearchEl) {
    editorSearchEl.addEventListener("input", renderEditor);
  }

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
