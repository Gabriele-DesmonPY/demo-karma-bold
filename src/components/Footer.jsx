import { Link } from "react-router-dom";
import Wordmark from "./Wordmark";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__col footer__col--brand">
          <Wordmark tone="light" withPayoff />
          <p className="footer__tag">Business consulting.</p>
        </div>

        <div className="footer__col">
          <p className="footer__col-title">Naviga</p>
          <nav className="footer__links" aria-label="Link del sito">
            <Link to="/">Home</Link>
            <Link to="/approccio">Approccio</Link>
            <Link to="/contatti">Contatti</Link>
          </nav>
        </div>

        <div className="footer__col">
          <p className="footer__col-title">Contatti</p>
          <div className="footer__contact">
            <a href="mailto:info@karmaround.it">info@karmaround.it</a>
            <span>karmaround.it</span>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>&copy; {new Date().getFullYear()} Karma Business Consulting</span>
      </div>
    </footer>
  );
}
