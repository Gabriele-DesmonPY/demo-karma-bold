import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import TextReveal from "../components/TextReveal";
import usePageMeta from "../hooks/usePageMeta";
import "./Legalens.css";

// Legalens — prima pagina propria (prima viveva compressa in una sezione
// della Home). Layout deliberatamente asimmetrico: l'hero mette la colonna
// identità (wordmark) a sinistra e l'introduzione a destra; la sezione dei
// tre passaggi inverte — lista a sinistra, chiosa a destra — cosi la pagina
// non ripete lo stesso sbilanciamento due volte. Wordmark in oro pieno,
// MAI con la tecnica -webkit-text-stroke: su "Legalens" (due "e") riproduce
// lo stesso artefatto già diagnosticato e corretto una volta su
// .legalens__mark nella vecchia Home.
const STEPS = [
  {
    n: "01",
    title: "Si comprende",
    text: "Il linguaggio tecnico diventa chiaro a chi lo userà davvero — non solo a chi lo ha scritto. Una clausola su misure di sicurezza, un termine di conservazione, un obbligo di notifica: prima di entrare in un processo, passano per una lettura che li rende operativi per chi non li ha redatti.",
  },
  {
    n: "02",
    title: "Si usa",
    text: "Entra nei processi reali, non resta un documento a parte. Se un contratto impone una scadenza, quella scadenza vive nel calendario di chi consegna. Se una regola cambia chi può vedere un dato, quella regola vive nei permessi del sistema che lo custodisce — non solo in un PDF firmato una volta.",
  },
  {
    n: "03",
    title: "Si mantiene",
    text: "Resta parte del lavoro quotidiano, non si archivia dopo la firma. Le regole cambiano, i progetti cambiano: Legalens è il punto in cui si torna quando qualcosa si muove, non un adempimento chiuso il giorno della consegna.",
  },
];

export default function Legalens() {
  usePageMeta(
    "Legalens — Karma Business Consulting",
    "Legalens è il metodo con cui Karma trasforma requisiti normativi e tecnici in qualcosa che le persone capiscono, usano e mantengono nel lavoro quotidiano."
  );

  return (
    <>
      <section className="lg-hero">
        <div className="container lg-hero__grid">
          <div className="lg-hero__identity">
            <p className="eyebrow lg-hero__eyebrow">Karma × Legalens</p>
            <p className="lg-hero__mark" aria-hidden="true">Legalens</p>
            <p className="lg-hero__tagline">Le regole diventano lavoro quotidiano.</p>
          </div>

          <div className="lg-hero__intro">
            <TextReveal as="h1" splitBy="words" className="lg-hero__headline">
              Uno strumento nato dal principio Karmaround.
            </TextReveal>
            <p className="lg-hero__lede">
              Un requisito normativo o tecnico, da solo, non cambia niente: resta scritto finché
              qualcuno non lo traduce in qualcosa che si può fare. Legalens è il modo in cui Karma
              fa quella traduzione — e la mantiene viva anche dopo che il progetto è partito.
            </p>
            <p className="lg-hero__lede lg-hero__lede--secondary">
              Non è un software, non è un template. È il passaggio, ripetuto per ogni progetto, che
              porta una regola dal linguaggio di chi la scrive al linguaggio di chi la applica ogni
              giorno.
            </p>
          </div>
        </div>
      </section>

      <section className="lg-steps">
        <div className="container lg-steps__grid">
          <div className="lg-steps__list">
            {STEPS.map((s, i) => (
              <Reveal as="article" className="lg-step" delay={i * 90} key={s.n}>
                <span className="lg-step__n">{s.n}</span>
                <h2 className="lg-step__title">{s.title}</h2>
                <p className="lg-step__text">{s.text}</p>
              </Reveal>
            ))}
          </div>

          <div className="lg-steps__side">
            <Reveal as="div" className="lg-side" delay={120}>
              <p className="lg-side__quote">
                Una regola funziona quando trova una forma compatibile con il contesto in cui deve
                vivere — Legalens è quella forma.
              </p>
              <div className="lg-side__divider" aria-hidden="true" />
              <p className="lg-side__note">
                Vale per un obbligo di sicurezza come per una clausola contrattuale: cambia il
                contenuto, non il percorso che lo rende utilizzabile.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="closing lg-closing">
        <div className="container closing__inner">
          <h2 className="closing__headline">
            Porta le tue regole dentro il lavoro quotidiano.
          </h2>
          <Link to="/contatti" className="btn btn-gold closing__cta">
            Parliamone
          </Link>
        </div>
      </section>
    </>
  );
}
