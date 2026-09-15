import { useState } from "react";
import Reveal from "../components/Reveal";
import TextReveal from "../components/TextReveal";
import "./Contatti.css";

export default function Contatti() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleNewsletterSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <section className="contact-hero">
        <div className="container contact-hero__inner">
          <p className="eyebrow contact-hero__eyebrow">Contatti</p>
          <TextReveal as="h1" splitBy="words" className="contact-hero__headline">
            Parliamone.
          </TextReveal>
          <p className="contact-hero__lede">
            Racconta a Karma cosa stai cercando di far funzionare. Rispondiamo noi
            per capire da dove partire insieme.
          </p>
          <div className="contact-hero__details">
            <a className="contact-hero__link" href="mailto:info@karmaround.it">
              info@karmaround.it
            </a>
            <span className="contact-hero__domain">karmaround.it</span>
          </div>
        </div>
      </section>

      <section className="contact-cards">
        <div className="container contact-cards__grid">
          <Reveal as="article" className="card card--surface contact-card">
            <h2 className="card__title">Prenota una conversazione</h2>
            <p className="card__text contact-card__text">
              Un primo confronto di 30 minuti, senza impegno, per capire se e come
              possiamo lavorarci insieme.
            </p>
            <button type="button" className="btn btn-gold contact-card__btn" disabled>
              Scegli un orario
            </button>
            <p className="contact-card__note">
              Anteprima — modulo di prenotazione non ancora attivo, in attesa di conferma.
            </p>
          </Reveal>

          <Reveal as="article" className="card card--surface contact-card" delay={100}>
            <h2 className="card__title">Newsletter</h2>
            <p className="card__text contact-card__text">
              Riflessioni su orientamento ed esecuzione per chi guida un&apos;impresa.
              Poche email, solo quando vale la pena scriverle.
            </p>
            {sent ? (
              <p className="contact-card__success">Iscrizione registrata. A presto.</p>
            ) : (
              <form className="contact-card__form" onSubmit={handleNewsletterSubmit}>
                <label className="sr-only" htmlFor="newsletter-email">
                  Il tuo indirizzo email
                </label>
                <input
                  id="newsletter-email"
                  className="contact-card__input"
                  type="email"
                  required
                  placeholder="La tua email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn btn-outline-white contact-card__btn">
                  Iscrivimi
                </button>
              </form>
            )}
            <p className="contact-card__note">
              Anteprima — non ancora confermata a contratto.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
