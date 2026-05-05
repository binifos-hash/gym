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

function summarizeStateForCoach(state) {
  const personal = state.personal || {};
  const metrics = Array.isArray(personal.metrics) ? [...personal.metrics] : [];
  const diary = Array.isArray(personal.diary) ? [...personal.diary] : [];
  const sessions = Object.values(state.workoutSessions || {});

  const recentSessions = sessions
    .filter((s) => s && typeof s === "object" && typeof s.date === "string")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20)
    .map((session) => {
      const exercises = Array.isArray(session.exercises) ? session.exercises : [];
      return {
        date: session.date,
        day: session.day,
        status: session.status,
        trainingType: session.trainingType || null,
        durationSeconds: session.durationSeconds || 0,
        completed: exercises.filter((e) => e && e.completed).length,
        total: exercises.length,
        exercises: exercises.slice(0, 10).map((e) => ({
          name: e.name,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          completed: Boolean(e.completed)
        }))
      };
    });

  const weeklyPlan = {};
  const days = ["lunedi", "martedi", "mercoledi", "giovedi", "venerdi", "sabato", "domenica"];
  days.forEach((day) => {
    const entries = Array.isArray(state.weekTemplate?.[day]) ? state.weekTemplate[day] : [];
    weeklyPlan[day] = {
      type: state.weekTemplateTypes?.[day] || null,
      count: entries.length,
      exercises: entries.slice(0, 8).map((e) => (typeof e === "string" ? e : e.name))
    };
  });

  return {
    profileName: personal.profileName || "",
    latestMetrics: metrics.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6),
    recentDiary: diary.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6),
    weeklyPlan,
    recentSessions
  };
}

function generateFreeCoachReply(question, context) {
  const q = String(question || "").toLowerCase();
  const recent = Array.isArray(context.recentSessions) ? context.recentSessions : [];
  const completed = recent.filter((s) => s.status === "completed");
  const missed = recent.filter((s) => s.status === "missed");
  const latestCompleted = completed[0] || null;

  const lines = [];
  lines.push("Analisi rapida basata sui tuoi dati GymPlanner (modalita free locale):");

  if (latestCompleted) {
    lines.push(
      `- Ultimo workout completato: ${latestCompleted.date} (${latestCompleted.trainingType || latestCompleted.day || "n/d"}), ${latestCompleted.completed}/${latestCompleted.total} esercizi.`
    );
  } else {
    lines.push("- Non vedo allenamenti completati recenti: inizia da una sessione breve per avere dati utili.");
  }

  lines.push(`- Sessioni completate recenti: ${completed.length}.`);
  if (missed.length > 0) {
    lines.push(`- Sessioni perse recenti: ${missed.length}.`);
  }

  const metrics = Array.isArray(context.latestMetrics) ? context.latestMetrics : [];
  if (metrics.length >= 2) {
    const newest = metrics[0];
    const older = metrics[metrics.length - 1];
    const dw = Number(newest.weight) - Number(older.weight);
    const dm = Number(newest.muscleMass) - Number(older.muscleMass);
    lines.push(`- Trend metriche: peso ${dw >= 0 ? "+" : ""}${dw.toFixed(1)} kg, massa ${dm >= 0 ? "+" : ""}${dm.toFixed(1)} kg.`);
  }

  lines.push("");
  lines.push("Consiglio pratico:");

  if (q.includes("spinta") || q.includes("petto") || q.includes("tricip")) {
    lines.push("1. Tieni 1 esercizio forza (6-8 rip) + 2-3 esercizi ipertrofia (10-15 rip).");
    lines.push("2. Lascia 1-2 ripetizioni in riserva nelle prime serie, ultima serie piu intensa.");
    lines.push("3. Se stalli, aumenta prima volume totale (+1 serie) e solo dopo il carico.");
  } else if (q.includes("trazione") || q.includes("schiena") || q.includes("bicip")) {
    lines.push("1. Apri con un movimento verticale (lat machine) e poi un orizzontale (rematore/pulley).");
    lines.push("2. Priorita a tecnica e controllo scapole prima di alzare i kg.");
    lines.push("3. Inserisci 1 esercizio rear delts/face pull per equilibrio posturale.");
  } else if (q.includes("gambe") || q.includes("quad") || q.includes("glute")) {
    lines.push("1. Mantieni ordine: multiarticolare -> isolamento -> finisher.");
    lines.push("2. Se il fiato limita, allunga recuperi principali a 90-120 secondi.");
    lines.push("3. Obiettivo progressivo: +1 rip totale o +2.5 kg ogni 1-2 settimane.");
  } else if (q.includes("recuper") || q.includes("dolore") || q.includes("stanco")) {
    lines.push("1. Riduci volume del 20-30% per 1 settimana (deload).");
    lines.push("2. Mantieni solo i fondamentali e cura sonno/idratazione.");
    lines.push("3. Dolore acuto o persistente: stop esercizio e confronto con professionista.");
  } else {
    lines.push("1. Fissa una progressione semplice: quando completi tutte le serie, aumenta leggermente il carico.");
    lines.push("2. Tieni recuperi coerenti: forza 90-120s, ipertrofia 60-90s.");
    lines.push("3. Registra sempre peso/ripetizioni per poter confrontare settimana su settimana.");
  }

  lines.push("");
  lines.push("Se vuoi, scrivimi il giorno specifico (Spinta/Trazione/Gambe) e ti propongo una revisione esercizio per esercizio.");

  return lines.join("\n");
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

app.get("/api/cleanup", async (req, res) => {
  try {
    const state = await readState();
    const sessions = Object.keys(state.workoutSessions).length;
    return res.json({ ok: true, sessionsRemaining: sessions });
  } catch (error) {
    return res.status(500).json({ error: "Errore cleanup" });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { question } = req.body || {};
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Domanda non valida" });
    }

    const state = await readState();
    const context = summarizeStateForCoach(state);
    const answer = generateFreeCoachReply(question.trim().slice(0, 2000), context);

    return res.json({ ok: true, answer });
  } catch (error) {
    return res.status(500).json({ error: `Errore chatbot: ${error.message}` });
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
