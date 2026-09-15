import { useEffect, useRef, useState } from "react";
import "./NetworkDiagram.css";

// Diagramma a rete per la sezione "Karmaround": nodi = dimensioni
// dell'impresa (mercato, organizzazione, persone...), linee = come si
// influenzano a vicenda. Un solo reveal all'ingresso in vista (via
// IntersectionObserver, stesso principio di Reveal/TextReveal — niente
// loop continuo, coerente con "pochi effetti fatti bene"). Le linee usano
// pathLength="1" così un'unica coppia stroke-dasharray/dashoffset basta
// per ogni segmento, indipendentemente dalla sua lunghezza reale.

const NODES = [
  { id: "mercato", label: "Mercato", x: 250, y: 78 },
  { id: "tecnologia", label: "Tecnologia", x: 402, y: 164 },
  { id: "dati", label: "Dati", x: 402, y: 336 },
  { id: "persone", label: "Persone", x: 250, y: 422 },
  { id: "processi", label: "Processi", x: 98, y: 336 },
  { id: "organizzazione", label: "Organizzazione", x: 98, y: 164 },
];

const EDGES = [
  ["mercato", "tecnologia"],
  ["tecnologia", "dati"],
  ["dati", "persone"],
  ["persone", "processi"],
  ["processi", "organizzazione"],
  ["organizzazione", "mercato"],
  ["mercato", "persone"],
  ["tecnologia", "processi"],
  ["dati", "organizzazione"],
];

function nodeById(id) {
  return NODES.find((n) => n.id === id);
}

export default function NetworkDiagram() {
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

  return (
    <svg
      ref={ref}
      className={`network-diagram ${visible ? "network-diagram--visible" : ""}`}
      viewBox="0 0 500 500"
      role="img"
      aria-label="Diagramma delle dimensioni dell'impresa collegate tra loro: mercato, organizzazione, processi, persone, tecnologia e dati si influenzano a vicenda"
    >
      {EDGES.map(([fromId, toId], i) => {
        const from = nodeById(fromId);
        const to = nodeById(toId);
        return (
          <line
            key={`${fromId}-${toId}`}
            className="network-diagram__edge"
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            pathLength="1"
            style={{ transitionDelay: `${80 + i * 40}ms` }}
          />
        );
      })}
      {NODES.map((n, i) => (
        <g
          key={n.id}
          className="network-diagram__node"
          style={{ transitionDelay: `${i * 40}ms` }}
        >
          <circle cx={n.x} cy={n.y} r="7" />
          <text
            x={n.x}
            y={n.y + (n.y < 250 ? -20 : 32)}
            textAnchor="middle"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
