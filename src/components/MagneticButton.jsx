// Magnetic hover effect — vanilla CSS transform + spring-like transition, no external motion lib.
import { useEffect, useRef, useState } from "react";

export default function MagneticButton({ children, distance = 0.4, className = "" }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    function handleMove(e) {
      if (!ref.current) return;
      if (!isHovered) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setOffset({ x: (e.clientX - centerX) * distance, y: (e.clientY - centerY) * distance });
    }

    document.addEventListener("mousemove", handleMove);
    return () => document.removeEventListener("mousemove", handleMove);
  }, [isHovered, distance]);

  return (
    <div
      ref={ref}
      className={`magnetic-btn ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setOffset({ x: 0, y: 0 });
      }}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      {children}
    </div>
  );
}
