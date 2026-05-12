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
let workoutDetailDate = null;
let calendarMonthCursor = startOfMonth(new Date());
let timerIntervalId = null;
let restTimerIntervalId = null;
let restTimerMinimized = false;
let pendingProgressionReview = null;

const weekContainerEl = document.getElementById("weekContainer");
const weekOverviewEl = document.getElementById("weekOverview");
const editorDaySelectEl = document.getElementById("editorDaySelect");
const editorDayTypeSelectEl = document.getElementById("editorDayTypeSelect");
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
const metricsYAxisEl = document.getElementById("metricsYAxis");
const metricsChartEl = document.getElementById("metricsChart");
const metricsChartScrollEl = document.getElementById("metricsChartScroll");
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

function openExerciseInfoPanel(name, sets, reps) {
  exerciseInfoPanelCurrentName = name;
  const saved = (state.exerciseMeta && state.exerciseMeta[name]) || {};
  const defaults = EXERCISE_DEFAULTS[name] || {};
  exerciseInfoTitleEl.textContent = name;

  // Prefer the session's stored exercise weight (historical snapshot) over the global meta weight.
  // This prevents the panel from showing a later-updated weight when reviewing completed sessions.
  const sessionExercise = workoutDetailDate && state.workoutSessions[workoutDetailDate]
    ? state.workoutSessions[workoutDetailDate].exercises.find((e) => e.name === name)
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
    // Try to find in current session
    if (workoutDetailDate && state.workoutSessions[workoutDetailDate]) {
      const ex = state.workoutSessions[workoutDetailDate].exercises.find((e) => e.name === name);
      if (ex) { resolvedSets = ex.sets; resolvedReps = ex.reps; }
    }
    // Fallback: check weekTemplate for any day that has this exercise
    if (resolvedSets == null) {
      for (const day of Object.values(state.weekTemplate || {})) {
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

  // 2. Propagate weight back to the week template so the editor reflects it.
  //    Only update entries that currently have no weight override.
  if (weightSave !== null && state.weekTemplate) {
    Object.values(state.weekTemplate).forEach((entries) => {
      if (!Array.isArray(entries)) return;
      entries.forEach((entry) => {
        if (entry && entry.name === name && entry.weight == null) {
          entry.weight = weightSave;
        }
      });
    });
  }

  // 3. Update the current session's exercise weight ONLY if the session is still
  //    in-progress or paused (i.e. NOT completed). Never rewrite finished history.
  if (workoutDetailDate && state.workoutSessions[workoutDetailDate]) {
    const session = state.workoutSessions[workoutDetailDate];
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

function computeNextWeightSuggestion(exercise, session, sessionCompletionRate) {
  if (!exercise || !exercise.supportsWeight) {
    return null;
  }

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

  return {
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

  days.forEach((day) => {
    const entries = Array.isArray(state.weekTemplate[day]) ? state.weekTemplate[day] : [];
    state.weekTemplate[day] = entries
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
  const day = getDayFromDate(dateFromIso(dateKey));
  return {
    date: dateKey,
    day,
    trainingType: (state.weekTemplateTypes && state.weekTemplateTypes[day]) || null,
    status: dateKey < getTodayKey() ? "missed" : "planned",
    exercises: cloneExercisesForSession(exercises),
    durationSeconds: 0,
    activeStartedAt: null,
    completedAt: null
  };
}

// Returns a session from state if it exists, otherwise builds a virtual planned one from template.
// Virtual sessions are NOT stored in state — they are computed on the fly.
function getOrBuildSession(dateKey) {
  const existing = state.workoutSessions[dateKey];
  if (existing) return existing;
  // Never build virtual sessions for past dates — only real saved data counts
  if (dateKey < getTodayKey()) return null;
  const templateExercises = getTemplateExercisesForDate(dateKey);
  if (!templateExercises.length) return null;
  return createWorkoutSession(dateKey, templateExercises);
}

function syncWorkoutSessionsRange() {
  normalizeWorkoutSessions();

  let changed = false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatIsoDate(today);

  // Only iterate past days: mark missed, handle in_progress/paused left over
  for (let offset = -WORKOUT_SYNC_PAST_DAYS; offset < 0; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const dateKey = formatIsoDate(date);
    const existing = state.workoutSessions[dateKey];

    if (!existing) continue;
    if (existing.status === "completed" || existing.status === "missed") continue;

    existing.durationSeconds = getSessionElapsedSeconds(existing);
    existing.activeStartedAt = null;
    existing.status = "missed";
    changed = true;
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

function ensureWeekTemplateTypes() {
  if (!state.weekTemplateTypes || typeof state.weekTemplateTypes !== "object") {
    state.weekTemplateTypes = {};
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
  Object.keys(state.workoutSessions).forEach((key) => {
    const s = state.workoutSessions[key];
    if (s.status === "planned") delete state.workoutSessions[key];
    // Drop missed sessions older than today — no value in keeping them
    if (s.status === "missed" && key < getTodayKey()) delete state.workoutSessions[key];
  });
}

async function saveWeekTemplate() {
  const res = await fetch("/api/week-template", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weekTemplate: state.weekTemplate, weekTemplateTypes: state.weekTemplateTypes })
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

  const totalExercises = days.reduce((sum, day) => sum + (state.weekTemplate[day] || []).length, 0);
  const { monday, sunday } = getWeekContext();

  weekNumEl.textContent = getWeekNum();
  dayCountEl.textContent = days.filter((day) => (state.weekTemplate[day] || []).length > 0).length;
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

  days.forEach((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const dateKey = formatIsoDate(date);
    const session = getOrBuildSession(dateKey);
    const exercises = session ? session.exercises : [];
    const visualStatus = getSessionVisualStatus(session, dateKey);
    const isRest = !session || !exercises.length;

    const card = document.createElement("div");
    card.className = `day-card day-card-${visualStatus}${dateKey === getTodayKey() ? " day-card-today" : ""}`;
    card.dataset.day = day;
    card.setAttribute("data-drop-zone", day);

    // Make card droppable for entire workout
    card.addEventListener("dragover", (e) => {
      if (!isRest) {
        e.preventDefault();
        card.classList.add("day-card-drag-over");
      }
    });

    card.addEventListener("dragleave", (e) => {
      if (e.target === card) {
        card.classList.remove("day-card-drag-over");
      }
    });

    card.addEventListener("drop", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      card.classList.remove("day-card-drag-over");

      const dragData = e.dataTransfer.getData("application/json");
      if (!dragData) return;

      try {
        const { fromDay } = JSON.parse(dragData);
        if (fromDay === day) return; // Same day

        // Move entire workout via API
        const res = await fetch("/api/move-exercise", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fromDay, toDay: day })
        });

        if (res.ok) {
          const data = await res.json();
          state.weekTemplate = data.weekTemplate;
          state.weekTemplateTypes = data.weekTemplateTypes;
          syncWorkoutSessionsRange();
          renderWeekCards();
          renderCalendar();
          renderEditor();
        } else {
          alert("Errore nello spostamento");
        }
      } catch (err) {
        console.error("Drop error:", err);
      }
    });

    const head = document.createElement("div");
    head.className = "day-header";

    if (!isRest) {
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
    const sessionType = (session && session.trainingType)
      || (state.weekTemplateTypes && state.weekTemplateTypes[day])
      || null;
    if (sessionType) {
      categoryLabel.textContent = sessionType;
      categoryLabel.dataset.type = sessionType.toLowerCase().replace(/\s+/g, "-");
    }

    dayInfo.appendChild(title);
    if (sessionType) dayInfo.appendChild(categoryLabel);
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

    // Add move button and exercise count for workouts
    if (!isRest) {
      const workoutFooter = document.createElement("div");
      workoutFooter.className = "day-workout-footer";

      const exerciseCount = document.createElement("span");
      exerciseCount.className = "day-exercise-count";
      const templateExercises = (state.weekTemplate[day] || []).map(normalizeExerciseEntry).filter(Boolean);
      exerciseCount.textContent = `${templateExercises.length} esercizio${templateExercises.length !== 1 ? "i" : ""}`;

      const moveBtn = document.createElement("button");
      moveBtn.className = "day-move-btn";
      moveBtn.type = "button";
      moveBtn.draggable = true;
      moveBtn.textContent = "⬇ Sposta allenamento";

      moveBtn.addEventListener("dragstart", (e) => {
        e.stopPropagation();
        const dragData = { fromDay: day };
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("application/json", JSON.stringify(dragData));
        moveBtn.classList.add("dragging");
        // Highlight all drop zones except current day
        document.querySelectorAll(".day-card").forEach((c) => {
          const cDay = c.dataset.day;
          const cIsRest = !state.weekTemplate[cDay] || !state.weekTemplate[cDay].length;
          if (c.dataset.day !== day) {
            if (!cIsRest || (state.weekTemplate[cDay] && state.weekTemplate[cDay].length)) {
              c.classList.add("day-card-drop-available");
            }
          }
        });
      });

      moveBtn.addEventListener("dragend", (e) => {
        e.stopPropagation();
        moveBtn.classList.remove("dragging");
        document.querySelectorAll(".day-card").forEach((c) => {
          c.classList.remove("day-card-drop-available", "day-card-drag-over");
        });
      });

      moveBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openWorkoutMoveMenu(day, moveBtn);
      });

      workoutFooter.appendChild(exerciseCount);
      workoutFooter.appendChild(moveBtn);
      card.appendChild(workoutFooter);
    }

    // Make entire card draggable if it has a workout
    if (!isRest) {
      card.draggable = true;
      card.addEventListener("dragstart", (e) => {
        if (e.target !== card && !e.target.classList.contains("day-move-btn")) {
          return; // Only drag from header or move button
        }
        e.stopPropagation();
        const dragData = { fromDay: day };
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("application/json", JSON.stringify(dragData));
        card.classList.add("dragging");
        document.querySelectorAll(".day-card").forEach((c) => {
          if (c.dataset.day !== day) {
            c.classList.add("day-card-drop-available");
          }
        });
      });

      card.addEventListener("dragend", (e) => {
        e.stopPropagation();
        card.classList.remove("dragging");
        document.querySelectorAll(".day-card").forEach((c) => {
          c.classList.remove("day-card-drop-available", "day-card-drag-over");
        });
      });
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

async function moveWorkoutToDay(fromDay, toDay) {
  try {
    const res = await fetch("/api/move-exercise", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromDay, toDay })
    });

    if (res.ok) {
      const data = await res.json();
      state.weekTemplate = data.weekTemplate;
      state.weekTemplateTypes = data.weekTemplateTypes;
      syncWorkoutSessionsRange();
      renderWeekCards();
      renderCalendar();
      renderEditor();
    } else {
      alert("Errore nello spostamento");
    }
  } catch (err) {
    console.error("Move workout error:", err);
    alert("Errore nello spostamento allenamento");
  }
}

function openWorkoutMoveMenu(fromDay, triggerBtn) {
  // Close existing menu if any
  const existingMenu = document.querySelector(".workout-move-menu");
  if (existingMenu) existingMenu.remove();

  const menu = document.createElement("div");
  menu.className = "workout-move-menu";

  const title = document.createElement("div");
  title.className = "workout-move-menu-title";
  title.textContent = `Sposta allenamento a:`;
  menu.appendChild(title);

  const daysList = document.createElement("div");
  daysList.className = "workout-move-menu-days";

  days.forEach((targetDay) => {
    if (targetDay === fromDay) return; // Skip current day

    const dayBtn = document.createElement("button");
    dayBtn.className = "workout-move-menu-day-btn";
    dayBtn.type = "button";
    dayBtn.textContent = dayLabels[targetDay];
    dayBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await moveWorkoutToDay(fromDay, targetDay);
      menu.remove();
    });

    daysList.appendChild(dayBtn);
  });

  menu.appendChild(daysList);

  // Position menu near button
  const rect = triggerBtn.getBoundingClientRect();
  menu.style.position = "fixed";
  menu.style.top = (rect.bottom + 8) + "px";
  menu.style.left = Math.max(8, Math.min(window.innerWidth - 240, rect.left - 40)) + "px";

  document.body.appendChild(menu);

  // Close menu on outside click
  const closeMenu = (e) => {
    if (!menu.contains(e.target) && !triggerBtn.contains(e.target)) {
      menu.remove();
      document.removeEventListener("click", closeMenu);
    }
  };

  setTimeout(() => {
    document.addEventListener("click", closeMenu);
  }, 0);
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
  const currentDayType = (state.weekTemplateTypes && state.weekTemplateTypes[currentDay]) || "";
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
    const emptyLi = document.createElement("li");
    emptyLi.className = "day-ex-empty";
    emptyLi.textContent = "Nessun esercizio nel giorno selezionato.";
    dayExerciseListEl.appendChild(emptyLi);
  }
}

function openWorkoutDetail(dateKey) {
  // Ensure the session exists in state (needed to start/interact with it)
  if (!state.workoutSessions[dateKey]) {
    const built = getOrBuildSession(dateKey);
    if (!built || !built.exercises.length) return;
    state.workoutSessions[dateKey] = built;
  }
  const session = state.workoutSessions[dateKey];
  if (!session || !session.exercises.length) return;

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

    const weightedExercises = session.exercises.filter((exercise) => exercise.supportsWeight);
    if (weightedExercises.length) {
      const hint = document.createElement("div");
      hint.className = "progression-hint";
      hint.textContent = "Progressione automatica attiva: al termine del workout i carichi consigliati vengono aggiornati in base a completamento, durata e trend recente.";
      workoutActionsEl.appendChild(hint);
    }
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
    if (session.date === getTodayKey()) {
      workoutActionsEl.appendChild(createActionButton("INIZIA ALLENAMENTO", "workout-start-btn", async () => {
        await handleStartWorkout(session);
      }));
    } else {
      const plannedNote = document.createElement("div");
      plannedNote.className = "workout-planned-note";
      plannedNote.textContent = "Puoi iniziare questo allenamento solo nel giorno programmato.";
      workoutActionsEl.appendChild(plannedNote);
    }
  }

  if (session.status === "in_progress" || session.status === "paused") {
    workoutActionsEl.appendChild(createActionButton(session.status === "in_progress" ? "▌▌ Pausa" : "▶ Riprendi", "workout-control-btn", async () => {
      await handlePauseWorkout(session);
    }));
    workoutActionsEl.appendChild(createActionButton("■ Fine", "workout-stop-btn", async () => {
      await handleFinishWorkout(session);
    }));
    workoutActionsEl.appendChild(createActionButton("↺ Annulla", "workout-cancel-btn", async () => {
      await handleCancelWorkout(session);
    }));
  }

  const timeline = document.createElement("div");
  timeline.className = "exercise-timeline";

  const showCheckbox = session.status === "in_progress" || session.status === "paused";

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
        session.exercises[index].completed = checkbox.checked;
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
    meta.textContent = `${setsStr} · ${exercise.trainingType}${weightStr}${warmupStr}`;

    content.appendChild(title);
    content.appendChild(meta);

    row.appendChild(point);
    row.appendChild(checkbox);
    row.appendChild(content);
    timeline.appendChild(row);

    // Click on content area opens exercise detail panel
    content.addEventListener("click", (e) => {
      e.stopPropagation();
      openExerciseInfoPanel(exercise.name, exercise.sets, exercise.reps);
    });
    point.addEventListener("click", (e) => {
      e.stopPropagation();
      openExerciseInfoPanel(exercise.name, exercise.sets, exercise.reps);
    });
  });

  workoutExerciseListEl.appendChild(timeline);

  if (
    session.status === "completed"
    && pendingProgressionReview
    && pendingProgressionReview.sessionDate === session.date
    && Array.isArray(pendingProgressionReview.updates)
    && pendingProgressionReview.updates.length
  ) {
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
    workoutExerciseListEl.appendChild(reviewCard);
  }

  // Diary note section (only for completed workouts)
  if (session.status === "completed") {
    const existingEntry = state.personal.diary.find((e) => e.date === session.date);
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
      const idx = state.personal.diary.findIndex((e) => e.date === session.date);
      if (idx >= 0) {
        state.personal.diary[idx].text = text;
      } else {
        state.personal.diary.push({ date: session.date, text });
      }
      state.personal.diary.sort((a, b) => b.date.localeCompare(a.date));
      await savePersonalState();
      saveBtn.textContent = "✓ Salvato";
      setTimeout(() => { saveBtn.textContent = "Salva nota"; }, 2000);
    });
    noteWrap.appendChild(label);
    noteWrap.appendChild(textarea);
    noteWrap.appendChild(saveBtn);
    workoutExerciseListEl.appendChild(noteWrap);
  }
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
    const session = getOrBuildSession(dateKey);
    const visualStatus = getSessionVisualStatus(session, dateKey);
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "calendar-cell";

    if (date.getMonth() !== calendarMonthCursor.getMonth()) {
      cell.classList.add("calendar-cell-muted");
    }

    if (session && session.exercises.length) {
      cell.classList.add(`calendar-cell-${visualStatus === "done" ? "done" : visualStatus === "missed" ? "missed" : "planned"}`);
      const score = getSessionPerformanceScore(session);
      if (visualStatus === "done") {
        const tier = getHeatTier(score);
        if (tier > 0) cell.classList.add(`calendar-heat-${tier}`);
      }
      if (Number.isFinite(score)) {
        cell.title = `Score ${score}/100 · ${getSessionStatusLabel(session, dateKey)}`;
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
    if (btn.dataset.tab === tabId) moveNavIndicator(btn);
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

  if (editorDayTypeSelectEl) {
    editorDayTypeSelectEl.addEventListener("change", () => {
      const currentDay = editorDaySelectEl.value || days[0];
      if (!state.weekTemplateTypes) state.weekTemplateTypes = {};
      state.weekTemplateTypes[currentDay] = editorDayTypeSelectEl.value || null;
      syncWorkoutSessionsRange();
      renderEditor();
      renderWeekCards();
    });
  }

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