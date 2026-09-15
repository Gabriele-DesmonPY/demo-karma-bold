import Reveal from "./Reveal";
import "./RelationMap.css";

// Le sei dimensioni di Karmaround erano un indice numerato (01-06): la
// numerazione contraddiceva il testo della sezione ("Non è un elenco
// fisso"). Qui sono nodi di una mappa — nessun numero, nessun ordine.
// Le posizioni sono irregolari apposta (non un esagono regolare, non una
// griglia): un esagono perfetto legge come "sistema", questa disposizione
// legge come "insieme di parti in relazione", com'è richiesto dal brief
// (5.2: "reti, percorsi, linee che attraversano più nodi" — non diagrammi
// hub-and-spoke, che il brief esclude esplicitamente).
// Le etichette più lunghe ("Organizzazione", "Tecnologia") vanno alle
// posizioni con più margine dal bordo; quelle corte ("Dati") alle
// posizioni più vicine al bordo — per non tagliare le pillole su mobile,
// dove il contenitore è stretto.
const NODES = [
  { label: "Mercato", x: 16, y: 18 },
  { label: "Organizzazione", x: 60, y: 8 },
  { label: "Persone", x: 86, y: 40 },
  { label: "Tecnologia", x: 68, y: 84 },
  { label: "Processi", x: 26, y: 88 },
  { label: "Dati", x: 10, y: 52 },
];

// [nodo A, nodo B, "bow"]. Il perimetro (6 lati) più due diagonali che si
// incrociano al centro: ogni nodo ha 2-3 collegamenti, nessuno fa da hub.
// Il bow alterna segno per evitare che le curve si arcuino tutte nello
// stesso verso.
const EDGES = [
  [0, 1, 7],
  [1, 2, -8],
  [2, 3, 7],
  [3, 4, -7],
  [4, 5, 8],
  [5, 0, -7],
  [0, 3, 6],
  [1, 4, -6],
];

function curvePath(a, b, bow) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * bow;
  const cy = my + (dx / len) * bow;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

export default function RelationMap() {
  return (
    <Reveal as="div" className="relation-map">
      <svg
        className="relation-map__lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {EDGES.map(([a, b, bow], i) => (
          <path
            key={`${a}-${b}`}
            className="relation-map__line"
            d={curvePath(NODES[a], NODES[b], bow)}
            style={{ transitionDelay: `${140 + i * 50}ms` }}
          />
        ))}
      </svg>
      <ul className="relation-map__nodes">
        {NODES.map((node, i) => (
          <li
            key={node.label}
            className="relation-map__node"
            style={{ left: `${node.x}%`, top: `${node.y}%`, transitionDelay: `${i * 70}ms` }}
          >
            {node.label}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
