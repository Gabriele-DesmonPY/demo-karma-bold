import { useEffect, useRef, useState } from "react";
import "./CustomCursor.css";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 640px)");
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring || mqMotion.matches || mqMobile.matches) return;

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const lerp = (a, b, n) => a + (b - a) * n;

    const tick = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.15);
      dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const selector = "a, button, [role='button'], input, textarea, select, .kh-hero__cta-link, .kh-closing__link";
    const onEnter = (e) => { if (e.target.matches(selector)) setHovered(true); };
    const onLeave = (e) => { if (e.target.matches(selector)) setHovered(false); };
    document.addEventListener("mouseenter", onEnter, true);
    document.addEventListener("mouseleave", onLeave, true);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter, true);
      document.removeEventListener("mouseleave", onLeave, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={`custom-cursor custom-cursor--dot ${hovered ? "custom-cursor--hover" : ""}`} aria-hidden="true" />
      <div ref={ringRef} className={`custom-cursor custom-cursor--ring ${hovered ? "custom-cursor--hover" : ""}`} aria-hidden="true" />
    </>
  );
}
