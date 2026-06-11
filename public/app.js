// ── Auth token injection ─────────────────────────────────────
// When the backend requires a password, the token is stored locally and
// attached to every same-origin /api/* request via the x-app-token header.
const APP_TOKEN_KEY = "gymplanner_token";
(function installAuthFetch() {
  const origFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = typeof input === "string" ? input : (input && input.url) || "";
    let token = null;
    try { token = localStorage.getItem(APP_TOKEN_KEY); } catch (e) { /* ignore */ }
    if (token && typeof url === "string" && url.includes("/api/")) {
      const opts = Object.assign({}, init);
      opts.headers = Object.assign({}, opts.headers, { "x-app-token": token });
      return origFetch(input, opts);
    }
    return origFetch(input, init);
  };
})();

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
const TOORX_DEFAULT_VIDEO = "https://www.youtube.com/embed/wMtmj4TBsKY";
const DEFAULT_WARMUP_EXERCISES = [
  {
    name: "Elittica (Riscaldamento 5 min)",
    category: "Riscaldamento",
    trainingType: "Cardio",
    supportsWeight: false,
    weight: null,
    restSeconds: 0,
    sets: 1,
    reps: 5,
    warmup: true
  }
];

const EXERCISE_DEFAULTS = {
  // -------- PESI LIBERI --------
  "Military press manubri seduto su panca": {
    weight: 6,
    description: "Seduto su panca con schienale verticale, manubri all'altezza delle spalle con gomiti a 90°. Spingi verso l'alto fino a quasi estendere le braccia convergendo leggermente i manubri. Abbassa lentamente. Mantieni core contratto e schiena incollata allo schienale. 3 serie × 10 rip · recupero 90s",
    videoUrl: ""
  },
  "Alzate laterali manubri seduto": {
    weight: 4,
    description: "Seduto su panca, manubri lungo i fianchi con palmi verso il corpo. Alza le braccia lateralmente fino all'altezza delle spalle con gomiti leggermente flessi. Abbassa in 3 secondi. Non usare l'inerzia. 3 serie × 12 rip · recupero 60s",
    videoUrl: ""
  },
  "Alzate laterali manubri in piedi": {
    weight: 4,
    description: "In piedi gambe parallele, manubri lungo i fianchi. Alza lateralmente fino all'altezza delle spalle, abbassa lentamente. Stai attento a non sollevare le spalle verso le orecchie. 3 serie × 12 rip · recupero 60s",
    videoUrl: ""
  },
  "Panca piana manubri": {
    weight: 10,
    description: "Sdraiato su panca, manubri all'altezza del petto con gomiti a 45-60° rispetto al busto. Spingi verso l'alto convergendo i manubri, abbassa lentamente sentendo lo stiramento. Non rimbalzare il peso sul petto. 3 serie × 10 rip · recupero 90s",
    videoUrl: ""
  },
  "Panca piana bilanciere": {
    weight: 20,
    description: "Sdraiato su panca con bilanciere in rack, presa leggermente più larga delle spalle. Abbassa il bilanciere verso la parte bassa del petto, spingi verso l'alto. Piedi a terra, schiena naturale. 3 serie × 8 rip · recupero 2min",
    videoUrl: ""
  },
  "French press bilanciere su panca": {
    weight: 8,
    description: "Sdraiato su panca, bilanciere con presa stretta (più stretta delle spalle) sopra la testa, braccia perpendicolari. Abbassa il bilanciere verso la fronte piegando solo i gomiti, che devono restare fermi. Estendi risalendo. 3 serie × 10 rip · recupero 90s",
    videoUrl: ""
  },
  "Skull crusher bilanciere su panca": {
    weight: 8,
    description: "Sdraiato su panca, bilanciere con presa stretta sopra la testa. Abbassa il bilanciere verso le corone (nuca/fronte) piegando solo i gomiti. Tieni le braccia perpendicolari al suolo. Estendi risalendo. 3 serie × 10 rip · recupero 90s",
    videoUrl: ""
  },
  "Goblet squat con manubrio": {
    weight: 8,
    description: "In piedi, gambe leggermente più larghe delle spalle, punte dei piedi leggermente divaricate. Tieni il manubrio verticale davanti al petto con entrambe le mani. Scendi in squat profondo mantenendo il petto alto e le ginocchia verso le punte. Risali espirando. 3 serie × 12 rip · recupero 90s",
    videoUrl: ""
  },
  "Bulgarian split squat con manubri": {
    weight: 6,
    description: "Piede posteriore appoggiato su una panca, piede anteriore avanzato di un passo lungo. Manubri lungo i fianchi. Scendi abbassando il ginocchio posteriore verso il suolo mantenendo il busto eretto. Il ginocchio anteriore non deve superare la punta del piede. 3 serie × 8 rip per gamba · recupero 2min",
    videoUrl: ""
  },
  "Hip thrust bilanciere su panca": {
    weight: 10,
    description: "Schiena appoggiata lateralmente alla panca (bordo sotto le scapole), bilanciere sul bacino protetto da un tappetino. Piedi a terra a larghezza fianchi. Fai scendere il bacino verso il suolo, poi spingi in alto contraendo i glutei al massimo. Mantieni 1 secondo in cima. 3 serie × 12 rip · recupero 90s",
    videoUrl: ""
  },
  "Stacco rumeno bilanciere": {
    weight: 12,
    description: "In piedi con bilanciere davanti alle cosce (presa prona). Gambe quasi dritte con leggera flessione del ginocchio. Inclina il busto in avanti abbassando il bilanciere lungo le gambe, mantenendo la schiena neutra e il petto alto. Scendi fino a sentire lo stiramento nei femorali (circa sotto le ginocchia). Risali contraendo glutei e femorali. 3 serie × 10 rip · recupero 90s",
    videoUrl: ""
  },
  "Curl bilanciere in piedi": {
    weight: 10,
    description: "In piedi, bilanciere in presa supinata (palmi verso l'alto) alla larghezza delle spalle. Braccia distese. Fletti i gomiti alzando il bilanciere verso le spalle, tieni i gomiti fermi a contatto con i fianchi. Abbassa lentamente in 3 secondi. 3 serie × 10 rip · recupero 60s",
    videoUrl: ""
  },
  "Curl manubri alternati": {
    weight: 6,
    description: "In piedi con manubri lungo i fianchi, esegui il curl alternando un braccio alla volta ruotando il polso verso l'esterno (supinazione) durante la salita. Gomiti fermi ai fianchi. Abbassa lentamente. 3 serie × 10 rip per braccio · recupero 60s",
    videoUrl: ""
  },
  "Affondi in camminata con manubri": {
    weight: 6,
    description: "In piedi con manubri lungo i fianchi. Fai un passo avanti ampio e scendi abbassando il ginocchio posteriore vicino al suolo. Spingendo col piede anteriore, porta il piede posteriore avanti per il passo successivo. 3 serie × 10 rip per gamba · recupero 90s",
    videoUrl: ""
  },
  "Estensioni tricipiti manubrio sopra testa": {
    weight: 6,
    description: "Seduto su panca, un manubrio sorretto con entrambe le mani sopra la testa, braccia estese. Abbassa il manubrio dietro la nuca piegando i gomiti (che puntano al soffitto), poi estendi risalendo. 3 serie × 12 rip · recupero 60s",
    videoUrl: ""
  },
  // -------- TOORX MSX-50 --------
  "Lat machine avanti presa larga": {
    weight: 15,
    description: "Seduto alla lat machine, coscie bloccate sotto i cuscinetti. Presa larga pronata (più larga delle spalle). Tira la barra verso il petto espandendo il petto e contraendo le scapole verso il basso. Non iperestendere la schiena. Risali controllando. 3 serie × 10 rip · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Lat machine avanti presa stretta": {
    weight: 15,
    description: "Come la lat machine presa larga ma con presa alla larghezza delle spalle. Maggiore enfasi sui bicipiti e sulla parte bassa del gran dorsale. 3 serie × 10 rip · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Lat machine presa inversa": {
    weight: 15,
    description: "Come la lat machine ma con presa supinata (palmi verso di te). Maggiore attivazione dei bicipiti. Tira verso il petto contraendo la schiena. 3 serie × 10 rip · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Pulley basso presa stretta": {
    weight: 12,
    description: "Seduto al pulley basso con schiena dritta e gambe leggermente flesse. Presa con maniglia a V (triangolare). Tira verso l'ombelico mantenendo il busto fermo, stringendo le scapole a fine movimento. Ritorna con controllo estendendo le braccia. 3 serie × 10 rip · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Pulley basso presa larga": {
    weight: 12,
    description: "Come il pulley presa stretta ma con barra larga. Tira verso l'addome stringendo le scapole. 3 serie × 10 rip · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Face pull cavo alto": {
    weight: 10,
    description: "Al cavo alto con corda. In piedi o seduto, tira la corda verso il viso aprendo le mani verso l'esterno e i gomiti verso l'alto. L'obiettivo è la rotazione esterna delle spalle e l'apertura posteriore. Ottimo per postura e cuffia dei rotatori. 3 serie × 15 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Crunch al cavo alto": {
    weight: 8,
    description: "In ginocchio davanti al cavo alto, corda ai lati della testa. Inclinati in avanti flettendo la colonna vertebrale (non solo le also) portando i gomiti verso le cosce. Mantieni la contrazione 1 secondo, ritorna lentamente. 3 serie × 15 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Pallof press al cavo": {
    weight: 8,
    description: "In piedi di fianco alla macchina, cavo all'altezza del petto. Con entrambe le mani tieni il manubrio davanti al petto. Spingi le braccia in avanti estendendole completamente, resistendo alla rotazione del busto (esercizio anti-rotazionale). Mantieni 2 secondi, ritorna. 3 serie × 10 rip per lato · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Bicipiti curl al cavo basso dritto": {
    weight: 10,
    description: "In piedi davanti al cavo basso con barra diritta in presa supinata. Fletti i gomiti alzando la barra verso le spalle mantenendo i gomiti fermi. Abbassa lentamente in 3 secondi. 3 serie × 12 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Bicipiti curl al cavo basso corda": {
    weight: 10,
    description: "Come il curl cavo con barra ma con corda: le mani si aprono alla fine del movimento aumentando la contrazione del bicipite. 3 serie × 12 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Bicipiti curl unilaterale al cavo": {
    weight: 8,
    description: "Un braccio alla volta, cavo basso con maniglia singola. Esegui il curl mantenendo il gomito fermo. 3 serie × 10 rip per braccio · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Bicipiti curl al cavo alto": {
    weight: 8,
    description: "Braccio esteso verso il cavo alto, maniglia singola. Fletti solo il gomito portando la mano verso la spalla. Ottimo pic contraction per il bicipite. 3 serie × 12 rip per braccio · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Tricipiti pushdown barra": {
    weight: 12,
    description: "In piedi davanti al cavo alto con barra diritta o curva, gomiti stretti ai fianchi. Spingi verso il basso estendendo i gomiti, mantieni 1 secondo, risali controllando. Non muovere le spalle. 3 serie × 12 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Tricipiti pushdown corda": {
    weight: 12,
    description: "Come il pushdown con barra ma con corda: alla fine del movimento apri le mani verso il basso aumentando la contrazione. 3 serie × 12 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Tricipiti estensioni sopra testa al cavo": {
    weight: 10,
    description: "Di spalle al cavo alto con corda, un passo avanti. Mani dietro la nuca, gomiti puntano in avanti. Estendi i gomiti portando la corda avanti/in basso. Ottimo per il capo lungo del tricipite. 3 serie × 12 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Alzate laterali al cavo": {
    weight: 8,
    description: "In piedi di fianco al cavo basso, maniglia singola con il braccio lontano dalla macchina. Alza lateralmente fino all'altezza della spalla con gomito leggermente flesso. Abbassa lentamente. 3 serie × 12 rip per braccio · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Alzate frontali al cavo": {
    weight: 8,
    description: "In piedi davanti al cavo basso, maniglia singola. Alza il braccio frontalmente fino all'altezza della spalla con gomito leggermente flesso. 3 serie × 12 rip per braccio · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Squat al cavo basso": {
    weight: 15,
    description: "Cavo basso con maniglia al centro del petto, un passo indietro dalla macchina. Esegui uno squat profondo mantenendo il peso del cavo come contrappeso che aiuta il bilancio. 3 serie × 12 rip · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Affondi al cavo": {
    weight: 10,
    description: "Cavo basso o centrale con maniglia, tieni la maniglia con entrambe le mani davanti al petto. Esegui affondi alternati sul posto. 3 serie × 10 rip per gamba · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Glute kickback al cavo": {
    weight: 8,
    description: "Con cavigliera al cavo basso, in quadrupedia o in piedi appoggiato alla macchina. Spingi il tallone verso il soffitto contraendo il gluteo. Mantieni 1 secondo in cima. 3 serie × 15 rip per gamba · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Leg curl in piedi con cavigliera al cavo": {
    weight: 8,
    description: "In piedi con cavigliera al cavo basso. Appoggiati alla macchina, fletti il ginocchio portando il tallone verso i glutei. Abbassa lentamente. 3 serie × 12 rip per gamba · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Calf raise al cavo": {
    weight: 10,
    description: "In piedi sul bordo di un gradino (o piatto), cavo basso con maniglia sulle spalle o una cintura. Solleva i talloni contrando i polpacci. Scendi lentamente sotto il livello del gradino per allungare. 3 serie × 15 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Woodchopper alto-basso": {
    weight: 10,
    description: "Cavo alto di fianco. Con braccia quasi tese tira il cavo diagonalmente dall'alto verso il basso dall'esterno verso l'interno (come tagliare la legna). Rotazione del busto, non delle braccia. 3 serie × 12 rip per lato · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Woodchopper basso-alto": {
    weight: 10,
    description: "Come il woodchopper ma dal basso verso l'alto. Core anti-rotazionale con rotazione controllata del busto. 3 serie × 12 rip per lato · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Chest press macchina": {
    weight: 20,
    description: "Seduto alla chest press con schiena appoggiata al sedile, maniglie all'altezza del petto. Spingi in avanti estendendo le braccia senza bloccare i gomiti. Ritorna controllando. 3 serie × 10 rip · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Croci ai cavi alti": {
    weight: 8,
    description: "In piedi tra i due cavi alti, maniglie singole. Parti con le braccia aperte, convergi verso il basso portando le mani davanti al petto (o più in basso). Mantieni gomiti leggermente flessi. 3 serie × 12 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Croci ai cavi bassi": {
    weight: 8,
    description: "Come le croci ai cavi alti ma partendo dal basso, convergi verso l'alto in avanti. 3 serie × 12 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Shoulder press stazione alta": {
    weight: 15,
    description: "Seduto alla stazione shoulder press, maniglie all'altezza delle spalle. Spingi verso l'alto, abbassa lentamente. 3 serie × 10 rip · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Rematore unilaterale cavo basso": {
    weight: 12,
    description: "In piedi o seduto, cavo basso maniglia singola. Tira verso il fianco mantenendo la schiena dritta e la scapola che si avvicina alla colonna. 3 serie × 10 rip per braccio · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Hip hinge al cavo basso": {
    weight: 15,
    description: "In piedi davanti al cavo basso, maniglia tra le gambe. Gambe quasi dritte con lieve flessione del ginocchio, busto inclinato in avanti. Estendi i fianchi portando il busto in verticale e contraendo glutei e femorali — come uno stacco ma guidato dal cavo. Abbassa controllando. Ottimo per imparare la cerniera dell'anca. 3 serie × 12 rip · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Alzate frontali al cavo": {
    weight: 8,
    description: "In piedi davanti al cavo basso, maniglia singola. Alza il braccio frontalmente fino all'altezza della spalla (o appena sopra) con gomito leggermente flesso. Abbassa lentamente in 3 secondi. Isola il deltoide anteriore. 3 serie × 12 rip per braccio · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Leg extension con accessorio caviglia": {
    weight: 8,
    description: "Seduto con cavigliera al cavo basso. Estendi il ginocchio portando la gamba in orizzontale, mantieni 1 secondo, abbassa controllando. 3 serie × 15 rip per gamba · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Russian twist al cavo": {
    weight: 8,
    description: "Seduto a terra di fianco al cavo (altezza del petto), gambe sollevate o a terra. Con entrambe le mani tira la maniglia e ruota il busto verso il lato opposto. Lento e controllato — è la rotazione del busto che conta, non le braccia. 3 serie × 12 rip per lato · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Upright row al cavo basso": {
    weight: 10,
    description: "In piedi davanti al cavo basso, presa stretta o corda. Tira verso il mento alzando i gomiti verso l'alto e verso l'esterno. Non alzare oltre l'altezza delle spalle per proteggere la cuffia dei rotatori. 3 serie × 12 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Deltoidi posteriori in croce ai cavi": {
    weight: 6,
    description: "In piedi tra i cavi, inclinato lievemente in avanti. Presa incrociata (mano destra al cavo sinistro e viceversa). Apri le braccia lateralmente verso l'esterno contraendo i deltoidi posteriori. Lento e controllato. 3 serie × 15 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Chest fly (pec deck)": {
    weight: 15,
    description: "Seduto alla macchina pec deck con schiena incollata allo schienale, gomiti a 90° sulle ginocchiere. Unisci i gomiti davanti al petto contraendo il petto, torna lentamente all'apertura massima sentendo lo stiramento. 3 serie × 12 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Pulldown braccia tese al cavo alto": {
    weight: 12,
    description: "In piedi davanti al cavo alto con barra o corda, braccia quasi tese. Premi verso il basso portando le braccia lungo i fianchi contraendo il gran dorsale. Non flettere i gomiti. 3 serie × 12 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Abduzioni anca al cavo": {
    weight: 6,
    description: "In piedi di fianco al cavo basso con cavigliera. Alza la gamba lateralmente verso l'esterno contraendo il gluteo medio. Mantieni il busto fermo, abbassa lentamente. 3 serie × 15 rip per gamba · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Shrug al cavo basso": {
    weight: 20,
    description: "In piedi davanti al cavo basso, barra o maniglie ai lati. Alzata delle spalle verso le orecchie tenendo le braccia dritte. Mantieni 1 secondo in alto, abbassa lentamente. 3 serie × 15 rip · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  // -------- TOORX MSX-50 (EN) --------
  "Front Chest Press": {
    weight: 20,
    description: "Seduto alla stazione chest press frontale, maniglie all'altezza del petto con gomiti a 90°. Spingi in avanti estendendo le braccia senza bloccare i gomiti, poi ritorna controllando fino allo stiramento pettorale. Tieni la schiena incollata al poggiaschena. 3 × 10 · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Butterfly": {
    weight: 15,
    description: "Seduto alla macchina butterfly (pec deck), avambracci sui cuscinetti laterali a 90°. Unisci i gomiti davanti al petto contraendo il petto, torna lentamente sentendo lo stiramento con una pausa di 1s in apertura. 3 × 12 · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Incline Press": {
    weight: 15,
    description: "Seduto alla stazione incline press con schienale inclinato a circa 30-45°, maniglie leggermente sopra il petto. Spingi verso l'alto e in avanti, poi ritorna lentamente. Lavora la parte alta del petto e il deltoide anteriore. 3 × 10 · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Seated Front Raise": {
    weight: 10,
    description: "Seduto alla macchina, maniglie basse. Alza le braccia frontalmente fino all'altezza delle spalle (o appena sopra) con gomiti leggermente flessi. Abbassa lentamente in 3 secondi. Isola il deltoide anteriore. 3 × 12 · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Lat Machine": {
    weight: 15,
    description: "Seduto alla lat machine, coscie bloccate sotto i cuscinetti. Presa larga pronata (più larga delle spalle). Tira la barra verso il petto espandendo il petto e contraendo le scapole verso il basso. Non iperestendere la schiena. Risali controllando. 3 × 10 · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Lat Machine Inverse": {
    weight: 15,
    description: "Come la Lat Machine ma con presa supinata (palmi verso di te, mani più ravvicinate). Maggiore attivazione dei bicipiti e della parte bassa del gran dorsale. Tira verso il petto contraendo la schiena. 3 × 10 · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Lat Pull Down": {
    weight: 12,
    description: "In piedi o in ginocchio davanti al cavo alto con barra o corda, braccia quasi tese. Spingi verso il basso portando la barra lungo i fianchi contraendo il gran dorsale, senza flettere i gomiti. Ritorna lentamente. 3 × 12 · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Behind Neck Pull-Down": {
    weight: 12,
    description: "Seduto alla lat machine. Presa larga, inclina il busto leggermente in avanti e porta la barra dietro la nuca (non forzare: se hai problemi alla spalla, evita questo esercizio). Contrai il dorsale, risali controllando. 3 × 10 · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Pectoral Machine": {
    weight: 20,
    description: "Seduto alla macchina pettorale (convergente o a leve). Avambracci o mani sulle leve laterali. Convergi verso il centro contraendo i pettorali, mantieni 1 secondo, ritorna con controllo. 3 × 12 · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Seated Fly": {
    weight: 10,
    description: "Seduto alla macchina fly (cavi o leve). Braccia aperte lateralmente con gomiti leggermente flessi. Convergi avanti portando le mani davanti al petto, mantieni 1s, ritorna sentendo lo stiramento. 3 × 12 · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Leg Extension": {
    weight: 20,
    description: "Seduto alla macchina leg extension, cuscinetto sulla parte superiore del piede. Estendi le ginocchia fino a portare le gambe in orizzontale, mantieni 1 secondo contraendo il quadricipite, abbassa lentamente. Isola il quadricipite. 3 × 15 · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Standing Leg Curl": {
    weight: 15,
    description: "In piedi alla macchina leg curl, cuscinetto sulla parte bassa del polpaccio. Fletti il ginocchio portando il tallone verso i glutei, contraendo i femorali. Abbassa lentamente. Lavora un gamba alla volta per simmetria. 3 × 12 per gamba · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Overhead Triceps Extension": {
    weight: 15,
    description: "Seduto o in piedi, cavo alto o corda dietro la nuca. Gomiti puntano in avanti, estendi le braccia portando la corda/barra verso il basso/frontalmente. Lavora il capo lungo del tricipite (il più grande). 3 × 12 · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Triceps Extension": {
    weight: 15,
    description: "In piedi davanti al cavo alto, barra dritta o curva in presa stretta (più stretta delle spalle). Gomiti fermi ai fianchi. Spingi verso il basso estendendo completamente i gomiti. Mantieni 1s, risali controllando. 3 × 12 · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Rowing": {
    weight: 20,
    description: "Seduto al rower/pulley basso con schiena dritta e gambe leggermente flesse, presa con maniglia triangolare. Tira verso l'ombelico mantenendo il busto fermo e le scapole che si chiudono a fine movimento. Ritorna estendendo le braccia. 3 × 10 · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Biceps Curl": {
    weight: 15,
    description: "In piedi o seduto davanti al cavo basso, barra EZ o diritta in presa supinata. Fletti i gomiti alzando la barra verso le spalle, tieni i gomiti fermi. Abbassa lentamente in 3 secondi. 3 × 12 · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Stand Mid Row": {
    weight: 20,
    description: "In piedi davanti al cavo centrale (all'altezza del petto), presa con barra o maniglie. Piedi larghi, core contratto. Tira orizzontalmente verso il petto/ombelico stringendo le scapole. Ritorna controllando. 3 × 10 · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Hip Abduction": {
    weight: 20,
    description: "Seduto alla macchina hip abduction (o con cavigliera al cavo). Apri le gambe lateralmente contro la resistenza contraendo il gluteo medio. Ritorna lentamente. 3 × 15 · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Lateral Leg Raise": {
    weight: 8,
    description: "In piedi di fianco alla macchina, cavigliera al cavo basso. Alza la gamba lateralmente verso l'esterno contraendo il gluteo medio. Tieni il busto fermo, abbassa lentamente. 3 × 15 per gamba · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Glute Kick Back": {
    weight: 10,
    description: "In piedi di fronte alla macchina con cavigliera al cavo basso, corpo leggermente inclinato in avanti appoggiato alle maniglie. Spingi il tallone verso il dietro/alto contraendo il gluteo al massimo. Mantieni 1s in cima, ritorna lentamente. 3 × 15 per gamba · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Leg Press": {
    weight: 40,
    description: "Seduto alla macchina leg press, piedi sulla piattaforma a larghezza fianchi (o leggermente più larghi). Abbassa la piattaforma fino a 90° di flessione del ginocchio, poi spingi espirando. Non bloccare i gomiti a fine movimento. Varia la posizione dei piedi per lavorare diversamente il quadricipite/gluteo. 3 × 12 · recupero 90s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  },
  "Arm Curl": {
    weight: 12,
    description: "Seduto alla macchina arm curl (Scott machine), avambracci sul cuscinetto inclinato. Fletti i gomiti portando le mani verso le spalle, mantieni 1s, abbassa lentamente. Isola completamente il bicipite eliminando l'inerzia. 3 × 12 · recupero 60s",
    videoUrl: "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y"
  }
};

let state = null;
let exerciseInfoPanelCurrentName = null;
// Chiave (data+slot) della sessione da cui è stato aperto il pannello info esercizio.
let exerciseInfoPanelSessionKey = null;
// Data (YYYY-MM-DD) dell'allenamento aperto nel dettaglio. Il dettaglio mostra
// entrambi gli allenamenti della giornata (slot 1 e 2) impilati.
let workoutDetailDate = null;
// Timer attivi nel dettaglio: { session, el } aggiornati ogni secondo.
let detailTimerEls = [];
// Slot della scheda in modifica nell'editor: 1 = allenamento principale, 2 = secondo.
let editorSlot = 1;
let calendarMonthCursor = startOfMonth(new Date());
let timerIntervalId = null;
let restTimerIntervalId = null;
let restTimerMinimized = false;
let pendingProgressionReview = null;

const weekContainerEl = document.getElementById("weekContainer");
const weekOverviewEl = document.getElementById("weekOverview");
const editorDaySelectEl = document.getElementById("editorDaySelect");
const editorDayTypeSelectEl = document.getElementById("editorDayTypeSelect");
const editorSlotBtns = [...document.querySelectorAll(".editor-slot-btn")];
const editorSearchEl = document.getElementById("editorSearch");
const libraryPickerEl = document.getElementById("libraryPicker");
const dayExerciseListEl = document.getElementById("dayExerciseList");
const saveWeekBtn = document.getElementById("saveWeekBtn");
const openPickerBtn = document.getElementById("openPickerBtn");
const closePickerBtn = document.getElementById("closePickerBtn");
const pickerDrawerEl = document.getElementById("pickerDrawer");
const openLibraryMgrBtn = document.getElementById("openLibraryMgrBtn");
const closeLibraryMgrBtn = document.getElementById("closeLibraryMgrBtn");
const libraryModalEl = document.getElementById("libraryModal");
const libraryMgrListEl = document.getElementById("libraryMgrList");
const newExerciseNameEl = document.getElementById("newExerciseName");
const addExerciseBtnEl = document.getElementById("addExerciseBtn");
const saveLibraryBtnEl = document.getElementById("saveLibraryBtn");
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
const calendarHeatmapSummaryEl = document.getElementById("calendarHeatmapSummary");
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
const metricWaistEl = document.getElementById("metricWaist");
const metricChestEl = document.getElementById("metricChest");
const metricArmEl = document.getElementById("metricArm");
const metricThighEl = document.getElementById("metricThigh");
const measurementsSummaryEl = document.getElementById("measurementsSummary");
const addPhotoBtn = document.getElementById("addPhotoBtn");
const photoInputEl = document.getElementById("photoInput");
const photoGridEl = document.getElementById("photoGrid");
const photoViewerEl = document.getElementById("photoViewer");
const photoViewerImgEl = document.getElementById("photoViewerImg");
const photoViewerDateEl = document.getElementById("photoViewerDate");
const photoViewerCloseEl = document.getElementById("photoViewerClose");
const photoViewerDeleteEl = document.getElementById("photoViewerDelete");
const metricsYAxisEl = document.getElementById("metricsYAxis");
const metricsChartEl = document.getElementById("metricsChart");
const metricsChartScrollEl = document.getElementById("metricsChartScroll");
const metricsLegendEl = document.getElementById("metricsLegend");
const diaryForm = document.getElementById("diaryForm");
const diaryInputEl = document.getElementById("diaryInput");
const diaryListEl = document.getElementById("diaryList");

const navButtons = [...document.querySelectorAll(".nav-btn")];
const tabPanels = [...document.querySelectorAll(".tab-panel")];
const mainHeaderEl = document.querySelector(".main-header");
const navIndicator = document.querySelector(".nav-indicator");

const exerciseInfoPanelEl = document.getElementById("exerciseInfoPanel");
const exerciseInfoTitleEl = document.getElementById("exerciseInfoTitle");
const exerciseInfoWeightEl = document.getElementById("exerciseInfoWeight");
const exerciseInfoDescEl = document.getElementById("exerciseInfoDesc");
const exerciseInfoVideoUrlEl = document.getElementById("exerciseInfoVideoUrl");
const exerciseInfoVideoWrapEl = document.getElementById("exerciseInfoVideoWrap");
const exerciseInfoVideoEl = document.getElementById("exerciseInfoVideo");
const saveExerciseInfoBtnEl = document.getElementById("saveExerciseInfoBtn");
const closeExerciseInfoBtnEl = document.getElementById("closeExerciseInfoBtn");
const exerciseInfoSetsValEl = document.getElementById("exerciseInfoSetsVal");
const exerciseInfoRepsValEl = document.getElementById("exerciseInfoRepsVal");
const exerciseInfoSetsWrapEl = document.getElementById("exerciseInfoSetsWrap");
const exerciseInfoProgressionWrapEl = document.getElementById("exerciseInfoProgressionWrap");
const exerciseInfoPrEl = document.getElementById("exerciseInfoPr");
const exerciseInfoChartEl = document.getElementById("exerciseInfoChart");

const themeToggleBtn = document.getElementById("themeToggleBtn");
const openPlateCalcBtn = document.getElementById("openPlateCalcBtn");
const closePlateCalcBtn = document.getElementById("closePlateCalcBtn");
const plateCalcModalEl = document.getElementById("plateCalcModal");
const plateTargetWeightEl = document.getElementById("plateTargetWeight");
const plateBarWeightEl = document.getElementById("plateBarWeight");
const plateResultEl = document.getElementById("plateResult");
const exportDataBtn = document.getElementById("exportDataBtn");
const importDataBtn = document.getElementById("importDataBtn");
const importDataInputEl = document.getElementById("importDataInput");

function moveNavIndicator(btn) {
  if (!navIndicator || !btn) return;
  const navPad = 8;
  const dx = btn.offsetLeft - navPad;
  navIndicator.style.width = btn.offsetWidth + "px";
  navIndicator.style.transform = `translateX(${dx}px)`;
}

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

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  try {
    // youtu.be/ID or youtube.com/watch?v=ID
    const u = new URL(url);
    let videoId = null;
    if (u.hostname === "youtu.be") {
      videoId = u.pathname.slice(1).split("?")[0];
    } else if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) {
        videoId = u.pathname.replace("/embed/", "").split("/")[0];
      } else {
        videoId = u.searchParams.get("v");
      }
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

function isToorxExercise(name) {
  return state && state.exerciseLibrary && state.exerciseLibrary.toorx_msx50 &&
    state.exerciseLibrary.toorx_msx50.includes(name);
}

// Walks every completed session and collects this exercise's logged performance,
// one data point per session date, sorted chronologically.
function getExerciseHistory(name) {
  const points = [];
  Object.values(state.workoutSessions || {}).forEach((session) => {
    if (!session || session.status !== "completed" || !Array.isArray(session.exercises)) return;
    const ex = session.exercises.find((e) => e && e.name === name && !e.warmup);
    if (!ex) return;
    const summary = summarizeExerciseSets(ex);
    if (!summary.loggedCount) return;
    points.push({ date: session.date, ...summary });
  });
  points.sort((a, b) => a.date.localeCompare(b.date));
  return points;
}

// Renders the personal-record badges and the progression line chart inside the
// exercise info panel. Hidden when there is no logged history yet.
function renderExerciseProgression(name) {
  if (!exerciseInfoProgressionWrapEl || !exerciseInfoChartEl || !exerciseInfoPrEl) return;

  const history = getExerciseHistory(name);
  if (!history.length) {
    exerciseInfoProgressionWrapEl.classList.add("hidden");
    return;
  }
  exerciseInfoProgressionWrapEl.classList.remove("hidden");

  const hasWeight = history.some((p) => p.hasWeight);
  const prTop = history.reduce((m, p) => Math.max(m, p.topWeight || 0), 0);
  const prOneRm = history.reduce((m, p) => Math.max(m, p.bestOneRm || 0), 0);
  const prVolume = history.reduce((m, p) => Math.max(m, p.totalVolume || 0), 0);

  exerciseInfoPrEl.innerHTML = "";
  const badges = [];
  if (hasWeight) {
    badges.push(["Record peso", `${prTop} kg`]);
    if (prOneRm) badges.push(["1RM stimato", `~${Math.round(prOneRm)} kg`]);
    badges.push(["Volume max", `${Math.round(prVolume)} kg`]);
  } else {
    badges.push(["Rip. max (sessione)", `${Math.round(prVolume)}`]);
  }
  badges.push(["Sessioni", String(history.length)]);
  badges.forEach(([label, value]) => {
    const badge = document.createElement("div");
    badge.className = "pr-badge";
    badge.innerHTML = `<span class="pr-badge-val">${value}</span><span class="pr-badge-label">${label}</span>`;
    exerciseInfoPrEl.appendChild(badge);
  });

  // Plot estimated 1RM when weighted, otherwise total volume (reps).
  const series = history.map((p) => (hasWeight ? (p.bestOneRm || p.topWeight || 0) : p.totalVolume));
  drawProgressionChart(exerciseInfoChartEl, history.map((p) => p.date), series, hasWeight ? "kg" : "rip");
}

function drawProgressionChart(canvas, dates, values, unit) {
  const ctx = canvas.getContext("2d");
  const cssWidth = canvas.clientWidth || 320;
  const cssHeight = 150;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.height = cssHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, cssWidth, cssHeight);

  const padL = 38;
  const padR = 12;
  const padT = 16;
  const padB = 24;

  if (values.length < 2) {
    ctx.fillStyle = "#8d8d8d";
    ctx.font = "12px 'DM Sans', sans-serif";
    ctx.fillText("Servono almeno 2 sessioni registrate", padL - 30, cssHeight / 2);
    return;
  }

  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const lo = Math.floor(minV - (maxV - minV) * 0.15 - 0.5);
  const hi = Math.ceil(maxV + (maxV - minV) * 0.15 + 0.5);
  const span = hi - lo || 1;

  const px = (i) => padL + (i * (cssWidth - padL - padR)) / (values.length - 1);
  const py = (v) => cssHeight - padB - ((v - lo) / span) * (cssHeight - padT - padB);

  // Gridlines + Y labels
  ctx.font = "10px 'DM Sans', sans-serif";
  ctx.textAlign = "right";
  for (let i = 0; i <= 3; i += 1) {
    const y = padT + (i * (cssHeight - padT - padB)) / 3;
    const val = (hi - (span * i) / 3).toFixed(0);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(cssWidth - padR, y);
    ctx.stroke();
    ctx.fillStyle = "#7a7a7a";
    ctx.fillText(`${val}`, padL - 6, y + 3);
  }

  // Area + line
  const accent = "#e8ff47";
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = px(i);
    const y = py(v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(px(values.length - 1), cssHeight - padB);
  ctx.lineTo(px(0), cssHeight - padB);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, padT, 0, cssHeight - padB);
  grad.addColorStop(0, "rgba(232,255,71,0.22)");
  grad.addColorStop(1, "rgba(232,255,71,0)");
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  values.forEach((v, i) => {
    const x = px(i);
    const y = py(v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Points
  values.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(px(i), py(v), 3, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
  });

  // Last value label
  const lastX = px(values.length - 1);
  const lastY = py(values[values.length - 1]);
  ctx.fillStyle = "#f0f0f0";
  ctx.font = "11px 'DM Sans', sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`${Math.round(values[values.length - 1])} ${unit}`, lastX - 2, lastY - 8);
}

function openExerciseInfoPanel(name, sets, reps, sessionKey) {
  exerciseInfoPanelCurrentName = name;
  exerciseInfoPanelSessionKey = sessionKey || null;
  const saved = (state.exerciseMeta && state.exerciseMeta[name]) || {};
  const defaults = EXERCISE_DEFAULTS[name] || {};
  exerciseInfoTitleEl.textContent = name;

  // Prefer the session's stored exercise weight (historical snapshot) over the global meta weight.
  // This prevents the panel from showing a later-updated weight when reviewing completed sessions.
  const detailSession = sessionKey ? state.workoutSessions[sessionKey] : null;
  const sessionExercise = detailSession
    ? detailSession.exercises.find((e) => e.name === name)
    : null;
  const sessionWeight = sessionExercise && typeof sessionExercise.weight === "number" ? sessionExercise.weight : null;
  const effectiveWeight = sessionWeight !== null
    ? sessionWeight
    : (saved.weight != null ? saved.weight : (defaults.weight != null ? defaults.weight : ""));
  exerciseInfoWeightEl.value = effectiveWeight !== "" ? String(effectiveWeight) : "";
  exerciseInfoDescEl.value = saved.description != null ? saved.description : (defaults.description || "");

  // Sets × Reps — look up from session/template if not passed directly
  let resolvedSets = sets;
  let resolvedReps = reps;
  if (resolvedSets == null || resolvedReps == null) {
    // Try to find in the session the panel was opened from
    if (detailSession) {
      const ex = detailSession.exercises.find((e) => e.name === name);
      if (ex) { resolvedSets = ex.sets; resolvedReps = ex.reps; }
    }
    // Fallback: check both week templates for any day that has this exercise
    if (resolvedSets == null) {
      const templateDays = [
        ...Object.values(state.weekTemplate || {}),
        ...Object.values(state.weekTemplate2 || {})
      ];
      for (const day of templateDays) {
        const ex = (Array.isArray(day) ? day : []).find((e) => (typeof e === "string" ? e : e.name) === name);
        if (ex && typeof ex === "object") { resolvedSets = ex.sets; resolvedReps = ex.reps; break; }
      }
    }
  }
  if (exerciseInfoSetsValEl) exerciseInfoSetsValEl.textContent = resolvedSets != null ? resolvedSets : 3;
  if (exerciseInfoRepsValEl) exerciseInfoRepsValEl.textContent = resolvedReps != null ? resolvedReps : 10;
  if (exerciseInfoSetsWrapEl) exerciseInfoSetsWrapEl.classList.toggle("hidden", false);

  // Video URL: saved > defaults > toorx fallback
  const savedUrl = saved.videoUrl != null ? saved.videoUrl : null;
  const defaultUrl = defaults.videoUrl || (isToorxExercise(name) ? "https://youtu.be/wMtmj4TBsKY?si=Sw1U8XnoSl0GQx4y" : "");
  const displayUrl = savedUrl !== null ? savedUrl : defaultUrl;
  exerciseInfoVideoUrlEl.value = displayUrl;
  updateExerciseInfoVideo(displayUrl);
  exerciseInfoPanelEl.classList.remove("hidden");

  // Render progression after the panel is visible so the canvas has a layout width.
  requestAnimationFrame(() => renderExerciseProgression(name));
}

function closeExerciseInfoPanel() {
  exerciseInfoPanelEl.classList.add("hidden");
  if (exerciseInfoVideoEl) exerciseInfoVideoEl.src = "";
  exerciseInfoPanelCurrentName = null;
}

function updateExerciseInfoVideo(url) {
  const embedUrl = getYouTubeEmbedUrl(url);
  if (embedUrl) {
    exerciseInfoVideoEl.src = embedUrl;
    exerciseInfoVideoWrapEl.classList.remove("hidden");
  } else {
    exerciseInfoVideoEl.src = "";
    exerciseInfoVideoWrapEl.classList.add("hidden");
  }
}

async function saveExerciseInfoEntry() {
  if (!exerciseInfoPanelCurrentName) return;
  const name = exerciseInfoPanelCurrentName;
  if (!state.exerciseMeta) state.exerciseMeta = {};
  const weightVal = parseFloat(exerciseInfoWeightEl.value);
  const weightSave = isNaN(weightVal) ? null : weightVal;

  // 1. Save to exerciseMeta (global reference / default weight)
  state.exerciseMeta[name] = {
    weight: weightSave,
    description: exerciseInfoDescEl.value.trim(),
    videoUrl: exerciseInfoVideoUrlEl.value.trim()
  };

  // 2. Propagate weight back to the week templates (both slots) so the editor
  //    reflects it. Only update entries that currently have no weight override.
  if (weightSave !== null) {
    [state.weekTemplate, state.weekTemplate2].forEach((templateMap) => {
      if (!templateMap) return;
      Object.values(templateMap).forEach((entries) => {
        if (!Array.isArray(entries)) return;
        entries.forEach((entry) => {
          if (entry && entry.name === name && entry.weight == null) {
            entry.weight = weightSave;
          }
        });
      });
    });
  }

  // 3. Update the originating session's exercise weight ONLY if the session is
  //    still in-progress or paused (i.e. NOT completed). Never rewrite history.
  if (exerciseInfoPanelSessionKey && state.workoutSessions[exerciseInfoPanelSessionKey]) {
    const session = state.workoutSessions[exerciseInfoPanelSessionKey];
    if (session.status === "in_progress" || session.status === "paused") {
      const ex = session.exercises.find((e) => e.name === name);
      if (ex && ex.supportsWeight) ex.weight = weightSave;
    }
  }

  const res = await fetch("/api/exercise-meta", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exerciseMeta: state.exerciseMeta })
  });
  if (!res.ok) { alert("Errore nel salvataggio"); return; }
  closeExerciseInfoPanel();
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

// Le sessioni del 2º allenamento della giornata usano la chiave "YYYY-MM-DD#2";
// quelle del 1º restano keyate per sola data (retrocompatibili).
function sessionKeyFor(dateKey, slot) {
  return slot === 2 ? `${dateKey}#2` : dateKey;
}

function parseSessionKey(sessionKey) {
  const [dateKey, slotStr] = String(sessionKey).split("#");
  return { dateKey, slot: slotStr === "2" ? 2 : 1 };
}

function getTemplateMapForSlot(slot) {
  return slot === 2 ? state.weekTemplate2 : state.weekTemplate;
}

function getTemplateTypesForSlot(slot) {
  return slot === 2 ? state.weekTemplateTypes2 : state.weekTemplateTypes;
}

// Tutte le sessioni registrate per una data (1º e 2º allenamento).
function getSessionsForDate(dateKey) {
  return [state.workoutSessions[dateKey], state.workoutSessions[sessionKeyFor(dateKey, 2)]]
    .filter((s) => s && Array.isArray(s.exercises) && s.exercises.length);
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

function roundToStep(value, step = 0.5) {
  if (!Number.isFinite(value)) return null;
  const safeStep = step > 0 ? step : 0.5;
  return Math.round(value / safeStep) * safeStep;
}

function resolveExerciseWeight(name, explicitWeight) {
  if (typeof explicitWeight === "number" && Number.isFinite(explicitWeight)) {
    return explicitWeight;
  }
  const metaWeight = state.exerciseMeta?.[name]?.weight;
  if (typeof metaWeight === "number" && Number.isFinite(metaWeight)) {
    return metaWeight;
  }
  const defaultWeight = EXERCISE_DEFAULTS[name]?.weight;
  if (typeof defaultWeight === "number" && Number.isFinite(defaultWeight)) {
    return defaultWeight;
  }
  return null;
}

function getExerciseCompletionTrend(exerciseName, dateKey, limit = 4) {
  const prior = Object.values(state.workoutSessions || {})
    .filter((session) => session && session.status === "completed" && session.date < dateKey)
    .sort((a, b) => b.date.localeCompare(a.date));

  const outcomes = [];
  prior.forEach((session) => {
    if (outcomes.length >= limit) return;
    const match = Array.isArray(session.exercises)
      ? session.exercises.find((exercise) => exercise && exercise.name === exerciseName)
      : null;
    if (match) {
      outcomes.push(match.completed ? 1 : -1);
    }
  });

  return outcomes.reduce((sum, value) => sum + value, 0);
}

function getAverageDurationForTrainingType(trainingType, dateKey) {
  if (!trainingType) return 0;
  const durations = Object.values(state.workoutSessions || {})
    .filter((session) => {
      return session
        && session.status === "completed"
        && session.date < dateKey
        && session.trainingType === trainingType
        && Number.isFinite(session.durationSeconds)
        && session.durationSeconds > 0;
    })
    .map((session) => session.durationSeconds)
    .slice(0, 8);

  if (!durations.length) return 0;
  return durations.reduce((sum, seconds) => sum + seconds, 0) / durations.length;
}

// Distills an exercise's per-set log into the signals used by the progression
// engine: the weight actually used and how the achieved reps compare to target.
// Returns null when nothing meaningful was logged.
function getLoggedPerformance(exercise) {
  const sets = Array.isArray(exercise.loggedSets)
    ? exercise.loggedSets.filter((s) => Number.isFinite(Number(s.reps)) && Number(s.reps) > 0)
    : [];
  if (!sets.length) return null;

  const targetReps = Number.isFinite(exercise.reps) && exercise.reps > 0 ? exercise.reps : 10;
  let weightSum = 0;
  let weightCount = 0;
  let topWeight = 0;
  let ratioSum = 0;
  let allHitTarget = true;

  sets.forEach((s) => {
    const reps = Number(s.reps);
    const weight = Number(s.weight);
    if (Number.isFinite(weight) && weight > 0) {
      weightSum += weight;
      weightCount += 1;
      if (weight > topWeight) topWeight = weight;
    }
    ratioSum += reps / targetReps;
    if (reps < targetReps) allHitTarget = false;
  });

  return {
    workingWeight: weightCount ? weightSum / weightCount : null,
    topWeight,
    avgRepsRatio: ratioSum / sets.length,
    allHitTarget,
    targetReps,
    loggedSets: sets.length
  };
}

function computeNextWeightSuggestion(exercise, session, sessionCompletionRate) {
  if (!exercise || !exercise.supportsWeight) {
    return null;
  }

  const perf = getLoggedPerformance(exercise);

  // ── Preferred path: real per-set data ("double progression") ──
  // Increase the load only when every working set reached the target reps;
  // hold when close; back off when reps fell well short. The base weight is
  // the load actually used, not the planned one.
  if (perf && (perf.workingWeight || perf.topWeight)) {
    const baseWeight = perf.workingWeight || perf.topWeight;
    if (!Number.isFinite(baseWeight) || baseWeight <= 0) return null;

    let factor;
    if (perf.allHitTarget) {
      // Bigger jump when comfortably over target reps, smaller when just on it.
      factor = perf.avgRepsRatio >= 1.25 ? 0.05 : 0.025;
    } else if (perf.avgRepsRatio >= 0.85) {
      factor = 0; // close enough — repeat the same weight
    } else {
      factor = -0.05; // missed reps clearly — deload a touch
    }

    // Secondary nudge from recent completion trend.
    const trend = getExerciseCompletionTrend(exercise.name, session.date, 4);
    if (trend <= -2 && factor > 0) factor -= 0.015;

    const suggested = roundToStep(Math.max(0.5, baseWeight * (1 + factor)), 0.5);
    if (!Number.isFinite(suggested)) return null;
    // Skip no-op suggestions (same as base) to avoid noisy review cards.
    if (factor === 0 && Math.abs(suggested - baseWeight) < 0.25) return null;

    return { current: roundToStep(baseWeight, 0.5), suggested, delta: factor, trend };
  }

  // ── Fallback: legacy heuristic from the completed flag ──
  const currentWeight = resolveExerciseWeight(exercise.name, exercise.weight);
  if (!Number.isFinite(currentWeight) || currentWeight <= 0) {
    return null;
  }

  let delta = exercise.completed ? 0.03 : -0.05;

  if (sessionCompletionRate >= 0.9) delta += 0.01;
  if (sessionCompletionRate < 0.7) delta -= 0.02;

  const trend = getExerciseCompletionTrend(exercise.name, session.date, 4);
  if (trend >= 2) delta += 0.01;
  if (trend <= -2) delta -= 0.02;

  const avgDuration = getAverageDurationForTrainingType(session.trainingType, session.date);
  if (avgDuration > 0 && session.durationSeconds > avgDuration * 1.25 && delta > 0) {
    delta -= 0.015;
  }

  delta = Math.max(-0.1, Math.min(0.08, delta));

  const suggested = roundToStep(Math.max(0.5, currentWeight * (1 + delta)), 0.5);
  if (!Number.isFinite(suggested)) {
    return null;
  }

  return {
    current: currentWeight,
    suggested,
    delta,
    trend
  };
}

function buildAutoProgressionUpdates(session) {
  if (!session || session.status !== "completed" || !Array.isArray(session.exercises) || !session.exercises.length) {
    return [];
  }

  const sessionCompletionRate = getCompletedExerciseCount(session) / Math.max(1, session.exercises.length);
  const updates = [];

  session.exercises.forEach((exercise) => {
    const suggestion = computeNextWeightSuggestion(exercise, session, sessionCompletionRate);
    if (!suggestion) return;

    const safeSuggested = Math.max(0.5, suggestion.suggested);
    updates.push({
      name: exercise.name,
      from: suggestion.current,
      to: safeSuggested,
      suggested: safeSuggested
    });
  });

  return updates;
}

function applyProgressionUpdates(updates, sessionDate) {
  if (!Array.isArray(updates) || !updates.length) {
    return;
  }

  if (!state.exerciseMeta || typeof state.exerciseMeta !== "object") {
    state.exerciseMeta = {};
  }

  updates.forEach((entry) => {
    if (!entry || !entry.name || !Number.isFinite(entry.suggested)) {
      return;
    }
    const safeSuggested = Math.max(0.5, roundToStep(entry.suggested, 0.5));
    const prevMeta = state.exerciseMeta[entry.name] || {};
    state.exerciseMeta[entry.name] = {
      ...prevMeta,
      weight: safeSuggested
    };
    entry.suggested = safeSuggested;
  });

  // Keep already-generated future planned sessions aligned with new recommendations.
  Object.values(state.workoutSessions || {}).forEach((futureSession) => {
    if (!futureSession || futureSession.date <= sessionDate || futureSession.status !== "planned") {
      return;
    }
    futureSession.exercises.forEach((exercise) => {
      const target = updates.find((entry) => entry && entry.name === exercise.name);
      if (target && exercise.supportsWeight) {
        exercise.weight = target.suggested;
      }
    });
  });
}

function openProgressionReview(session, updates) {
  if (!session || !Array.isArray(updates) || !updates.length) {
    pendingProgressionReview = null;
    return;
  }

  pendingProgressionReview = {
    sessionKey: sessionKeyFor(session.date, session.slot),
    sessionDate: session.date,
    updates: updates.map((entry) => ({ ...entry }))
  };
}

function dismissProgressionReview() {
  pendingProgressionReview = null;
  if (workoutDetailDate) {
    renderWorkoutDetail();
  }
}

async function confirmProgressionReview() {
  if (!pendingProgressionReview || !Array.isArray(pendingProgressionReview.updates)) {
    return;
  }

  const cleanUpdates = pendingProgressionReview.updates
    .map((entry) => {
      const parsed = Number(entry.suggested);
      if (!entry.name || Number.isNaN(parsed) || parsed <= 0) {
        return null;
      }
      return {
        ...entry,
        suggested: Math.max(0.5, roundToStep(parsed, 0.5))
      };
    })
    .filter(Boolean);

  if (!cleanUpdates.length) {
    dismissProgressionReview();
    return;
  }

  applyProgressionUpdates(cleanUpdates, pendingProgressionReview.sessionDate);
  const metaSaved = await saveExerciseMetaState();
  if (!metaSaved) {
    alert("Non sono riuscito a salvare i nuovi carichi consigliati.");
    return;
  }

  pendingProgressionReview = null;
  renderEditor();
  renderWeekCards();
  renderCalendar();
  if (workoutDetailDate) {
    renderWorkoutDetail();
  }
}

async function saveExerciseMetaState() {
  const res = await fetch("/api/exercise-meta", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exerciseMeta: state.exerciseMeta })
  });
  return res.ok;
}

function getSessionPerformanceScore(session) {
  if (!session || !Array.isArray(session.exercises) || !session.exercises.length) {
    return null;
  }

  if (session.status === "missed") {
    return 0;
  }

  const completionRate = getCompletedExerciseCount(session) / Math.max(1, session.exercises.length);

  if (session.status === "completed") {
    const targetSeconds = 45 * 60;
    const duration = Number.isFinite(session.durationSeconds) ? session.durationSeconds : targetSeconds;
    const distance = Math.abs(duration - targetSeconds) / targetSeconds;
    const durationFactor = Math.max(0.35, 1 - distance);
    return Math.round((completionRate * 0.72 + durationFactor * 0.28) * 100);
  }

  if (session.status === "in_progress" || session.status === "paused") {
    return Math.round(35 + completionRate * 30);
  }

  return 25;
}

function getHeatTier(score) {
  if (!Number.isFinite(score) || score <= 0) return 0;
  if (score >= 85) return 4;
  if (score >= 70) return 3;
  if (score >= 55) return 2;
  return 1;
}

function updateCalendarHeatmapSummary(monthDate) {
  if (!calendarHeatmapSummaryEl) return;

  const month = monthDate.getMonth();
  const year = monthDate.getFullYear();
  const monthlySessions = Object.values(state.workoutSessions || {}).filter((session) => {
    if (!session || !session.date) return false;
    const d = dateFromIso(session.date);
    return d.getFullYear() === year && d.getMonth() === month && Array.isArray(session.exercises) && session.exercises.length;
  });

  const completed = monthlySessions.filter((session) => session.status === "completed");
  const missed = monthlySessions.filter((session) => session.status === "missed").length;
  const avgScore = completed.length
    ? Math.round(completed.reduce((sum, session) => sum + (getSessionPerformanceScore(session) || 0), 0) / completed.length)
    : 0;

  const typeCounter = {};
  completed.forEach((session) => {
    const type = session.trainingType || "Workout";
    typeCounter[type] = (typeCounter[type] || 0) + 1;
  });
  const bestType = Object.entries(typeCounter).sort((a, b) => b[1] - a[1])[0]?.[0] || "n/d";

  calendarHeatmapSummaryEl.textContent = `Heatmap mese: ${completed.length} completati, ${missed} persi, score medio ${avgScore}/100, focus migliore: ${bestType}.`;
}

function inferExerciseMeta(name) {
  const lower = (name || "").toLowerCase();

  const cardioPattern = /(corsa|bike|cyclette|ellittica|cardio|jump|burpee|salto)/;
  const mobilityPattern = /(mobilita|stretch|allung|yoga)/;
  const corePattern = /(plank|crunch|addom|sit up|leg raise|hollow|core)/;
  const legsPattern = /(squat|affondi|leg |polpacci|calf|hip thrust|stacco rumeno|leg press|leg extension|leg curl|standing leg curl|hip abduction|lateral leg raise|glute kick)/;
  const pushPattern = /(panca|chest|spinte|military|shoulder press|dip|tricip|push|incline press|front chest|butterfly|pectoral|seated fly|overhead tricep|triceps extension|seated front raise)/;
  const pullPattern = /(rematore|lat machine|lat pull|pulldown|pulley|trazioni|curl|face pull|stacco|row|rowing|stand mid row|biceps curl|arm curl|behind neck)/;
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

  const result = {
    name,
    category: (isObj && entry.category) || inferred.category,
    trainingType: (isObj && entry.trainingType) || inferred.trainingType,
    supportsWeight,
    weight,
    restSeconds: (isObj && typeof entry.restSeconds === "number") ? entry.restSeconds : 60,
    sets: (isObj && typeof entry.sets === "number") ? entry.sets : 3,
    reps: (isObj && typeof entry.reps === "number") ? entry.reps : 10,
    warmup: Boolean(isObj && entry.warmup)
  };

  // Preserve the per-set log (reps/weight/done) when present. This is the
  // historical record of what was actually performed during a session.
  if (isObj && Array.isArray(entry.loggedSets)) {
    result.loggedSets = entry.loggedSets.map((s) => {
      const repsNum = Number(s && s.reps);
      const weightRaw = s && s.weight;
      const weightNum = Number(weightRaw);
      return {
        reps: Number.isFinite(repsNum) ? repsNum : null,
        weight: (weightRaw === null || weightRaw === undefined || weightRaw === "" || Number.isNaN(weightNum)) ? null : weightNum,
        done: Boolean(s && s.done)
      };
    });
  }

  return result;
}

// Lazily build/resize the per-set log for an exercise to match its target set count.
// New sets are pre-filled with the planned reps and the exercise's reference weight.
function ensureLoggedSets(exercise) {
  const targetSets = Number.isFinite(exercise.sets) && exercise.sets > 0 ? exercise.sets : 3;
  if (!Array.isArray(exercise.loggedSets)) {
    exercise.loggedSets = [];
  }
  const defaultReps = Number.isFinite(exercise.reps) ? exercise.reps : 10;
  const defaultWeight = exercise.supportsWeight && typeof exercise.weight === "number" ? exercise.weight : null;
  while (exercise.loggedSets.length < targetSets) {
    exercise.loggedSets.push({ reps: defaultReps, weight: defaultWeight, done: false });
  }
  if (exercise.loggedSets.length > targetSets) {
    exercise.loggedSets = exercise.loggedSets.slice(0, targetSets);
  }
  return exercise.loggedSets;
}

// Estimated one-rep max via the Epley formula. Returns null when not computable.
function estimateOneRepMax(weight, reps) {
  const w = Number(weight);
  const r = Number(reps);
  if (!Number.isFinite(w) || w <= 0 || !Number.isFinite(r) || r <= 0) return null;
  if (r === 1) return w;
  return w * (1 + r / 30);
}

// Aggregates a single completed exercise's set log into summary stats.
function summarizeExerciseSets(exercise) {
  const sets = Array.isArray(exercise.loggedSets) ? exercise.loggedSets : [];
  let totalVolume = 0;
  let topWeight = 0;
  let bestOneRm = 0;
  let loggedCount = 0;
  sets.forEach((s) => {
    const reps = Number(s.reps);
    const weight = Number(s.weight);
    if (!Number.isFinite(reps) || reps <= 0) return;
    loggedCount += 1;
    if (Number.isFinite(weight) && weight > 0) {
      totalVolume += weight * reps;
      if (weight > topWeight) topWeight = weight;
      const orm = estimateOneRepMax(weight, reps);
      if (orm && orm > bestOneRm) bestOneRm = orm;
    } else {
      totalVolume += reps; // bodyweight: count reps as volume
    }
  });
  return {
    totalVolume,
    topWeight,
    bestOneRm,
    loggedCount,
    hasWeight: topWeight > 0
  };
}

function getWarmupExercises() {
  return DEFAULT_WARMUP_EXERCISES
    .map(normalizeExerciseEntry)
    .filter(Boolean)
    .map((exercise) => ({
      ...exercise,
      supportsWeight: false,
      weight: null,
      restSeconds: Number.isFinite(exercise.restSeconds) ? exercise.restSeconds : 0,
      sets: Number.isFinite(exercise.sets) ? exercise.sets : 1,
      reps: Number.isFinite(exercise.reps) ? exercise.reps : 5,
      warmup: true,
      completed: false
    }));
}

function prependWarmupExercises(exercises) {
  const base = Array.isArray(exercises) ? exercises : [];
  if (!base.length) return [];

  const warmups = getWarmupExercises();
  if (!warmups.length) return base;

  const existingWarmups = base.filter((exercise) => exercise && exercise.warmup);
  const nonWarmupExercises = base.filter((exercise) => !exercise?.warmup);

  const mergedWarmups = warmups.map((warmupExercise, index) => {
    const existing = existingWarmups[index];
    return existing
      ? {
          ...warmupExercise,
          completed: Boolean(existing.completed)
        }
      : warmupExercise;
  });

  return [...mergedWarmups, ...nonWarmupExercises];
}

async function applyWarmupConfigToActiveSessions() {
  Object.values(state.workoutSessions || {}).forEach((session) => {
    if (!session || session.status === "completed" || session.status === "missed") {
      return;
    }
    if (!Array.isArray(session.exercises) || !session.exercises.length) {
      return;
    }
    session.exercises = prependWarmupExercises(session.exercises);
  });

  await saveWorkoutSessions();
  renderWeekCards();
  renderCalendar();
  if (workoutDetailDate) {
    renderWorkoutDetail();
  }
}

function normalizeWeekTemplate() {
  if (!state.weekTemplate || typeof state.weekTemplate !== "object") {
    state.weekTemplate = {};
  }
  if (!state.weekTemplate2 || typeof state.weekTemplate2 !== "object") {
    state.weekTemplate2 = {};
  }

  days.forEach((day) => {
    const entries = Array.isArray(state.weekTemplate[day]) ? state.weekTemplate[day] : [];
    state.weekTemplate[day] = entries
      .map(normalizeExerciseEntry)
      .filter(Boolean);

    const entries2 = Array.isArray(state.weekTemplate2[day]) ? state.weekTemplate2[day] : [];
    state.weekTemplate2[day] = entries2
      .map(normalizeExerciseEntry)
      .filter(Boolean);
  });
}

function cloneExercisesForSession(exercises) {
  const baseExercises = exercises
    .map(normalizeExerciseEntry)
    .filter(Boolean)
    .map((exercise) => ({
      ...exercise,
      weight: resolveExerciseWeight(exercise.name, exercise.weight),
      completed: false
    }));

  return prependWarmupExercises(baseExercises);
}

function normalizeWorkoutSession(session, sessionKey) {
  if (!session || typeof session !== "object") {
    return null;
  }

  const keyInfo = sessionKey ? parseSessionKey(sessionKey) : { dateKey: null, slot: 1 };
  const slot = session.slot === 2 || keyInfo.slot === 2 ? 2 : 1;
  const resolvedDate = session.date || keyInfo.dateKey;
  if (!resolvedDate) {
    return null;
  }

  const dateObj = dateFromIso(resolvedDate);
  const day = session.day || getDayFromDate(dateObj);
  let normalizedExercises = Array.isArray(session.exercises)
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

  // Add warmup only to editable sessions; keep historical completed/missed sessions untouched.
  if (normalizedExercises.length && status !== "completed" && status !== "missed") {
    normalizedExercises = prependWarmupExercises(normalizedExercises);
  }

  return {
    date: resolvedDate,
    day,
    slot,
    trainingType: session.trainingType || null,
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
  Object.entries(state.workoutSessions).forEach(([sessionKey, session]) => {
    const normalized = normalizeWorkoutSession(session, sessionKey);
    if (normalized) {
      nextSessions[sessionKeyFor(normalized.date, normalized.slot)] = normalized;
    }
  });

  state.workoutSessions = nextSessions;
}

function getTemplateExercisesForDate(dateKey, slot = 1) {
  const day = getDayFromDate(dateFromIso(dateKey));
  const templateMap = getTemplateMapForSlot(slot) || {};
  return cloneExercisesForSession(templateMap[day] || []);
}

function createWorkoutSession(dateKey, exercises, slot = 1) {
  const day = getDayFromDate(dateFromIso(dateKey));
  const typesMap = getTemplateTypesForSlot(slot) || {};
  return {
    date: dateKey,
    day,
    slot,
    trainingType: typesMap[day] || null,
    status: dateKey < getTodayKey() ? "missed" : "planned",
    exercises: cloneExercisesForSession(exercises),
    durationSeconds: 0,
    activeStartedAt: null,
    completedAt: null
  };
}

// Returns a session from state if it exists, otherwise builds a virtual planned one from template.
// Virtual sessions are NOT stored in state — they are computed on the fly.
function getOrBuildSession(dateKey, slot = 1) {
  const existing = state.workoutSessions[sessionKeyFor(dateKey, slot)];
  if (existing) return existing;
  // Never build virtual sessions for past dates — only real saved data counts
  if (dateKey < getTodayKey()) return null;
  const templateExercises = getTemplateExercisesForDate(dateKey, slot);
  if (!templateExercises.length) return null;
  return createWorkoutSession(dateKey, templateExercises, slot);
}

function syncWorkoutSessionsRange() {
  normalizeWorkoutSessions();

  let changed = false;
  const todayKey = getTodayKey();

  // Past sessions (both slots) left in_progress/paused/planned become missed.
  Object.values(state.workoutSessions).forEach((session) => {
    if (!session || session.status === "completed" || session.status === "missed") return;
    if (!session.date || session.date >= todayKey) return;

    session.durationSeconds = getSessionElapsedSeconds(session);
    session.activeStartedAt = null;
    session.status = "missed";
    changed = true;
  });

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

// Stato visivo aggregato di una giornata con uno o due allenamenti.
// Priorità: in corso > in pausa > tutti completati > (passato) perso > programmato.
function getCombinedDayStatus(activeSlots, isPast) {
  if (!activeSlots.length) return "rest";

  const sessions = activeSlots.map((s) => s.session).filter(Boolean);
  if (sessions.some((s) => s.status === "in_progress")) return "live";
  if (sessions.some((s) => s.status === "paused")) return "paused";

  if (activeSlots.every((s) => s.session && s.session.status === "completed")) {
    return "done";
  }

  if (isPast) return "missed";
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

function ensureWeekTemplateTypes() {
  if (!state.weekTemplateTypes || typeof state.weekTemplateTypes !== "object") {
    state.weekTemplateTypes = {};
  }
  if (!state.weekTemplate2 || typeof state.weekTemplate2 !== "object") {
    state.weekTemplate2 = {};
  }
  if (!state.weekTemplateTypes2 || typeof state.weekTemplateTypes2 !== "object") {
    state.weekTemplateTypes2 = {};
  }
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

  if (!Array.isArray(state.personal.photos)) {
    state.personal.photos = [];
  }
}

async function loadState() {
  const res = await fetch("/api/state");
  state = await res.json();
  ensurePersonalDefaults();
  ensureWeekTemplateTypes();
  normalizeWeekTemplate();
  normalizeWorkoutSessions();
  if (!state.exerciseMeta || typeof state.exerciseMeta !== "object") state.exerciseMeta = {};
  // Remove stale planned sessions — they are always computed on the fly
  const todayKey = getTodayKey();
  Object.keys(state.workoutSessions).forEach((key) => {
    const s = state.workoutSessions[key];
    if (s.status === "planned") delete state.workoutSessions[key];
    // Drop missed sessions older than today — no value in keeping them.
    // Le chiavi del 2º allenamento hanno suffisso "#2": confronta la data reale.
    const sessionDate = (s && s.date) || key.split("#")[0];
    if (s.status === "missed" && sessionDate < todayKey) delete state.workoutSessions[key];
  });
}

async function saveWeekTemplate() {
  const res = await fetch("/api/week-template", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      weekTemplate: state.weekTemplate,
      weekTemplateTypes: state.weekTemplateTypes,
      weekTemplate2: state.weekTemplate2,
      weekTemplateTypes2: state.weekTemplateTypes2
    })
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
  // Never persist planned sessions — they are computed on the fly from the template
  const toSave = Object.fromEntries(
    Object.entries(state.workoutSessions).filter(([, s]) => s.status !== "planned")
  );
  const res = await fetch("/api/workout-sessions", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workoutSessions: toSave })
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

  const totalExercises = days.reduce(
    (sum, day) => sum + (state.weekTemplate[day] || []).length + (state.weekTemplate2[day] || []).length,
    0
  );
  const { monday, sunday } = getWeekContext();

  weekNumEl.textContent = getWeekNum();
  dayCountEl.textContent = days.filter(
    (day) => (state.weekTemplate[day] || []).length > 0 || (state.weekTemplate2[day] || []).length > 0
  ).length;
  exerciseCountEl.textContent = totalExercises;
  weekRangeEl.textContent = `${formatDate(monday)} - ${formatDate(sunday)}`;
}

let libraryMgrActiveSource = "bench";

function openPickerDrawer() {
  if (!pickerDrawerEl) return;
  renderEditor(); // refresh picker list
  pickerDrawerEl.classList.remove("hidden");
  if (editorSearchEl) editorSearchEl.focus();
}

function closePickerDrawer() {
  if (!pickerDrawerEl) return;
  pickerDrawerEl.classList.add("hidden");
  if (editorSearchEl) editorSearchEl.value = "";
}

function renderLibraryModal() {
  if (!libraryMgrListEl) return;
  libraryMgrListEl.innerHTML = "";
  const source = libraryMgrActiveSource === "bench"
    ? state.exerciseLibrary.bench_dumbbell_barbell
    : state.exerciseLibrary.toorx_msx50;
  source.forEach((name, index) => {
    const meta = inferExerciseMeta(name);
    const li = document.createElement("li");
    li.className = "library-mgr-item";
    li.innerHTML = `
      <div class="library-mgr-item-info">
        <span class="library-mgr-item-name">${name}</span>
        <span class="library-mgr-item-meta">${meta.trainingType} · ${meta.supportsWeight ? "con carico" : "corpo libero"}</span>
      </div>
      <div style="display:flex;gap:6px">
        <button class="library-mgr-edit" data-index="${index}" type="button" title="Dettagli">ⓘ</button>
        <button class="library-mgr-delete" data-index="${index}" type="button" title="Rimuovi">✕</button>
      </div>
    `;
    li.querySelector(".library-mgr-edit").addEventListener("click", () => {
      openExerciseInfoPanel(name);
    });
    li.querySelector(".library-mgr-delete").addEventListener("click", () => {
      const key = libraryMgrActiveSource === "bench" ? "bench_dumbbell_barbell" : "toorx_msx50";
      state.exerciseLibrary[key].splice(index, 1);
      renderLibraryModal();
    });
    libraryMgrListEl.appendChild(li);
  });
}

function openLibraryModal() {
  if (!libraryModalEl) return;
  renderLibraryModal();
  libraryModalEl.classList.remove("hidden");
}

function closeLibraryModal() {
  if (!libraryModalEl) return;
  libraryModalEl.classList.add("hidden");
}

async function saveExerciseLibrary() {
  const res = await fetch("/api/exercise-library", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exerciseLibrary: state.exerciseLibrary })
  });
  if (!res.ok) {
    alert("Errore nel salvataggio della libreria");
    return false;
  }
  return true;
}

function renderLibrarySection() {
  // No-op: static library panel removed, managed via modal
}

function renderWeekCards() {
  const { monday } = getWeekContext();
  weekContainerEl.innerHTML = "";

  const STATUS_LABELS = {
    done: "Completato",
    missed: "Perso",
    paused: "In pausa",
    live: "In corso",
    planned: "Programmato",
    rest: "Riposo"
  };

  days.forEach((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const dateKey = formatIsoDate(date);
    const isPast = dateKey < getTodayKey();

    // Entrambi gli allenamenti della giornata (slot 1 e 2).
    const slotData = [1, 2].map((slot) => {
      const session = getOrBuildSession(dateKey, slot);
      const templateMap = getTemplateMapForSlot(slot) || {};
      const templateExercises = (templateMap[day] || [])
        .map(normalizeExerciseEntry)
        .filter(Boolean);
      const typesMap = getTemplateTypesForSlot(slot) || {};
      const type = (session && session.trainingType) || typesMap[day] || null;
      return {
        slot,
        session,
        templateExercises,
        hasTemplate: templateExercises.length > 0,
        type
      };
    });

    // Slot "attivi": quelli con una sessione reale o un template programmato.
    const activeSlots = slotData.filter((s) => s.session || s.hasTemplate);
    const isRest = activeSlots.length === 0;
    const isDouble = activeSlots.length > 1;

    // Tipo combinato mostrato sulla card, es. "Spinta + Trazione".
    const combinedType = activeSlots.map((s) => s.type).filter(Boolean).join(" + ");
    const singleType = activeSlots.length === 1 ? activeSlots[0].type : null;

    // Stato visivo complessivo del giorno (aggrega i due allenamenti).
    const visualStatus = getCombinedDayStatus(activeSlots, isPast);
    const allCompleted = !isRest && activeSlots.every((s) => s.session && s.session.status === "completed");

    // Esercizi totali (dal template quando presente, altrimenti dalla sessione).
    const totalCount = activeSlots.reduce((sum, s) => {
      return sum + (s.hasTemplate ? s.templateExercises.length : (s.session ? s.session.exercises.length : 0));
    }, 0);

    // Tempo totale (somma) quando entrambi gli allenamenti sono completati.
    const totalDuration = activeSlots.reduce((sum, s) => {
      return sum + (s.session && s.session.status === "completed" ? (s.session.durationSeconds || 0) : 0);
    }, 0);

    const canOpenDetail = !isRest && activeSlots.some((s) => s.session || (s.hasTemplate && !isPast));

    const card = document.createElement("div");
    card.className = `day-card day-card-${visualStatus}`
      + (dateKey === getTodayKey() ? " day-card-today" : "")
      + (allCompleted ? " day-card-locked" : "");
    card.dataset.day = day;

    const head = document.createElement("div");
    head.className = "day-header";

    if (canOpenDetail) {
      head.style.cursor = "pointer";
      head.addEventListener("click", () => openWorkoutDetail(dateKey));
    }

    const dayLeft = document.createElement("div");
    dayLeft.className = "day-left";

    const dayNum = document.createElement("div");
    dayNum.className = "day-num";
    dayNum.textContent = formatDate(date);

    const dayInfo = document.createElement("div");

    const title = document.createElement("div");
    title.className = "day-title";
    title.textContent = dayLabels[day];

    const categoryLabel = document.createElement("div");
    categoryLabel.className = "day-category";
    if (combinedType) {
      categoryLabel.textContent = combinedType;
      // Colore per tipo solo quando ce n'è uno solo; col "+" resta neutro.
      if (singleType) {
        categoryLabel.dataset.type = singleType.toLowerCase().replace(/\s+/g, "-");
      } else {
        categoryLabel.classList.add("day-category-double");
      }
    }

    dayInfo.appendChild(title);
    if (combinedType) dayInfo.appendChild(categoryLabel);
    dayLeft.appendChild(dayNum);
    dayLeft.appendChild(dayInfo);

    const right = document.createElement("div");
    right.className = "day-right";

    const badge = document.createElement("span");
    badge.className = `day-badge day-badge-${visualStatus}`;
    badge.textContent = STATUS_LABELS[visualStatus] || "Riposo";
    right.appendChild(badge);

    if (allCompleted && totalDuration > 0) {
      const timeChip = document.createElement("span");
      timeChip.className = "day-time-chip";
      timeChip.textContent = formatDuration(totalDuration);
      right.appendChild(timeChip);
    }

    head.appendChild(dayLeft);
    head.appendChild(right);
    card.appendChild(head);

    // Footer with exercise count + move buttons (one per workout) or a lock.
    if (!isRest) {
      const workoutFooter = document.createElement("div");
      workoutFooter.className = "day-workout-footer";

      const exerciseCount = document.createElement("span");
      exerciseCount.className = "day-exercise-count";
      const countText = `${totalCount} esercizio${totalCount !== 1 ? "i" : ""}`;
      exerciseCount.textContent = isDouble ? `2 allenamenti · ${countText}` : countText;
      workoutFooter.appendChild(exerciseCount);

      // Uno slot è spostabile se è programmato e la sua sessione non è completata.
      const movableSlots = activeSlots.filter(
        (s) => s.hasTemplate && !(s.session && s.session.status === "completed")
      );

      if (movableSlots.length) {
        const moveActions = document.createElement("div");
        moveActions.className = "day-move-actions";

        movableSlots.forEach((s) => {
          const moveBtn = document.createElement("button");
          moveBtn.className = "day-move-btn";
          moveBtn.type = "button";
          // Con due allenamenti i pulsanti distinguono lo slot: "Sposta 1" / "Sposta 2".
          const label = isDouble ? `Sposta ${s.slot}` : "Sposta";
          moveBtn.innerHTML = `<span class="day-move-btn-icon" aria-hidden="true">⇄</span> ${label}`;
          moveBtn.title = isDouble
            ? `Sposta il ${s.slot}º allenamento (${s.type || "Allenamento"}) in un altro giorno`
            : "Sposta l'allenamento in un altro giorno";
          moveBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openWorkoutMoveMenu(day, s.slot);
          });
          moveActions.appendChild(moveBtn);
        });

        workoutFooter.appendChild(moveActions);
      } else if (allCompleted) {
        const lock = document.createElement("span");
        lock.className = "day-move-locked";
        lock.innerHTML = `<span aria-hidden="true">🔒</span> Completato`;
        lock.title = "Un allenamento completato non può essere spostato";
        workoutFooter.appendChild(lock);
      }

      card.appendChild(workoutFooter);
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

let toastTimeoutId = null;
function showToast(message) {
  let toast = document.getElementById("gymToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "gymToast";
    toast.className = "gym-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  // restart the show animation even if a toast is already visible
  toast.classList.remove("gym-toast-show");
  void toast.offsetWidth;
  toast.classList.add("gym-toast-show");
  if (toastTimeoutId) clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => toast.classList.remove("gym-toast-show"), 2600);
}

// Sposta UN allenamento (giorno + slot) verso un altro giorno. Se la
// destinazione ha già un allenamento, il server li unisce (diventa il 2º);
// se ne ha già due, rifiuta e mostriamo l'errore.
async function moveWorkout(fromDay, fromSlot, toDay) {
  try {
    const res = await fetch("/api/move-workout", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromDay, fromSlot, toDay })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      showToast(data.error || "Spostamento non riuscito");
      return;
    }

    state.weekTemplate = data.weekTemplate;
    state.weekTemplateTypes = data.weekTemplateTypes;
    state.weekTemplate2 = data.weekTemplate2 || {};
    state.weekTemplateTypes2 = data.weekTemplateTypes2 || {};
    normalizeWeekTemplate();
    syncWorkoutSessionsRange();
    renderWeekCards();
    renderCalendar();
    renderEditor();

    showToast(data.merged
      ? `Unito a ${dayLabels[toDay]} come 2º allenamento`
      : `Spostato a ${dayLabels[toDay]}`);
  } catch (err) {
    console.error("Move workout error:", err);
    showToast("Errore nello spostamento allenamento");
  }
}

// Tipi combinati di un giorno (slot 1 + slot 2), es. "Spinta + Trazione".
function getDayTypesLabel(day) {
  const t1 = (state.weekTemplateTypes && state.weekTemplateTypes[day]) || null;
  const t2 = (state.weekTemplateTypes2 && state.weekTemplateTypes2[day]) || null;
  return [t1, t2].filter(Boolean).join(" + ");
}

function getSlotType(day, slot) {
  const typesMap = slot === 2 ? state.weekTemplateTypes2 : state.weekTemplateTypes;
  return (typesMap && typesMap[day]) || null;
}

// Quanti allenamenti (0, 1 o 2) ha un giorno.
function countDayWorkouts(day) {
  let n = 0;
  if ((state.weekTemplate[day] || []).length > 0) n += 1;
  if ((state.weekTemplate2[day] || []).length > 0) n += 1;
  return n;
}

// Modale centrato (con sfondo scurito) per spostare UN allenamento (giorno+slot)
// in un altro giorno. La destinazione può essere libera, avere già un
// allenamento (→ unione, diventa il 2º) o esserne piena (→ disabilitata).
function openWorkoutMoveMenu(fromDay, fromSlot) {
  const slot = fromSlot === 2 ? 2 : 1;
  const isDoubleSource = countDayWorkouts(fromDay) > 1;

  const existing = document.querySelector(".workout-move-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.className = "workout-move-modal";

  const backdrop = document.createElement("div");
  backdrop.className = "workout-move-backdrop";
  overlay.appendChild(backdrop);

  const panel = document.createElement("div");
  panel.className = "workout-move-panel panel-card";

  const head = document.createElement("div");
  head.className = "workout-move-head";

  const headText = document.createElement("div");
  const title = document.createElement("h3");
  title.className = "workout-move-title";
  const fromType = getSlotType(fromDay, slot);
  // Col doppio allenamento specifichiamo quale stiamo spostando.
  title.textContent = isDoubleSource
    ? `Sposta ${slot}º allenamento di ${dayLabels[fromDay]}`
    : `Sposta ${dayLabels[fromDay]}`;
  const subtitle = document.createElement("p");
  subtitle.className = "workout-move-subtitle";
  subtitle.textContent = fromType
    ? `${fromType} → scegli il giorno di destinazione`
    : "Scegli il giorno di destinazione";
  headText.appendChild(title);
  headText.appendChild(subtitle);
  head.appendChild(headText);

  const closeBtn = document.createElement("button");
  closeBtn.className = "drawer-close";
  closeBtn.type = "button";
  closeBtn.textContent = "✕";
  head.appendChild(closeBtn);
  panel.appendChild(head);

  const daysList = document.createElement("div");
  daysList.className = "workout-move-days";

  days.forEach((targetDay) => {
    if (targetDay === fromDay) return; // Salta il giorno di partenza

    const targetCount = countDayWorkouts(targetDay);
    const isFull = targetCount >= 2;
    const isMerge = targetCount === 1;
    const targetTypes = getDayTypesLabel(targetDay);

    const dayBtn = document.createElement("button");
    dayBtn.className = "workout-move-day"
      + (isFull ? " is-full" : isMerge ? " is-merge" : " is-empty");
    dayBtn.type = "button";
    dayBtn.disabled = isFull;

    const name = document.createElement("span");
    name.className = "wm-day-name";
    name.textContent = dayLabels[targetDay];

    const sub = document.createElement("span");
    sub.className = "wm-day-sub";
    if (isFull) {
      sub.textContent = `Pieno · 2 allenamenti (${targetTypes})`;
    } else if (isMerge) {
      sub.textContent = `Unisci · diventa 2º con ${targetTypes || "l'allenamento esistente"}`;
    } else {
      sub.textContent = "Giorno libero";
    }

    dayBtn.appendChild(name);
    dayBtn.appendChild(sub);

    if (!isFull) {
      dayBtn.addEventListener("click", async () => {
        overlay.remove();
        await moveWorkout(fromDay, slot, targetDay);
      });
    }

    daysList.appendChild(dayBtn);
  });

  panel.appendChild(daysList);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);
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
  const templateMap = getTemplateMapForSlot(editorSlot);
  const typesMap = getTemplateTypesForSlot(editorSlot);
  editorSlotBtns.forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.slot) === editorSlot);
  });
  const plannedExercises = (templateMap[currentDay] || []).map(normalizeExerciseEntry).filter(Boolean);
  templateMap[currentDay] = plannedExercises;
  const daySet = new Set(plannedExercises.map((exercise) => exercise.name));
  const allExercises = getAllExercises();
  const currentDayType = (typesMap && typesMap[currentDay]) || "";
  if (editorDayTypeSelectEl) editorDayTypeSelectEl.value = currentDayType;
  const selectedType = currentDayType || "all";
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
      templateMap[currentDay].push({
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

  const warmupConfig = getWarmupExercises()[0] || DEFAULT_WARMUP_EXERCISES[0];
  const warmupLi = document.createElement("li");
  warmupLi.className = "day-ex-warmup-item";

  const warmupTop = document.createElement("div");
  warmupTop.className = "day-ex-top";

  const warmupName = document.createElement("span");
  warmupName.className = "day-ex-name";
  warmupName.textContent = "Riscaldamento (inizio allenamento)";

  const warmupMeta = document.createElement("span");
  warmupMeta.className = "day-ex-meta";
  warmupMeta.textContent = "automatico su tutti gli allenamenti";

  warmupTop.appendChild(warmupName);
  warmupTop.appendChild(warmupMeta);

  const warmupControls = document.createElement("div");
  warmupControls.className = "day-ex-controls";

  function makeInputGroup(labelText, input) {
    const group = document.createElement("label");
    group.className = "day-ex-input-group";
    const lbl = document.createElement("span");
    lbl.className = "day-ex-input-label";
    lbl.textContent = labelText;
    group.appendChild(lbl);
    group.appendChild(input);
    return group;
  }

  const warmupNameInput = document.createElement("input");
  warmupNameInput.type = "text";
  warmupNameInput.placeholder = "Nome riscaldamento";
  warmupNameInput.value = warmupConfig?.name || "Elittica (Riscaldamento 5 min)";
  warmupNameInput.addEventListener("change", async () => {
    const nextName = warmupNameInput.value.trim() || "Elittica (Riscaldamento 5 min)";
    DEFAULT_WARMUP_EXERCISES[0] = {
      ...DEFAULT_WARMUP_EXERCISES[0],
      name: nextName,
      category: "Riscaldamento",
      trainingType: "Cardio",
      supportsWeight: false,
      weight: null,
      restSeconds: 0,
      warmup: true
    };
    await applyWarmupConfigToActiveSessions();
    renderEditor();
  });

  const warmupMinutesInput = document.createElement("input");
  warmupMinutesInput.type = "number";
  warmupMinutesInput.min = "1";
  warmupMinutesInput.max = "30";
  warmupMinutesInput.step = "1";
  warmupMinutesInput.value = String(warmupConfig?.reps || 5);
  warmupMinutesInput.addEventListener("change", async () => {
    const raw = Number(warmupMinutesInput.value);
    const nextMinutes = Number.isNaN(raw) ? 5 : Math.min(30, Math.max(1, Math.round(raw)));
    DEFAULT_WARMUP_EXERCISES[0] = {
      ...DEFAULT_WARMUP_EXERCISES[0],
      reps: nextMinutes,
      sets: 1,
      category: "Riscaldamento",
      trainingType: "Cardio",
      supportsWeight: false,
      weight: null,
      restSeconds: 0,
      warmup: true
    };
    warmupMinutesInput.value = String(nextMinutes);
    await applyWarmupConfigToActiveSessions();
    renderEditor();
  });

  warmupControls.appendChild(makeInputGroup("Esercizio", warmupNameInput));
  warmupControls.appendChild(makeInputGroup("Minuti", warmupMinutesInput));
  warmupLi.appendChild(warmupTop);
  warmupLi.appendChild(warmupControls);
  dayExerciseListEl.appendChild(warmupLi);

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

    if (exercise.supportsWeight) {
      const weightInput = document.createElement("input");
      weightInput.type = "number";
      weightInput.step = "0.5";
      weightInput.min = "0";
      weightInput.placeholder = "—";
      const _metaW = state.exerciseMeta?.[exercise.name]?.weight;
      const _defW = EXERCISE_DEFAULTS[exercise.name]?.weight;
      weightInput.value = typeof exercise.weight === "number"
        ? String(exercise.weight)
        : typeof _metaW === "number"
          ? String(_metaW)
          : typeof _defW === "number"
            ? String(_defW)
            : "";

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

      controls.appendChild(makeInputGroup("Peso (kg)", weightInput));
    }

    const setsInput = document.createElement("input");
    setsInput.type = "number";
    setsInput.min = "1";
    setsInput.max = "10";
    setsInput.placeholder = "—";
    setsInput.className = "sets-reps-input";
    setsInput.title = "Serie";
    setsInput.value = typeof exercise.sets === "number" ? String(exercise.sets) : "3";
    setsInput.addEventListener("input", () => {
      const v = parseInt(setsInput.value, 10);
      exercise.sets = isNaN(v) || v < 1 ? 3 : v;
      if (workoutDetailDate) renderWorkoutDetail();
    });
    controls.appendChild(makeInputGroup("Serie", setsInput));

    const repsInput = document.createElement("input");
    repsInput.type = "number";
    repsInput.min = "1";
    repsInput.max = "100";
    repsInput.placeholder = "—";
    repsInput.className = "sets-reps-input";
    repsInput.title = "Ripetizioni";
    repsInput.value = typeof exercise.reps === "number" ? String(exercise.reps) : "10";
    repsInput.addEventListener("input", () => {
      const v = parseInt(repsInput.value, 10);
      exercise.reps = isNaN(v) || v < 1 ? 10 : v;
      if (workoutDetailDate) renderWorkoutDetail();
    });
    controls.appendChild(makeInputGroup("Rip.", repsInput));

    const restInput = document.createElement("input");
    restInput.type = "number";
    restInput.step = "5";
    restInput.min = "0";
    restInput.placeholder = "—";
    restInput.className = "rest-input";
    restInput.value = typeof exercise.restSeconds === "number" ? String(exercise.restSeconds) : "60";

    restInput.addEventListener("input", () => {
      const value = Number(restInput.value);
      exercise.restSeconds = Number.isNaN(value) || value < 0 ? 60 : value;
      syncWorkoutSessionsRange();
    });

    controls.appendChild(makeInputGroup("Pausa (s)", restInput));

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Rimuovi";

    removeBtn.addEventListener("click", () => {
      templateMap[currentDay] = templateMap[currentDay].filter((_, index) => index !== exerciseIndex);
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
    const emptyLi = document.createElement("li");
    emptyLi.className = "day-ex-empty";
    emptyLi.textContent = editorSlot === 2
      ? "Nessun 2º allenamento in questo giorno. Aggiungi un esercizio per crearlo."
      : "Nessun esercizio nel giorno selezionato.";
    dayExerciseListEl.appendChild(emptyLi);
  }
}

function openWorkoutDetail(dateKey) {
  // Materializza entrambi gli allenamenti della giornata (slot 1 e 2) come
  // sessioni reali, così possono essere avviati/modificati indipendentemente.
  let hasAny = false;
  [1, 2].forEach((slot) => {
    const key = sessionKeyFor(dateKey, slot);
    if (!state.workoutSessions[key]) {
      const built = getOrBuildSession(dateKey, slot);
      if (built && built.exercises.length) {
        state.workoutSessions[key] = built;
      }
    }
    const existing = state.workoutSessions[key];
    if (existing && existing.exercises.length) hasAny = true;
  });
  if (!hasAny) return;

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
      stopTimerLoop();
      return;
    }
    // Aggiorna il timer di ogni allenamento in corso (slot 1 e/o 2).
    let anyRunning = false;
    detailTimerEls.forEach(({ session, el }) => {
      if (session && session.status === "in_progress") {
        el.textContent = formatDuration(getSessionElapsedSeconds(session));
        anyRunning = true;
      }
    });
    if (!anyRunning) {
      stopTimerLoop();
    }
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
  if (session.date !== getTodayKey()) {
    alert("Puoi iniziare solo l'allenamento del giorno corrente.");
    return;
  }

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

  const progressionUpdates = buildAutoProgressionUpdates(session);

  await saveWorkoutSessions();
  renderWeekCards();
  renderCalendar();
  renderWorkoutDetail();
  renderPersonal();

  if (progressionUpdates.length) {
    openProgressionReview(session, progressionUpdates);
    renderWorkoutDetail();
  }
}

async function handleCancelWorkout(session) {
  session.status = "planned";
  session.durationSeconds = 0;
  session.activeStartedAt = null;
  session.completedAt = null;
  session.exercises = session.exercises.map((exercise) => ({
    ...exercise,
    completed: false
  }));

  await saveWorkoutSessions();
  renderWeekCards();
  renderCalendar();
  renderWorkoutDetail();
  renderPersonal();
}

// Builds the per-set logging block for one exercise. When readOnly is true it
// renders a compact recap of what was logged plus summary stats (volume / top
// set / estimated 1RM); otherwise it renders editable reps/weight inputs and a
// per-set "done" toggle.
function buildSetLogger(exercise, exerciseIndex, session, readOnly) {
  const sets = ensureLoggedSets(exercise);
  if (!sets.length) return null;

  const wrap = document.createElement("div");
  wrap.className = "set-logger";

  sets.forEach((setData, setIndex) => {
    const setRow = document.createElement("div");
    setRow.className = `set-row${setData.done ? " set-row-done" : ""}`;

    const numEl = document.createElement("span");
    numEl.className = "set-num";
    numEl.textContent = setIndex + 1;
    setRow.appendChild(numEl);

    const fields = document.createElement("div");
    fields.className = "set-fields";

    const repsField = document.createElement("label");
    repsField.className = "set-field";
    if (readOnly) {
      repsField.innerHTML = `<span class="set-field-val">${setData.reps != null ? setData.reps : "—"}</span><span class="set-field-unit">rip</span>`;
    } else {
      const repsInput = document.createElement("input");
      repsInput.type = "number";
      repsInput.inputMode = "numeric";
      repsInput.min = "0";
      repsInput.className = "set-input set-input-reps";
      repsInput.value = setData.reps != null ? String(setData.reps) : "";
      repsInput.addEventListener("click", (e) => e.stopPropagation());
      repsInput.addEventListener("change", async () => {
        const v = Number(repsInput.value);
        setData.reps = Number.isFinite(v) && v >= 0 ? v : null;
        await saveWorkoutSessions();
      });
      repsField.appendChild(repsInput);
      const unit = document.createElement("span");
      unit.className = "set-field-unit";
      unit.textContent = "rip";
      repsField.appendChild(unit);
    }
    fields.appendChild(repsField);

    if (exercise.supportsWeight) {
      const weightField = document.createElement("label");
      weightField.className = "set-field";
      if (readOnly) {
        weightField.innerHTML = `<span class="set-field-val">${setData.weight != null ? setData.weight : "—"}</span><span class="set-field-unit">kg</span>`;
      } else {
        const weightInput = document.createElement("input");
        weightInput.type = "number";
        weightInput.inputMode = "decimal";
        weightInput.min = "0";
        weightInput.step = "0.5";
        weightInput.className = "set-input set-input-weight";
        weightInput.value = setData.weight != null ? String(setData.weight) : "";
        weightInput.addEventListener("click", (e) => e.stopPropagation());
        weightInput.addEventListener("change", async () => {
          const v = Number(weightInput.value);
          setData.weight = weightInput.value === "" || Number.isNaN(v) ? null : v;
          await saveWorkoutSessions();
        });
        weightField.appendChild(weightInput);
        const unit = document.createElement("span");
        unit.className = "set-field-unit";
        unit.textContent = "kg";
        weightField.appendChild(unit);
      }
      fields.appendChild(weightField);
    }

    setRow.appendChild(fields);

    if (!readOnly) {
      const doneBtn = document.createElement("button");
      doneBtn.type = "button";
      doneBtn.className = "set-done-btn";
      doneBtn.textContent = setData.done ? "✓" : "○";
      doneBtn.disabled = session.status !== "in_progress";
      doneBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        setData.done = !setData.done;
        setRow.classList.toggle("set-row-done", setData.done);
        doneBtn.textContent = setData.done ? "✓" : "○";

        // Exercise is complete when every set is marked done.
        const allDone = sets.every((s) => s.done);
        session.exercises[exerciseIndex].completed = allDone;

        await saveWorkoutSessions();
        renderWeekCards();
        renderCalendar();

        if (setData.done) {
          showRestTimer(exercise.restSeconds || 60);
        }
        // If the whole exercise just completed, refresh to update the top
        // checkbox / done styling on the parent row.
        if (allDone) renderWorkoutDetail();
      });
      setRow.appendChild(doneBtn);
    }

    wrap.appendChild(setRow);
  });

  // Summary line on completed sessions.
  if (readOnly) {
    const summary = summarizeExerciseSets(exercise);
    if (summary.loggedCount) {
      const sum = document.createElement("div");
      sum.className = "set-summary";
      const parts = [];
      if (summary.hasWeight) {
        parts.push(`Volume ${Math.round(summary.totalVolume)} kg`);
        parts.push(`Top ${summary.topWeight} kg`);
        if (summary.bestOneRm) parts.push(`1RM ~${Math.round(summary.bestOneRm)} kg`);
      } else {
        parts.push(`${Math.round(summary.totalVolume)} rip totali`);
      }
      sum.textContent = parts.join(" · ");
      wrap.appendChild(sum);
    }
  }

  return wrap;
}

function renderWorkoutDetail() {
  const dateKey = workoutDetailDate;
  // Tutti gli allenamenti della giornata (1º e 2º), in ordine di slot.
  const sessions = dateKey
    ? [1, 2]
        .map((slot) => state.workoutSessions[sessionKeyFor(dateKey, slot)])
        .filter((s) => s && Array.isArray(s.exercises) && s.exercises.length)
    : [];

  if (!sessions.length) {
    closeWorkoutDetail();
    return;
  }

  const date = dateFromIso(dateKey);
  const day = sessions[0].day;
  workoutDetailKickerEl.textContent = dayLabels[day];
  workoutDetailTitleEl.textContent = formatLongDate(date);

  const typesSummary = sessions.map((s) => s.trainingType).filter(Boolean).join(" + ");
  const totalExercises = sessions.reduce((sum, s) => sum + s.exercises.length, 0);
  workoutDetailMetaEl.textContent = sessions.length > 1
    ? `2 allenamenti${typesSummary ? ` · ${typesSummary}` : ""} · ${totalExercises} esercizi`
    : `${totalExercises} esercizi · ${getSessionStatusLabel(sessions[0], dateKey)}`;

  // Il timer/summary condivisi in testata non servono: ogni sezione ha i propri.
  workoutTimerEl.classList.add("hidden");
  workoutCompletedSummaryEl.classList.add("hidden");
  workoutActionsEl.innerHTML = "";
  workoutExerciseListEl.innerHTML = "";

  detailTimerEls = [];
  let anyRunning = false;

  sessions.forEach((session) => {
    const orderLabel = sessions.length > 1
      ? (session.slot === 2 ? "2º allenamento" : "1º allenamento")
      : "";
    workoutExerciseListEl.appendChild(buildWorkoutSection(session, orderLabel));
    if (session.status === "in_progress") anyRunning = true;
  });

  if (anyRunning) {
    startTimerLoop();
  } else {
    stopTimerLoop();
  }

  // Una sola nota di giornata, condivisa tra i due allenamenti.
  if (sessions.some((s) => s.status === "completed")) {
    workoutExerciseListEl.appendChild(buildWorkoutDiaryNote(dateKey));
  }
}

// Costruisce la sezione di UN allenamento: testata (tipo + stato + timer),
// pulsanti azione propri, lista esercizi e revisione progressione.
function buildWorkoutSection(session, orderLabel) {
  const sectionKey = sessionKeyFor(session.date, session.slot);
  const section = document.createElement("section");
  section.className = `workout-section workout-section-${session.status}`;

  // ── Testata ──
  const head = document.createElement("div");
  head.className = "workout-section-head";

  const headInfo = document.createElement("div");
  headInfo.className = "workout-section-info";

  if (orderLabel) {
    const order = document.createElement("span");
    order.className = "workout-section-order";
    order.textContent = orderLabel;
    headInfo.appendChild(order);
  }

  const typeTitle = document.createElement("h3");
  typeTitle.className = "workout-section-type";
  typeTitle.textContent = session.trainingType || "Allenamento";
  if (session.trainingType) {
    typeTitle.dataset.type = session.trainingType.toLowerCase().replace(/\s+/g, "-");
  }
  headInfo.appendChild(typeTitle);

  const statusLine = document.createElement("span");
  statusLine.className = "workout-section-status";
  statusLine.textContent = `${session.exercises.length} esercizi · ${getSessionStatusLabel(session, session.date)}`;
  headInfo.appendChild(statusLine);

  head.appendChild(headInfo);

  const headRight = document.createElement("div");
  headRight.className = "workout-section-headright";
  if (session.status === "in_progress" || session.status === "paused") {
    const timer = document.createElement("div");
    timer.className = "workout-timer";
    timer.textContent = formatDuration(getSessionElapsedSeconds(session));
    headRight.appendChild(timer);
    detailTimerEls.push({ session, el: timer });
  } else if (session.status === "completed") {
    const summary = document.createElement("div");
    summary.className = "workout-completed-summary";
    summary.textContent = `${formatDuration(session.durationSeconds)} · ${getCompletedExerciseCount(session)}/${session.exercises.length}`;
    headRight.appendChild(summary);
  }
  head.appendChild(headRight);
  section.appendChild(head);

  // ── Azioni (start / pausa / fine / annulla) ──
  const actions = document.createElement("div");
  actions.className = "workout-actions";

  if (session.status === "planned") {
    if (session.date === getTodayKey()) {
      actions.appendChild(createActionButton("INIZIA ALLENAMENTO", "workout-start-btn", async () => {
        await handleStartWorkout(session);
      }));
    } else {
      const plannedNote = document.createElement("div");
      plannedNote.className = "workout-planned-note";
      plannedNote.textContent = "Puoi iniziare questo allenamento solo nel giorno programmato.";
      actions.appendChild(plannedNote);
    }
  } else if (session.status === "in_progress" || session.status === "paused") {
    actions.appendChild(createActionButton(session.status === "in_progress" ? "▌▌ Pausa" : "▶ Riprendi", "workout-control-btn", async () => {
      await handlePauseWorkout(session);
    }));
    actions.appendChild(createActionButton("■ Fine", "workout-stop-btn", async () => {
      await handleFinishWorkout(session);
    }));
    actions.appendChild(createActionButton("↺ Annulla", "workout-cancel-btn", async () => {
      await handleCancelWorkout(session);
    }));
  } else if (session.status === "completed") {
    const weightedExercises = session.exercises.filter((exercise) => exercise.supportsWeight);
    if (weightedExercises.length) {
      const hint = document.createElement("div");
      hint.className = "progression-hint";
      hint.textContent = "Progressione automatica attiva: al termine del workout i carichi consigliati vengono aggiornati in base a completamento, durata e trend recente.";
      actions.appendChild(hint);
    }
  }
  section.appendChild(actions);

  // ── Lista esercizi ──
  const timeline = document.createElement("div");
  timeline.className = "exercise-timeline";

  const showCheckbox = session.status === "in_progress" || session.status === "paused";
  const showSetRecap = session.status === "completed";

  session.exercises.forEach((exercise, index) => {
    const row = document.createElement("div");
    row.className = `exercise-line ${exercise.completed ? "exercise-line-done" : ""}`;
    if (exercise.warmup) {
      row.classList.add("exercise-line-warmup");
    }
    row.style.cursor = "pointer";

    const point = document.createElement("span");
    point.className = "exercise-line-point";

    let checkbox = null;
    if (showCheckbox) {
      checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = exercise.completed;
      checkbox.disabled = session.status !== "in_progress";

      checkbox.addEventListener("change", async () => {
        const ex = session.exercises[index];
        ex.completed = checkbox.checked;
        if (!exercise.warmup) {
          ensureLoggedSets(ex).forEach((s) => { s.done = checkbox.checked; });
        }
        await saveWorkoutSessions();
        renderWeekCards();
        renderCalendar();
        renderWorkoutDetail();
        if (checkbox.checked) {
          showRestTimer(exercise.restSeconds || 60);
        }
      });
    } else {
      checkbox = document.createElement("span");
      checkbox.className = "exercise-line-check-placeholder";
    }

    const content = document.createElement("div");
    content.className = "exercise-line-content";

    const title = document.createElement("div");
    title.className = "exercise-line-title";
    title.textContent = exercise.name;

    const meta = document.createElement("div");
    meta.className = "exercise-line-meta";
    const weightStr = exercise.supportsWeight && typeof exercise.weight === "number" ? ` · ${exercise.weight} kg` : "";
    const setsStr = (exercise.sets || 3) + "×" + (exercise.reps || 10);
    const warmupStr = exercise.warmup ? " · Riscaldamento" : "";
    meta.textContent = `${setsStr} · ${exercise.trainingType}${warmupStr}${weightStr}`;

    content.appendChild(title);
    content.appendChild(meta);

    row.appendChild(point);
    row.appendChild(checkbox);
    row.appendChild(content);
    timeline.appendChild(row);

    if (!exercise.warmup && (showCheckbox || showSetRecap)) {
      const logger = buildSetLogger(exercise, index, session, showSetRecap);
      if (logger) timeline.appendChild(logger);
    }

    content.addEventListener("click", (e) => {
      e.stopPropagation();
      openExerciseInfoPanel(exercise.name, exercise.sets, exercise.reps, sectionKey);
    });
    point.addEventListener("click", (e) => {
      e.stopPropagation();
      openExerciseInfoPanel(exercise.name, exercise.sets, exercise.reps, sectionKey);
    });
  });

  section.appendChild(timeline);

  // ── Revisione progressione (per questo allenamento) ──
  if (
    session.status === "completed"
    && pendingProgressionReview
    && pendingProgressionReview.sessionKey === sectionKey
    && Array.isArray(pendingProgressionReview.updates)
    && pendingProgressionReview.updates.length
  ) {
    section.appendChild(buildProgressionReviewCard());
  }

  return section;
}

function buildProgressionReviewCard() {
  const reviewCard = document.createElement("div");
  reviewCard.className = "progression-review-card";

  const reviewTitle = document.createElement("h3");
  reviewTitle.textContent = "Nuovi pesi consigliati";
  reviewCard.appendChild(reviewTitle);

  const reviewSub = document.createElement("p");
  reviewSub.className = "progression-review-sub";
  reviewSub.textContent = "Modifica i valori se vuoi, poi salva o ignora.";
  reviewCard.appendChild(reviewSub);

  const reviewList = document.createElement("div");
  reviewList.className = "progression-review-list";

  pendingProgressionReview.updates.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = "progression-review-row";

    const info = document.createElement("div");
    info.className = "progression-review-info";

    const name = document.createElement("strong");
    name.textContent = entry.name;

    const from = document.createElement("span");
    from.textContent = `Attuale: ${entry.from} kg`;

    info.appendChild(name);
    info.appendChild(from);

    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.5";
    input.min = "0.5";
    input.value = String(entry.suggested ?? entry.to);
    input.addEventListener("input", () => {
      const parsed = Number(input.value);
      pendingProgressionReview.updates[index].suggested = Number.isNaN(parsed) ? entry.suggested : parsed;
    });

    row.appendChild(info);
    row.appendChild(input);
    reviewList.appendChild(row);
  });

  reviewCard.appendChild(reviewList);

  const actions = document.createElement("div");
  actions.className = "progression-review-actions";

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.className = "btn-save";
  saveBtn.textContent = "Salva consigli";
  saveBtn.addEventListener("click", confirmProgressionReview);

  const ignoreBtn = document.createElement("button");
  ignoreBtn.type = "button";
  ignoreBtn.className = "workout-cancel-btn";
  ignoreBtn.textContent = "Ignora";
  ignoreBtn.addEventListener("click", dismissProgressionReview);

  actions.appendChild(saveBtn);
  actions.appendChild(ignoreBtn);
  reviewCard.appendChild(actions);
  return reviewCard;
}

// Nota di giornata (una sola per data, condivisa tra i due allenamenti).
function buildWorkoutDiaryNote(dateKey) {
  const existingEntry = state.personal.diary.find((e) => e.date === dateKey);
  const noteWrap = document.createElement("div");
  noteWrap.className = "workout-diary-note";
  const label = document.createElement("label");
  label.textContent = "Nota allenamento";
  const textarea = document.createElement("textarea");
  textarea.placeholder = "Come è andato? Annotazioni, sensazioni...";
  textarea.value = existingEntry ? existingEntry.text : "";
  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.className = "workout-diary-save";
  saveBtn.textContent = "Salva nota";
  saveBtn.addEventListener("click", async () => {
    const text = textarea.value.trim();
    if (!text) return;
    const idx = state.personal.diary.findIndex((e) => e.date === dateKey);
    if (idx >= 0) {
      state.personal.diary[idx].text = text;
    } else {
      state.personal.diary.push({ date: dateKey, text });
    }
    state.personal.diary.sort((a, b) => b.date.localeCompare(a.date));
    await savePersonalState();
    saveBtn.textContent = "✓ Salvato";
    setTimeout(() => { saveBtn.textContent = "Salva nota"; }, 2000);
  });
  noteWrap.appendChild(label);
  noteWrap.appendChild(textarea);
  noteWrap.appendChild(saveBtn);
  return noteWrap;
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
  updateCalendarHeatmapSummary(calendarMonthCursor);
  calendarGridEl.innerHTML = "";

  const firstDay = startOfMonth(calendarMonthCursor);
  const gridStart = new Date(firstDay);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  gridStart.setDate(firstDay.getDate() - mondayOffset);

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const dateKey = formatIsoDate(date);
    const session1 = getOrBuildSession(dateKey, 1);
    const session2 = getOrBuildSession(dateKey, 2);
    const hasFirst = !!(session1 && session1.exercises.length);
    const hasSecond = !!(session2 && session2.exercises.length);
    // La cella riflette il 1º allenamento; se manca, il 2º.
    const session = hasFirst ? session1 : session2;
    const visualStatus = getSessionVisualStatus(session, dateKey);
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "calendar-cell";

    if (date.getMonth() !== calendarMonthCursor.getMonth()) {
      cell.classList.add("calendar-cell-muted");
    }

    if (session && session.exercises.length) {
      cell.classList.add(`calendar-cell-${visualStatus === "done" ? "done" : visualStatus === "missed" ? "missed" : "planned"}`);
      if (hasFirst && hasSecond) {
        cell.classList.add("calendar-cell-double");
      }
      const score = getSessionPerformanceScore(session);
      if (visualStatus === "done") {
        const tier = getHeatTier(score);
        if (tier > 0) cell.classList.add(`calendar-heat-${tier}`);
      }
      if (Number.isFinite(score)) {
        const doubleNote = hasFirst && hasSecond ? " · 2 allenamenti" : "";
        cell.title = `Score ${score}/100 · ${getSessionStatusLabel(session, dateKey)}${doubleNote}`;
      }
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
    const sessionsForDay = getSessionsForDate(dateKey);
    const isToday = dateKey === todayKey;

    // Recorded sessions for this day (1º and/or 2º workout)
    if (sessionsForDay.length) {
      // Almeno un allenamento completato mantiene viva la streak del giorno.
      if (sessionsForDay.some((s) => s.status === "completed")) {
        streak += 1;
        continue;
      }
      // Today still planned / in progress doesn't break the streak yet
      if (isToday) continue;
      // A past workout left unfinished counts as missed → streak resets
      break;
    }

    // No stored session: today with nothing started yet is fine
    if (isToday) continue;

    // Missed sessions are purged server-side, so detect a scheduled-but-skipped
    // day from the weekly template instead (either slot).
    const scheduled = getTemplateExercisesForDate(dateKey, 1);
    const scheduled2 = getTemplateExercisesForDate(dateKey, 2);
    if ((scheduled && scheduled.length) || (scheduled2 && scheduled2.length)) {
      // A workout was planned for this past day but never completed → missed
      break;
    }

    // Rest day (nothing scheduled) → does not affect the streak
  }

  return streak;
}

function renderPersonal() {
  profileNameEl.textContent = state.personal.profileName;
  if (profileStreakValueEl) {
    profileStreakValueEl.textContent = String(getPersonalWorkoutStreak());
  }
  renderMetricsChart();
  renderMeasurementsSummary();
  renderPhotos();
  renderDiary();
}

// Shows the latest body measurement for each tracked circumference along with
// the delta versus the previous reading that included it.
function renderMeasurementsSummary() {
  if (!measurementsSummaryEl) return;

  const fields = [
    ["waist", "Vita"],
    ["chest", "Petto"],
    ["arm", "Braccio"],
    ["thigh", "Coscia"]
  ];
  const metrics = [...state.personal.metrics].sort((a, b) => a.date.localeCompare(b.date));

  const cards = fields.map(([key, label]) => {
    const withValue = metrics.filter((m) => Number.isFinite(Number(m[key])));
    if (!withValue.length) return "";
    const latest = withValue[withValue.length - 1];
    const prev = withValue.length > 1 ? withValue[withValue.length - 2] : null;
    let deltaStr = "";
    if (prev) {
      const d = Number(latest[key]) - Number(prev[key]);
      const sign = d > 0 ? "+" : "";
      const cls = d > 0 ? "measure-up" : (d < 0 ? "measure-down" : "");
      deltaStr = `<span class="measure-delta ${cls}">${sign}${d.toFixed(1)}</span>`;
    }
    return `<div class="measure-card">
      <span class="measure-label">${label}</span>
      <span class="measure-val">${Number(latest[key])}<small>cm</small></span>
      ${deltaStr}
    </div>`;
  }).filter(Boolean).join("");

  measurementsSummaryEl.innerHTML = cards
    ? `<p class="measurements-title">Ultime misure</p><div class="measure-grid">${cards}</div>`
    : "";
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
  const topPadding = 30;
  const bottomPadding = 38;
  const leftPadding = 24;
  const rightPadding = 24;
  const axisW = 56;
  const width = Math.max(viewportWidth, (Math.max(metrics.length, 2) - 1) * spacing + leftPadding + rightPadding);

  // Crisp rendering on high-DPI / retina screens: scale the backing store by
  // the device pixel ratio while keeping the CSS size in logical pixels.
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  plotCanvas.width = Math.round(width * dpr);
  plotCanvas.height = Math.round(height * dpr);
  plotCanvas.style.width = width + "px";
  plotCanvas.style.height = height + "px";
  plotCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  axisCanvas.width = Math.round(axisW * dpr);
  axisCanvas.height = Math.round(height * dpr);
  axisCanvas.style.width = axisW + "px";
  axisCanvas.style.height = height + "px";
  axisCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const plotBg = plotCtx.createLinearGradient(0, 0, 0, height);
  plotBg.addColorStop(0, "#181818");
  plotBg.addColorStop(1, "#0f0f0f");
  plotCtx.fillStyle = plotBg;
  plotCtx.fillRect(0, 0, width, height);

  const axisBg = axisCtx.createLinearGradient(0, 0, 0, height);
  axisBg.addColorStop(0, "#181818");
  axisBg.addColorStop(1, "#0f0f0f");
  axisCtx.fillStyle = axisBg;
  axisCtx.fillRect(0, 0, axisW, height);

  if (metrics.length < 2) {
    plotCtx.fillStyle = "#8d8d8d";
    plotCtx.font = "14px 'DM Sans', sans-serif";
    plotCtx.fillText("Aggiungi almeno 2 misurazioni per visualizzare il grafico", 24, 40);
    if (metricsLegendEl) metricsLegendEl.innerHTML = "";
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

  // Horizontal gridlines (dashed) + Y-axis labels
  for (let index = 0; index <= 4; index += 1) {
    const y = topPadding + (index * (height - topPadding - bottomPadding)) / 4;
    const value = (maxY - ((maxY - minY) * index) / 4).toFixed(1);

    plotCtx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    plotCtx.lineWidth = 1;
    plotCtx.setLineDash([4, 6]);
    plotCtx.beginPath();
    plotCtx.moveTo(leftPadding, y);
    plotCtx.lineTo(width - rightPadding, y);
    plotCtx.stroke();
    plotCtx.setLineDash([]);

    axisCtx.fillStyle = "#7a7a7a";
    axisCtx.font = "10px 'DM Sans', sans-serif";
    axisCtx.textAlign = "right";
    axisCtx.fillText(value, axisW - 10, y + 3);
  }

  // Date labels along the bottom
  const labelStep = Math.max(1, Math.ceil(parsedMetrics.length / 8));
  parsedMetrics.forEach((metric, index) => {
    if (index % labelStep !== 0 && index !== parsedMetrics.length - 1) {
      return;
    }
    const x = projectX(index);
    plotCtx.fillStyle = "#707070";
    plotCtx.font = "10px 'DM Sans', sans-serif";
    plotCtx.textAlign = "center";
    plotCtx.fillText(metric.dateObj.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" }), x, height - 14);
  });
  plotCtx.textAlign = "left";

  function seriesPoints(key) {
    return parsedMetrics.map((metric, index) => ({ x: projectX(index), y: projectY(metric[key]) }));
  }

  // Smooth (Catmull-Rom → cubic bezier) path through the points.
  // Adds segments to the current path; does not begin or close it.
  function traceSmooth(pts) {
    plotCtx.moveTo(pts[0].x, pts[0].y);
    for (let i = 0; i < pts.length - 1; i += 1) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      plotCtx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
  }

  function drawArea(pts, colorStart, colorEnd) {
    const gradient = plotCtx.createLinearGradient(0, topPadding, 0, height - bottomPadding);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);

    plotCtx.beginPath();
    traceSmooth(pts);
    plotCtx.lineTo(pts[pts.length - 1].x, height - bottomPadding);
    plotCtx.lineTo(pts[0].x, height - bottomPadding);
    plotCtx.closePath();
    plotCtx.fillStyle = gradient;
    plotCtx.fill();
  }

  function drawSeries(pts, color) {
    // Soft glow underlay for the line
    plotCtx.save();
    plotCtx.shadowColor = color;
    plotCtx.shadowBlur = 10;
    plotCtx.strokeStyle = color;
    plotCtx.lineWidth = 2.5;
    plotCtx.lineJoin = "round";
    plotCtx.lineCap = "round";
    plotCtx.beginPath();
    traceSmooth(pts);
    plotCtx.stroke();
    plotCtx.restore();

    pts.forEach((p, index) => {
      const isLast = index === pts.length - 1;
      const r = isLast ? 5 : 3.2;

      // Halo
      plotCtx.beginPath();
      plotCtx.fillStyle = color;
      plotCtx.globalAlpha = 0.18;
      plotCtx.arc(p.x, p.y, r + 4, 0, Math.PI * 2);
      plotCtx.fill();
      plotCtx.globalAlpha = 1;

      // Dot
      plotCtx.beginPath();
      plotCtx.fillStyle = color;
      plotCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
      plotCtx.fill();

      // Bright core
      plotCtx.beginPath();
      plotCtx.fillStyle = "rgba(255, 255, 255, 0.92)";
      plotCtx.arc(p.x, p.y, isLast ? 2 : 1.3, 0, Math.PI * 2);
      plotCtx.fill();

      // Ring on the latest point
      if (isLast) {
        plotCtx.beginPath();
        plotCtx.strokeStyle = color;
        plotCtx.lineWidth = 1.5;
        plotCtx.arc(p.x, p.y, r + 3, 0, Math.PI * 2);
        plotCtx.stroke();
      }
    });
  }

  const weightPts = seriesPoints("weight");
  const musclePts = seriesPoints("muscleMass");

  drawArea(weightPts, "rgba(232, 255, 71, 0.18)", "rgba(232, 255, 71, 0.01)");
  drawArea(musclePts, "rgba(255, 92, 53, 0.16)", "rgba(255, 92, 53, 0.01)");
  drawSeries(weightPts, "#e8ff47");
  drawSeries(musclePts, "#ff5c35");

  // HTML legend with current values + delta since first measurement
  // (stays put instead of scrolling away with the canvas)
  if (metricsLegendEl) {
    const latest = parsedMetrics[parsedMetrics.length - 1];
    const first = parsedMetrics[0];
    const deltaTag = (now, then) => {
      const d = now - then;
      const cls = d >= 0 ? "up" : "down";
      const sign = d > 0 ? "+" : "";
      return `<span class="metrics-legend-delta ${cls}">${sign}${d.toFixed(1)} kg</span>`;
    };
    metricsLegendEl.innerHTML = `
      <div class="metrics-legend-item">
        <span class="metrics-legend-dot" style="background:#e8ff47"></span>
        <span class="metrics-legend-label">Peso</span>
        <span class="metrics-legend-value">${latest.weight.toFixed(1)} kg</span>
        ${deltaTag(latest.weight, first.weight)}
      </div>
      <div class="metrics-legend-item">
        <span class="metrics-legend-dot" style="background:#ff5c35"></span>
        <span class="metrics-legend-label">Massa muscolare</span>
        <span class="metrics-legend-value">${latest.muscleMass.toFixed(1)} kg</span>
        ${deltaTag(latest.muscleMass, first.muscleMass)}
      </div>
    `;
  }

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
    if (btn.dataset.tab === tabId) moveNavIndicator(btn);
  });

  if (mainHeaderEl) {
    mainHeaderEl.style.display = tabId === "tab-week" ? "block" : "none";
  }

  if (tabId === "tab-personal") {
    renderPersonal();
  }
}

// ── Progress photos ──────────────────────────────────────────
let photoViewerCurrentId = null;

// Reads a File and returns a compressed JPEG data URL (max side ~900px) so the
// stored state stays small enough for the JSON document.
function compressImageFile(file, maxSide = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read error"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode error"));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSide) {
          height = Math.round((height * maxSide) / width);
          width = maxSide;
        } else if (height >= width && height > maxSide) {
          width = Math.round((width * maxSide) / height);
          height = maxSide;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handleAddPhoto(file) {
  if (!file) return;
  try {
    showToast("Elaborazione foto...");
    const dataUrl = await compressImageFile(file);
    if (!Array.isArray(state.personal.photos)) state.personal.photos = [];
    state.personal.photos.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: getTodayKey(),
      dataUrl
    });
    state.personal.photos.sort((a, b) => a.date.localeCompare(b.date));
    const ok = await savePersonalState();
    if (ok) {
      renderPhotos();
      showToast("Foto salvata");
    }
  } catch (e) {
    showToast("Impossibile elaborare l'immagine");
  }
}

function renderPhotos() {
  if (!photoGridEl) return;
  const photos = Array.isArray(state.personal.photos) ? state.personal.photos : [];
  if (!photos.length) {
    photoGridEl.innerHTML = `<p class="photo-empty">Nessuna foto. Aggiungine una per confrontare i progressi nel tempo.</p>`;
    return;
  }
  photoGridEl.innerHTML = "";
  photos.forEach((photo) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "photo-cell";
    cell.style.backgroundImage = `url("${photo.dataUrl}")`;
    const label = document.createElement("span");
    label.className = "photo-cell-date";
    label.textContent = formatPhotoDate(photo.date);
    cell.appendChild(label);
    cell.addEventListener("click", () => openPhotoViewer(photo.id));
    photoGridEl.appendChild(cell);
  });
}

function formatPhotoDate(dateKey) {
  try {
    return dateFromIso(dateKey).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "2-digit" });
  } catch (e) {
    return dateKey;
  }
}

function openPhotoViewer(id) {
  const photo = (state.personal.photos || []).find((p) => p.id === id);
  if (!photo || !photoViewerEl) return;
  photoViewerCurrentId = id;
  photoViewerImgEl.src = photo.dataUrl;
  photoViewerDateEl.textContent = formatPhotoDate(photo.date);
  photoViewerEl.classList.remove("hidden");
}

function closePhotoViewer() {
  if (photoViewerEl) photoViewerEl.classList.add("hidden");
  if (photoViewerImgEl) photoViewerImgEl.src = "";
  photoViewerCurrentId = null;
}

async function deleteCurrentPhoto() {
  if (!photoViewerCurrentId) return;
  if (!confirm("Eliminare questa foto?")) return;
  state.personal.photos = (state.personal.photos || []).filter((p) => p.id !== photoViewerCurrentId);
  const ok = await savePersonalState();
  if (ok) {
    closePhotoViewer();
    renderPhotos();
    showToast("Foto eliminata");
  }
}

// ── Data export / import ─────────────────────────────────────
async function exportData() {
  try {
    const res = await fetch("/api/state");
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gymplanner-backup-${getTodayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Backup esportato");
  } catch (e) {
    showToast("Errore durante l'esportazione");
  }
}

async function importData(file) {
  if (!file) return;
  if (!confirm("Importare questo backup? I dati attuali verranno sovrascritti.")) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const res = await fetch("/api/import", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: parsed })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showToast(err.error || "Import non riuscito");
      return;
    }
    // Reload everything from the freshly imported state.
    await loadState();
    syncWorkoutSessionsRange();
    updateStats();
    renderLibrarySection();
    renderEditorDaySelect();
    renderEditor();
    renderWeekCards();
    renderCalendar();
    renderPersonal();
    showToast("Backup importato");
  } catch (e) {
    showToast("File non valido");
  }
}

// ── Plate calculator ─────────────────────────────────────────
const PLATE_SIZES = [25, 20, 15, 10, 5, 2.5, 1.25];

// Greedy breakdown of the per-side load into available plates.
function computePlates(totalWeight, barWeight) {
  const perSide = (totalWeight - barWeight) / 2;
  if (!Number.isFinite(perSide) || perSide < 0) return null;
  const plates = [];
  let remaining = perSide;
  PLATE_SIZES.forEach((size) => {
    let count = 0;
    while (remaining >= size - 1e-9) {
      remaining -= size;
      count += 1;
    }
    if (count) plates.push({ size, count });
  });
  return { perSide, plates, leftover: remaining };
}

function renderPlateCalc() {
  if (!plateResultEl) return;
  const total = Number(plateTargetWeightEl.value);
  const bar = Number(plateBarWeightEl.value);
  if (!Number.isFinite(total) || total <= 0) {
    plateResultEl.innerHTML = `<p class="plate-empty">Inserisci un peso totale.</p>`;
    return;
  }
  const result = computePlates(total, bar);
  if (!result) {
    plateResultEl.innerHTML = `<p class="plate-empty">Peso inferiore al bilanciere.</p>`;
    return;
  }
  if (!result.plates.length) {
    plateResultEl.innerHTML = `<p class="plate-empty">Solo bilanciere (${bar} kg), nessun disco.</p>`;
    return;
  }
  const chips = result.plates
    .map((p) => `<span class="plate-chip">${p.count}× ${p.size}</span>`)
    .join("");
  const leftoverNote = result.leftover > 0.01
    ? `<p class="plate-note">Non ottenibile esattamente: ${(result.leftover).toFixed(2)} kg per lato mancanti.</p>`
    : "";
  plateResultEl.innerHTML = `
    <p class="plate-perside">${result.perSide.toFixed(2)} kg per lato</p>
    <div class="plate-chips">${chips}</div>
    ${leftoverNote}
  `;
}

function openPlateCalc() {
  if (!plateCalcModalEl) return;
  plateCalcModalEl.classList.remove("hidden");
  renderPlateCalc();
}

function closePlateCalc() {
  if (plateCalcModalEl) plateCalcModalEl.classList.add("hidden");
}

// ── Theme (dark / light) ─────────────────────────────────────
const THEME_KEY = "gymplanner_theme";

function applyTheme(theme) {
  const isLight = theme === "light";
  document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");
  if (themeToggleBtn) themeToggleBtn.textContent = isLight ? "☀️ Chiaro" : "🌙 Scuro";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", isLight ? "#f4f4f5" : "#0d0d0d");
}

function initTheme() {
  let theme = "dark";
  try {
    theme = localStorage.getItem(THEME_KEY) || "dark";
  } catch (e) { /* ignore */ }
  applyTheme(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  const next = current === "light" ? "dark" : "light";
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (e) { /* ignore */ }
  // Repaint canvases that bake colours in.
  renderMetricsChart();
}

function bindEvents() {
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });

  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);
  if (openPlateCalcBtn) openPlateCalcBtn.addEventListener("click", openPlateCalc);
  if (closePlateCalcBtn) closePlateCalcBtn.addEventListener("click", closePlateCalc);
  if (plateCalcModalEl) {
    plateCalcModalEl.querySelector(".plate-modal-backdrop").addEventListener("click", closePlateCalc);
  }
  if (plateTargetWeightEl) plateTargetWeightEl.addEventListener("input", renderPlateCalc);
  if (plateBarWeightEl) plateBarWeightEl.addEventListener("change", renderPlateCalc);

  if (addPhotoBtn && photoInputEl) {
    addPhotoBtn.addEventListener("click", () => photoInputEl.click());
    photoInputEl.addEventListener("change", () => {
      const file = photoInputEl.files && photoInputEl.files[0];
      handleAddPhoto(file);
      photoInputEl.value = "";
    });
  }
  if (photoViewerCloseEl) photoViewerCloseEl.addEventListener("click", closePhotoViewer);
  if (photoViewerDeleteEl) photoViewerDeleteEl.addEventListener("click", deleteCurrentPhoto);

  if (exportDataBtn) exportDataBtn.addEventListener("click", exportData);
  if (importDataBtn && importDataInputEl) {
    importDataBtn.addEventListener("click", () => importDataInputEl.click());
    importDataInputEl.addEventListener("change", () => {
      const file = importDataInputEl.files && importDataInputEl.files[0];
      importData(file);
      importDataInputEl.value = "";
    });
  }

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

  if (editorDayTypeSelectEl) {
    editorDayTypeSelectEl.addEventListener("change", () => {
      const currentDay = editorDaySelectEl.value || days[0];
      ensureWeekTemplateTypes();
      const typesMap = getTemplateTypesForSlot(editorSlot);
      typesMap[currentDay] = editorDayTypeSelectEl.value || null;
      syncWorkoutSessionsRange();
      renderEditor();
      renderWeekCards();
    });
  }

  editorSlotBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextSlot = Number(btn.dataset.slot) === 2 ? 2 : 1;
      if (nextSlot === editorSlot) return;
      editorSlot = nextSlot;
      renderEditor();
    });
  });

  if (editorSearchEl) {
    editorSearchEl.addEventListener("input", renderEditor);
  }

  if (openPickerBtn) openPickerBtn.addEventListener("click", openPickerDrawer);
  if (closePickerBtn) closePickerBtn.addEventListener("click", closePickerDrawer);
  if (pickerDrawerEl) {
    pickerDrawerEl.querySelector(".picker-drawer-backdrop").addEventListener("click", closePickerDrawer);
  }

  if (closeExerciseInfoBtnEl) closeExerciseInfoBtnEl.addEventListener("click", closeExerciseInfoPanel);
  if (exerciseInfoPanelEl) {
    exerciseInfoPanelEl.querySelector(".exercise-info-backdrop").addEventListener("click", closeExerciseInfoPanel);
  }
  if (saveExerciseInfoBtnEl) saveExerciseInfoBtnEl.addEventListener("click", saveExerciseInfoEntry);
  if (exerciseInfoVideoUrlEl) {
    exerciseInfoVideoUrlEl.addEventListener("blur", () => updateExerciseInfoVideo(exerciseInfoVideoUrlEl.value));
  }

  if (openLibraryMgrBtn) openLibraryMgrBtn.addEventListener("click", openLibraryModal);
  if (closeLibraryMgrBtn) closeLibraryMgrBtn.addEventListener("click", closeLibraryModal);
  if (libraryModalEl) {
    libraryModalEl.querySelector(".library-modal-backdrop").addEventListener("click", closeLibraryModal);
    libraryModalEl.querySelectorAll(".lib-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        libraryMgrActiveSource = tab.dataset.source;
        libraryModalEl.querySelectorAll(".lib-tab").forEach((t) => t.classList.toggle("active", t === tab));
        renderLibraryModal();
      });
    });
  }

  if (addExerciseBtnEl && newExerciseNameEl) {
    addExerciseBtnEl.addEventListener("click", () => {
      const name = newExerciseNameEl.value.trim();
      if (!name) return;
      const key = libraryMgrActiveSource === "bench" ? "bench_dumbbell_barbell" : "toorx_msx50";
      if (!state.exerciseLibrary[key].includes(name)) {
        state.exerciseLibrary[key].push(name);
        renderLibraryModal();
        newExerciseNameEl.value = "";
      }
    });
    newExerciseNameEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addExerciseBtnEl.click();
    });
  }

  if (saveLibraryBtnEl) {
    saveLibraryBtnEl.addEventListener("click", async () => {
      const ok = await saveExerciseLibrary();
      if (ok) {
        alert("Libreria salvata!");
        closeLibraryModal();
        renderEditor();
      }
    });
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

    // Optional body measurements (cm) — only stored when filled in.
    const measureFields = [
      ["waist", metricWaistEl],
      ["chest", metricChestEl],
      ["arm", metricArmEl],
      ["thigh", metricThighEl]
    ];
    measureFields.forEach(([key, el]) => {
      if (el && el.value !== "") {
        const v = Number(el.value);
        if (Number.isFinite(v)) metric[key] = v;
      }
    });

    state.personal.metrics.push(metric);
    state.personal.metrics.sort((a, b) => a.date.localeCompare(b.date));

    await savePersonalState();
    metricForm.reset();
    metricForm.classList.add("hidden");
    renderMetricsChart();
    renderMeasurementsSummary();
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

// ── Rest Timer ────────────────────────────────────────────────
const REST_TIMER_KEY = "gymplanner_rest_timer_ends_at";

function restTimerFormatTime(s) {
  const safe = Math.max(0, s);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function _startRestTimerLoop() {
  const overlay = document.getElementById("restTimerOverlay");
  const display = document.getElementById("restTimerDisplay");
  const mini = document.getElementById("restTimerMini");
  const miniDisplay = document.getElementById("restTimerMiniDisplay");
  const skipBtn = document.getElementById("restTimerSkip");
  const minimizeBtn = document.getElementById("restTimerMinimize");

  if (!overlay || !display || !skipBtn) return;

  clearInterval(restTimerIntervalId);

  function tick() {
    const remaining = Math.round((Number(localStorage.getItem(REST_TIMER_KEY)) - Date.now()) / 1000);
    const formatted = restTimerFormatTime(remaining);
    display.textContent = formatted;
    if (miniDisplay) miniDisplay.textContent = formatted;
    if (remaining <= 0) {
      hideRestTimer();
    }
  }

  tick();
  restTimerIntervalId = setInterval(tick, 1000);

  skipBtn.onclick = hideRestTimer;

  if (minimizeBtn) {
    minimizeBtn.onclick = () => {
      restTimerMinimized = true;
      overlay.classList.add("hidden");
      if (mini) mini.classList.remove("hidden");
    };
  }

  if (mini) {
    mini.onclick = () => {
      restTimerMinimized = false;
      mini.classList.add("hidden");
      overlay.classList.remove("hidden");
    };
    mini.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") mini.onclick();
    };
  }
}

function showRestTimer(seconds) {
  // Persist end timestamp so the timer survives app close/reload
  localStorage.setItem(REST_TIMER_KEY, String(Date.now() + seconds * 1000));
  restTimerMinimized = false;

  const overlay = document.getElementById("restTimerOverlay");
  const mini = document.getElementById("restTimerMini");
  if (overlay) overlay.classList.remove("hidden");
  if (mini) mini.classList.add("hidden");

  _startRestTimerLoop();
}

function hideRestTimer() {
  clearInterval(restTimerIntervalId);
  restTimerIntervalId = null;
  restTimerMinimized = false;
  localStorage.removeItem(REST_TIMER_KEY);
  const overlay = document.getElementById("restTimerOverlay");
  if (overlay) overlay.classList.add("hidden");
  const mini = document.getElementById("restTimerMini");
  if (mini) mini.classList.add("hidden");
}

function restoreRestTimerIfNeeded() {
  const endsAt = Number(localStorage.getItem(REST_TIMER_KEY));
  if (!endsAt) return;
  const remaining = Math.round((endsAt - Date.now()) / 1000);
  if (remaining <= 0) {
    localStorage.removeItem(REST_TIMER_KEY);
    return;
  }
  // Timer is still running — restore it minimized so the user can keep using the app
  restTimerMinimized = true;
  const mini = document.getElementById("restTimerMini");
  if (mini) mini.classList.remove("hidden");
  _startRestTimerLoop();
}

// Blocks app start until authenticated, but only when the backend requires it.
async function ensureAuthenticated() {
  let status;
  try {
    const res = await fetch("/api/auth/status");
    status = await res.json();
  } catch (e) {
    return; // server unreachable — let normal flow surface the error
  }
  if (!status || !status.authRequired) return;

  const tokenValid = async () => {
    try {
      const r = await fetch("/api/state");
      return r.ok;
    } catch (e) {
      return false;
    }
  };

  if (await tokenValid()) return;

  const overlay = document.getElementById("authOverlay");
  const form = document.getElementById("authForm");
  const pwd = document.getElementById("authPassword");
  const err = document.getElementById("authError");
  if (!overlay || !form || !pwd) return;

  overlay.classList.remove("hidden");
  pwd.focus();

  await new Promise((resolve) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try { localStorage.setItem(APP_TOKEN_KEY, pwd.value); } catch (er) { /* ignore */ }
      if (await tokenValid()) {
        if (err) err.classList.add("hidden");
        overlay.classList.add("hidden");
        resolve();
      } else {
        if (err) err.classList.remove("hidden");
        pwd.value = "";
        try { localStorage.removeItem(APP_TOKEN_KEY); } catch (er) { /* ignore */ }
      }
    });
  });
}

async function init() {
  initTheme();
  await ensureAuthenticated();
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
  restoreRestTimerIfNeeded();
  // Position the nav indicator instantly on first load (no animation)
  if (navIndicator) navIndicator.style.transition = "none";
  setActiveTab("tab-week");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (navIndicator) {
        navIndicator.style.transition = "";
        navIndicator.style.opacity = "1";
      }
    });
  });
}

init();