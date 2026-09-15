import Mark from "./Mark";

/**
 * Wordmark ufficiale: marchio (K + spirale) e "KARMA", con payoff opzionale
 * "Business Consulting". `tone="light"` per l'uso su fondo navy (nav,
 * footer): badge in silhouette crema per restare leggibile sullo stesso
 * fondo scuro dove il navy del logo a colori si confonderebbe.
 */
export default function Wordmark({ tone = "dark", withPayoff = false, markSize, className = "" }) {
  const isLight = tone === "light";
  const mainColor = isLight ? "var(--cream)" : "var(--navy)";
  const mutedColor = isLight ? "var(--muted-on-dark)" : "var(--muted)";
  const mark = markSize ?? (withPayoff ? 40 : 28);

  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: mark >= 40 ? 12 : 8 }}
    >
      <Mark tone={isLight ? "cream" : "navy"} size={mark} />
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            color: mainColor,
            fontFamily: "var(--font-label)",
            fontWeight: 700,
            letterSpacing: "0.02em",
            fontSize: mark >= 40 ? 17 : 15,
          }}
        >
          KARMA
        </span>
        {withPayoff && (
          <span
            style={{
              marginTop: 4,
              color: mutedColor,
              fontFamily: "var(--font-label)",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontSize: 9.5,
            }}
          >
            Business Consulting
          </span>
        )}
      </span>
    </span>
  );
}
