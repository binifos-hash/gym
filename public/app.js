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

const WORKOUT_SYNC_PAST_DAYS = 90;
const WORKOUT_SYNC_FUTURE_DAYS = 180;

let state = null;
let workoutDetailDate = null;
let calendarMonthCursor = startOfMonth(new Date());
let timerIntervalId = null;

const weekContainerEl = document.getElementById("weekContainer");
const weekOverviewEl = document.getElementById("weekOverview");
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

const openCalendarBtn = document.getElementById("openCalendarBtn");
const backToWeekBtn = document.getElementById("backToWeekBtn");
const workoutDetailEl = document.getElementById("workoutDetail");
const workoutDetailKickerEl = document.getElementById("workoutDetailKicker");
const workoutDetailTitleEl = document.getElementById("workoutDetailTitle");
const workoutDetailMetaEl = document.getElementById("workoutDetailMeta");
const workoutActionsEl = document.getElementById("workoutActions");
const workoutTimerEl = document.getElementById("workoutTimer");
const workoutCompletedSummaryEl = document.getElementById("workoutCompletedSummary");
const workoutExerciseListEl = document.getElementById("workoutExerciseList");

const calendarModalEl = document.getElementById("calendarModal");
const calendarGridEl = document.getElementById("calendarGrid");
const calendarMonthLabelEl = document.getElementById("calendarMonthLabel");
const calendarPrevBtn = document.getElementById("calendarPrevBtn");
const calendarNextBtn = document.getElementById("calendarNextBtn");
const closeCalendarBtn = document.getElementById("closeCalendarBtn");

const profileNameEl = document.getElementById("profileName");
const profileStreakValueEl = document.getElementById("profileStreakValue");
const addMetricBtn = document.getElementById("addMetricBtn");
const metricForm = document.getElementById("metricForm");
const metricDateEl = document.getElementById("metricDate");
const metricWeightEl = document.getElementById("metricWeight");
const metricMuscleEl = document.getElementById("metricMuscle");
const metricsYAxisEl = document.getElementById("metricsYAxis");
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

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDate(date) {
  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit"
  });
}

function formatLongDate(date) {
  return date.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

function formatMonthYear(date) {
  return date.toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric"
  });
}

function formatIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromIso(dateKey) {
  return new Date(`${dateKey}T00:00:00`);
}

function getTodayKey() {
  return formatIsoDate(new Date());
}

function getDayFromDate(date) {
  return days[(date.getDay() + 6) % 7];
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

function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = String(Math.floor(safeSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(safeSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
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

function cloneExercisesForSession(exercises) {
  return exercises
    .map(normalizeExerciseEntry)
    .filter(Boolean)
    .map((exercise) => ({
      ...exercise,
      completed: false
    }));
}

function normalizeWorkoutSession(session, dateKey) {
  if (!session || typeof session !== "object") {
    return null;
  }

  const resolvedDate = session.date || dateKey;
  if (!resolvedDate) {
    return null;
  }

  const dateObj = dateFromIso(resolvedDate);
  const day = session.day || getDayFromDate(dateObj);
  const normalizedExercises = Array.isArray(session.exercises)
    ? session.exercises
      .map((exercise) => {
        const normalized = normalizeExerciseEntry(exercise);
        if (!normalized) {
          return null;
        }

        return {
          ...normalized,
          completed: Boolean(exercise && exercise.completed)
        };
      })
      .filter(Boolean)
    : [];

  const validStatuses = ["planned", "in_progress", "paused", "completed", "missed"];
  const status = validStatuses.includes(session.status) ? session.status : (resolvedDate < getTodayKey() ? "missed" : "planned");

  return {
    date: resolvedDate,
    day,
    status,
    exercises: normalizedExercises,
    durationSeconds: Number.isFinite(session.durationSeconds) ? session.durationSeconds : 0,
    activeStartedAt: session.activeStartedAt || null,
    completedAt: session.completedAt || null
  };
}

function normalizeWorkoutSessions() {
  if (!state.workoutSessions || typeof state.workoutSessions !== "object") {
    state.workoutSessions = {};
  }

  const nextSessions = {};
  Object.entries(state.workoutSessions).forEach(([dateKey, session]) => {
    const normalized = normalizeWorkoutSession(session, dateKey);
    if (normalized) {
      nextSessions[normalized.date] = normalized;
    }
  });

  state.workoutSessions = nextSessions;
}

function getTemplateExercisesForDate(dateKey) {
  const day = getDayFromDate(dateFromIso(dateKey));
  return cloneExercisesForSession(state.weekTemplate[day] || []);
}

function createWorkoutSession(dateKey, exercises) {
  return {
    date: dateKey,
    day: getDayFromDate(dateFromIso(dateKey)),
    status: dateKey < getTodayKey() ? "missed" : "planned",
    exercises: cloneExercisesForSession(exercises),
    durationSeconds: 0,
    activeStartedAt: null,
    completedAt: null
  };
}

function syncWorkoutSessionsRange() {
  normalizeWorkoutSessions();

  let changed = false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatIsoDate(today);

  for (let offset = -WORKOUT_SYNC_PAST_DAYS; offset <= WORKOUT_SYNC_FUTURE_DAYS; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const dateKey = formatIsoDate(date);
    const templateExercises = getTemplateExercisesForDate(dateKey);
    const existing = state.workoutSessions[dateKey];

    if (!existing) {
      if (templateExercises.length) {
        state.workoutSessions[dateKey] = createWorkoutSession(dateKey, templateExercises);
        changed = true;
      }
      continue;
    }

    if (existing.status === "completed") {
      continue;
    }

    if (dateKey < todayKey) {
      if (existing.status !== "missed") {
        existing.durationSeconds = getSessionElapsedSeconds(existing);
        existing.activeStartedAt = null;
        existing.status = "missed";
        changed = true;
      }
      continue;
    }

    if (existing.status === "in_progress" || existing.status === "paused") {
      continue;
    }

    if (!templateExercises.length) {
      delete state.workoutSessions[dateKey];
      changed = true;
      continue;
    }

    const nextSnapshot = createWorkoutSession(dateKey, templateExercises);
    const currentComparable = JSON.stringify(existing.exercises.map(({ completed, ...exercise }) => exercise));
    const nextComparable = JSON.stringify(nextSnapshot.exercises.map(({ completed, ...exercise }) => exercise));
    if (currentComparable !== nextComparable || existing.status !== "planned") {
      state.workoutSessions[dateKey] = {
        ...nextSnapshot,
        status: "planned"
      };
      changed = true;
    }
  }

  return changed;
}

function getSessionElapsedSeconds(session) {
  if (!session) {
    return 0;
  }

  let total = Number.isFinite(session.durationSeconds) ? session.durationSeconds : 0;

  if (session.status === "in_progress" && session.activeStartedAt) {
    total += Math.max(0, Math.floor((Date.now() - new Date(session.activeStartedAt).getTime()) / 1000));
  }

  return total;
}

function getCompletedExerciseCount(session) {
  return session.exercises.filter((exercise) => exercise.completed).length;
}

function getSessionVisualStatus(session, dateKey) {
  if (!session || !session.exercises.length) {
    return "rest";
  }

  if (session.status === "completed") {
    return "done";
  }

  if (dateKey < getTodayKey()) {
    return "missed";
  }

  if (session.status === "paused") {
    return "paused";
  }

  if (session.status === "in_progress") {
    return "live";
  }

  return "planned";
}

function getSessionStatusLabel(session, dateKey) {
  const visualStatus = getSessionVisualStatus(session, dateKey);
  if (visualStatus === "done") {
    return "Completato";
  }
  if (visualStatus === "missed") {
    return "Perso";
  }
  if (visualStatus === "paused") {
    return "In pausa";
  }
  if (visualStatus === "live") {
    return "In corso";
  }
  if (visualStatus === "planned") {
    return "Programmato";
  }
  return "Riposo";
}

function getSessionCategorySummary(session) {
  if (!session || !session.exercises.length) {
    return "Riposo";
  }

  const uniqueTypes = [...new Set(session.exercises.map((exercise) => exercise.trainingType).filter(Boolean))];
  if (!uniqueTypes.length) {
    return "Workout";
  }

  if (uniqueTypes.length <= 2) {
    return uniqueTypes.join(" · ");
  }

  return `${uniqueTypes.slice(0, 2).join(" · ")} +${uniqueTypes.length - 2}`;
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
  normalizeWorkoutSessions();
}

async function saveWeekTemplate() {
  const res = await fetch("/api/week-template", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weekTemplate: state.weekTemplate })
  });

  if (!res.ok) {
    alert("Errore nel salvataggio settimana");
    return false;
  }

  syncWorkoutSessionsRange();
  await saveWorkoutSessions();
  alert("Settimana salvata con successo");
  return true;
}

async function saveWorkoutSessions() {
  const res = await fetch("/api/workout-sessions", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workoutSessions: state.workoutSessions })
  });

  if (!res.ok) {
    alert("Errore nel salvataggio allenamenti");
    return false;
  }

  return true;
}

async function savePersonalState() {
  const res = await fetch("/api/personal", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personal: state.personal })
  });

  if (!res.ok) {
    alert("Errore nel salvataggio sezione personale");
    return false;
  }

  return true;
}

function updateStats() {
  if (!weekNumEl || !dayCountEl || !exerciseCountEl || !weekRangeEl) {
    return;
  }

  const totalExercises = days.reduce((sum, day) => sum + (state.weekTemplate[day] || []).length, 0);
  const { monday, sunday } = getWeekContext();

  weekNumEl.textContent = getWeekNum();
  dayCountEl.textContent = days.filter((day) => (state.weekTemplate[day] || []).length > 0).length;
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
  const { monday } = getWeekContext();
  weekContainerEl.innerHTML = "";

  days.forEach((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const dateKey = formatIsoDate(date);
    const session = state.workoutSessions[dateKey];
    const exercises = session ? session.exercises : [];
    const visualStatus = getSessionVisualStatus(session, dateKey);
    const isRest = !session || !exercises.length;

    const card = document.createElement("button");
    card.type = "button";
    card.className = `day-card day-card-${visualStatus}`;
    card.disabled = isRest;
    if (!isRest) {
      card.addEventListener("click", () => openWorkoutDetail(dateKey));
    }

    const head = document.createElement("div");
    head.className = "day-header";

    const dayLeft = document.createElement("div");
    dayLeft.className = "day-left";

    const dayNum = document.createElement("div");
    dayNum.className = "day-num";
    dayNum.textContent = formatDate(date);

    const dayInfo = document.createElement("div");

    const title = document.createElement("div");
    title.className = "day-title";
    title.textContent = dayLabels[day];

    const focus = document.createElement("div");
    focus.className = "day-focus";
    focus.textContent = getSessionCategorySummary(session);

    dayInfo.appendChild(title);
    dayInfo.appendChild(focus);
    dayLeft.appendChild(dayNum);
    dayLeft.appendChild(dayInfo);

    const right = document.createElement("div");
    right.className = "day-right";

    const badge = document.createElement("span");
    badge.className = `day-badge day-badge-${visualStatus}`;
    badge.textContent = getSessionStatusLabel(session, dateKey);
    right.appendChild(badge);

    if (!isRest && session.status === "completed") {
      const timeChip = document.createElement("span");
      timeChip.className = "day-time-chip";
      timeChip.textContent = formatDuration(session.durationSeconds);
      right.appendChild(timeChip);
    }

    head.appendChild(dayLeft);
    head.appendChild(right);
    card.appendChild(head);

    if (!isRest) {
      const preview = document.createElement("div");
      preview.className = "day-preview";
      const previewNames = exercises.slice(0, 3).map((exercise) => exercise.name).join(" · ");
      preview.textContent = previewNames;
      card.appendChild(preview);
    }

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
      syncWorkoutSessionsRange();
      renderWeekCards();
      renderCalendar();
      if (workoutDetailDate) {
        renderWorkoutDetail();
      }
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
      syncWorkoutSessionsRange();
      renderWeekCards();
      renderCalendar();
      if (workoutDetailDate) {
        renderWorkoutDetail();
      }
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
        syncWorkoutSessionsRange();
        renderWeekCards();
        renderCalendar();
        if (workoutDetailDate) {
          renderWorkoutDetail();
        }
      });

      controls.appendChild(weightInput);
    }

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Rimuovi";

    removeBtn.addEventListener("click", () => {
      state.weekTemplate[currentDay] = state.weekTemplate[currentDay].filter((_, index) => index !== exerciseIndex);
      renderEditor();
      syncWorkoutSessionsRange();
      renderWeekCards();
      renderCalendar();
      if (workoutDetailDate) {
        renderWorkoutDetail();
      }
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

function openWorkoutDetail(dateKey) {
  const session = state.workoutSessions[dateKey];
  if (!session || !session.exercises.length) {
    return;
  }

  workoutDetailDate = dateKey;
  renderWorkoutDetail();
  toggleWorkoutDetail(true);
}

function toggleWorkoutDetail(isOpen) {
  weekOverviewEl.classList.toggle("hidden", isOpen);
  workoutDetailEl.classList.toggle("hidden", !isOpen);
}

function closeWorkoutDetail() {
  workoutDetailDate = null;
  stopTimerLoop();
  toggleWorkoutDetail(false);
}

function startTimerLoop() {
  stopTimerLoop();
  timerIntervalId = window.setInterval(() => {
    if (!workoutDetailDate) {
      return;
    }
    const session = state.workoutSessions[workoutDetailDate];
    if (!session || session.status !== "in_progress") {
      stopTimerLoop();
      return;
    }
    workoutTimerEl.textContent = formatDuration(getSessionElapsedSeconds(session));
  }, 1000);
}

function stopTimerLoop() {
  if (timerIntervalId) {
    window.clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

function createActionButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

async function handleStartWorkout(session) {
  session.status = "in_progress";
  session.durationSeconds = 0;
  session.activeStartedAt = new Date().toISOString();
  await saveWorkoutSessions();
  renderWeekCards();
  renderCalendar();
  renderWorkoutDetail();
  renderPersonal();
}

async function handlePauseWorkout(session) {
  if (session.status === "in_progress") {
    session.durationSeconds = getSessionElapsedSeconds(session);
    session.activeStartedAt = null;
    session.status = "paused";
  } else if (session.status === "paused") {
    session.status = "in_progress";
    session.activeStartedAt = new Date().toISOString();
  }

  await saveWorkoutSessions();
  renderWeekCards();
  renderCalendar();
  renderWorkoutDetail();
  renderPersonal();
}

async function handleFinishWorkout(session) {
  session.durationSeconds = getSessionElapsedSeconds(session);
  session.activeStartedAt = null;
  session.status = "completed";
  session.completedAt = new Date().toISOString();
  await saveWorkoutSessions();
  renderWeekCards();
  renderCalendar();
  renderWorkoutDetail();
  renderPersonal();
}

function renderWorkoutDetail() {
  const session = workoutDetailDate ? state.workoutSessions[workoutDetailDate] : null;
  if (!session) {
    closeWorkoutDetail();
    return;
  }

  const date = dateFromIso(session.date);
  workoutDetailKickerEl.textContent = dayLabels[session.day];
  workoutDetailTitleEl.textContent = formatLongDate(date);
  workoutDetailMetaEl.textContent = `${session.exercises.length} esercizi · ${getSessionStatusLabel(session, session.date)}`;

  workoutActionsEl.innerHTML = "";
  workoutExerciseListEl.innerHTML = "";

  workoutTimerEl.classList.toggle("hidden", session.status === "completed" || session.status === "planned" || session.status === "missed");
  workoutCompletedSummaryEl.classList.toggle("hidden", session.status !== "completed");

  if (session.status === "completed") {
    workoutCompletedSummaryEl.textContent = `Tempo finale ${formatDuration(session.durationSeconds)} · ${getCompletedExerciseCount(session)}/${session.exercises.length} esercizi completati`;
    stopTimerLoop();
  } else if (session.status === "in_progress" || session.status === "paused") {
    workoutTimerEl.textContent = formatDuration(getSessionElapsedSeconds(session));
    if (session.status === "in_progress") {
      startTimerLoop();
    } else {
      stopTimerLoop();
    }
  } else {
    stopTimerLoop();
  }

  if (session.status === "planned") {
    workoutActionsEl.appendChild(createActionButton("INIZIA ALLENAMENTO", "workout-start-btn", async () => {
      await handleStartWorkout(session);
    }));
  }

  if (session.status === "in_progress" || session.status === "paused") {
    workoutActionsEl.appendChild(createActionButton(session.status === "in_progress" ? "▌▌ Pausa" : "▶ Riprendi", "workout-control-btn", async () => {
      await handlePauseWorkout(session);
    }));
    workoutActionsEl.appendChild(createActionButton("■ Fine", "workout-stop-btn", async () => {
      await handleFinishWorkout(session);
    }));
  }

  const timeline = document.createElement("div");
  timeline.className = "exercise-timeline";

  session.exercises.forEach((exercise, index) => {
    const row = document.createElement("label");
    row.className = `exercise-line ${exercise.completed ? "exercise-line-done" : ""}`;

    const point = document.createElement("span");
    point.className = "exercise-line-point";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = exercise.completed;
    checkbox.disabled = session.status !== "in_progress";

    checkbox.addEventListener("change", async () => {
      session.exercises[index].completed = checkbox.checked;
      await saveWorkoutSessions();
      renderWeekCards();
      renderCalendar();
      renderWorkoutDetail();
    });

    const content = document.createElement("div");
    content.className = "exercise-line-content";

    const title = document.createElement("div");
    title.className = "exercise-line-title";
    title.textContent = exercise.name;

    const meta = document.createElement("div");
    meta.className = "exercise-line-meta";
    meta.textContent = `${exercise.trainingType} · ${exercise.category}${exercise.supportsWeight && typeof exercise.weight === "number" ? ` · ${exercise.weight} kg` : ""}`;

    content.appendChild(title);
    content.appendChild(meta);

    row.appendChild(point);
    row.appendChild(checkbox);
    row.appendChild(content);
    timeline.appendChild(row);
  });

  workoutExerciseListEl.appendChild(timeline);
}

function openCalendar() {
  calendarModalEl.classList.remove("hidden");
  renderCalendar();
}

function closeCalendar() {
  calendarModalEl.classList.add("hidden");
}

function renderCalendar() {
  if (!calendarGridEl || !calendarMonthLabelEl) {
    return;
  }

  calendarMonthLabelEl.textContent = formatMonthYear(calendarMonthCursor);
  calendarGridEl.innerHTML = "";

  const firstDay = startOfMonth(calendarMonthCursor);
  const gridStart = new Date(firstDay);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  gridStart.setDate(firstDay.getDate() - mondayOffset);

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const dateKey = formatIsoDate(date);
    const session = state.workoutSessions[dateKey];
    const visualStatus = getSessionVisualStatus(session, dateKey);
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "calendar-cell";

    if (date.getMonth() !== calendarMonthCursor.getMonth()) {
      cell.classList.add("calendar-cell-muted");
    }

    if (session && session.exercises.length) {
      cell.classList.add(`calendar-cell-${visualStatus === "done" ? "done" : visualStatus === "missed" ? "missed" : "planned"}`);
      cell.addEventListener("click", () => {
        closeCalendar();
        openWorkoutDetail(dateKey);
      });
    } else {
      cell.disabled = true;
    }

    if (dateKey === getTodayKey()) {
      cell.classList.add("calendar-cell-today");
    }

    cell.textContent = String(date.getDate());
    calendarGridEl.appendChild(cell);
  }
}

function getPersonalWorkoutStreak() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatIsoDate(today);

  let streak = 0;
  for (let offset = 0; offset <= WORKOUT_SYNC_PAST_DAYS + 365; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const dateKey = formatIsoDate(date);
    const session = state.workoutSessions[dateKey];

    if (!session || !session.exercises || !session.exercises.length) {
      continue;
    }

    if (session.status === "completed") {
      streak += 1;
      continue;
    }

    if (dateKey === todayKey && (session.status === "planned" || session.status === "in_progress" || session.status === "paused")) {
      continue;
    }

    break;
  }

  return streak;
}

function renderPersonal() {
  profileNameEl.textContent = state.personal.profileName;
  if (profileStreakValueEl) {
    profileStreakValueEl.textContent = String(getPersonalWorkoutStreak());
  }
  renderMetricsChart();
  renderDiary();
}

function renderMetricsChart() {
  if (!metricsChartEl || !metricsYAxisEl) {
    return;
  }

  const plotCanvas = metricsChartEl;
  const axisCanvas = metricsYAxisEl;
  const plotCtx = plotCanvas.getContext("2d");
  const axisCtx = axisCanvas.getContext("2d");
  const metrics = [...state.personal.metrics].sort((a, b) => a.date.localeCompare(b.date));

  const viewportWidth = (metricsChartScrollEl && metricsChartScrollEl.clientWidth) || 860;
  const spacing = 84;
  const height = 300;
  const topPadding = 28;
  const bottomPadding = 38;
  const leftPadding = 24;
  const rightPadding = 24;
  const width = Math.max(viewportWidth, (Math.max(metrics.length, 2) - 1) * spacing + leftPadding + rightPadding);

  plotCanvas.width = width;
  plotCanvas.height = height;
  axisCanvas.width = 56;
  axisCanvas.height = height;

  const plotBg = plotCtx.createLinearGradient(0, 0, 0, height);
  plotBg.addColorStop(0, "#171717");
  plotBg.addColorStop(1, "#0f0f0f");
  plotCtx.fillStyle = plotBg;
  plotCtx.fillRect(0, 0, width, height);

  const axisBg = axisCtx.createLinearGradient(0, 0, 0, height);
  axisBg.addColorStop(0, "#171717");
  axisBg.addColorStop(1, "#0f0f0f");
  axisCtx.fillStyle = axisBg;
  axisCtx.fillRect(0, 0, axisCanvas.width, height);

  if (metrics.length < 2) {
    plotCtx.fillStyle = "#8d8d8d";
    plotCtx.font = "14px DM Sans";
    plotCtx.fillText("Aggiungi almeno 2 misurazioni per visualizzare il grafico", 24, 40);
    return;
  }

  const parsedMetrics = metrics.map((metric) => ({
    ...metric,
    dateObj: new Date(`${metric.date}T00:00:00`)
  }));

  const values = metrics.flatMap((metric) => [metric.weight, metric.muscleMass]);
  const minY = Math.floor(Math.min(...values) - 1);
  const maxY = Math.ceil(Math.max(...values) + 1);

  function projectX(index) {
    const span = parsedMetrics.length - 1;
    return leftPadding + (index * (width - leftPadding - rightPadding)) / span;
  }

  function projectY(value) {
    const ratio = (value - minY) / (maxY - minY || 1);
    return height - bottomPadding - ratio * (height - topPadding - bottomPadding);
  }

  for (let index = 0; index <= 4; index += 1) {
    const y = topPadding + (index * (height - topPadding - bottomPadding)) / 4;
    const value = (maxY - ((maxY - minY) * index) / 4).toFixed(1);

    plotCtx.strokeStyle = "#2a2a2a";
    plotCtx.lineWidth = 1;
    plotCtx.beginPath();
    plotCtx.moveTo(leftPadding, y);
    plotCtx.lineTo(width - rightPadding, y);
    plotCtx.stroke();

    axisCtx.strokeStyle = "#3a3a3a";
    axisCtx.lineWidth = 1;
    axisCtx.beginPath();
    axisCtx.moveTo(axisCanvas.width - 12, y);
    axisCtx.lineTo(axisCanvas.width - 2, y);
    axisCtx.stroke();

    axisCtx.fillStyle = "#737373";
    axisCtx.font = "10px DM Sans";
    axisCtx.textAlign = "right";
    axisCtx.fillText(value, axisCanvas.width - 14, y + 3);
  }

  const labelStep = Math.max(1, Math.ceil(parsedMetrics.length / 8));
  parsedMetrics.forEach((metric, index) => {
    if (index % labelStep !== 0 && index !== parsedMetrics.length - 1) {
      return;
    }

    const x = projectX(index);
    plotCtx.fillStyle = "#707070";
    plotCtx.font = "10px DM Sans";
    plotCtx.textAlign = "center";
    plotCtx.fillText(metric.dateObj.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" }), x, height - 14);
  });

  plotCtx.textAlign = "left";

  function drawArea(key, colorStart, colorEnd) {
    const gradient = plotCtx.createLinearGradient(0, topPadding, 0, height - bottomPadding);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);

    plotCtx.beginPath();
    parsedMetrics.forEach((metric, index) => {
      const x = projectX(index);
      const y = projectY(metric[key]);
      if (index === 0) {
        plotCtx.moveTo(x, y);
      } else {
        plotCtx.lineTo(x, y);
      }
    });

    plotCtx.lineTo(projectX(parsedMetrics.length - 1), height - bottomPadding);
    plotCtx.lineTo(projectX(0), height - bottomPadding);
    plotCtx.closePath();
    plotCtx.fillStyle = gradient;
    plotCtx.fill();
  }

  function drawSeries(key, color) {
    plotCtx.strokeStyle = color;
    plotCtx.lineWidth = 2.5;
    plotCtx.beginPath();
    parsedMetrics.forEach((metric, index) => {
      const x = projectX(index);
      const y = projectY(metric[key]);
      if (index === 0) {
        plotCtx.moveTo(x, y);
      } else {
        plotCtx.lineTo(x, y);
      }
    });
    plotCtx.stroke();

    parsedMetrics.forEach((metric, index) => {
      const x = projectX(index);
      const y = projectY(metric[key]);
      plotCtx.beginPath();
      plotCtx.fillStyle = color;
      plotCtx.arc(x, y, 3.5, 0, Math.PI * 2);
      plotCtx.fill();
    });
  }

  drawArea("weight", "rgba(232, 255, 71, 0.16)", "rgba(232, 255, 71, 0.02)");
  drawArea("muscleMass", "rgba(255, 92, 53, 0.14)", "rgba(255, 92, 53, 0.02)");
  drawSeries("weight", "#e8ff47");
  drawSeries("muscleMass", "#ff5c35");

  plotCtx.font = "11px DM Sans";
  plotCtx.fillStyle = "#e8ff47";
  plotCtx.fillText("Peso", width - 140, 20);
  plotCtx.fillStyle = "#ff5c35";
  plotCtx.fillText("Massa muscolare", width - 95, 20);

  if (metricsChartScrollEl && parsedMetrics.length) {
    const latestDate = parsedMetrics[parsedMetrics.length - 1].dateObj;
    const monthStart = new Date(latestDate);
    monthStart.setDate(monthStart.getDate() - 30);
    let firstVisibleIndex = parsedMetrics.findIndex((metric) => metric.dateObj >= monthStart);
    if (firstVisibleIndex < 0) {
      firstVisibleIndex = Math.max(0, parsedMetrics.length - 6);
    }
    metricsChartScrollEl.scrollLeft = Math.max(0, projectX(firstVisibleIndex) - leftPadding);
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

  if (tabId === "tab-personal") {
    renderPersonal();
  }
}

function bindEvents() {
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });

  backToWeekBtn.addEventListener("click", closeWorkoutDetail);
  openCalendarBtn.addEventListener("click", openCalendar);
  closeCalendarBtn.addEventListener("click", closeCalendar);
  calendarModalEl.querySelector(".calendar-backdrop").addEventListener("click", closeCalendar);
  calendarPrevBtn.addEventListener("click", () => {
    calendarMonthCursor = new Date(calendarMonthCursor.getFullYear(), calendarMonthCursor.getMonth() - 1, 1);
    renderCalendar();
  });
  calendarNextBtn.addEventListener("click", () => {
    calendarMonthCursor = new Date(calendarMonthCursor.getFullYear(), calendarMonthCursor.getMonth() + 1, 1);
    renderCalendar();
  });

  editorDaySelectEl.addEventListener("change", renderEditor);

  if (editorTypeFilterEl) {
    editorTypeFilterEl.addEventListener("change", renderEditor);
  }

  if (editorSearchEl) {
    editorSearchEl.addEventListener("input", renderEditor);
  }

  window.addEventListener("resize", () => {
    renderMetricsChart();
  });

  saveWeekBtn.addEventListener("click", async () => {
    const didSave = await saveWeekTemplate();
    if (didSave) {
      renderWeekCards();
      renderCalendar();
      if (workoutDetailDate) {
        renderWorkoutDetail();
      }
      updateStats();
    }
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

  const didSyncSessions = syncWorkoutSessionsRange();
  if (didSyncSessions) {
    await saveWorkoutSessions();
  }

  updateStats();
  renderLibrarySection();
  renderEditorDaySelect();
  renderEditor();
  renderWeekCards();
  renderCalendar();
  renderPersonal();
  bindEvents();
  setActiveTab("tab-week");
}

init();