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

// Larger limit to accommodate client-compressed progress photos (base64) that
// are stored inside the personal section of the state document.
app.use(express.json({ limit: "12mb" }));

// ── Optional authentication ────────────────────────────────────
// When APP_PASSWORD is set, every /api/* call must carry a matching token in
// the `x-app-token` header. When it's unset (e.g. local dev) the API is open.
// Static assets (index.html/app.js/css) stay public — they hold no secrets.
const APP_PASSWORD = process.env.APP_PASSWORD || "";

// Lets the client discover whether a login is required (mounted before the guard).
app.get("/api/auth/status", (req, res) => {
  res.json({ authRequired: Boolean(APP_PASSWORD) });
});

app.use("/api", (req, res, next) => {
  if (!APP_PASSWORD) return next();
  const token = req.headers["x-app-token"];
  if (typeof token === "string" && token === APP_PASSWORD) return next();
  return res.status(401).json({ error: "Non autorizzato" });
});

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
    // Le chiavi del 2º allenamento hanno suffisso "#2": confronta la data reale.
    const sessionDate = (s && s.date) || key.split("#")[0];
    if (s.status === "planned" || (s.status === "missed" && sessionDate < todayKey)) {
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

  // Secondo allenamento opzionale della giornata (slot 2)
  if (!state.weekTemplate2 || typeof state.weekTemplate2 !== "object") {
    state.weekTemplate2 = {};
  }

  if (!state.weekTemplateTypes2 || typeof state.weekTemplateTypes2 !== "object") {
    state.weekTemplateTypes2 = {};
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

// Il secondo allenamento è sparso: solo i giorni che lo hanno compaiono come chiave.
function isValidSecondWeekTemplate(weekTemplate2) {
  const validDays = [
    "lunedi",
    "martedi",
    "mercoledi",
    "giovedi",
    "venerdi",
    "sabato",
    "domenica"
  ];

  if (!weekTemplate2 || typeof weekTemplate2 !== "object") {
    return false;
  }

  return Object.entries(weekTemplate2).every(
    ([day, entries]) => validDays.includes(day) && Array.isArray(entries)
  );
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
    const { weekTemplate, weekTemplateTypes, weekTemplate2, weekTemplateTypes2 } = req.body;

    if (!isValidWeekTemplate(weekTemplate)) {
      return res.status(400).json({ error: "Formato weekTemplate non valido" });
    }

    if (weekTemplate2 !== undefined && !isValidSecondWeekTemplate(weekTemplate2)) {
      return res.status(400).json({ error: "Formato weekTemplate2 non valido" });
    }

    const state = await readState();
    state.weekTemplate = weekTemplate;
    if (weekTemplateTypes && typeof weekTemplateTypes === "object") {
      state.weekTemplateTypes = weekTemplateTypes;
    }
    if (weekTemplate2 !== undefined) {
      state.weekTemplate2 = weekTemplate2;
    }
    if (weekTemplateTypes2 && typeof weekTemplateTypes2 === "object") {
      state.weekTemplateTypes2 = weekTemplateTypes2;
    }
    await writeState(state);

    return res.json({
      ok: true,
      weekTemplate: state.weekTemplate,
      weekTemplateTypes: state.weekTemplateTypes,
      weekTemplate2: state.weekTemplate2,
      weekTemplateTypes2: state.weekTemplateTypes2
    });
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

    if (!state.weekTemplateTypes || typeof state.weekTemplateTypes !== "object") {
      state.weekTemplateTypes = {};
    }
    if (!state.weekTemplate2 || typeof state.weekTemplate2 !== "object") {
      state.weekTemplate2 = {};
    }
    if (!state.weekTemplateTypes2 || typeof state.weekTemplateTypes2 !== "object") {
      state.weekTemplateTypes2 = {};
    }

    // Scambia interi allenamenti tra due giorni (template + tipo) in modo simmetrico.
    // Funziona sia spostando su un giorno di riposo sia scambiando due giorni pieni.
    // Lo scambio coinvolge entrambi gli slot della giornata (1º e 2º allenamento).
    const swapEntries = (map, a, b) => {
      const fromValue = map[a];
      const toValue = map[b];

      if (toValue !== undefined && toValue !== null) {
        map[a] = toValue;
      } else {
        delete map[a];
      }

      if (fromValue !== undefined && fromValue !== null) {
        map[b] = fromValue;
      } else {
        delete map[b];
      }
    };

    state.weekTemplate[fromDay] = state.weekTemplate[fromDay] || [];
    state.weekTemplate[toDay] = state.weekTemplate[toDay] || [];
    swapEntries(state.weekTemplate, fromDay, toDay);
    swapEntries(state.weekTemplateTypes, fromDay, toDay);
    swapEntries(state.weekTemplate2, fromDay, toDay);
    swapEntries(state.weekTemplateTypes2, fromDay, toDay);

    await writeState(state);
    return res.json({
      ok: true,
      weekTemplate: state.weekTemplate,
      weekTemplateTypes: state.weekTemplateTypes,
      weekTemplate2: state.weekTemplate2,
      weekTemplateTypes2: state.weekTemplateTypes2
    });
  } catch (error) {
    return res.status(500).json({ error: "Errore nello spostamento allenamento" });
  }
});

app.put("/api/import", async (req, res) => {
  try {
    const incoming = req.body && (req.body.state || req.body);
    if (!incoming || typeof incoming !== "object") {
      return res.status(400).json({ error: "Payload import non valido" });
    }

    // Reshape to guarantee the expected top-level structure, then persist
    // the whole state in one shot (full restore from a backup export).
    const shaped = ensureStateShape(incoming);

    // Fill any missing weekday so a partial template still validates.
    ["lunedi", "martedi", "mercoledi", "giovedi", "venerdi", "sabato", "domenica"].forEach((day) => {
      if (!Array.isArray(shaped.weekTemplate[day])) shaped.weekTemplate[day] = [];
    });

    if (!isValidWeekTemplate(shaped.weekTemplate)) {
      return res.status(400).json({ error: "weekTemplate non valido nel file importato" });
    }
    if (!isValidPersonal(shaped.personal)) {
      return res.status(400).json({ error: "Sezione personale non valida nel file importato" });
    }
    if (!isValidWorkoutSessions(shaped.workoutSessions)) {
      return res.status(400).json({ error: "workoutSessions non valido nel file importato" });
    }

    await writeState(shaped);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Errore durante l'import" });
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

// Only boot the HTTP server when run directly (`node server.js`). When the file
// is required from a test, we just expose the pure helpers below.
if (require.main === module) {
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
}

module.exports = {
  app,
  ensureStateShape,
  isValidWeekTemplate,
  isValidSecondWeekTemplate,
  isValidPersonal,
  isValidWorkoutSessions
};
