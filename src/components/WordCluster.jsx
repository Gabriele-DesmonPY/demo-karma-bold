import Reveal from "./Reveal";
import "./WordCluster.css";

// Cluster di parole/etichette — nessuna linea, nessun nodo: solo
// tipografia (coerente con la regola di progetto "niente diagrammi a
// nodi/etichette"). Riusato in 4 punti della Home: le parole ambientali
// dell'hero, l'identità in "Il centro", le competenze e i punti della
// Mappa Karma — stesso componente, stesso linguaggio visivo ogni volta
// che il contenuto è "un insieme non ordinato di voci", mai una gerarchia
// o una sequenza (quelle usano liste numerate/testuali altrove).
// Un solo IntersectionObserver per cluster (via Reveal sul contenitore):
// lo stagger fra le voci è CSS (transition-delay per nth-child), non un
// observer per parola.
export default function WordCluster({ words, center, variant = "tags", className = "" }) {
  return (
    <div className={`word-cluster word-cluster--${variant} ${className}`}>
      {center && <span className="word-cluster__center">{center}</span>}
      <Reveal as="ul" className="word-cluster__list">
        {words.map((w) => (
          <li key={w} className="word-cluster__item">
            {w}
          </li>
        ))}
      </Reveal>
    </div>
  );
}
