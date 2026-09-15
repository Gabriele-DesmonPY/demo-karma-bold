import "./OrbitRing.css";

// Anello di etichette intorno a un centro — "Le competenze" (12 voci
// equidistanti su un cerchio) e "Mappa Karma" (7 voci sparse come punti di
// una mappa, posizioni fisse). L'anello intero ruota lentissimo
// (km-spin); ogni etichetta CONTRORUOTA alla stessa velocità, così il testo
// resta sempre dritto mentre la sua posizione scivola lungo il cerchio —
// stessa tecnica del riferimento (km-spin + km-spin-rev), non un effetto
// nuovo.
function circlePositions(n, radius) {
  return Array.from({ length: n }, (_, i) => {
    const angle = ((-90 + i * (360 / n)) * Math.PI) / 180;
    return {
      left: 50 + radius * Math.cos(angle),
      top: 50 + radius * Math.sin(angle),
    };
  });
}

export default function OrbitRing({
  center,
  items,
  radius = 42,
  positions,
  spin = 150,
  accentIndexes = [],
  className = "",
}) {
  const pts = positions || circlePositions(items.length, radius);

  return (
    <div className={`orbit-ring ${className}`}>
      <svg className="orbit-ring__guides" viewBox="-100 -100 200 200" aria-hidden="true">
        <circle r="42" fill="none" stroke="var(--kh-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <circle r="70" fill="none" stroke="var(--kh-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.7" />
      </svg>

      <div className="orbit-ring__center">{center}</div>

      <div className="orbit-ring__spin" style={{ animationDuration: `${spin}s` }}>
        {items.map((label, i) => (
          <div
            key={label}
            className="orbit-ring__slot"
            style={{ left: `${pts[i].left}%`, top: `${pts[i].top}%` }}
          >
            <div className="orbit-ring__counter" style={{ animationDuration: `${spin}s` }}>
              <span
                className={`orbit-ring__label ${accentIndexes.includes(i) ? "orbit-ring__label--accent" : ""}`}
              >
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
