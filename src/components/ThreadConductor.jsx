import { useRef } from "react";
import useProgressLoop from "../hooks/useProgressLoop";
import "./ThreadConductor.css";

export default function ThreadConductor() {
  const beadRef = useRef(null);

  const getProgress = () => {
    const doc = document.documentElement;
    const span = Math.max(1, doc.scrollHeight - window.innerHeight);
    return Math.min(1, Math.max(0, window.scrollY / span));
  };

  const applyProgress = (p) => {
    const bead = beadRef.current;
    if (!bead) return;
    const prog = p === null ? 0 : p;
    bead.style.top = `${(prog * 100).toFixed(3)}%`;
  };

  useProgressLoop(getProgress, applyProgress, true, null);

  // Tre percorsi leggermente sfalsati per simulare una corda/treccia
  const mainPath =
    "M10 0 C15 36,5 72,10 108 S15 180,10 216 S5 288,10 324 S15 396,10 432 S5 504,10 540 S15 612,10 648 S5 720,10 756 S15 792,10 800";
  const secondaryPath =
    "M8 0 C13 36,3 72,8 108 S13 180,8 216 S3 288,8 324 S13 396,8 432 S3 504,8 540 S13 612,8 648 S3 720,8 756 S13 792,8 800";
  const tertiaryPath =
    "M12 0 C17 36,7 72,12 108 S17 180,12 216 S7 288,12 324 S17 396,12 432 S7 504,12 540 S17 612,12 648 S7 720,12 756 S17 792,12 800";

  return (
    <div className="thread-conductor" aria-hidden="true">
      <svg
        className="thread-conductor__line"
        viewBox="0 0 20 800"
        preserveAspectRatio="none"
      >
        <path className="thread-conductor__line--tertiary" d={tertiaryPath} />
        <path className="thread-conductor__line--secondary" d={secondaryPath} />
        <path className="thread-conductor__line--main" d={mainPath} />
      </svg>
      <div className="thread-conductor__bead" ref={beadRef}>
        <span className="thread-conductor__bead-core" />
      </div>
    </div>
  );
}
