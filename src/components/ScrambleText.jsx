import { useEffect, useRef, useState } from "react";
import "./ScrambleText.css";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default function ScrambleText({ children, as: Tag = "span", className = "", duration = 800, stagger = 25, delay = 0 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState("");
  const [started, setStarted] = useState(false);
  const text = typeof children === "string" ? children : "";

  useEffect(() => {
    const node = ref.current;
    if (!node || !text) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setDisplay(text); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } }, { threshold: 0.1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [text]);

  useEffect(() => {
    if (!started || !text) return;
    const chars = text.split("");
    const total = chars.length;
    let raf = null;
    let startTime = null;
    const tick = (now) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime - delay;
      let output = "";
      let done = 0;
      for (let i = 0; i < total; i++) {
        const char = chars[i];
        const charElapsed = elapsed - i * stagger;
        if (charElapsed >= duration) { output += char; done++; }
        else if (charElapsed > 0) {
          const progress = charElapsed / duration;
          output += Math.random() < progress * 0.35 ? char : CHARS[Math.floor(Math.random() * CHARS.length)];
        } else { output += " "; }
      }
      setDisplay(output);
      if (done < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [started, text, duration, stagger, delay]);

  return (
    <Tag ref={ref} className={`scramble-text ${className}`}>
      {display || text.replace(/./g, " ")}
    </Tag>
  );
}
