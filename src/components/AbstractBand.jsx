import { useRef } from "react";
import useProgressLoop from "../hooks/useProgressLoop";

// Intermezzo editoriale full-bleed tra le sezioni: una texture astratta
// trattata in duotone brand (navy/oro) che si dissolve su TUTTI i bordi
// (maschera 2D: verticale × orizzontale) e respira con un drift
// lentissimo oltre al parallax di scroll. La prop opzionale `claim`
// aggiunge un momento tipografico al centro della fascia — una parola
// in Instrument Serif italic tra due hairline dorate.
export default function AbstractBand({ src, alt = "", height = "38vh", speed = 12, claim, className = "" }) {
  const wrapRef = useRef(null);
  const layerRef = useRef(null);

  const getProgress = () => {
    const node = wrapRef.current;
    if (!node) return 0;
    const rect = node.getBoundingClientRect();
    const vh = window.innerHeight;
    const span = rect.height + vh;
    return Math.min(1, Math.max(0, (vh - rect.top) / span));
  };

  const applyProgress = (p) => {
    const el = layerRef.current;
    if (!el) return;
    const shift = (p - 0.5) * speed;
    el.style.transform = `translateY(${shift.toFixed(2)}px)`;
  };

  useProgressLoop(getProgress, applyProgress, true, wrapRef);

  return (
    <div ref={wrapRef} className={`kh-abstract-band ${className}`} style={{ height }}>
      <div className="kh-abstract-band__media" aria-hidden="true">
        <div ref={layerRef} className="kh-abstract-band__layer">
          <img src={src} alt={alt} loading="lazy" className="kh-abstract-band__img" />
        </div>
        <div className="kh-abstract-band__tint" />
        <div className="kh-abstract-band__glow" />
      </div>
      {claim ? (
        <div className="kh-abstract-band__claim">
          <span className="kh-abstract-band__claim-line" />
          <span className="kh-abstract-band__claim-text">{claim}</span>
          <span className="kh-abstract-band__claim-line" />
        </div>
      ) : null}
    </div>
  );
}