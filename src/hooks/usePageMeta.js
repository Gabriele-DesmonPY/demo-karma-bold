import { useEffect } from "react";

// Imposta title + meta description per la pagina montata, ripristinando i
// valori precedenti allo smontaggio (il sito è una SPA senza libreria di
// gestione dell'head: nessuna nuova dipendenza, solo il DOM diretto).
export default function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta ? meta.getAttribute("content") : null;
    if (meta && description) {
      meta.setAttribute("content", description);
    }

    return () => {
      document.title = prevTitle;
      if (meta && prevDescription !== null) {
        meta.setAttribute("content", prevDescription);
      }
    };
  }, [title, description]);
}
