import { useEffect, useRef, useState } from "react";
import "./StepPath.css";

// Elemento grafico della sezione Metodo: i 6 verbi del percorso come nodi
// su una spina verticale, con un arco di ritorno dall'ultimo al primo per
// rendere visivamente la ricorsività ("un percorso che si rilegge mentre
// avanza"), non solo a parole. Stesso principio di reveal-on-scroll di
// NetworkDiagram (IntersectionObserver, pathLength="1"), diverso disegno
// (spina verticale invece di rete radiale) per non ripetere lo stesso
// segno grafico due volte nella stessa pagina.

const STEPS = [
  { n: "01", label: "Leggere" },
  { n: "02", label: "Riconoscere" },
  { n: "03", label: "Scegliere" },
  { n: "04", label: "Costruire" },
  { n: "05", label: "Accompagnare" },
  { n: "06", label: "Adattare" },
];

const TOP = 40;
const STEP = 96;
const X = 60;

export default function StepPath() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const bottom = TOP + STEP * (STEPS.length - 1);

  return (
    <svg
      ref={ref}
      className={`step-path ${visible ? "step-path--visible" : ""}`}
      viewBox="0 0 320 560"
      role="img"
      aria-label="Le sei fasi del metodo Karma — Leggere, Riconoscere, Scegliere, Costruire, Accompagnare, Adattare — collegate in un percorso ricorsivo: dopo Adattare si torna a Leggere."
    >
      <defs>
        <marker id="step-path-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill="var(--gold-deep)" />
        </marker>
      </defs>

      <line
        className="step-path__spine"
        x1={X}
        y1={TOP}
        x2={X}
        y2={bottom}
        pathLength="1"
      />

      <path
        className="step-path__loop"
        d={`M${X},${bottom} C 6,${bottom} 6,${TOP} ${X},${TOP}`}
        pathLength="1"
        markerEnd="url(#step-path-arrow)"
      />

      {STEPS.map((step, i) => {
        const y = TOP + STEP * i;
        return (
          <g key={step.n} className="step-path__node" style={{ transitionDelay: `${260 + i * 90}ms` }}>
            <circle cx={X} cy={y} r="9" />
            <text className="step-path__index" x={X + 26} y={y - 6}>
              {step.n}
            </text>
            <text className="step-path__label" x={X + 26} y={y + 13}>
              {step.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
