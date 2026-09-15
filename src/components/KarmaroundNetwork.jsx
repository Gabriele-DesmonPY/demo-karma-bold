import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import "./KarmaroundNetwork.css";

// Le sei dimensioni principali di Karmaround, posizionate in modo irregolare
// (non un esagono regolare, non una griglia) — le etichette più lunghe
// ("Organizzazione", "Tecnologia") nei punti con più margine dal bordo,
// le più corte ("Dati") nei punti più stretti, per restare leggibili anche
// su schermi piccoli.
const NODES = [
  { label: "Mercato", x: 84, y: 30 },
  { label: "Organizzazione", x: 50, y: 8 },
  { label: "Processi", x: 18, y: 82 },
  { label: "Persone", x: 14, y: 22 },
  { label: "Tecnologia", x: 70, y: 88 },
  { label: "Dati", x: 88, y: 66 },
];

// Perimetro (6 lati) + due diagonali che si incrociano al centro: ogni nodo
// ha 2-3 collegamenti, nessuno fa da hub — coerente col vincolo del brief
// (5.2) contro le strutture hub-and-spoke. Le etichette delle relazioni
// sono concrete, non generiche ("cosa cambia quando questi due elementi si
// toccano"), tre riprese testualmente dal prompt di Gabry.
const EDGES = [
  { a: 0, b: 1, bow: 6, label: "priorità e vincoli" },
  { a: 1, b: 2, bow: -8, label: "ruoli e flussi" },
  { a: 2, b: 3, bow: 7, label: "compiti e carichi" },
  { a: 3, b: 4, bow: -7, label: "adozione e formazione" },
  { a: 4, b: 5, bow: 6, label: "raccolta e governo" },
  { a: 5, b: 0, bow: -6, label: "segnali e domanda" },
  { a: 0, b: 3, bow: 5, label: "carichi e ruoli" },
  { a: 2, b: 5, bow: -5, label: "flussi e responsabilità" },
];

function curvePoint(a, b, bow) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { cx: mx + (-dy / len) * bow, cy: my + (dx / len) * bow };
}

export default function KarmaroundNetwork() {
  const [active, setActive] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const clearTimer = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const activate = (i) => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    setActive(i);
  };
  const deactivate = () => {
    // piccolo ritardo: evita che il pannello sparisca per un attimo
    // mentre il puntatore passa da un nodo al successivo
    clearTimer.current = setTimeout(() => setActive(null), 80);
  };

  const edgesOf = (i) => EDGES.filter((e) => e.a === i || e.b === i);

  return (
    <Reveal as="div" className="karma-network">
      <div className="karma-network__stage">
        <svg className="karma-network__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {EDGES.map((e, i) => {
            const a = NODES[e.a];
            const b = NODES[e.b];
            const { cx, cy } = curvePoint(a, b, e.bow);
            const isActive = active !== null && (e.a === active || e.b === active);
            return (
              <path
                key={i}
                className={`karma-network__line${isActive ? " karma-network__line--active" : ""}`}
                d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
              />
            );
          })}
          {/* L'impulso ambiente si vede solo sui collegamenti del nodo attivo:
              a riposo la figura resta pulita, senza linee/puntini sparsi —
              il movimento nasce dall'interazione, non gira a vuoto. */}
          {!reducedMotion &&
            active !== null &&
            edgesOf(active).map((e, i) => {
              const a = NODES[e.a];
              const b = NODES[e.b];
              const { cx, cy } = curvePoint(a, b, e.bow);
              return (
                <circle key={`pulse-${i}`} className="karma-network__pulse" r="0.9">
                  <animateMotion
                    dur="2.4s"
                    repeatCount="indefinite"
                    path={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
                  />
                </circle>
              );
            })}
        </svg>

        {active !== null &&
          edgesOf(active).map((e, i) => {
            const a = NODES[e.a];
            const b = NODES[e.b];
            const { cx, cy } = curvePoint(a, b, e.bow);
            return (
              <span
                key={i}
                className="karma-network__edge-label"
                style={{ left: `${cx}%`, top: `${cy}%` }}
              >
                {e.label}
              </span>
            );
          })}

        <div className="karma-network__nodes">
          {NODES.map((node, i) => (
            <button
              key={node.label}
              type="button"
              className={`karma-network__node${active === i ? " karma-network__node--active" : ""}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => activate(i)}
              onMouseLeave={deactivate}
              onFocus={() => activate(i)}
              onBlur={deactivate}
              onClick={() => setActive((cur) => (cur === i ? null : i))}
              aria-pressed={active === i}
            >
              <span className="karma-network__node-dot" aria-hidden="true" />
              {node.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="karma-network__list">
        {EDGES.map((e, i) => (
          <li className="karma-network__list-item" key={i}>
            <span className="karma-network__list-pair">
              {NODES[e.a].label} <span aria-hidden="true">→</span> {NODES[e.b].label}
            </span>
            <span className="karma-network__list-label">{e.label}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
