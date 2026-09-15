import { useEffect, useLayoutEffect, useRef } from "react";
import "./CompetenceMap.css";

// Costellazione della decisione — struttura statica a mozzo e razze.
// Le competenze stanno su due colonne ai lati del mozzo "LA DECISIONE":
// testo orizzontale, mai sovrapposto. Dietro, un SVG con hairline che
// collega ogni nodo al centro: l'estremo esterno di ogni razza è ancorato
// al CENTRO del dot dell'item (elemento reale, mai coordinate stimate),
// quello interno al punto in cui la retta mozzo→nodo attraversa il bordo
// della pillola (capsula/stadium). Le razze si disegnano al primo ingresso
// in viewport (stroke-dashoffset) e si accendono al passaggio del mouse.
// Nessuna rotazione, nessun indice o posizione cablata: il numero di item
// è libero (10, 11, 12... le colonne si dividono a metà dinamicamente).
export default function CompetenceMap({ center, items }) {
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const hubRef = useRef(null);

  // Misura i nodi e il mozzo e posiziona le razze in coordinate px
  // relative alla root (l'SVG non ha viewBox: le user units coincidono
  // con i CSS pixel). Tutto deriva da getBoundingClientRect di elementi
  // reali: scroll-proof (differenze di coordinate viewport) e sensibile
  // a qualsiasi layout/font/transform corrente.
  const measure = () => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const hub = hubRef.current;
    if (!root || !svg || !hub) return;
    const rb = root.getBoundingClientRect();
    const hb = hub.getBoundingClientRect();
    if (!rb.width || !hb.width) return;
    const cx = hb.left + hb.width / 2 - rb.left;
    const cy = hb.top + hb.height / 2 - rb.top;
    // La pillola è uno stadium (border-radius: 999px): segmento centrale
    // di semilunghezza s, semialtezza r. Calcolo l'uscita della retta
    // mozzo→nodo dal bordo della capsula così la linea parte ESATTAMENTE
    // dalla pillola, a qualsiasi larghezza/dimensione del mozzo.
    const r = hb.height / 2;
    const s = Math.max(hb.width / 2 - r, 0);
    const dots = root.querySelectorAll(".cmap__dot");
    const lines = svg.querySelectorAll("line");
    dots.forEach((dot, i) => {
      const line = lines[i];
      if (!line) return;
      const db = dot.getBoundingClientRect();
      const dx = db.left + db.width / 2 - rb.left - cx;
      const dy = db.top + db.height / 2 - rb.top - cy;
      const dist = Math.hypot(dx, dy);
      if (!dist) return;
      const ux = dx / dist;
      const uy = dy / dist;
      const ax = Math.abs(ux);
      const ay = Math.abs(uy);
      // Uscita dalla capsula lungo la direzione del nodo:
      // - lato curvo (vicino ai poli): t = r / |uy|
      // - lato retto: intersezione con (|x| = s) espansa di r.
      const t =
        ay > 0 && r * ax <= s * ay
          ? r / ay
          : ax * s + Math.sqrt(Math.max(r * r - s * s * ay * ay, 0));
      line.setAttribute("x1", (cx + ux * t).toFixed(1));
      line.setAttribute("y1", (cy + uy * t).toFixed(1));
      line.setAttribute("x2", (cx + dx).toFixed(1));
      line.setAttribute("y2", (cy + dy).toFixed(1));
      // Lunghezza reale del segmento disegnato: serve all'animazione
      // dashoffset (dasharray/dashoffset = --len) per coprire tutto il
      // tratto senza mai "fermarsi prima" del dot.
      line.style.setProperty("--len", Math.max(dist - t, 1).toFixed(1));
    });
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Misura differita di un frame (coalesce più eventi in un solo calcolo).
    let rafEvent = 0;
    const measureSoon = () => {
      cancelAnimationFrame(rafEvent);
      rafEvent = requestAnimationFrame(measure);
    };

    // Loop di misurazione: per i primi ~3s rimisura a ogni frame, così le
    // razze seguono IN TEMPO REALE l'animazione d'ingresso (le voci partono
    // con transform: translateY(10px) e i transform NON notificano il
    // ResizeObserver) e qualsiasi altro rimescolamento del layout.
    let rafLoop = 0;
    const tick = () => {
      measure();
      rafLoop = requestAnimationFrame(tick);
    };
    rafLoop = requestAnimationFrame(tick);
    const stopLoop = () => cancelAnimationFrame(rafLoop);
    const loopTimer = window.setTimeout(stopLoop, 3000);

    // I font web spostano le label: rimisura quando sono pronti (anche
    // oltre i 3s del loop).
    if (document.fonts?.ready) document.fonts.ready.then(measureSoon);

    // Resize di root, mozzo, colonne e singoli item: copre wrap, clamp()
    // tipografici, zoom, breakpoint e qualsiasi cambio di box dei nodi.
    const ro = new ResizeObserver(measureSoon);
    ro.observe(root);
    root
      .querySelectorAll(".cmap__item, .cmap__col, .cmap__hub")
      .forEach((el) => ro.observe(el));

    // Fallback eventi: resize finestra e fine di QUALSIASI transizione
    // dentro il componente (ingresso dei nodi, hover, ecc.).
    window.addEventListener("resize", measureSoon);
    root.addEventListener("transitionend", measureSoon);

    return () => {
      window.clearTimeout(loopTimer);
      stopLoop();
      cancelAnimationFrame(rafEvent);
      ro.disconnect();
      window.removeEventListener("resize", measureSoon);
      root.removeEventListener("transitionend", measureSoon);
    };
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

  // Nessun presupposto sul numero di item: metà a sinistra, metà a destra.
  const half = Math.ceil(items.length / 2);
  const left = items.slice(0, half);
  const right = items.slice(half);

  const renderItem = (label, i, side) => (
    <div
      key={`${i}-${label}`}
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
          <line
            key={`${i}-${label}`}
            data-i={i}
            className="cmap__line"
            style={{ transitionDelay: `${i * 55}ms` }}
          />
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