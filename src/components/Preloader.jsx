import { useEffect, useRef, useState } from "react";
import "./Preloader.css";

// Preloader — il logo Karma si disegna con un tratto dorato prima di
// lasciare entrare l'utente. Usa stroke-dashoffset animato via CSS,
// non via JS, così è hardware-accelerato e non dipende dal main thread.
export default function Preloader() {
  const [phase, setPhase] = useState("drawing"); // drawing | fading | done
  const wrapperRef = useRef(null);

  useEffect(() => {
    const seen = sessionStorage.getItem("karma_preloader_seen");
    if (seen) { setPhase("done"); return; }

    const t1 = setTimeout(() => setPhase("fading"), 1400);
    const t2 = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("karma_preloader_seen", "1");
    }, 2000);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      ref={wrapperRef}
      className={`preloader ${phase === "fading" ? "preloader--fading" : ""}`}
      aria-hidden="true"
    >
      <div className="preloader__inner">
        <svg
          className="preloader__mark"
          viewBox="-100 -100 200 200"
          width={80}
          height={80}
          aria-hidden="true"
        >
          <circle
            className="preloader__ring"
            cx={0}
            cy={0}
            r={90}
            fill="none"
            stroke="var(--kh-gold)"
            strokeWidth={1.5}
          />
          <circle
            className="preloader__dot"
            cx={0}
            cy={0}
            r={4}
            fill="var(--kh-gold)"
          />
        </svg>
        <span className="preloader__brand">KARMA</span>
      </div>
    </div>
  );
}
