const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "state.json");

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function readState() {
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  const state = ensureStateShape(JSON.parse(raw));

  // Clean up sessions that should never be persisted
  const todayKey = getTodayKey();
  let dirty = false;
  Object.keys(state.workoutSessions).forEach((key) => {
    const s = state.workoutSessions[key];
    if (s.status === "planned" || (s.status === "missed" && key < todayKey)) {
      delete state.workoutSessions[key];
      dirty = true;
    }
  });
  if (dirty) writeState(state);

  return state;
}

function writeState(state) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(ensureStateShape(state), null, 2), "utf8");
}

function ensureStateShape(state) {
  if (!state || typeof state !== "object") {
    state = {};
  }

  if (!state.exerciseLibrary || typeof state.exerciseLibrary !== "object") {
    state.exerciseLibrary = {
      bench_dumbbell_barbell: [],
      toorx_msx50: []
    };
  }

  if (!state.weekTemplate || typeof state.weekTemplate !== "object") {
    state.weekTemplate = {};
  }

  if (!state.weekTemplateTypes || typeof state.weekTemplateTypes !== "object") {
    state.weekTemplateTypes = {};
  }

  if (!state.progress || typeof state.progress !== "object") {
    state.progress = {};
  }

  if (!state.personal || typeof state.personal !== "object") {
    state.personal = {
      profileName: "",
      metrics: [],
      diary: []
    };
  }

  if (!state.workoutSessions || typeof state.workoutSessions !== "object") {
    state.workoutSessions = {};
  }

  return state;
}

function isValidWeekTemplate(weekTemplate) {
  const validDays = [
    "lunedi",
    "martedi",
    "mercoledi",
    "giovedi",
    "venerdi",
    "sabato",
    "domenica"
  ];

  if (!weekTemplate || typeof weekTemplate !== "object") {
    return false;
  }

  return validDays.every((day) => Array.isArray(weekTemplate[day]));
}

function isValidPersonal(personal) {
  if (!personal || typeof personal !== "object") {
    return false;
  }

  if (typeof personal.profileName !== "string") {
    return false;
  }

  if (!Array.isArray(personal.metrics) || !Array.isArray(personal.diary)) {
    return false;
  }

  return true;
}

function isValidWorkoutSessions(workoutSessions) {
  if (!workoutSessions || typeof workoutSessions !== "object") {
    return false;
  }

  return Object.values(workoutSessions).every((session) => {
    if (!session || typeof session !== "object") {
      return false;
    }

    if (typeof session.date !== "string" || typeof session.day !== "string") {
      return false;
    }

    if (!Array.isArray(session.exercises)) {
      return false;
    }

    if (typeof session.status !== "string") {
      return false;
    }

    if (session.durationSeconds != null && typeof session.durationSeconds !== "number") {
      return false;
    }

    return true;
  });
}

app.get("/api/state", (req, res) => {
  try {
    const state = readState();
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: "Errore lettura stato" });
  }
});

app.put("/api/week-template", (req, res) => {
  try {
    const { weekTemplate, weekTemplateTypes } = req.body;

    if (!isValidWeekTemplate(weekTemplate)) {
      return res.status(400).json({ error: "Formato weekTemplate non valido" });
    }

    const state = readState();
    state.weekTemplate = weekTemplate;
    if (weekTemplateTypes && typeof weekTemplateTypes === "object") {
      state.weekTemplateTypes = weekTemplateTypes;
    }
    writeState(state);

    return res.json({ ok: true, weekTemplate: state.weekTemplate, weekTemplateTypes: state.weekTemplateTypes });
  } catch (error) {
    return res.status(500).json({ error: "Errore salvataggio settimana" });
  }
});

app.put("/api/progress", (req, res) => {
  try {
    const { weekKey, day, exercise, completed } = req.body;

    if (!weekKey || !day || !exercise || typeof completed !== "boolean") {
      return res.status(400).json({ error: "Payload progress non valido" });
    }

    const state = readState();

    if (!state.progress[weekKey]) {
      state.progress[weekKey] = {};
    }

    if (!state.progress[weekKey][day]) {
      state.progress[weekKey][day] = {};
    }

    state.progress[weekKey][day][exercise] = completed;
    writeState(state);

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Errore salvataggio progress" });
  }
});

app.put("/api/personal", (req, res) => {
  try {
    const { personal } = req.body;

    if (!isValidPersonal(personal)) {
      return res.status(400).json({ error: "Payload personal non valido" });
    }

    const state = readState();
    state.personal = personal;
    writeState(state);

    return res.json({ ok: true, personal: state.personal });
  } catch (error) {
    return res.status(500).json({ error: "Errore salvataggio sezione personale" });
  }
});

app.put("/api/workout-sessions", (req, res) => {
  try {
    const { workoutSessions } = req.body;

    if (!isValidWorkoutSessions(workoutSessions)) {
      return res.status(400).json({ error: "Payload workoutSessions non valido" });
    }

    const state = readState();
    state.workoutSessions = workoutSessions;
    writeState(state);

    return res.json({ ok: true, workoutSessions: state.workoutSessions });
  } catch (error) {
    return res.status(500).json({ error: "Errore salvataggio workout sessions" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Gym app in ascolto su http://localhost:${PORT}`);
});
