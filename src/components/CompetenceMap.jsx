import { useEffect, useLayoutEffect, useRef } from "react";
import "./CompetenceMap.css";

// Costellazione della decisione — struttura statica a mozzo e razze.
// Dodici competenze in due colonne ai lati del mozzo "LA DECISIONE":
// testo orizzontale, mai sovrapposto. Dietro, un SVG con hairline che
// collega ogni nodo al centro: le razze si disegnano al primo ingresso
// in viewport (stroke-dashoffset) e si accendono al passaggio del mouse.
// Nessuna rotazione: tutte le voci restano leggibili per sempre.
export default function CompetenceMap({ center, items }) {
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const hubRef = useRef(null);

  // Misura i nodi e il mozzo e posiziona le razze in coordinate px
  // (l'SVG non ha viewBox: le user units coincidono con i CSS pixel).
  const measure = () => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const hub = hubRef.current;
    if (!root || !svg || !hub) return;
    const rb = root.getBoundingClientRect();
    const hb = hub.getBoundingClientRect();
    const cx = hb.left + hb.width / 2 - rb.left;
    const cy = hb.top + hb.height / 2 - rb.top;
    const dots = root.querySelectorAll(".cmap__dot");
    const lines = svg.querySelectorAll("line");
    dots.forEach((dot, i) => {
      const line = lines[i];
      if (!line) return;
      const db = dot.getBoundingClientRect();
      const x = db.left + db.width / 2 - rb.left;
      const y = db.top + db.height / 2 - rb.top;
      line.setAttribute("x1", x.toFixed(1));
      line.setAttribute("y1", y.toFixed(1));
      line.setAttribute("x2", cx.toFixed(1));
      line.setAttribute("y2", cy.toFixed(1));
      line.style.setProperty("--len", Math.hypot(cx - x, cy - y).toFixed(1));
    });
  };

  useLayoutEffect(() => {
    measure();
    // I font web spostano le label: rimisura quando sono pronti.
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    const ro = new ResizeObserver(measure);
    if (rootRef.current) ro.observe(rootRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      node.classList.add("cmap--visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("cmap--visible");
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Hover: la razza del nodo sotto il cursore si accende insieme a lui.
  const highlight = (on) => (e) => {
    const item = e.target.closest(".cmap__item");
    if (!item) return;
    const line = svgRef.current?.querySelector(`line[data-i="${item.dataset.i}"]`);
    if (line) line.classList.toggle("cmap__line--hot", on);
  };

  const half = Math.ceil(items.length / 2);
  const left = items.slice(0, half);
  const right = items.slice(half);

  const renderItem = (label, i, side) => (
    <div
      key={label}
      data-i={i}
      className={`cmap__item cmap__item--${side}${label === "AI" ? " cmap__item--accent" : ""}`}
      style={{ transitionDelay: `${180 + i * 55}ms` }}
    >
      {side === "sx" ? (
        <>
          <span className="cmap__label">{label}</span>
          <span className="cmap__dot" aria-hidden="true" />
        </>
      ) : (
        <>
          <span className="cmap__dot" aria-hidden="true" />
          <span className="cmap__label">{label}</span>
        </>
      )}
    </div>
  );

  return (
    <div
      ref={rootRef}
      className="cmap"
      onMouseOver={highlight(true)}
      onMouseOut={highlight(false)}
    >
      <svg ref={svgRef} className="cmap__web" aria-hidden="true">
        {items.map((label, i) => (
          <line key={label} data-i={i} className="cmap__line" style={{ transitionDelay: `${i * 55}ms` }} />
        ))}
      </svg>

      <div ref={hubRef} className="cmap__hub">{center}</div>

      <div className="cmap__col cmap__col--sx">
        {left.map((label, i) => renderItem(label, i, "sx"))}
      </div>
      <div className="cmap__col cmap__col--dx">
        {right.map((label, k) => renderItem(label, half + k, "dx"))}
      </div>
    </div>
  );
}