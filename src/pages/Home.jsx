import { useRef } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import LineReveal from "../components/LineReveal";
import Spiral from "../components/Spiral";
import SpiralStage from "../components/SpiralStage";
import CompetenceMap from "../components/CompetenceMap";
import DrawLines from "../components/DrawLines";
import ImageReveal from "../components/ImageReveal";
import ThreadConductor from "../components/ThreadConductor";
import AbstractBand from "../components/AbstractBand";
import HeroRibbon from "../components/HeroRibbon";
import useProgressLoop from "../hooks/useProgressLoop";
import usePageMeta from "../hooks/usePageMeta";
import { useEffect } from "react";
import bissoFilo from "../assets/photos/bisso-filo.webp";
import abstractAurora from "../assets/photos/abstract-aurora.webp";
import abstractCorrente from "../assets/photos/abstract-corrente.webp";
import abstractTopografia from "../assets/photos/abstract-topografia.webp";
import "./Home.css";

// ── Decorazione spirale scroll-driven ──
function ScrollSpiralDecor({ from, to, rot, opacity, armsCount = 3, spin = 200, className = "", style }) {
  const wrapRef = useRef(null);
  const spiralRef = useRef(null);

  const getProgress = () => {
    const node = wrapRef.current;
    if (!node) return 0;
    const rect = node.getBoundingClientRect();
    const span = Math.max(1, rect.height - window.innerHeight);
    return Math.min(1, Math.max(0, -rect.top / span));
  };

  const applyProgress = (p) => {
    const el = spiralRef.current;
    if (!el) return;
    const prog = p === null ? 1 : p;
    const scale = from + (to - from) * prog;
    el.style.transform = `rotate(${(prog * rot).toFixed(2)}deg) scale(${scale.toFixed(3)})`;
  };

  useProgressLoop(getProgress, applyProgress, true, wrapRef);

  return (
    <div ref={wrapRef} className={className} style={style} aria-hidden="true">
      <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", animation: `kh-spin ${spin}s linear infinite` }}>
        <div ref={spiralRef} style={{ width: "70%", height: "70%" }}>
          <Spiral armsCount={armsCount} goldOpacity={opacity} showThin={false} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    </div>
  );
}

// Hairline dorata fissa in alto: larghezza = progresso di lettura.
// Un tocco editoriale che misura il percorso senza aggiungere UI.
function GoldProgress() {
  const barRef = useRef(null);

  const getProgress = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };

  const applyProgress = (p) => {
    const el = barRef.current;
    if (!el) return;
    el.style.transform = `scaleX(${p === null ? 1 : p.toFixed(4)})`;
  };

  useProgressLoop(getProgress, applyProgress, true, null);

  return (
    <div className="kh-progress" aria-hidden="true">
      <div ref={barRef} className="kh-progress__bar" />
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const secObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('kh-sec-enter--visible');
            secObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );

    const stagObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('kh-stagger--visible');
            stagObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.kh-sec-enter').forEach((el) => secObserver.observe(el));
    document.querySelectorAll('.kh-stagger').forEach((el) => stagObserver.observe(el));

    return () => {
      secObserver.disconnect();
      stagObserver.disconnect();
    };
  }, []);

  usePageMeta(
    "Karma — Business Consulting",
    "Ogni decisione educa il futuro della tua impresa. Karma accompagna chi decide a comprenderne le connessioni, riconoscere ciò che conta e costruire una direzione coerente con la propria realtà."
  );

  return (
    <div className="karma-home">
      <GoldProgress />
      <ThreadConductor />

      {/* ═══════════════════════════════════════════════════════════════
         1 — HERO
         La matassa: la spirale entra da fuori schermo, grande,
         lenta. Il filo inizia qui.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="kh-hero">
        <HeroRibbon />
        <div className="kh-hero__spiral">
          <div className="kh-hero__spiral-spin">
            <Spiral armsCount={3} goldOpacity={0.75} thinOpacity={0.14} />
          </div>
        </div>

        <div className="kh-hero__copy">
          <Reveal as="div" className="kh-eyebrow kh-hero__eyebrow">
            Karma · Ecologia della decisione
          </Reveal>
          <LineReveal as="h1" className="kh-hero__title" delay={120}>
            Ogni decisione educa il futuro della tua impresa.
          </LineReveal>
          <Reveal as="p" className="kh-lede" delay={80}>
            Una scelta continua oltre il momento in cui viene presa.
          </Reveal>
          <Reveal as="p" className="kh-body kh-body--onnavy" delay={140} style={{ maxWidth: "52ch" }}>
            Entra nel modo in cui l'impresa pensa, agisce, assume responsabilità e affronta ciò
            che verrà. Karma accompagna chi decide a comprenderne le connessioni, riconoscere ciò
            che conta e costruire una direzione coerente con la propria realtà.
          </Reveal>
        </div>
      </section>

      <AbstractBand src={abstractAurora} height="34vh" speed={10} claim="ogni scelta lascia una luce" />

      {/* ═══════════════════════════════════════════════════════════════
         2 — LA COMPLESSITÀ DELLA SCELTA
         Merge: "Le molte verità" + "Il contesto"
         Il filo incontra molte verità contemporanee.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="kh-sec-enter kh-sec kh-grad-nc" style={{ "--fade-a": "12%", "--fade-b": "38%" }}>
        <div className="kh-col">
          <LineReveal as="h2" className="kh-h2">
            {"Tutto può avere senso.\nPreso separatamente."}
          </LineReveal>
          <Reveal as="p" className="kh-lede" style={{ margin: "16px 0 48px" }}>
            Quando hai raccolto tutte le risposte e devi ancora scegliere.
          </Reveal>

          {/* Il filo delle voci: un filo doro attraversa le sei voci, ognuna
              appesa come un nodo, alternata destra/sinistra come recto/verso. */}
          <div className="kh-thread kh-stagger">
            <span className="kh-thread__pulse" aria-hidden="true" />
            {[
              "Il mercato sta andando lì.",
              "I numeri suggeriscono questo.",
              "Dobbiamo essere compliant.",
              "Il team ha bisogno di tempo.",
              "Questa tecnologia potrebbe accelerare tutto.",
              "Il cliente chiede altro.",
            ].map((q, i) => (
              <Reveal as="p" key={q} className={`kh-thread__item${i % 2 ? " kh-thread__item--sx" : ""}`} delay={120 + i * 90}>
                <span className="kh-thread__dot" aria-hidden="true" />
                <span className="kh-thread__text">“{q}”</span>
              </Reveal>
            ))}
          </div>

          <Reveal as="div" className="kh-col--center" style={{ margin: "80px auto 0", maxWidth: 640 }}>
            <p className="kh-lede" style={{ marginBottom: 20 }}>
              Ogni voce vede qualcosa.
              <br />
              Ogni scelta muove qualcosa.
            </p>
            <p className="kh-body kh-body--oncream" style={{ marginInline: "auto" }}>
              Più prospettive possono contenere qualcosa di vero contemporaneamente.
            </p>
          </Reveal>

          {/* ── Il contesto (merging) ── */}
          <div style={{ marginTop: "clamp(80px, 12vh, 140px)" }}>
            <LineReveal as="h2" className="kh-h2" style={{ maxWidth: "20ch" }}>
              La stessa scelta può avere significati diversi.
            </LineReveal>
            <Reveal as="p" className="kh-body kh-body--oncream" delay={60} style={{ maxWidth: "58ch", marginTop: 48 }}>
              Una scelta incontra sempre una storia già cominciata. Una tecnologia incontra processi,
              persone, competenze e responsabilità. Una crescita incontra la capacità dell'organizzazione
              di sostenerla. Una nuova regola incontra comportamenti, strumenti e relazioni.
              Una riorganizzazione incontra equilibri costruiti nel tempo. Una nuova opportunità
              incontra priorità, risorse e visione.
            </Reveal>
            <Reveal as="p" className="kh-lede" delay={100} style={{ marginTop: 48, fontStyle: "normal", fontFamily: "var(--font-accent)", color: "var(--kh-ink)" }}>
              Il contesto dà significato alla scelta.
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         3 — DECIDERE È TENERE INSIEME
         Il filo lega le cose.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="kh-sec-enter kh-sec kh-grad-cn" style={{ "--fade-a": "58%", "--fade-b": "82%" }}>
        <DrawLines
          viewBox="0 0 1000 620"
          paths={[
            { d: "M120 120 C 300 180, 380 300, 520 330" },
            { d: "M880 140 C 700 210, 640 300, 520 330" },
            { d: "M180 430 C 320 400, 420 350, 520 330" },
            { d: "M820 470 C 700 410, 600 350, 520 330" },
            { d: "M500 60 C 510 160, 515 260, 520 330" },
            { d: "M520 330 C 540 430, 560 520, 600 600" },
          ]}
        />
        <div className="kh-col">
          <LineReveal as="h2" className="kh-h2">
            Decidere è tenere insieme.
          </LineReveal>
          <Reveal as="p" className="kh-lede" style={{ margin: "32px 0", fontStyle: "normal", color: "var(--kh-ink)", maxWidth: "24ch" }}>
            Ogni scelta entra nella vita dell'impresa.
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 48, maxWidth: 980, marginLeft: "auto" }}>
            <Reveal as="p" className="kh-body kh-body--oncream" style={{ maxWidth: "60ch" }}>
              Incontra persone, processi, risorse, responsabilità, mercato. Incontra una storia
              già cominciata e una visione che indica dove andare.
            </Reveal>
            <Reveal as="p" className="kh-body kh-body--oncream" delay={60} style={{ maxWidth: "60ch" }}>
              Persone, visione, mercato, organizzazione, risorse, responsabilità e tempo entrano
              nella stessa trama. Una decisione la attraversa e contribuisce a trasformarla.
            </Reveal>
          </div>
          <Reveal as="p" className="kh-body kh-body--oncream" delay={100} style={{ margin: "48px 0 64px", maxWidth: "62ch" }}>
            Karma accompagna chi decide a leggere queste connessioni, attraversarne le
            conseguenze e riconoscere la direzione coerente con la propria realtà.
          </Reveal>
          <Reveal as="p" className="kh-lede" delay={140} style={{ color: "var(--kh-cream)", maxWidth: "30ch", fontStyle: "normal" }}>
            Tenere insieme significa riconoscere ciò che conta.
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         4 — LA DOMANDA
         Il filo si ferma. Un momento di riflessione.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="kh-sec-enter kh-sec kh-grad-nc kh-question" style={{ "--fade-a": "6%", "--fade-b": "18%" }}>
        <div className="kh-question__inner">
          <Reveal as="div" className="kh-eyebrow" style={{ color: "var(--kh-gold-deep)" }}>
            Il discernimento abita qui
          </Reveal>
          <LineReveal as="h2" className="kh-h2" delay={200}>
            {"Che cosa ha senso\nper noi, qui, adesso?"}
          </LineReveal>
          <Reveal as="div" className="kh-question__lines" delay={200}>
            <span>Per questa impresa.</span>
            <span>Con questa storia.</span>
            <span>Con queste persone.</span>
            <span>Con queste possibilità.</span>
            <span>In questo momento.</span>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         5 — ENTRARE NELLA SPIRALE
         Momento pinnato. Il filo si srotola attraverso le tappe.
         ═══════════════════════════════════════════════════════════════ */}
      <SpiralStage
        height="200vh"
        spiral={{ armsCount: 3, from: 0.62, to: 3.1, rot: 180, opacity: 0.7 }}
        spin={320}
        className="kh-grad-spirale-in"
        items={[
          { at: 0.02, span: 0.13, content: <span className="kh-h3">ascoltare</span> },
          { at: 0.13, span: 0.13, content: <span className="kh-h3">osservare</span> },
          { at: 0.24, span: 0.13, content: <span className="kh-h3">collegare</span> },
          { at: 0.35, span: 0.13, content: <span className="kh-h3">comprendere</span> },
          { at: 0.46, span: 0.13, content: <span className="kh-h3">distinguere</span> },
          { at: 0.57, span: 0.13, content: <span className="kh-h3">interrogare</span> },
          { at: 0.68, span: 0.13, content: <span className="kh-h3">tradurre</span> },
          { at: 0.79, span: 0.13, content: <span className="kh-h3">discernere</span> },
          { at: 0.9, span: 0.13, content: <span className="kh-h3" style={{ color: "var(--kh-gold)" }}>scegliere</span> },
        ]}
      />

      {/* ═══════════════════════════════════════════════════════════════
         6 — ECOLOGIA DELLA DECISIONE
         Il filo intreccia le connessioni.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="kh-sec-enter kh-sec kh-flat-navy">
        <div className="kh-col kh-split kh-split--start">
          <div>
            <Reveal as="div" className="kh-eyebrow">L'approccio Karma</Reveal>
            <LineReveal as="h2" className="kh-h2" delay={0.1}>
              Ecologia della decisione
            </LineReveal>
            <Reveal as="p" className="kh-lede kh-lede--onnavy" delay={200} style={{ maxWidth: "26ch", marginTop: 28 }}>
              Abitare la complessità per far emergere una direzione.
            </Reveal>
          </div>
          <div className="kh-stack">
            <Reveal as="p" className="kh-body kh-body--onnavy" style={{ maxWidth: "44ch" }}>
              Ogni decisione vive dentro una trama di relazioni.
            </Reveal>
            <Reveal as="p" className="kh-body kh-body--onnavy" delay={40} style={{ maxWidth: "44ch" }}>
              Karma la attraversa insieme a chi decide.
            </Reveal>
            <Reveal
              as="p"
              className="kh-body kh-body--onnavy"
              delay={80}
              style={{
                borderLeft: "1px solid rgba(198,154,87,.4)",
                paddingLeft: 20,
                maxWidth: "44ch",
              }}
            >
              Ascoltiamo ciò che emerge, seguiamo le connessioni, avviciniamo prospettive diverse,
              distinguiamo ciò che conta dal rumore e rendiamo leggibili conseguenze, possibilità,
              tensioni e dipendenze.
            </Reveal>
            <Reveal as="p" className="kh-body kh-body--onnavy" delay={120} style={{ maxWidth: "44ch" }}>
              La complessità diventa uno spazio da abitare.
            </Reveal>
            <Reveal as="p" className="kh-lede kh-lede--onnavy" delay={160} style={{ maxWidth: "26ch", fontStyle: "normal", fontFamily: "var(--font-accent)", color: "var(--kh-cream)" }}>
              Dentro quello spazio, la direzione può emergere.
            </Reveal>
          </div>
        </div>
      </section>

      <AbstractBand src={abstractCorrente} height="36vh" speed={12} claim="il filo attraversa" className="kh-flat-navy" />

      {/* ═══════════════════════════════════════════════════════════════
         7 — IL CENTRO
         Momento pinnato. Il filo trova il suo nucleo.
         ═══════════════════════════════════════════════════════════════ */}
      <SpiralStage
        height="260vh"
        spiral={{ armsCount: 3, from: 2.6, to: 0.34, rot: 120, opacity: 0.55, showThin: false, size: "min(150vh,150vw)" }}
        spin={420}
        breathingDot
        className="kh-flat-navy"
        items={[
          {
            at: 0.06,
            span: 0.5,
            content: (
              <div className="kh-spiral-seme">
                SÉ
                <span className="kh-spiral-seme__slash">/</span>
                ME
              </div>
            ),
          },
          {
            at: 0.4,
            span: 0.42,
            content: (
              <div className="kh-spiral-keys">
                <span>Visione</span>
                <span>Identità</span>
                <span>Storia</span>
                <span>Valori</span>
                <span>Direzione</span>
                <span>Momento</span>
              </div>
            ),
          },
          {
            at: 0.76,
            span: 0.3,
            content: <h3 className="kh-h3" style={{ color: "var(--kh-gold)" }}>La scelta prende forma da qui.</h3>,
          },
        ]}
      />

      {/* ═══════════════════════════════════════════════════════════════
         8 — IL FILO
         Il cuore emotivo. La foto del bisso. Il filo è reale.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="kh-sec-enter kh-sec kh-sec-tight kh-flat-navy">
        <div className="kh-col kh-col--narrow kh-stack">
          <Reveal as="div" className="kh-photo">
            <ImageReveal delay={200}>
              <div className="kh-photo__frame">
                <img
                  src={bissoFilo}
                  alt="Un filo dorato di bisso marino, tenuto in mano e teso controluce."
                  loading="lazy"
                />
              </div>
            </ImageReveal>
            <p className="kh-photo__caption">Il filo che si segue, non solo quello di cui si parla.</p>
          </Reveal>
          <Reveal as="p" className="kh-body kh-body--onnavy">
            Ogni impresa nasce da una visione. Cresce, cambia, incontra nuove condizioni. Il filo
            che l'ha generata continua a offrire un punto da cui leggere ciò che accade e
            orientare ciò che verrà.
          </Reveal>
          <Reveal as="p" className="kh-h3" delay={60} style={{ color: "var(--kh-cream)" }}>
            La coerenza è un filo vivo.
          </Reveal>
          <Reveal as="p" className="kh-lede" delay={120}>
            Tiene insieme ciò che l'impresa è, ciò che sta diventando e le scelte attraverso cui
            prende forma. La coerenza permette all'impresa di evolvere continuando a
            riconoscersi.
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         9 — CRESCERE INSIEME
         Merge: Capacità decisionale + Accompagnamento + Competenze
         + Poi la scelta comincia a vivere + Ciò che resta
         Il filo rafforza l'impresa e le persone.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="kh-sec-enter kh-sec" style={{ background: "var(--kh-navy)", color: "var(--kh-cream)" }}>
        {/* 9A — Capacità decisionale */}
        <div className="kh-col" style={{ marginBottom: "var(--space-rhythm)" }}>
          <ScrollSpiralDecor from={0.5} to={1.9} rot={-60} opacity={0.3} spin={200} className="kh-lines" />
          <Reveal as="div" className="kh-eyebrow">Il tempo della decisione</Reveal>
          <LineReveal as="h2" className="kh-h2">
            {"Le decisioni di oggi\neducano il modo in cui sceglieremo domani."}
          </LineReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 48, maxWidth: 900, marginLeft: "auto", marginTop: 56 }}>
            <Reveal as="p" className="kh-lede kh-lede--onnavy">
              Ogni decisione può rendere l'impresa più capace di affrontare la successiva.
            </Reveal>
            <Reveal as="p" className="kh-body kh-body--onnavy" delay={60} style={{ maxWidth: "52ch" }}>
              Educa il modo in cui vengono assunte le responsabilità. Educa ciò che le persone
              imparano a premiare, tollerare, proteggere. Educa il rapporto con il rischio, il modo
              di utilizzare tecnologia e dati, il modo in cui verrà affrontata la decisione successiva.
            </Reveal>
          </div>
          <Reveal
            as="div"
            delay={100}
            style={{ marginTop: 96, paddingTop: 48, borderTop: "1px solid rgba(198,154,87,.3)" }}
          >
            <p className="kh-lede kh-lede--onnavy" style={{ marginBottom: 16 }}>
              La capacità decisionale cresce dentro l'impresa.
            </p>
            <p className="kh-body kh-body--onnavy" style={{ margin: 0 }}>
              La capacità resta nell'impresa.
            </p>
          </Reveal>
        </div>

        {/* Divider visivo */}
        <div className="kh-col" style={{ paddingBlock: "var(--space-rhythm-tight)" }}>
          <div style={{ height: 1, background: "rgba(198,154,87,.2)", maxWidth: 600, margin: "0 auto" }} />
        </div>

        {/* 9B — Accompagnamento */}
        <div className="kh-col" style={{ marginBottom: "var(--space-rhythm)" }}>
          <DrawLines
            viewBox="0 0 600 400"
            paths={[
              { d: "M-20 90 C 160 110, 210 210, 320 205 S 480 250, 620 230", stroke: "var(--kh-ink)", opacity: 0.45 },
              { d: "M-20 330 C 150 320, 220 220, 320 215 S 470 190, 620 200", stroke: "var(--kh-gold)", opacity: 0.9 },
              { d: "M-20 200 C 170 180, 230 250, 330 240 S 460 300, 620 300", stroke: "var(--kh-line)", opacity: 1 },
            ]}
          />
          <LineReveal as="h2" className="kh-h2" style={{ maxWidth: "20ch", marginBottom: 56 }}>
            Decidere è un atto che si attraversa insieme.
          </LineReveal>
          <div className="kh-split">
            <div className="kh-stack">
              <Reveal as="p" className="kh-body kh-body--onnavy" style={{ maxWidth: "60ch" }}>
                Ci mettiamo intorno alla stessa decisione.
                <br />
                <br />
                Tu porti la conoscenza della tua impresa, la sua storia, ciò che senti muoversi,
                ciò che conosci e ciò che ancora fatica a trovare forma.
                <br />
                <br />
                Noi portiamo ascolto, domande, esperienza, competenze e la capacità di mettere in
                relazione prospettive diverse.
              </Reveal>
              <Reveal as="div" delay={60} className="kh-stack kh-stack--tight" style={{ color: "rgba(250,248,244,.72)" }}>
                <span className="kh-h3">
                  Diventiamo un team intorno a ciò che conta.
                </span>
                <span style={{ marginTop: 6 }}>
                  Il nostro ruolo è metterci al servizio della decisione e dell'impresa che dovrà
                  viverla.
                </span>
              </Reveal>
            </div>
            <Reveal as="div" delay={100}>
              <Spiral armsCount={3} goldOpacity={0.25} showThin={false} style={{ maxWidth: 320, marginInline: "auto" }} />
            </Reveal>
          </div>
        </div>

        {/* 9C — Le competenze */}
        <div className="kh-col kh-split" style={{ marginBottom: "var(--space-rhythm)" }}>
          <div>
            <LineReveal as="h2" className="kh-h2" style={{ marginBottom: 32 }}>
              Competenze intorno alla decisione.
            </LineReveal>
            <Reveal as="div" delay={80} className="kh-stack">
              <p className="kh-body kh-body--onnavy" style={{ maxWidth: "46ch" }}>
                Ogni situazione determina il perimetro che vale la pena osservare. Le competenze
                entrano quando aiutano a vedere meglio, comprendere una conseguenza, tradurre un
                vincolo o costruire una possibilità.
              </p>
              <p className="kh-body kh-body--onnavy" style={{ maxWidth: "46ch" }}>
                La mappa ci aiuta a capire quali sguardi servono davvero.
              </p>
              <p className="kh-sguardi" style={{ color: "var(--kh-cream)" }}>
                Più sguardi.
                <br />
                Una decisione intera.
              </p>
            </Reveal>
          </div>
          <Reveal as="div" delay={120}>
            <CompetenceMap
              center="LA DECISIONE"
              items={[
                "STRATEGIA", "ORGANIZZAZIONE", "PROCESSI", "PERSONE", "PROJECT MANAGEMENT",
                "TECNOLOGIA", "DATI", "AI", "PRIVACY", "DIRITTO", "COMPLIANCE", "MERCATO",
              ]}
            />
          </Reveal>
        </div>

        {/* Divider visivo */}
        <div className="kh-col" style={{ paddingBlock: "var(--space-rhythm-tight)" }}>
          <div style={{ height: 1, background: "rgba(198,154,87,.2)", maxWidth: 600, margin: "0 auto" }} />
        </div>

        {/* 9D — Poi la scelta vive + Ciò che resta */}
        <div className="kh-col">
          <LineReveal as="h2" className="kh-h2">
            Poi la scelta comincia a vivere.
          </LineReveal>
          <Reveal as="p" className="kh-body kh-body--onnavy" style={{ maxWidth: "56ch", marginTop: 40 }}>
            Entra nei processi, incontra le persone, modifica comportamenti, produce risultati,
            fa emergere conseguenze prima invisibili. La realtà restituisce informazioni.
            Continuiamo ad ascoltarla. La decisione evolve insieme al contesto.
          </Reveal>
          <Reveal as="p" className="kh-lede kh-lede--onnavy" delay={60} style={{ marginTop: 48, maxWidth: "40ch" }}>
            La coerenza è un filo che attraversa forme diverse.
          </Reveal>
          <Reveal as="p" className="kh-body kh-body--onnavy" delay={100} style={{ marginTop: 20, maxWidth: "56ch" }}>
            Il contesto cambia. Le informazioni cambiano. L'impresa cambia. Anche una decisione
            può evolvere continuando a custodire ciò che l'ha generata.
          </Reveal>

          {/* Ciò che resta — integrato */}
          <div style={{ marginTop: "var(--space-rhythm)" }}>
            <LineReveal as="h2" className="kh-h2" style={{ maxWidth: "22ch" }}>
              Vogliamo lasciarti con più capacità di scegliere di quella con cui sei arrivato.
            </LineReveal>
            <Reveal as="p" className="kh-body kh-body--onnavy" delay={60} style={{ maxWidth: "56ch", marginTop: 40 }}>
              Una connessione che prima non vedevi. Un nodo finalmente riconoscibile. Una domanda
              più precisa. Un criterio che puoi utilizzare ancora. Una maggiore capacità di orientarti
              quando la prossima decisione arriverà.
            </Reveal>
            <Reveal as="p" className="kh-h3" delay={100} style={{ marginTop: 48 }}>
              Decidere educa a decidere.
            </Reveal>
            <Reveal as="p" className="kh-body kh-body--onnavy" delay={140} style={{ marginTop: 16, maxWidth: "52ch" }}>
              Il valore continua dentro l'impresa. Se dopo di noi il progetto cammina senza di noi,
              abbiamo lavorato bene.
            </Reveal>
          </div>
        </div>
      </section>

      <AbstractBand src={abstractTopografia} height="36vh" speed={12} claim="la direzione emerge" className="kh-flat-navy" />

      {/* ═══════════════════════════════════════════════════════════════
         10 — CONOSCIAMOCI
         Merge: Mappa Karma + chiusura CTA
         Il filo si chiude in un incontro.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="kh-sec-enter kh-sec kh-flat-navy kh-closing">
        <div className="kh-closing__spiral">
          <div style={{ width: "100%", height: "100%", animation: "kh-spin 300s linear infinite" }}>
            <Spiral armsCount={3} goldOpacity={0.5} thinOpacity={0.12} />
          </div>
        </div>

        <div className="kh-col kh-col--narrow" style={{ position: "relative", zIndex: 1 }}>
          {/* Mappa Karma — integrata */}
          <Reveal as="div" className="kh-eyebrow" style={{ marginInline: "auto", display: "table" }}>
            Ciò che ti restituiamo
          </Reveal>
          <LineReveal as="h2" className="kh-h2" delay={0.1}>
            Una prima Mappa Karma.
          </LineReveal>
          <Reveal as="div" delay={80} className="kh-stack" style={{ maxWidth: "52ch", marginInline: "auto", marginTop: 32 }}>
            <p className="kh-body kh-body--onnavy">
              Una spirale identitaria e decisionale che restituisce una prima lettura di dove
              siete, cosa si sta muovendo, quali connessioni meritano attenzione e da quale
              seme può iniziare il lavoro.
            </p>
            <p className="kh-lede kh-lede--onnavy" style={{ fontStyle: "normal", fontFamily: "var(--font-accent)" }}>
              Al centro, il seme: ciò che oggi chiede di essere compreso, custodito o reso
              possibile.
            </p>
          </Reveal>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(198,154,87,.25)", maxWidth: 400, margin: "var(--space-rhythm-tight) auto" }} />

          {/* CTA chiusura */}
          <Reveal as="div" className="kh-eyebrow" style={{ marginInline: "auto", display: "table", marginTop: "var(--space-rhythm-tight)" }}>
            Il primo incontro · 30 minuti · gratuito
          </Reveal>
          <LineReveal as="h2" className="kh-h2" delay={100}>
            Conosciamoci
          </LineReveal>
          <Reveal as="p" className="kh-lede kh-lede--onnavy" delay={120} style={{ marginInline: "auto", marginTop: 12, maxWidth: "28ch" }}>
            Cominciamo da dove siamo.
          </Reveal>
          <Reveal as="div" delay={100} className="kh-stack" style={{ maxWidth: "56ch", marginInline: "auto", marginTop: 32 }}>
            <p className="kh-body kh-body--onnavy">
              La prima conversazione con Karma dura 30 minuti ed è gratuita.
            </p>
            <p className="kh-body kh-body--onnavy">
              Ci racconti l'impresa, il momento che sta vivendo e ciò che oggi chiede attenzione.
              Insieme iniziamo a riconoscere i nodi, le connessioni e i punti che chiedono
              integrazione.
            </p>
          </Reveal>
          <Reveal as="p" className="kh-h3" delay={140} style={{ margin: "48px auto 36px", maxWidth: "20ch" }}>
            Alla fine ti restituiamo una prima Mappa Karma.
          </Reveal>
          <Reveal delay={180}>
            <Link to="/contatti" className="kh-closing__link">
              Prenota il primo incontro →
            </Link>
          </Reveal>
          <Reveal as="div" delay={220} className="kh-closing__notes">
            <span>30 minuti insieme · gratuiti</span>
            <span>Nessuna preparazione necessaria. Partiamo da ciò che c'è.</span>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
