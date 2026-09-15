import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import TextReveal from "../components/TextReveal";
import ImageReveal from "../components/ImageReveal";
import KarmaroundNetwork from "../components/KarmaroundNetwork";
import usePageMeta from "../hooks/usePageMeta";
import guidePhoto from "../assets/photos/approccio-guida.webp";
import "./Approccio.css";

// Copy allineata al brief strategico "Abitare la complessità" (stessa fonte
// già usata per la nuova Home): sezione 5 "Karmaround" per l'apertura e la
// mappa, 5.1 "Cinque regole operative" e sezione 6 "In quali situazioni
// Karma deve essere riconoscibile" per le due sezioni successive. Testo
// ripreso dal documento, non riformulato dove il documento è già la voce
// giusta.

const RULES = [
  {
    n: "01",
    title: "Partire dalla situazione",
    text: "Partire dalla situazione concreta e seguirne le connessioni prima di assegnarla a una disciplina.",
  },
  {
    n: "02",
    title: "Osservare gli effetti",
    text: "Osservare ogni intervento anche attraverso gli effetti che può generare sulle altre parti dell'organizzazione.",
  },
  {
    n: "03",
    title: "Scegliere le competenze dopo",
    text: "Individuare le competenze necessarie dopo aver compreso il problema e la direzione.",
  },
  {
    n: "04",
    title: "Tenere la lettura comune",
    text: "Integrare specialisti e fornitori mantenendo una lettura comune del perché, del risultato atteso e delle conseguenze del progetto.",
  },
  {
    n: "05",
    title: "Rivalutare la direzione",
    text: "Rivalutare la direzione quando l'esecuzione fa emergere informazioni che cambiano il quadro.",
  },
];

const SITUATIONS = [
  "Un progetto coinvolge più persone, reparti o fornitori e nessuno riesce a mantenerne una vista unitaria.",
  "L'azienda cresce e la struttura organizzativa mostra tensioni che prima non esistevano.",
  "Una tecnologia o l'AI promettono un vantaggio, ma gli effetti su processi, persone, dati, costi e responsabilità sono ancora poco chiari.",
  "Le attività aumentano e diventa difficile capire quali decisioni sblocchino davvero il risultato.",
  "Un problema continua a ripresentarsi nonostante interventi locali.",
  "Esistono già pareri, consulenti o specialisti, ma manca una lettura capace di collegarli e trasformarli in una direzione praticabile.",
  "Un'idea appare promettente e occorre capire se l'organizzazione sia realmente in grado di sostenerla.",
];

export default function Approccio() {
  usePageMeta(
    "Approccio — Karma Business Consulting",
    "Karmaround: il principio con cui Karma legge e accompagna un progetto, mantenendo visibile ciò che nella realtà è connesso."
  );

  return (
    <>
      <section className="approach-hero">
        <div className="container approach-hero__inner">
          <p className="eyebrow approach-hero__eyebrow">Approccio</p>
          <TextReveal as="h1" splitBy="words" className="approach-hero__headline">
            Karmaround
          </TextReveal>
          <p className="approach-hero__lede">
            Il principio con cui Karma legge e accompagna ogni progetto, mantenendo visibile
            ciò che nella realtà è connesso e seguendo gli impatti che attraversano
            l'organizzazione.
          </p>
        </div>
      </section>

      <section className="guide">
        <div className="guide__grid">
          <Reveal as="div" className="container guide__text">
            <p className="eyebrow guide__eyebrow">Sul campo</p>
            <p className="guide__statement">
              Indicazioni concrete, non teoria: lavoriamo fianco a fianco finché il
              risultato non arriva davvero.
            </p>
          </Reveal>
          <Reveal as="div" className="guide__photo" delay={150}>
            <ImageReveal delay={100}>
              <img src={guidePhoto} alt="" role="presentation" loading="lazy" decoding="async" />
            </ImageReveal>
          </Reveal>
        </div>
      </section>

      <section className="karma-map" id="mappa">
        <div className="container karma-map__grid">
          <div className="karma-map__figure">
            <KarmaroundNetwork />
          </div>
          <div className="karma-map__text">
            <Reveal as="p" className="eyebrow karma-map__eyebrow">
              La mappa interconnessa
            </Reveal>
            <Reveal as="p" className="karma-map__intro" delay={60}>
              Mercato, organizzazione, processi, persone, tecnologia e dati entrano nel lavoro
              quando incidono sul progetto — e si influenzano a vicenda. Non è un elenco
              fisso: è la mappa che cambia a ogni progetto.
            </Reveal>
            <Reveal as="p" className="karma-map__hint" delay={100}>
              Passa il mouse su un nodo — o selezionalo al tocco — per vedere come si
              collega alle altre dimensioni.
            </Reveal>
          </div>
        </div>
      </section>

      <section className="approach-rules">
        <div className="container approach-rules__inner">
          <Reveal as="p" className="eyebrow approach-rules__eyebrow">
            Come procediamo
          </Reveal>
          <Reveal as="h2" className="approach-rules__headline" delay={60}>
            Cinque regole, un principio.
          </Reveal>
          <div className="approach-rules__list">
            {RULES.map((rule, i) => (
              <Reveal as="div" className="approach-rule" delay={120 + i * 70} key={rule.n}>
                <span className="approach-rule__num" aria-hidden="true">
                  {rule.n}
                </span>
                <div className="approach-rule__body">
                  <h3 className="approach-rule__title">{rule.title}</h3>
                  <p className="approach-rule__text">{rule.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="approach-situations">
        <div className="container approach-situations__grid">
          <div className="approach-situations__lead">
            <Reveal as="p" className="eyebrow approach-situations__eyebrow">
              Quando serve
            </Reveal>
            <Reveal as="h2" className="approach-situations__headline" delay={60}>
              Quando serve questo approccio
            </Reveal>
          </div>
          <ul className="approach-situations__list">
            {SITUATIONS.map((text, i) => (
              <Reveal as="li" className="approach-situations__item" delay={120 + i * 60} key={text.slice(0, 24)}>
                {text}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="approach-cta">
        <div className="container approach-cta__inner">
          <h2 className="approach-cta__headline">
            Racconta a Karma cosa stai cercando di far funzionare.
          </h2>
          <Link to="/contatti" className="btn btn-gold">
            Prenota una conversazione
          </Link>
        </div>
      </section>
    </>
  );
}
