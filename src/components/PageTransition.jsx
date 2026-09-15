import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PageTransition.css";

// Transizione fluida tra pagine — niente Framer Motion, solo CSS + stato.
// Al cambio di route: la pagina corrente riceve classe .exit (fade+lift),
// poi avviene il cambio rotta, poi la nuova pagina entra con .enter.
// Durata totale ~540ms: 220ms uscita + 320ms entrata.
export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState("enter");
  const prevPathRef = useRef(location.pathname);
  const timerRef = useRef(null);

  useEffect(() => {
    const newPath = location.pathname;
    const prevPath = prevPathRef.current;
    if (newPath === prevPath) return;

    // Inizia uscita
    setPhase("exit");

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDisplayChildren(children);
      prevPathRef.current = newPath;
      setPhase("enter");
      window.scrollTo(0, 0);
    }, 220);
  }, [location.pathname, children]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={`page-transition page-transition--${phase}`}>
      {displayChildren}
    </div>
  );
}
