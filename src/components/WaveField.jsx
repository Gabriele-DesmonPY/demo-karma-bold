import { useEffect, useRef } from "react";
import "./WaveField.css";

// Sfondo animato a "nastri" — ricostruzione in canvas/vanilla JS del
// generatore di gradienti 21st.dev (community/gradients, modalità
// "stripes"/Ribbon Field, riferimento fornito da Gabry), con la palette
// sostituita da quella di brand. Stessa "forma" compositiva dell'originale
// (bianco 18% -> blu cielo 57% -> oltremare 60% -> iris 100%, cioè una
// fascia chiara stretta, una cucitura a due toni ravvicinati, una base che
// riempie il resto): qui la fascia chiara diventa un caldo quasi-bianco,
// la cucitura diventa oro-chiaro/oro-scuro, la base diventa il navy di
// brand — stesso ritmo, palette Karma. I confini di banda (le coppie di
// stop qui sotto) sono quelli esatti dell'approssimazione CSS fornita nel
// riferimento, ricolorati; non riproducono l'algoritmo interno esatto di
// generazione delle bande (proprietario, non documentato oltre alla CSS
// risultante), ma la stessa disposizione e le stesse proporzioni.
//
// L'animazione segue invece la formula di movimento data testualmente nel
// riferimento: l'angolo non ruota (motionAmount è 0 nel preset fornito),
// solo l'onda avanza — ogni riga (asse perpendicolare all'angolo) campiona
// il gradiente con un offset laterale
//   offset = (wave / 100) * 0.35 * sin(cross * 2.4 * 2π + clock)
// dove "clock" avanza nel tempo (20.75 + t*1.2, come specificato) — è
// quello che fa "ondeggiare" le bande invece di farle scorrere o ruotare.
// Il seno riparte sempre da valore diverso da zero in modo continuo (mai
// un salto all'avvio): non c'è un istante "prima dell'animazione" diverso
// dal primo frame animato, quindi non serve la correzione cos(x)-1 usata
// altrove per evitare scatti — qui il clock parte già da 20.75, non da 0.
const ANGLE_DEG = 32;
const WAVE = 14;
// Rallentato su richiesta di Gabry (era 1 — troppo veloce): l'onda avanza
// a circa un terzo del ritmo originale, resta percettibile ma diventa
// un fondale, non qualcosa che cattura l'occhio.
const SPEED = 0.35;

// Round 12 settembre 2026 (fluidità): un gradiente diverso per OGNI riga
// (createLinearGradient + 8 addColorStop, ~600 volte per frame) era il
// costo più alto di tutta la home — migliaia di allocazioni al secondo per
// un effetto che poi viene comunque sfocato di 22px. Raggruppare le righe
// in bande che condividono lo stesso gradiente taglia le allocazioni senza
// cambiare il risultato visivo: una banda da 4px resta ben sotto il raggio
// di sfocatura, quindi il "gradino" fra bande vicine sparisce lo stesso.
const GRADIENT_BAND = 4;

// Sotto questa larghezza il canvas non parte proprio: sostituito da un
// semplice sfondo CSS statico (vedi ZoomParallaxIntro.css). Il progetto ha
// già una storia di problemi di fluidità mobile con effetti pesanti — un
// loop rAF che ridisegna l'intero canvas ogni frame è esattamente il tipo
// di lavoro che su un telefono di fascia media/bassa può bloccare la
// pagina in apertura, proprio quando l'utente vede la home per la prima
// volta. Stessa soglia già usata da ZoomParallaxIntro per isMobile.
const MOBILE_BREAKPOINT = 640;

// Stessi confini di banda del CSS del riferimento (percentuali, qui come
// frazioni 0–1), colori sostituiti con la palette di brand mantenendo
// ordine e proporzioni.
const STOPS = [
  { pos: 0.0432, color: [255, 249, 236] }, // quasi-bianco caldo (era #FFFFFF)
  { pos: 0.3318, color: [255, 249, 236] },
  { pos: 0.3786, color: [208, 172, 117] }, // gold-bright (era #78B8F9)
  { pos: 0.5814, color: [208, 172, 117] },
  { pos: 0.5886, color: [175, 129, 59] }, // gold-deep (era #5667FF)
  { pos: 0.7964, color: [175, 129, 59] },
  { pos: 0.8, color: [10, 37, 69] }, // navy di brand (era #4D2FF9)
  { pos: 1, color: [10, 37, 69] },
];

export default function WaveField({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

    // Il loop non deve girare se: l'utente ha chiesto reduced-motion, siamo
    // su mobile (vedi MOBILE_BREAKPOINT più sopra), oppure il canvas non è
    // attualmente in vista (l'utente ha già scrollato oltre l'ingresso —
    // da qui in poi il resto della pagina, timeline e sezioni oro, non ha
    // motivo di continuare a pagare un ridisegno completo del canvas ad
    // ogni frame per uno sfondo che non si vede più).
    let inView = true;
    const shouldAnimate = () => !mqMotion.matches && !mqMobile.matches && inView;

    let raf = null;
    let startedAt = Date.now();

    // Angolo del canvas: ruotato in modo che l'asse locale +x coincida con
    // la direzione del gradiente CSS a ANGLE_DEG (dove 0° punta in alto e
    // cresce in senso orario, convenzione CSS) — φ = angolo - 90°.
    const angleRad = ((ANGLE_DEG - 90) * Math.PI) / 180;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      // Risoluzione piena (non più dimezzata): il costo resta comunque
      // basso — si disegna per riga, non per pixel — e una risoluzione
      // più alta rende più sottile il "gradino" ai confini di banda,
      // prima ancora della sfocatura in CSS che lo elimina del tutto
      // (vedi WaveField.css: era il dimezzamento + i bordi netti fra le
      // bande a rendere visibili i pixel segnalati da Gabry).
      canvas.width = width;
      canvas.height = height;
    };

    // Lunghezza della "linea di gradiente" come la calcolerebbe un vero
    // linear-gradient CSS a questo angolo su un box W×H — non la
    // diagonale del canvas. Usare la diagonale come intervallo 0–100%
    // "zoomava" la vista sul centro del gradiente (quasi tutto oro,
    // navy e crema ridotti a un'unghia negli angoli): questa è la stessa
    // formula che usa il CSS per far coincidere gli stop percentuali con
    // le proporzioni reali del box, indipendentemente da quanto il canvas
    // debba estendersi in diagonale per coprire gli angoli dopo la
    // rotazione.
    const gradientSpan = (w, h) => {
      const a = (ANGLE_DEG * Math.PI) / 180;
      return Math.abs(w * Math.sin(a)) + Math.abs(h * Math.cos(a));
    };

    const drawFrame = (t) => {
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) return;
      const diag = Math.sqrt(w * w + h * h);
      const half = diag / 2;
      const spanHalf = gradientSpan(w, h) / 2;
      const clock = 20.75 + t * SPEED * 1.2;

      ctx.save();
      ctx.clearRect(0, 0, w, h);
      ctx.translate(w / 2, h / 2);
      ctx.rotate(angleRad);

      const rowStep = Math.max(1, Math.round(diag / 600));
      let grad = null;
      let rowsLeftInBand = 0;
      for (let y = -half; y <= half; y += rowStep) {
        // Un nuovo gradiente ogni GRADIENT_BAND righe, non ad ogni riga: il
        // filter: blur(22px) in WaveField.css sfoca comunque ogni confine
        // più piccolo del suo raggio, quindi una banda di poche righe resta
        // visivamente identica a un gradiente per-riga ma costa una
        // frazione delle allocazioni (createLinearGradient + 8
        // addColorStop, prima ripetute ~600 volte per frame).
        if (rowsLeftInBand <= 0) {
          const crossNorm = (y + half) / diag;
          const offset = (WAVE / 100) * 0.35 * Math.sin(crossNorm * 2.4 * Math.PI * 2 + clock);
          // Il gradiente è definito solo fra -spanHalf e +spanHalf (le
          // proporzioni reali); il fillRect si estende oltre fino a ±half
          // per coprire gli angoli del box dopo la rotazione — fuori
          // dall'intervallo il canvas estende automaticamente il colore
          // del primo/ultimo stop, esattamente come farebbe un
          // linear-gradient CSS.
          grad = ctx.createLinearGradient(-spanHalf, 0, spanHalf, 0);
          STOPS.forEach((s) => {
            const shifted = Math.min(1, Math.max(0, s.pos + offset));
            grad.addColorStop(shifted, `rgb(${s.color.join(",")})`);
          });
          rowsLeftInBand = GRADIENT_BAND;
        }
        ctx.fillStyle = grad;
        ctx.fillRect(-half, y, diag, rowStep + 1);
        rowsLeftInBand -= 1;
      }

      ctx.restore();
    };

    const tick = () => {
      drawFrame((Date.now() - startedAt) / 1000);
      raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(() => {
      resize();
      drawFrame(shouldAnimate() ? (Date.now() - startedAt) / 1000 : 0);
    });
    ro.observe(parent);
    resize();

    // Attivo/disattivo il loop in un unico punto: qualunque condizione sia
    // cambiata (viewport, prefers-reduced-motion, scroll fuori/dentro
    // vista), la stessa funzione decide se ripartire o fermarsi — niente
    // logica duplicata fra i vari listener qui sotto.
    const sync = () => {
      if (shouldAnimate()) {
        if (raf === null) {
          startedAt = Date.now();
          raf = requestAnimationFrame(tick);
        }
      } else {
        if (raf !== null) cancelAnimationFrame(raf);
        raf = null;
        drawFrame(0);
      }
    };

    sync();

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    io.observe(parent);

    mqMotion.addEventListener("change", sync);
    mqMobile.addEventListener("change", sync);

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mqMotion.removeEventListener("change", sync);
      mqMobile.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div className={`wave-field ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="wave-field__canvas" />
      <div className="wave-field__grain" />
    </div>
  );
}
