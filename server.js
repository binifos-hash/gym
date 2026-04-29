const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "state.json");

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function readState() {
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(raw);
}

function writeState(state) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf8");
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
    const { weekTemplate } = req.body;

    if (!isValidWeekTemplate(weekTemplate)) {
      return res.status(400).json({ error: "Formato weekTemplate non valido" });
    }

    const state = readState();
    state.weekTemplate = weekTemplate;
    writeState(state);

    return res.json({ ok: true, weekTemplate: state.weekTemplate });
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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Gym app in ascolto su http://localhost:${PORT}`);
});
