// Riferimento condiviso all'istanza Lenis attiva (null se lo scroll
// fluido è disattivato per prefers-reduced-motion, o prima del mount).
// Permette ad altri componenti — es. ScrollToTop su cambio pagina — di
// usare lenis.scrollTo invece di window.scrollTo, evitando che le due
// animazioni di scroll vadano in conflitto.
export const lenisRef = { current: null };
