import { Link } from "react-router-dom";
import "./HomeFooter.css";

// Footer della Home — trasparente sul RibbonField fisso, con le
// informazioni utili: navigazione, contatti, brand.
export default function HomeFooter() {
  return (
    <footer className="home-footer" aria-label="Informazioni e contatti">
      <div className="home-footer__inner">
        <div className="home-footer__brand">
          <span className="home-footer__name">Karma Business Consulting</span>
          <span className="home-footer__tag">Ecologia della decisione</span>
        </div>

        <nav className="home-footer__nav" aria-label="Link del sito">
          <Link to="/">Home</Link>
          <Link to="/approccio">Approccio</Link>
          <Link to="/contatti">Contatti</Link>
        </nav>

        <div className="home-footer__contacts">
          <a href="mailto:info@karmaround.it">info@karmaround.it</a>
          <span>karmaround.it</span>
        </div>
      </div>

      <div className="home-footer__legal">
        <span>© {new Date().getFullYear()} Karma Business Consulting</span>
      </div>
    </footer>
  );
}