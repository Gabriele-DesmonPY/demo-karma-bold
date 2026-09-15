import { useEffect, useRef } from "react";
import useProgressLoop from "../hooks/useProgressLoop";
import "./DrawLines.css";

// Linee SVG che si tracciano su scroll — stroke-dashoffset animato via
// useProgressLoop, lo stesso pattern del resto del sito.
export default function DrawLines({
  paths = [],
  viewBox = "0 0 1000 900",
  preserveAspectRatio = "none",
  className = "",
  strokeColor = "var(--kh-gold)",
  baseOpacity = 0.5,
}) {
  const stageRef = useRef(null);
  const pathRefs = useRef([]);
  const lengthsRef = useRef([]);

  useEffect(() => {
    lengthsRef.current = pathRefs.current.map((el) =>
      el ? el.getTotalLength() : 0
    );
    pathRefs.current.forEach((el, i) => {
      if (!el) return;
      const len = lengthsRef.current[i];
      el.style.strokeDasharray = len.toFixed(2);
      el.style.strokeDashoffset = len.toFixed(2);
    });
  }, [paths.length]);

  const getProgress = () => {
    const node = stageRef.current;
    if (!node) return 0;
    const rect = node.getBoundingClientRect();
    const span = Math.max(1, rect.height - window.innerHeight);
    return Math.min(1, Math.max(0, -rect.top / span));
  };

  const applyProgress = (p) => {
    if (p === null) return;
    const ease = (t) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const prog = ease(p);
    pathRefs.current.forEach((el, i) => {
      if (!el) return;
      const len = lengthsRef.current[i];
      const offset = len * (1 - prog);
      el.style.strokeDashoffset = Math.max(0, offset).toFixed(2);
    });
  };

  useProgressLoop(getProgress, applyProgress, true, stageRef);

  return (
    <svg
      ref={stageRef}
      className={`draw-lines ${className}`}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
    >
      <g fill="none" vectorEffect="non-scaling-stroke">
        {paths.map((path, i) => (
          <path
            key={i}
            ref={(node) => {
              pathRefs.current[i] = node;
            }}
            d={path.d}
            stroke={path.stroke || strokeColor}
            strokeWidth={path.width || 1}
            opacity={path.opacity ?? baseOpacity}
          />
        ))}
      </g>
    </svg>
  );
}
