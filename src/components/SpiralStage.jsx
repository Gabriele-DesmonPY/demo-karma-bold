import { useRef } from "react";
import useProgressLoop from "../hooks/useProgressLoop";
import Spiral from "./Spiral";
import "./SpiralStage.css";

// Un "momento" pinnato — sezione alta (260-340vh), contenuto agganciato
// (position:sticky) per un intero schermo mentre si scorre: la spirale
// scala/ruota con lo scroll e, sopra, un contenuto per volta (parola,
// blocco) si accende e si spegne mentre il progress avanza — non un
// carosello, una sequenza che SI ATTRAVERSA scrollando, esattamente come nel
// riferimento ("Entrare nella spirale", "Il centro"). Una sola lettura del
// progress per frame (useProgressLoop) guida sia la spirale che i blocchi:
// stesso principio già in uso in ZoomParallaxIntro/TimelineSpine — mai due
// stati che possono disallinearsi.
//
// "items": [{ content, at, span }] — ognuno si dissolve dentro/fuori dentro
// la finestra [at, at+span] con lo stesso profilo del riferimento (salita
// 28% della finestra, pieno fino all'82%, discesa nel resto).
export default function SpiralStage({
  height = "280vh",
  spiral: { armsCount = 3, from = 0.7, to = 2.6, rot = 120, opacity = 0.6, showThin = true, size } = {},
  spin = 340,
  breathingDot = false,
  items = [],
  className = "",
}) {
  const stageRef = useRef(null);
  const spiralRef = useRef(null);
  const itemRefs = useRef([]);

  const getProgress = () => {
    const node = stageRef.current;
    if (!node) return 0;
    const rect = node.getBoundingClientRect();
    const span = Math.max(1, rect.height - window.innerHeight);
    return Math.min(1, Math.max(0, -rect.top / span));
  };

  const applyProgress = (p) => {
    const prog = p === null ? 1 : p;
    const spiralEl = spiralRef.current;
    if (spiralEl) {
      const scale = from + (to - from) * prog;
      spiralEl.style.transform = `rotate(${(prog * rot).toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    }
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const it = items[i];
      const d = (prog - it.at) / it.span;
      let o;
      if (d < 0) o = 0;
      else if (d < 0.28) o = d / 0.28;
      else if (d < 0.82) o = 1;
      else if (d < 1.1) o = (1.1 - d) / 0.28;
      else o = 0;
      const clamped = Math.min(1, Math.max(0, o));
      const dc = Math.min(1, Math.max(0, d));
      el.style.opacity = clamped.toFixed(3);
      el.style.transform = `translateY(${((1 - dc) * 16).toFixed(1)}px) scale(${(0.97 + 0.03 * dc).toFixed(3)})`;
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
            <div ref={spiralRef} className="spiral-stage__spiral">
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
