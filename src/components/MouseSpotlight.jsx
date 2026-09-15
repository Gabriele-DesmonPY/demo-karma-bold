import { useEffect, useRef } from "react";
import "./MouseSpotlight.css";

// Mouse spotlight — alone dorato sottile che segue il mouse con lerp
// (smoothing). Solo su sezioni navy. Attivo solo su desktop.
export default function MouseSpotlight() {
  const spotRef = useRef(null);
  const posRef = useRef({ x: -1000, y: -1000 });
  const targetRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef(null);

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 640px)");
    const el = spotRef.current;
    if (!el || mqMotion.matches || mqMobile.matches) return;

    const onMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const lerp = (a, b, n) => a + (b - a) * n;

    const tick = () => {
      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;
      // Fermo quando l'alone ha raggiunto il mouse: il loop non gira a vuoto
      // e riparte solo al prossimo movimento (onMove).
      if (Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4) {
        rafRef.current = null;
        return;
      }
      posRef.current.x += dx * 0.08;
      posRef.current.y += dy * 0.08;
      el.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
    };

    const onMoveWrapper = (e) => {
      onMove(e);
      start();
    };

    window.addEventListener("mousemove", onMoveWrapper, { passive: true });
    start();

    return () => {
      window.removeEventListener("mousemove", onMoveWrapper);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <div ref={spotRef} className="mouse-spotlight" aria-hidden="true" />;
}
