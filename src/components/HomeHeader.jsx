import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./HomeHeader.css";

export default function HomeHeader() {
  const [hidden, setHidden] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const heroH = window.innerHeight * 1.04;
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setHidden(window.scrollY > heroH * 0.6);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <header className={`home-header ${hidden ? "home-header--hidden" : ""}`} aria-label="Home hero header">
      <div className="home-header__inner">
        <span className="home-header__brand">KARMA</span>
        <Link to="/contatti" className="home-header__cta">
          CONOSCIAMOCI
        </Link>
      </div>
    </header>
  );
}
