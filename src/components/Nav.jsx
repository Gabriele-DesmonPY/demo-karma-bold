import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Wordmark from "./Wordmark";
import "./Nav.css";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/approccio", label: "Approccio" },
  { to: "/legalens", label: "Legalens" },
  { to: "/contatti", label: "Contatti" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="container nav__inner">
        <NavLink to="/" className="nav__logo" aria-label="Karma, torna alla home">
          <Wordmark tone="light" />
        </NavLink>

        <nav className="nav__links" aria-label="Navigazione principale">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/contatti" className="btn btn-gold nav__cta">
            Iniziamo
          </NavLink>
        </nav>

        <button
          className={`nav__burger ${open ? "is-open" : ""}`}
          aria-label={open ? "Chiudi il menu" : "Apri il menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`nav__mobile-wrap ${open ? "is-open" : ""}`}>
        <div id="mobile-menu" className="nav__mobile">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) => `nav__mobile-link ${isActive ? "is-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/contatti" className="btn btn-gold" onClick={() => setOpen(false)}>
            Iniziamo
          </NavLink>
        </div>
      </div>
    </header>
  );
}
