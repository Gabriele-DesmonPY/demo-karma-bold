import markFull from "../assets/brand/logo-mark.png";
import markGold from "../assets/brand/logo-mark-gold.png";
import markNavy from "../assets/brand/logo-mark-navy.png";
import markCream from "../assets/brand/logo-mark-cream.png";

const SOURCES = {
  full: markFull,   // K navy + spirale oro — lockup a colori reali (badge)
  gold: markGold,   // silhouette oro piena — motivo decorativo su fondo navy
  navy: markNavy,   // silhouette navy piena — motivo decorativo su fondo oro/chiaro
  cream: markCream, // silhouette crema — badge su fondo navy (nav/footer)
};

/**
 * Marchio ufficiale KARMA: K tipografica con la spirale aurea che le
 * appartiene, ricavata dal file reale del logo fornito dalla cliente
 * (src/assets/brand/logo-mark*.png — vedi riepilogo per l'origine).
 *
 * `tone="full"` è il lockup a colori reali (badge, nav, footer, card).
 * Le altre tonalità sono silhouette monocrome pensate per l'uso decorativo
 * in grande formato sopra un fondo pieno (hero, sezioni a blocco colore).
 */
export default function Mark({ tone = "full", size = 40, className = "", style, ...rest }) {
  return (
    <img
      src={SOURCES[tone] || SOURCES.full}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={className}
      style={{ width: size, height: "auto", flexShrink: 0, userSelect: "none", ...style }}
      {...rest}
    />
  );
}
