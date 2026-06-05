const test = require("node:test");
const assert = require("node:assert/strict");

const {
  ensureStateShape,
  isValidWeekTemplate,
  isValidPersonal,
  isValidWorkoutSessions
} = require("../server.js");

const ALL_DAYS = ["lunedi", "martedi", "mercoledi", "giovedi", "venerdi", "sabato", "domenica"];

function emptyWeekTemplate() {
  return ALL_DAYS.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {});
}

test("ensureStateShape fills all top-level keys on empty input", () => {
  const shaped = ensureStateShape({});
  assert.ok(shaped.exerciseLibrary && typeof shaped.exerciseLibrary === "object");
  assert.ok(Array.isArray(shaped.exerciseLibrary.bench_dumbbell_barbell));
  assert.ok(Array.isArray(shaped.exerciseLibrary.toorx_msx50));
  assert.deepEqual(shaped.weekTemplate, {});
  assert.deepEqual(shaped.weekTemplateTypes, {});
  assert.deepEqual(shaped.progress, {});
  assert.deepEqual(shaped.workoutSessions, {});
  assert.deepEqual(shaped.exerciseMeta, {});
  assert.equal(shaped.personal.profileName, "");
  assert.ok(Array.isArray(shaped.personal.metrics));
  assert.ok(Array.isArray(shaped.personal.diary));
});

test("ensureStateShape is tolerant of non-object input", () => {
  assert.doesNotThrow(() => ensureStateShape(null));
  assert.doesNotThrow(() => ensureStateShape("garbage"));
  const shaped = ensureStateShape(undefined);
  assert.ok(shaped.personal);
});

test("isValidWeekTemplate requires every weekday to be an array", () => {
  assert.equal(isValidWeekTemplate(emptyWeekTemplate()), true);

  const missingDay = emptyWeekTemplate();
  delete missingDay.domenica;
  assert.equal(isValidWeekTemplate(missingDay), false);

  const badDay = emptyWeekTemplate();
  badDay.lunedi = "not-an-array";
  assert.equal(isValidWeekTemplate(badDay), false);

  assert.equal(isValidWeekTemplate(null), false);
  assert.equal(isValidWeekTemplate(undefined), false);
});

test("isValidPersonal enforces shape", () => {
  assert.equal(isValidPersonal({ profileName: "Paolo", metrics: [], diary: [] }), true);
  assert.equal(isValidPersonal({ profileName: 123, metrics: [], diary: [] }), false);
  assert.equal(isValidPersonal({ profileName: "x", metrics: "no", diary: [] }), false);
  assert.equal(isValidPersonal({ profileName: "x", metrics: [], diary: "no" }), false);
  assert.equal(isValidPersonal(null), false);
});

test("isValidPersonal accepts extra fields (photos, measurements)", () => {
  const personal = {
    profileName: "Paolo",
    metrics: [{ date: "2026-01-01", weight: 80, muscleMass: 35, waist: 84 }],
    diary: [],
    photos: [{ id: "a", date: "2026-01-01", dataUrl: "data:image/jpeg;base64,xxx" }]
  };
  assert.equal(isValidPersonal(personal), true);
});

test("isValidWorkoutSessions validates each session", () => {
  const good = {
    "2026-01-01": {
      date: "2026-01-01",
      day: "lunedi",
      status: "completed",
      exercises: [],
      durationSeconds: 1200
    }
  };
  assert.equal(isValidWorkoutSessions(good), true);

  // durationSeconds is optional but must be a number when present
  const badDuration = JSON.parse(JSON.stringify(good));
  badDuration["2026-01-01"].durationSeconds = "20min";
  assert.equal(isValidWorkoutSessions(badDuration), false);

  const missingExercises = {
    "2026-01-02": { date: "2026-01-02", day: "martedi", status: "planned" }
  };
  assert.equal(isValidWorkoutSessions(missingExercises), false);

  const badStatus = {
    "2026-01-03": { date: "2026-01-03", day: "mercoledi", status: 5, exercises: [] }
  };
  assert.equal(isValidWorkoutSessions(badStatus), false);

  assert.equal(isValidWorkoutSessions({}), true);
});

test("isValidWorkoutSessions accepts sessions carrying per-set logs", () => {
  const withLogs = {
    "2026-02-01": {
      date: "2026-02-01",
      day: "lunedi",
      status: "completed",
      durationSeconds: 3000,
      exercises: [
        {
          name: "Panca piana bilanciere",
          supportsWeight: true,
          sets: 3,
          reps: 8,
          completed: true,
          loggedSets: [
            { reps: 8, weight: 60, done: true },
            { reps: 8, weight: 60, done: true },
            { reps: 6, weight: 60, done: true }
          ]
        }
      ]
    }
  };
  assert.equal(isValidWorkoutSessions(withLogs), true);
});
