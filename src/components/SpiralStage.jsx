import { useRef } from "react";
import useProgressLoop from "../hooks/useProgressLoop";
import Spiral from "./Spiral";
import "./SpiralStage.css";

// Un "momento" pinnato — sezione alta (200-260vh), contenuto agganciato
// (position:sticky) per un intero schermo mentre si scorre.
//
// LA SPIRALE (round 15 settembre 2026 — sezione "Il centro"): non scala più
// con lo scroll (il vecchio zoom-out from→to veniva letto come il "reverse"
// dell'animazione della spirale che si avvolge). Ora la spirale ha un
// comportamento autonomo e costante: ruota lentissima in continuo
// (keyframes CSS, durata = `spin` secondi a giro) e respira di scala di
// ±4% con un ciclo lento di 14s — nessuna trasformazione pilotata dallo
// scroll, quindi nessun richiamo al rimpicciolirsi/srotolarsi.
//
// I CONTENUTI ("items": [{ content, at, span }]): niente più scorrimenti o
// sovrapposizioni — dissolvenza editoriale. Ogni blocco vive nella finestra
// [at, at+span] del progress: entra con fade + blur→nitido, esce con
// nitido→blur + fade. Le finestre si sovrappongono? Il blocco successivo
// "copre" il precedente mentre sale (l'opacità del precedente viene
// smorzata da quella del seguente): il risultato è una dissolvenza
// incrociata morbida in cui si legge sempre un blocco alla volta.
// Gli eventuali valori inutilizzati di `spiral` (from, to, rot) restano
// accettati ma ignorati, per compatibilità con l'API esistente.
const FADE = 0.24; // frazione della finestra dedicata a entrata/uscita
const BLUR_MAX = 9; // px di sfocatura a opacità zero

// Curva di dissolve: entra nella prima frazione FADE, tiene pieno, esce
// nell'ultima frazione FADE — con smoothstep (t²(3-2t)) invece del lineare,
// così i bordi della dissolvenza sono morbidi e non meccanici.
// Se la finestra supera la fine dello stage (at+span ≥ 1) l'ultimo blocco
// non esce: resta pieno fino a che la sezione non si sgancia.
function fadeCurve(prog, at, span) {
  if (span <= 0) return prog >= at ? 1 : 0;
  const holdsToEnd = at + span >= 1;
  const d = (prog - at) / span;
  if (d <= 0) return 0;
  const smooth = (t) => t * t * (3 - 2 * t);
  if (d < FADE) return smooth(d / FADE);
  if (holdsToEnd || d <= 1 - FADE) return 1;
  if (d < 1) return smooth((1 - d) / FADE);
  return 0;
}

export default function SpiralStage({
  height = "280vh",
  spiral: { armsCount = 3, opacity = 0.6, showThin = true, size } = {},
  spin = 340,
  breathingDot = false,
  items = [],
  className = "",
}) {
  const stageRef = useRef(null);
  const itemRefs = useRef([]);

  const getProgress = () => {
    const node = stageRef.current;
    if (!node) return 0;
    const rect = node.getBoundingClientRect();
    const span = Math.max(1, rect.height - window.innerHeight);
    return Math.min(1, Math.max(0, -rect.top / span));
  };

  const applyProgress = (p) => {
    const itemEls = itemRefs.current;
    if (p === null) {
      // Cleanup (loop disabilitato): azzera gli stili inline, il layout
      // statico (mobile / reduced-motion) riprende il controllo dal CSS.
      itemEls.forEach((el) => {
        if (!el) return;
        el.style.opacity = "";
        el.style.filter = "";
      });
      return;
    }

    // 1) opacità "grezza" di ogni blocco dalla sua finestra...
    const raw = items.map((it) => fadeCurve(p, it.at, it.span));
    // 2) ...poi, dal fondo verso la cima, ogni blocco viene smorzato da
    //    quanto è già visibile il successivo: se due finestre si accavallano
    //    il precedente sbiadisce mentre il seguente prende fuoco —mai due
    //    blocchi leggibili insieme, solo una dissolvenza incrociata.
    const vis = new Array(items.length).fill(0);
    for (let i = items.length - 1; i >= 0; i--) {
      const next = i + 1 < items.length ? vis[i + 1] : 0;
      vis[i] = raw[i] * (1 - next);
    }

    itemEls.forEach((el, i) => {
      if (!el) return;
      const o = vis[i];
      el.style.opacity = o.toFixed(3);
      // Il blur è parte dell'animazione, non un effetto separato: il blocco
      // "emerge dalla sfocatura" in entrata e ci torna in uscita. Applichiamo
      // il filtro solo quando serve (sotto la soglia è come pieno).
      el.style.filter = o > 0.995 ? "none" : `blur(${((1 - o) * BLUR_MAX).toFixed(2)}px)`;
    });
  };

  useProgressLoop(getProgress, applyProgress, true, stageRef);

  return (
    <section ref={stageRef} className={`spiral-stage ${className}`} style={{ height }}>
      <div className="spiral-stage__pin">
        <div
          className="spiral-stage__spiral-wrap"
          style={size ? { width: size, height: size } : undefined}
        >
          <div className="spiral-stage__spin" style={{ animationDuration: `${spin}s` }}>
            <div className="spiral-stage__spiral">
              <Spiral armsCount={armsCount} goldOpacity={opacity} showThin={showThin} />
            </div>
          </div>
        </div>

        {breathingDot && <div className="spiral-stage__dot" aria-hidden="true" />}

        <div className="spiral-stage__content">
          {items.map((it, i) => (
            <div
              key={i}
              ref={(node) => {
                itemRefs.current[i] = node;
              }}
              className="spiral-stage__item"
            >
              {it.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}