import { useEffect, useId, useRef, useState } from "react";
import Reveal from "./Reveal";
import "./SectionIndex.css";

export default function SectionIndex({
  items,
  loopNote,
  variant = "list",
  closeLoop = false,
  className = "",
}) {
  const isTimeline = variant === "timeline";
  const rowsRef = useRef(null);
  const firstDotRef = useRef(null);
  const lastDotRef = useRef(null);
  const [loopPath, setLoopPath] = useState(null);
  const arrowId = useId();

  // Il "si torna a leggere" del copy era solo scritto, non visibile. Misura
  // la posizione reale dei pallini estremi (non un valore fisso: il numero
  // di voci può cambiare) e disegna una curva dal nodo 06 al nodo 01 con
  // una freccia — la ricorsione del metodo diventa un tratto, non solo una
  // frase.
  useEffect(() => {
    if (!isTimeline || !closeLoop) return;
    const measure = () => {
      const container = rowsRef.current;
      const first = firstDotRef.current;
      const last = lastDotRef.current;
      if (!container || !first || !last) return;
      const cBox = container.getBoundingClientRect();
      const fBox = first.getBoundingClientRect();
      const lBox = last.getBoundingClientRect();
      if (cBox.width === 0 || cBox.height === 0) return;
      const x1 = fBox.left + fBox.width / 2 - cBox.left;
      const y1 = fBox.top + fBox.height / 2 - cBox.top;
      const x2 = lBox.left + lBox.width / 2 - cBox.left;
      const y2 = lBox.top + lBox.height / 2 - cBox.top;
      const bow = 24;
      const easeY = (y2 - y1) * 0.25;
      setLoopPath({
        width: cBox.width,
        height: cBox.height,
        // Parte dall'ultimo nodo (06 — Adattare) e torna al primo
        // (01 — Leggere): la freccia punta in su, dentro il nodo 01.
        d: `M ${x2} ${y2} C ${x2 + bow} ${y2 - easeY}, ${x1 + bow} ${y1 + easeY}, ${x1} ${y1}`,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (rowsRef.current) ro.observe(rowsRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isTimeline, closeLoop, items.length]);

  return (
    <div className={`section-index section-index--${variant} ${className}`}>
      <div className="section-index__rows" ref={isTimeline ? rowsRef : null}>
        {isTimeline && <div className="section-index__spine" aria-hidden="true" />}
        {isTimeline && closeLoop && loopPath && (
          <svg
            className="section-index__loop-svg"
            width={loopPath.width}
            height={loopPath.height}
            aria-hidden="true"
          >
            <defs>
              <marker
                id={arrowId}
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto-start-reverse"
              >
                <path d="M0.5 0.5 L7.5 4 L0.5 7.5 Z" className="section-index__loop-arrowhead" />
              </marker>
            </defs>
            <path
              className="section-index__loop-path"
              d={loopPath.d}
              markerEnd={`url(#${arrowId})`}
            />
          </svg>
        )}
        {items.map((item, i) => (
          <Reveal as="div" className="section-index__row" delay={i * 70} key={item.n}>
            {isTimeline ? (
              <>
                <span className="section-index__gutter" aria-hidden="true">
                  <span
                    className="section-index__dot"
                    ref={i === 0 ? firstDotRef : i === items.length - 1 ? lastDotRef : null}
                  />
                </span>
                <span className="section-index__num" aria-hidden="true">
                  {item.n}
                </span>
              </>
            ) : (
              <span className="section-index__num" aria-hidden="true">
                {item.n}
              </span>
            )}
            <span className="section-index__label">{item.label}</span>
          </Reveal>
        ))}
      </div>
      {loopNote && (
        <Reveal as="p" className="section-index__loop" delay={items.length * 70 + 40}>
          <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M15 6 A7 7 0 1 1 6 3" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M6 3 L4 1.5 M6 3 L4.3 5.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          {loopNote}
        </Reveal>
      )}
    </div>
  );
}
