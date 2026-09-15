import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { lenisRef } from "../lib/lenisInstance";

// Scroll fluido/inerziale su tutto il sito. Lenis lavora sopra lo scroll
// nativo (sticky, anchor link e accessibilità da tastiera restano
// invariati), quindi il resto del motion system — Reveal, TextReveal,
// ParallaxLayer, tutti basati su IntersectionObserver o sull'evento
// "scroll" nativo — continua a funzionare senza modifiche.
// Disattivato per chi ha impostato prefers-reduced-motion.
export default function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
