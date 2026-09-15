import { useEffect, useRef } from "react";

// Parallax da scroll, senza librerie esterne (niente GSAP/Lenis): sposta
// il contenuto di una frazione (speed) della posizione del suo
// contenitore nel viewport, così i livelli scorrono a velocità diverse
// mentre si passa oltre la sezione — stesso principio dei componenti
// "layered parallax", implementato con lo stack vanilla già in uso nel
// resto del sito (vedi Reveal/TextReveal). Rispetta prefers-reduced-motion.
//
// maxShiftRatio (opzionale) limita lo spostamento a una frazione
// dell'altezza del contenitore: serve quando il livello riempie lo
// spazio (es. una foto) per non scoprire il bordo durante lo scroll.
//
// disableBelow (opzionale, px) spegne l'effetto sotto quella larghezza di
// viewport: sui layout impilati da mobile il livello è quasi sempre più
// piccolo (l'effetto diventa impercettibile) mentre il listener di scroll
// continua comunque a girare — su telefono conviene toglierlo del tutto
// per non aggiungere lavoro a ogni frame di scroll senza beneficio visivo.
export default function ParallaxLayer({ speed = 0.2, maxShiftRatio, disableBelow, className = "", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    const container = node?.parentElement;
    if (!node || !container) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const narrowQuery = disableBelow ? window.matchMedia(`(max-width: ${disableBelow}px)`) : null;
    let active = !narrowQuery?.matches;
    let ticking = false;

    const update = () => {
      if (!active) {
        ticking = false;
        return;
      }
      const rect = container.getBoundingClientRect();
      let shift = rect.top * speed;
      if (maxShiftRatio) {
        const max = rect.height * maxShiftRatio;
        shift = Math.max(-max, Math.min(max, shift));
      }
      node.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!active || ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const onQueryChange = (e) => {
      active = !e.matches;
      if (!active) {
        node.style.transform = "";
      } else {
        update();
      }
    };

    if (active) update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    narrowQuery?.addEventListener("change", onQueryChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      narrowQuery?.removeEventListener("change", onQueryChange);
    };
  }, [speed, maxShiftRatio, disableBelow]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
