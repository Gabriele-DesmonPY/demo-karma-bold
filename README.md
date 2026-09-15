# Karma — Business Consulting

Sito vetrina per Karma Business Consulting. React 19 + Vite, nessun framework CSS (design system a custom property in `src/index.css`), routing lato client con `react-router-dom`.

## Sviluppo locale

```
npm install
npm run dev
```

## Build di produzione

```
npm run build
```

Genera i file statici in `dist/`.

## Deploy su Vercel

Il progetto è pronto per l'import diretto su Vercel (framework rilevato automaticamente: Vite).

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`

`vercel.json` include già il rewrite necessario perché le rotte client-side (`/approccio`, `/contatti`) funzionino anche su refresh o link diretto:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Passi:
1. Importa la cartella del progetto come nuovo progetto su [vercel.com](https://vercel.com/new) (o `vercel` da CLI dentro questa cartella).
2. Vercel rileva Vite e usa automaticamente build/output command sopra.
3. Deploy.

Nessuna variabile d'ambiente richiesta.
