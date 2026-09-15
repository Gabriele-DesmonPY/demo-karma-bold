import "./HomeFooter.css";

// Footer minimal per la Home — una sola riga, stesso stile del riferimento
// HTML del cliente: "KARMA BUSINESS CONSULTING / ECOLOGIA DELLA DECISIONE".
export default function HomeFooter() {
  return (
    <footer className="home-footer" aria-label="Chiusura pagina">
      <div className="home-footer__inner">
        <span>KARMA BUSINESS CONSULTING</span>
        <span>ECOLOGIA DELLA DECISIONE</span>
      </div>
    </footer>
  );
}
