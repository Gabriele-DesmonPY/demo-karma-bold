import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import TextReveal from "./TextReveal";
import useProgressLoop from "../hooks/useProgressLoop";
import WaveField from "./WaveField";
import "./ZoomParallaxIntro.css";
import logoRevealVideoMp4 from "../assets/video/logo-reveal.mp4";
import logoRevealVideoWebm from "../assets/video/logo-reveal.webm";
import logoRevealPoster from "../assets/photos/logo-reveal-poster.webp";
import mosaicConversation from "../assets/photos/mosaic-conversation.webp";
import mosaicFirma from "../assets/photos/mosaic-firma.webp";
import mosaicScrivania from "../assets/photos/mosaic-scrivania.webp";
import mosaicColloquio from "../assets/photos/mosaic-colloquio.webp";
import mosaicRiunione from "../assets/photos/mosaic-riunione.webp";
import mosaicDati from "../assets/photos/mosaic-dati.webp";

// Sequenza d'ingresso — porta fedelmente il principio del componente
// "zoom-parallax" di riferimento (21st.dev, vedi round precedente): un
// mosaico di 7 riquadri, ciascuno con una propria posizione e velocità di
// scala, che si ingrandiscono durante 300vh di scroll fino a coprire
// l'intero schermo. Reimplementato in vanilla JS/CSS — niente
// framer-motion/Lenis, stessa scelta di stack già presa e documentata per
// questo progetto — con la stessa logica di scroll-linked transform di
// ParallaxLayer.jsx.
//
// Round 12 settembre 2026 (octies): tutti e 7 i riquadri sono ora foto
// reali (set fornito da Gabry) — sostituiscono sia le 4 foto di
// passaggio già nel progetto sia i 3 placeholder in duotono navy/oro
// usati finora, incluso l'indice 6 (quello che a fine scroll resta sopra
// a tutti gli altri e copre l'intero schermo).
//
// Round successivo (undecies): il riquadro f0 — quello SENZA top/left,
// perciò l'unico centrato per davvero nello stage — è quello che Gabry ha
// segnalato come "si sfoca e diventa brutta" ingrandendolo: una foto a
// 1248px scalata fino a 4x da un ritaglio di un quarto di schermo non
// regge. Al suo posto un piccolo video (HyperFrames + WAAPI, /design
// /ui-styling): sfondo astratto navy con bagliori oro, il marchio Karma
// che emerge a metà. Non riproduce in autoplay — il suo "currentTime"
// viene impostato frame per frame sullo stesso progress di scroll che
// guida la scala (vedi applyProgress), così il logo si rivela in sync
// con lo zoom, mai sgranato perché non è mai una foto raster stiracchiata.
const FRAMES = [
  {
    key: "f0",
    kind: "video",
    sources: [
      { src: logoRevealVideoWebm, type: "video/webm" },
      { src: logoRevealVideoMp4, type: "video/mp4" },
    ],
    poster: logoRevealPoster,
    scale: 4,
    style: { height: "25vh", width: "25vw" },
  },
  { key: "f1", kind: "photo", src: mosaicConversation, scale: 5, style: { top: "-30vh", left: "5vw", height: "30vh", width: "35vw" } },
  { key: "f2", kind: "photo", src: mosaicFirma, scale: 6, style: { top: "-10vh", left: "-25vw", height: "45vh", width: "20vw" } },
  { key: "f3", kind: "photo", src: mosaicScrivania, scale: 5, style: { left: "27.5vw", height: "25vh", width: "25vw" } },
  { key: "f4", kind: "photo", src: mosaicColloquio, scale: 6, style: { top: "27.5vh", left: "5vw", height: "25vh", width: "20vw" } },
  { key: "f5", kind: "photo", src: mosaicRiunione, scale: 8, style: { top: "27.5vh", left: "-22.5vw", height: "25vh", width: "30vw" } },
  { key: "f6", kind: "photo", src: mosaicDati, scale: 9, style: { top: "22.5vh", left: "25vw", height: "15vh", width: "15vw" } },
];

// Round 12 settembre 2026 (decies): il progress non è più uno stato React
// aggiornato sull'evento "scroll" (setProgress ad ogni scroll -> render di
// 7 riquadri + overlay ad ogni evento) ma un loop requestAnimationFrame
// condiviso (useProgressLoop.js) che legge la posizione reale e scrive lo
// stile direttamente nel DOM via ref. È il pezzo più pesante della home in
// apertura pagina — 7 immagini che scalano assieme all'overlay — e sotto
// scroll fluido/inerziale (Lenis) il pattern per-evento produceva
// un'apertura percepita a scatti, non fluida. Un solo apply(progress) per
// frame, mai un render React nel mezzo, corregge anche questo.
export default function ZoomParallaxIntro() {
  const wrapRef = useRef(null);
  const overlayRef = useRef(null);
  const frameRefs = useRef([]);
  const videoRefs = useRef([]);
  // Letti subito al primo render (lazy initializer), non solo dopo il
  // mount in un effect: prima di questa correzione, un telefono vedeva per
  // un istante il markup "desktop" — mosaico 300vh, 7 immagini/video a
  // grandezza reale — prima che React lo sostituisse con la versione
  // statica al primo effect. Su una rete/CPU lenta quell'istante basta a
  // far partire il download del video (preload="auto") e il layout del
  // contenitore alto, lavoro che poi viene comunque buttato via — uno dei
  // contributi concreti al "si blocca" segnalato su mobile.
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 640px)").matches);

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => setReducedMotion(mqMotion.matches);
    mqMotion.addEventListener("change", onMotionChange);

    const mqMobile = window.matchMedia("(max-width: 640px)");
    const onMobileChange = () => setIsMobile(mqMobile.matches);
    mqMobile.addEventListener("change", onMobileChange);

    return () => {
      mqMotion.removeEventListener("change", onMotionChange);
      mqMobile.removeEventListener("change", onMobileChange);
    };
  }, []);

  // Mobile e reduced-motion restano un mosaico statico, piccolo, senza
  // loop rAF né contenitore alto — coerente con la storia del progetto di
  // evitare effetti pesanti su mobile.
  const staticState = reducedMotion || isMobile;

  // Overlay centrato: pieno e leggibile per il primo 45% del progress, poi
  // si dissolve fra il 45% e il 65% — il riquadro finale (duotono) arriva a
  // coprire lo schermo pulito, senza testo sopra. Un piccolo spostamento
  // verso l'alto accompagna la dissolvenza, stesso principio già usato per
  // le tappe della timeline (Home.jsx).
  const fadeStart = 0.45;
  const fadeEnd = 0.65;

  const getProgress = () => {
    const node = wrapRef.current;
    if (!node) return 0;
    const rect = node.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
  };

  const applyProgress = (progress) => {
    const overlay = overlayRef.current;
    if (overlay) {
      if (progress === null) {
        overlay.style.opacity = "";
        overlay.style.transform = "";
      } else {
        const fade = Math.min(1, Math.max(0, (progress - fadeStart) / (fadeEnd - fadeStart)));
        overlay.style.opacity = 1 - fade;
        overlay.style.transform = `translateY(${-32 * fade}px)`;
      }
    }

    frameRefs.current.forEach((node, i) => {
      if (!node) return;
      if (progress === null) {
        node.style.transform = "";
        return;
      }
      const f = FRAMES[i];
      const scale = 1 + (f.scale - 1) * progress;
      node.style.transform = `scale(${scale.toFixed(3)})`;
    });

    // Il video del riquadro centrale (f0) non va MAI in play/pause: la sua
    // "riproduzione" è lo stesso progress che guida la scala, letto come
    // posizione nel tempo — stesso principio dello scrubbing della spina
    // in Home.jsx (un unico valore, applicato a tutto insieme, mai un
    // secondo stato che può disallinearsi). Il -0.05s di margine evita
    // l'ultimo istante esatto del video (un frame nero limite del
    // renderer, osservato in fase di verifica, non un problema del sito).
    videoRefs.current.forEach((video) => {
      if (!video || progress === null) return;
      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) return;
      video.currentTime = Math.min(duration - 0.05, Math.max(0, progress * duration));
    });
  };

  useProgressLoop(getProgress, applyProgress, !staticState, wrapRef);

  // Round 12 settembre 2026 (duodecies — mobile "impossibile da vedere"):
  // il fallback statico mostrava tutti e 7 i riquadri del mosaico rimpiccioliti
  // in una griglia — proprio l'effetto pesante che le istruzioni di
  // costruzione escludevano esplicitamente per mobile ("1–2 immagini,
  // semplice scale/fade... il progetto ha già una storia di problemi di
  // fluidità mobile con effetti pesanti, non ripeterla"). Su mobile restano
  // solo due immagini: il marchio (poster del video f0, stesso momento di
  // brand del desktop) e una foto delle persone — non un mosaico, una
  // sequenza a due tempi, verticale, con un semplice fade/lift all'ingresso
  // (Reveal, lo stesso già usato ovunque nel sito: un solo IntersectionObserver
  // per immagine, nessun loop continuo).
  const mobileLead = FRAMES[0];
  const mobileSecondary = FRAMES[1];

  return (
    <section className={`zpv${staticState ? " zpv--static" : ""}`} ref={wrapRef}>
      <div className="zpv__stage">
        <WaveField />
        <div
          ref={overlayRef}
          className="zpv__overlay"
          style={staticState ? undefined : { opacity: 1, transform: "translateY(0px)" }}
        >
          <p className="eyebrow zpv__overlay-eyebrow">Karma — Business Consulting</p>
          <TextReveal as="h1" splitBy="words" className="zpv__overlay-headline">
            Il problema che vedi potrebbe non essere il vero problema.
          </TextReveal>
        </div>

        {staticState ? (
          <div className="zpv-mobile">
            <Reveal as="div" className="zpv-mobile__frame zpv-mobile__frame--lead">
              <img src={mobileLead.poster} alt="" role="presentation" loading="eager" decoding="async" />
            </Reveal>
            <Reveal as="div" className="zpv-mobile__frame zpv-mobile__frame--secondary" delay={90}>
              <img src={mobileSecondary.src} alt="" role="presentation" loading="lazy" decoding="async" />
            </Reveal>
          </div>
        ) : (
          FRAMES.map((f, i) => (
            <div
              key={f.key}
              ref={(node) => {
                frameRefs.current[i] = node;
              }}
              className="zpv-frame"
              style={{ transform: "scale(1)" }}
            >
              <div className="zpv-frame__inner" style={f.style}>
                {f.kind === "photo" && (
                  <img
                    src={f.src}
                    alt=""
                    role="presentation"
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                )}
                {f.kind === "video" && (
                  <video
                    ref={(node) => {
                      videoRefs.current[i] = node;
                    }}
                    poster={f.poster}
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                  >
                    {f.sources.map((s) => (
                      <source key={s.type} src={s.src} type={s.type} />
                    ))}
                  </video>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
