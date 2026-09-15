import { useEffect, useRef } from "react";

// Anima con requestAnimationFrame invece che sull'evento "scroll": un loop
// che ad ogni frame dipinto rilegge la posizione reale di scroll e applica
// il risultato DIRETTAMENTE al DOM dentro `onFrame` (style/setAttribute),
// non con uno stato React — niente re-render per un valore che cambia
// anche 60 volte al secondo.
//
// Perché non "scroll" + setState (round 12 settembre 2026, nonies — bug
// riportato da Gabry: la freccia della spina restava indietro, come
// staccata dalla linea, scrollando in fretta):
// 1) l'evento "scroll" spara quando decide il browser — con uno scroll
//    fluido/inerziale (qui: Lenis) può disallinearsi dal frame realmente
//    dipinto. Un loop rAF persistente resta invece sempre sincrono col
//    frame corrente, a prescindere da quanti eventi "scroll" arrivano.
// 2) quando più elementi indipendenti leggono lo stesso progress in due
//    effect separati (come il riempimento della spina e la testa
//    luminosa/freccia che lo segue), due setState possono applicarsi in
//    tick React differenti e percepirsi disallineati. Calcolando e
//    applicando tutto nello stesso tick dello stesso loop restano sempre
//    in sync — è la stessa ragione per cui qui la spina e la sua testa si
//    aggiornano da un'unica `apply()`, mai da due stati separati.
//
// `getProgress`/`onFrame` possono cambiare a ogni render (closure fresche
// sulle props correnti): il loop li legge sempre nella versione più
// recente tramite ref, ma il loop stesso parte una sola volta al mount
// (o quando cambia `enabled`) — non si riavvia a ogni render.
//
// - Con prefers-reduced-motion attivo, il loop non parte: `onFrame(1)`
//   viene chiamato una volta sola, per mostrare subito lo stato finale
//   (percorso pieno, nessuna animazione da disattivare via CSS).
// - Con `enabled` false (es. layout statico su mobile, dove l'elemento
//   non deve avere alcuno stile inline calcolato via JS) il loop non
//   parte affatto e `onFrame(null)` segnala al chiamante di ripulire gli
//   stili inline eventualmente rimasti da uno stato precedente.
//
// Round 12 settembre 2026 (fluidità): ogni sezione della Home (le due
// TimelineRow, la KarmaBand, la sua TimelineSpine, il mosaico
// ZoomParallaxIntro) aveva un proprio loop rAF che continuava a girare per
// TUTTA la durata della pagina — anche a centinaia di pixel di distanza
// dalla viewport, con `getProgress` già fermo a 0 o 1. Con 4-5 loop così
// attivi insieme, ognuno legge il layout (getBoundingClientRect) e poi
// scrive stile nel DOM: letture e scritture intrecciate fra loop diversi
// nello stesso frame forzano ricalcoli di layout sincroni ripetuti — è
// proprio il tipo di lavoro che si sente come "poco fluido" scrollando,
// anche se nessun singolo loop è pesante da solo. `observeRef` (opzionale)
// collega il loop a un IntersectionObserver: fuori da quella zona
// (rootMargin generoso, la sezione resta "pronta" un po' prima di entrare
// davvero in vista) il loop si ferma del tutto, senza cambiare il valore
// finale già applicato — non c'è animazione da completare, solo lavoro da
// non ripetere a vuoto.
export default function useProgressLoop(getProgress, onFrame, enabled = true, observeRef = null) {
  const getProgressRef = useRef(getProgress);
  const onFrameRef = useRef(onFrame);
  getProgressRef.current = getProgress;
  onFrameRef.current = onFrame;

  useEffect(() => {
    if (!enabled) {
      onFrameRef.current(null);
      return undefined;
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = null;
    let inView = true;
    // Il progress cambia solo quando si scrolla: se il valore è identico a
    // quello del frame prima, non riscrivere lo stile — evita letture layout
    // + scritture CSS a vuoto quando la pagina è ferma (e riduce il lavoro
    // per frame anche durante lo scroll: solo i loop col progress realmente
    // cambiato toccano il DOM).
    let last = undefined;

    const tick = () => {
      const p = getProgressRef.current();
      if (p !== last) {
        last = p;
        onFrameRef.current(p);
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf === null) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };

    const sync = () => {
      if (mq.matches) {
        stop();
        onFrameRef.current(1);
      } else if (inView) {
        start();
      } else {
        // Fuori vista: fermo il loop ma lascio l'ultimo valore applicato
        // com'è (niente onFrame qui) — non è uno stato "finale" come
        // prefers-reduced-motion, solo un lavoro sospeso in attesa di
        // tornare rilevante.
        stop();
      }
    };

    sync();
    mq.addEventListener("change", sync);

    let io = null;
    const node = observeRef?.current;
    if (node) {
      io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          sync();
        },
        { rootMargin: "150% 0px" }
      );
      io.observe(node);
    }

    return () => {
      stop();
      mq.removeEventListener("change", sync);
      io?.disconnect();
    };
  }, [enabled, observeRef]);
}
