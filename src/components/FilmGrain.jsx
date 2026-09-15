import "./FilmGrain.css";

export default function FilmGrain() {
  return (
    <div className="film-grain" aria-hidden="true">
      <svg className="film-grain__svg" width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
