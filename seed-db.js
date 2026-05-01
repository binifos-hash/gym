/**
 * seed-db.js  –  esegui una volta sola per popolare il DB Postgres con
 * tutti i dati esistenti + sessione completata del 2026-05-01 (venerdì/Gambe).
 *
 * Uso:
 *   DATABASE_URL="postgresql://..." node seed-db.js
 */

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const state = {
  exerciseLibrary: {
    bench_dumbbell_barbell: [
      "Panca piana bilanciere",
      "Panca piana presa stretta",
      "Panca piana presa larga",
      "Floor press bilanciere",
      "Panca piana manubri",
      "Panca manubri alternata",
      "Panca manubri presa neutra",
      "Spinte manubri con fermo",
      "Pullover manubrio su panca",
      "Croci manubri su panca piana",
      "Rematore manubrio su panca",
      "Rematore bilanciere busto flesso",
      "Rematore bilanciere presa inversa",
      "Stacco rumeno bilanciere",
      "Stacco da terra bilanciere",
      "Hip thrust bilanciere su panca",
      "Bulgarian split squat con manubri",
      "Affondi in camminata con manubri",
      "Goblet squat con manubrio",
      "Military press manubri seduto su panca",
      "Shoulder press bilanciere seduto",
      "Alzate laterali manubri seduto",
      "Alzate posteriori manubri su panca",
      "Curl bilanciere in piedi",
      "Curl manubri alternati",
      "Curl concentrato su panca",
      "French press bilanciere su panca",
      "Estensioni tricipiti manubrio sopra testa",
      "Skull crusher bilanciere su panca",
      "Calf raise con manubri"
    ],
    toorx_msx50: [
      "Lat machine avanti presa larga",
      "Lat machine avanti presa stretta",
      "Lat machine presa inversa",
      "Lat machine unilaterale",
      "Pulldown braccia tese al cavo alto",
      "Pulley basso presa stretta",
      "Pulley basso presa larga",
      "Rematore unilaterale cavo basso",
      "Face pull cavo alto",
      "Rear delt row al cavo",
      "Chest press macchina",
      "Chest press presa stretta",
      "Chest fly (pec deck)",
      "Chest fly un braccio",
      "Croci ai cavi alti",
      "Croci ai cavi bassi",
      "Cable crossover centrale",
      "Shoulder press stazione alta",
      "Alzate laterali al cavo",
      "Alzate frontali al cavo",
      "Upright row al cavo basso",
      "Bicipiti curl al cavo basso dritto",
      "Bicipiti curl al cavo basso corda",
      "Bicipiti curl unilaterale al cavo",
      "Bicipiti curl al cavo alto",
      "Tricipiti pushdown barra",
      "Tricipiti pushdown corda",
      "Tricipiti estensioni sopra testa al cavo",
      "Tricipiti kickback al cavo",
      "Squat al cavo basso",
      "Affondi al cavo",
      "Glute kickback al cavo",
      "Abduzioni anca al cavo",
      "Adduzioni anca al cavo",
      "Leg extension con accessorio caviglia",
      "Leg curl in piedi con cavigliera al cavo",
      "Hip hinge al cavo basso",
      "Calf raise al cavo",
      "Crunch al cavo alto",
      "Woodchopper alto-basso",
      "Woodchopper basso-alto",
      "Pallof press al cavo",
      "Russian twist al cavo",
      "Deltoidi posteriori in croce ai cavi",
      "Shrug al cavo basso"
    ]
  },

  weekTemplate: {
    lunedi: [
      { name: "Front Chest Press",              category: "Spinta",   trainingType: "forza",   supportsWeight: true,  weight: null, restSeconds: 60, sets: 3, reps: 10 },
      { name: "Incline Press",                  category: "Spinta",   trainingType: "forza",   supportsWeight: true,  weight: null, restSeconds: 60, sets: 3, reps: 10 },
      { name: "Butterfly",                      category: "Spinta",   trainingType: "ipertrofia", supportsWeight: true, weight: null, restSeconds: 60, sets: 3, reps: 12 },
      { name: "Seated Front Raise",             category: "Spinta",   trainingType: "ipertrofia", supportsWeight: true, weight: null, restSeconds: 60, sets: 3, reps: 12 },
      { name: "Triceps Extension",              category: "Spinta",   trainingType: "ipertrofia", supportsWeight: true, weight: null, restSeconds: 60, sets: 3, reps: 12 },
      { name: "Alzate laterali manubri seduto", category: "Spinta",   trainingType: "ipertrofia", supportsWeight: true, weight: null, restSeconds: 60, sets: 3, reps: 12 }
    ],
    martedi: [],
    mercoledi: [
      { name: "Lat Machine",               category: "Trazione", trainingType: "forza",      supportsWeight: true, weight: null, restSeconds: 60, sets: 3, reps: 10 },
      { name: "Lat Machine Inverse",       category: "Trazione", trainingType: "forza",      supportsWeight: true, weight: null, restSeconds: 60, sets: 3, reps: 10 },
      { name: "Rowing",                    category: "Trazione", trainingType: "forza",      supportsWeight: true, weight: null, restSeconds: 60, sets: 3, reps: 10 },
      { name: "Biceps Curl",               category: "Trazione", trainingType: "ipertrofia", supportsWeight: true, weight: null, restSeconds: 60, sets: 3, reps: 12 },
      { name: "Arm Curl",                  category: "Trazione", trainingType: "ipertrofia", supportsWeight: true, weight: null, restSeconds: 60, sets: 3, reps: 12 },
      { name: "Curl bilanciere in piedi",  category: "Trazione", trainingType: "ipertrofia", supportsWeight: true, weight: null, restSeconds: 60, sets: 3, reps: 12 }
    ],
    giovedi: [],
    venerdi: [
      { name: "Leg Press",                         category: "Gambe", trainingType: "forza",      supportsWeight: true,  weight: null, restSeconds: 60, sets: 3, reps: 10 },
      { name: "Leg Extension",                     category: "Gambe", trainingType: "ipertrofia", supportsWeight: true,  weight: null, restSeconds: 60, sets: 3, reps: 12 },
      { name: "Standing Leg Curl",                 category: "Gambe", trainingType: "ipertrofia", supportsWeight: true,  weight: null, restSeconds: 60, sets: 3, reps: 12 },
      { name: "Hip Abduction",                     category: "Gambe", trainingType: "ipertrofia", supportsWeight: true,  weight: null, restSeconds: 60, sets: 3, reps: 15 },
      { name: "Glute Kick Back",                   category: "Gambe", trainingType: "ipertrofia", supportsWeight: true,  weight: null, restSeconds: 60, sets: 3, reps: 15 },
      { name: "Bulgarian split squat con manubri", category: "Gambe", trainingType: "forza",      supportsWeight: true,  weight: null, restSeconds: 90, sets: 3, reps: 8  }
    ],
    sabato: [],
    domenica: []
  },

  weekTemplateTypes: {
    lunedi:   "Spinta",
    martedi:  null,
    mercoledi: "Trazione",
    giovedi:  null,
    venerdi:  "Gambe",
    sabato:   null,
    domenica: null
  },

  progress: {},

  personal: {
    profileName: "Paolo Bini",
    metrics: [
      { date: "2026-04-29", weight: 60.2, muscleMass: 28.4 }
    ],
    diary: [
      { date: "2026-04-29", text: "Allenamento ottimo, energia alta" }
    ]
  },

  exerciseMeta: {},

  workoutSessions: {
    "2026-05-01": {
      date: "2026-05-01",
      day: "venerdi",
      trainingType: "Gambe",
      status: "completed",
      exercises: [
        { name: "Leg Press",                         category: "Gambe", trainingType: "forza",      supportsWeight: true,  weight: null, restSeconds: 60, sets: 3, reps: 10, completed: true },
        { name: "Leg Extension",                     category: "Gambe", trainingType: "ipertrofia", supportsWeight: true,  weight: null, restSeconds: 60, sets: 3, reps: 12, completed: true },
        { name: "Standing Leg Curl",                 category: "Gambe", trainingType: "ipertrofia", supportsWeight: true,  weight: null, restSeconds: 60, sets: 3, reps: 12, completed: true },
        { name: "Hip Abduction",                     category: "Gambe", trainingType: "ipertrofia", supportsWeight: true,  weight: null, restSeconds: 60, sets: 3, reps: 15, completed: true },
        { name: "Glute Kick Back",                   category: "Gambe", trainingType: "ipertrofia", supportsWeight: true,  weight: null, restSeconds: 60, sets: 3, reps: 15, completed: true },
        { name: "Bulgarian split squat con manubri", category: "Gambe", trainingType: "forza",      supportsWeight: true,  weight: null, restSeconds: 90, sets: 3, reps: 8,  completed: true }
      ],
      durationSeconds: 3600,
      activeStartedAt: null,
      completedAt: "2026-05-01T10:00:00.000Z"
    }
  }
};

async function seed() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_state (
      id   INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL
    )
  `);

  await pool.query(`
    INSERT INTO app_state (id, data)
    VALUES (1, $1::jsonb)
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `, [JSON.stringify(state)]);

  console.log("✅ DB popolato con successo!");
  await pool.end();
}

seed().catch((e) => { console.error("❌ Errore seed:", e); process.exit(1); });
