const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "state.json");

// ── Storage backend ────────────────────────────────────────────
// If DATABASE_URL is set (Render / production) use PostgreSQL.
// Otherwise fall back to the local JSON file (dev).
let pgPool = null;
if (process.env.DATABASE_URL) {
  const { Pool } = require("pg");
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}

async function initDb() {
  if (!pgPool) return;
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS app_state (
      id   INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB   NOT NULL
    )
  `);
  // Seed with empty object if no row exists yet
  await pgPool.query(`
    INSERT INTO app_state (id, data)
    VALUES (1, '{}'::jsonb)
    ON CONFLICT (id) DO NOTHING
  `);
}
// ──────────────────────────────────────────────────────────────

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function readState() {
  let state;
  if (pgPool) {
    const { rows } = await pgPool.query("SELECT data FROM app_state WHERE id = 1");
    state = ensureStateShape(rows[0]?.data || {});
  } else {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    state = ensureStateShape(JSON.parse(raw));
  }

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
  if (dirty) await writeState(state);

  return state;
}

async function writeState(state) {
  const shaped = ensureStateShape(state);
  if (pgPool) {
    await pgPool.query(
      "UPDATE app_state SET data = $1 WHERE id = 1",
      [shaped]
    );
  } else {
    fs.writeFileSync(DATA_FILE, JSON.stringify(shaped, null, 2), "utf8");
  }
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

  if (!state.exerciseMeta || typeof state.exerciseMeta !== "object") {
    state.exerciseMeta = {};
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

app.get("/api/state", async (req, res) => {
  try {
    const state = await readState();
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: "Errore lettura stato" });
  }
});

app.put("/api/week-template", async (req, res) => {
  try {
    const { weekTemplate, weekTemplateTypes } = req.body;

    if (!isValidWeekTemplate(weekTemplate)) {
      return res.status(400).json({ error: "Formato weekTemplate non valido" });
    }

    const state = await readState();
    state.weekTemplate = weekTemplate;
    if (weekTemplateTypes && typeof weekTemplateTypes === "object") {
      state.weekTemplateTypes = weekTemplateTypes;
    }
    await writeState(state);

    return res.json({ ok: true, weekTemplate: state.weekTemplate, weekTemplateTypes: state.weekTemplateTypes });
  } catch (error) {
    return res.status(500).json({ error: "Errore salvataggio settimana" });
  }
});

app.put("/api/progress", async (req, res) => {
  try {
    const { weekKey, day, exercise, completed } = req.body;

    if (!weekKey || !day || !exercise || typeof completed !== "boolean") {
      return res.status(400).json({ error: "Payload progress non valido" });
    }

    const state = await readState();

    if (!state.progress[weekKey]) {
      state.progress[weekKey] = {};
    }

    if (!state.progress[weekKey][day]) {
      state.progress[weekKey][day] = {};
    }

    state.progress[weekKey][day][exercise] = completed;
    await writeState(state);

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Errore salvataggio progress" });
  }
});

app.put("/api/personal", async (req, res) => {
  try {
    const { personal } = req.body;

    if (!isValidPersonal(personal)) {
      return res.status(400).json({ error: "Payload personal non valido" });
    }

    const state = await readState();
    state.personal = personal;
    await writeState(state);

    return res.json({ ok: true, personal: state.personal });
  } catch (error) {
    return res.status(500).json({ error: "Errore salvataggio sezione personale" });
  }
});

app.put("/api/workout-sessions", async (req, res) => {
  try {
    const { workoutSessions } = req.body;

    if (!isValidWorkoutSessions(workoutSessions)) {
      return res.status(400).json({ error: "Payload workoutSessions non valido" });
    }

    const state = await readState();
    state.workoutSessions = workoutSessions;
    await writeState(state);

    return res.json({ ok: true, workoutSessions: state.workoutSessions });
  } catch (error) {
    return res.status(500).json({ error: "Errore salvataggio workout sessions" });
  }
});

app.put("/api/exercise-library", async (req, res) => {
  try {
    const { exerciseLibrary } = req.body;
    if (!exerciseLibrary || typeof exerciseLibrary !== "object") {
      return res.status(400).json({ error: "Payload exerciseLibrary non valido" });
    }
    if (!Array.isArray(exerciseLibrary.bench_dumbbell_barbell) || !Array.isArray(exerciseLibrary.toorx_msx50)) {
      return res.status(400).json({ error: "Formato exerciseLibrary non valido" });
    }
    const state = await readState();
    state.exerciseLibrary = exerciseLibrary;
    await writeState(state);
    return res.json({ ok: true, exerciseLibrary: state.exerciseLibrary });
  } catch (error) {
    return res.status(500).json({ error: "Errore salvataggio libreria" });
  }
});

app.put("/api/exercise-meta", async (req, res) => {
  try {
    const { exerciseMeta } = req.body;
    if (!exerciseMeta || typeof exerciseMeta !== "object") {
      return res.status(400).json({ error: "Payload exerciseMeta non valido" });
    }
    const state = await readState();
    state.exerciseMeta = exerciseMeta;
    await writeState(state);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Errore salvataggio exerciseMeta" });
  }
});

app.put("/api/move-exercise", async (req, res) => {
  try {
    const { fromDay, toDay } = req.body;

    const validDays = [
      "lunedi",
      "martedi",
      "mercoledi",
      "giovedi",
      "venerdi",
      "sabato",
      "domenica"
    ];

    if (!validDays.includes(fromDay) || !validDays.includes(toDay)) {
      return res.status(400).json({ error: "Giorno non valido" });
    }

    if (fromDay === toDay) {
      return res.status(400).json({ error: "Non puoi spostare in lo stesso giorno" });
    }

    const state = await readState();

    // Scambia interi allenamenti tra due giorni
    const tempTemplate = state.weekTemplate[fromDay];
    const tempType = state.weekTemplateTypes?.[fromDay];

    state.weekTemplate[fromDay] = state.weekTemplate[toDay] || [];
    state.weekTemplate[toDay] = tempTemplate || [];

    if (tempType) {
      state.weekTemplateTypes[toDay] = tempType;
      delete state.weekTemplateTypes[fromDay];
    } else {
      delete state.weekTemplateTypes[toDay];
    }

    const toType = state.weekTemplateTypes?.[fromDay];
    if (!toType) {
      delete state.weekTemplateTypes[fromDay];
    }

    await writeState(state);
    return res.json({ ok: true, weekTemplate: state.weekTemplate, weekTemplateTypes: state.weekTemplateTypes });
  } catch (error) {
    return res.status(500).json({ error: "Errore nello spostamento allenamento" });
  }
});

app.get("/api/cleanup", async (req, res) => {
  try {
    const state = await readState();
    const sessions = Object.keys(state.workoutSessions).length;
    return res.json({ ok: true, sessionsRemaining: sessions });
  } catch (error) {
    return res.status(500).json({ error: "Errore cleanup" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

initDb().then(() => {
  app.listen(PORT, async () => {
    console.log(`Gym app in ascolto su http://localhost:${PORT}`);
    console.log(pgPool ? "Storage: PostgreSQL" : "Storage: file JSON locale");
    try {
      await readState();
      console.log("Cleanup sessioni completato all'avvio.");
    } catch (e) {
      console.error("Errore cleanup avvio:", e);
    }
  });
}).catch((e) => {
  console.error("Errore inizializzazione DB:", e);
  process.exit(1);
});
