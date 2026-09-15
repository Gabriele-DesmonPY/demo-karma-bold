# Piano: Elevation 1000× — Karma Business Consulting

## Fase 1 — Analisi del Reference (Completata)

### Identità Visiva Attuale
- **Palette duale**: Home usa `#002c3a` + `#c7a14a` (editoriale), altre pagine usano `#0a2545` + `#c69a57` (corporate). Questa discrepanza è il difetto più grave: navigando da Home ad Approccio l'utente percepisce un cambio di brand.
- **Tipografia duale**: Home usa Instrument Serif maiuscolo per TUTTI i titoli; altre pagine usano Plus Jakarta Sans weight 800. Due voci completamente diverse.
- **Motivo spirale**: SVG logaritmica generativa, filo conduttore forte della Home. Sulle altre pagine è assente o ridotto al minimo.
- **Gradienti di sezione**: Home usa transizioni sfumate tra navy e cream. Altre pagine usano tagli netti.

### Struttura Mappata

| Pagina | Sezioni | Problema principale |
|--------|---------|---------------------|
| Home | ~16 sezioni, ~500vh | Troppe sezioni, ritmo non respira, nessun punto di pausa visiva |
| Approccio | 5 sezioni | Design system diverso dalla Home, nessuna spirale |
| Legalens | 3 sezioni | Stesso problema, layout asimmetrico forzato senza motivo visivo |
| Contatti | 2 sezioni | Card standard, nessuna atmosfera brand |

### Art Direction Distintiva
Cosa funziona:
- La spirale come filo conduttore è memorabile
- Il concetto "ecologia della decisione" è poetico e differenziante
- Il bisso-filo come metafora visiva è potente
- Il tono editoriale (Instrument Serif) trasmette autorevolezza

Cosa non funziona:
- Il corporate standard sulle pagine interne smonta il lusso costruito in Home
- Troppi effetti (orbit words, spiral spin 300s, draw lines, scramble text) che competono per l'attenzione
- La nav sticky con `#0a2545` appare sopra sezioni `#002c3a` — sfalsamento cromatico visibile

### Tipografia Analizzata
- **Home H1**: `clamp(2.35rem, 6.1vw, 6.1rem)`, line-height 1.02, letter-spacing -0.012em. Troppo stretto: su viewport medie il testo a capo si sovrappone visivamente.
- **Altri H1**: `clamp(2.3rem, 5.4vw, 4.6rem)`, weight 800. Meno impact rispetto alla Home.
- **Body**: troppi valori diversi (0.98rem, 1.05rem, clamp(0.92rem, 1.1vw, 1.05rem), 16px...)
- **Scale incoerente**: su Home i titoli sono enormi e editoriali; su altre pagine sono "corporate bold"

### Motion Analizzata
- **TextReveal**: word-by-word con IntersectionObserver. Funziona ma è lento e a volte le parole si rivelano troppo tardi (threshold 0.1).
- **SpiralStage**: pinned scroll con transform scale/rotate. Tecnica solida ma i blocchi di testo appaiono troppo piccoli al centro dello schermo.
- **ScrambleText**: effetto caratteri random. Premium ma usato su 3 titoli — diventa prevedibile.
- **DrawLines**: stroke-dashoffset su scroll. Le linee sono sottili (1px) e a bassa opacità (0.5) — quasi invisibili.
- **Orbit words**: parole fluttuanti a destra dell'hero. Su schermi larghi funziona; su 13-15" possono invadere la colonna di testo.

---

## Fase 3 — Benchmark di Qualità (Research)

### Riferimenti selezionati

1. **Moncler.com** (ADC Awards 2026) — *Best Editorial Layout, Best Image Treatment*
   - Lezione: il prodotto (qui: il pensiero) è l'eroe. L'interfaccia si ritrae. Spazi bianchi generosi, ritmo da magazine.

2. **Jonite by Series Eight** (Awwwards SOTD) — *Best Typography + Spacing*
   - Lezione: tipografia e fotografia condividono lo stesso peso visivo. Linee pulite, modularità, material texture sottile.

3. **Verlanor (Framer template)** — *Best Typography Pairing*
   - Lezione: Instrument Serif + Inter funziona perché il serif è display-only, il sans gestisce tutto il resto. Mai due serif in competizione.

4. **Noir Studio** — *Best Motion Design*
   - Lezione: clip-path line reveals per titoli. Custom cursor morfico. Magnetic buttons. Lenis smooth scroll integrato.

5. **Abu Dhabi Investment Authority (S1T2)** — *Best Premium Corporate*
   - Lezione: cinemagraphs invece di foto statiche. Dati visualizzati con linee sottilissime. Poche pagine, paragrafi corti deliberati.

6. **Counsel (Rocket Studio)** — *Best Consulting Aesthetic*
   - Lezione: alternanza navy/parchment come recto/verso. Gold usatissimo con disciplina: solo rule lines, pull quotes, CTAs.

7. **Aesop.com** — *Best Component Consistency*
   - Lezione: ogni card, ogni bottone, ogni link appartiene allo stesso sistema. Non c'è variazione ad-hoc tra pagine.

8. **Ritz-Carlton Reserve** — *Best Hero Treatment*
   - Lezione: hero a schermo intero con testo in basso a sinistra, mai centrato. Tipografia bianca su immagine scura con overlay calibrato.

9. **Polestar.com** — *Best Section Rhythm*
   - Lezione: alternanza intenzionale — HIGH IMPACT (full-bleed foto + claim) → QUIET (testo su fondo neutro) → INFORMATION (dati + grafico) → VISUAL (prodotto in macro) → HIGH IMPACT (CTA finale).

10. **Studio Freight** — *Best Micro-interactions*
    - Lezione: hover states che comunicano qualità. Link che non sono semplicemente "underline" ma hanno un movimento fluido. Cursor che risponde al contesto.

---

## Fase 4-6 — Competition Interna & Direzione Finale

### Designer 01 — Art Director: Vincitore
**Decisione**: Unificare TUTTE le pagine sotto il design system editoriale della Home. Le pagine interne non devono sembrare "un altro sito". La spirale e la palette `#002c3a` + `#c7a14a` diventano globali.

### Designer 02 — Typography + Layout: Vincitore
**Decisione**: Sistema tipografico a 4 livelli, uniforme su tutte le pagine:
- **Display**: Instrument Serif, uppercase, line-height 1.05 (non 1.02), letter-spacing 0.01em (leggermente positivo per leggibilità uppercase)
- **Heading**: Plus Jakarta Sans 700, sentence case, line-height 1.15
- **Body**: Manrope 500, line-height 1.7, max-width 55ch
- **Label/Eyebrow**: Manrope 800, uppercase, letter-spacing 0.14em, 12px

Ridurre il numero di sezioni Home da ~16 a ~10, fondendo quelle con contenuto sovrapposto.

### Designer 03 — Motion: Vincitore
**Decisione**: 
- Rimpiazzare TextReveal (word-by-word lento) con **clip-path line reveal** per titoli — più cinematografico.
- Integrare **Lenis smooth scroll** (il progetto ha già `src/lib/lenisInstance.js` ma sembra non usato).
- Aggiungere **parallax sottile** alle foto (±15px, non ±100px).
- Semplificare l'hero: rimuovere orbit words (competizione visiva), mantenere la spirale che entra da fuori schermo.
- Il cursore custom (già presente ma commentato) viene riattivato con stato morfico su link/bottoni.

### Designer 04 — Visual Storyteller: Vincitore
**Decisione**: 
- Trattare la fotografia del bisso con un overlay più sofisticato (non solo multiply).
- Aggiungere texture sottile (grain) su sezioni navy — non commentato, attivo.
- Rimuovere le "mosaic photos" non usate (sono in assets ma non referenziate).
- Usare la spirale brand come watermark coerente: appare in 3 momenti (hero, metà pagina, chiusura) con opacità calibrata.

### Designer 05 — UX + Conversion: Vincitore
**Decisione**:
- La nav deve essere coerente: su Home, il `mix-blend-mode: difference` header viene sostituito da una nav che trasforma il suo sfondo da trasparente a navy solido quando si esce dall'hero.
- Rimozione del menu mobile a tendina: usare un overlay fullscreen con animazione stagger dei link.
- CTA "Iniziamo" sempre visibile in nav.
- Aggiungere schema di navigazione visibile (progresso sezione) sulla Home, magari come numeri laterali fissi.

---

## Fase 7 — Zero-Based Implementation Plan

### Macro-struttura

L'implementazione riguarda TUTTI i file CSS e JSX delle pagine e dei componenti globali.

#### A. Design System Globale (`src/index.css`)
1. **Unificazione palette**: tutto il sito usa la palette editoriale della Home (`#002c3a`, `#c7a14a`, `#f7f5f0`, `#16282d`). Rimuovere i token `--navy`, `--gold` globali e sostituirli con `--kh-*`.
2. **Riduzione scale tipografica**: da ~15 dimensioni diverse a 5 token:
   - `--text-display`: clamp(2.4rem, 6vw, 5.8rem)
   - `--text-h1`: clamp(2rem, 4.5vw, 4.2rem)
   - `--text-h2`: clamp(1.6rem, 3vw, 2.8rem)
   - `--text-body`: clamp(0.95rem, 1.05vw, 1.05rem)
   - `--text-label`: 12px
3. **Spaziatura armonica**: aggiungere `--space-rhythm: clamp(80px, 12vh, 160px)` per sezioni. Rimpiazzare i padding hardcoded con questo token.
4. **Animazioni**: definire keyframes globali per `reveal-up`, `reveal-line`, `fade-in`.

#### B. Navigazione (`src/components/Nav.jsx` + `.css`)
1. **Unificare Nav**: un solo componente Nav, gestisce sia Home che altre pagine.
2. **Comportamento trasformativo**: su Home inizia trasparente (o con mix-blend-mode), poi a scroll > 60vh acquisisce sfondo `#002c3a` solido con bordo oro sottile.
3. **Mobile**: overlay fullscreen con links che entrano con stagger da sinistra.
4. **Rimuovere HomeHeader**: il suo ruolo viene assorbito dalla Nav trasformativa.

#### C. Footer (`src/components/Footer.jsx` + `.css`)
1. **Unificare footer**: HomeFooter e Footer diventano un unico componente che adatta il suo layout in base alla pagina.
2. **Footer editoriale**: riga superiore sottile con "KARMA BUSINESS CONSULTING" / "ECOLOGIA DELLA DECISIONE", sotto la griglia a 3 colonne esistente.
3. **Sottigliare il bordo oro**: da 4px a 2px. Aggiungere gradiente sotto il bordo (oro che sfuma ai lati).

#### D. Home (`src/pages/Home.jsx` + `.css`)
1. **Ridurre sezioni** (da 16 a 10):
   - Fondere "Le molte verità" + "Il contesto" in un'unica sezione "La complessità della scelta"
   - Fondere "Poi la scelta comincia a vivere" + "Ciò che resta" in "Il ciclo della decisione"
   - Rimuovere decorazioni SVG inutili (DrawLines nelle sezioni intermedie)
2. **Ridisegnare Hero**: rimuovere orbit words, mantenere spirale grande. Titolo con clip-path reveal. Layout più aperto, più aria.
3. **Ridisegnare SpiralStage**: i blocchi di testo devono essere più grandi, meglio centrati. La spirale deve essere più visibile (opacity più alta).
4. **Aggiungere texture**: film grain attivo su sezioni navy.
5. **Migliorare le transizioni**: le gradienti `.kh-grad-nc` / `.kh-grad-cn` devono essere più morbide e più lunghe.

#### E. Approccio (`src/pages/Approccio.jsx` + `.css`)
1. **Riscrittura completa del CSS**: usare il design system editoriale (Instrument Serif per titoli, palette unificata).
2. **Hero**: fullscreen navy con titolo "Karmaround" in Instrument Serif uppercase, sottotitolo in gold italic.
3. **Sezione mappa**: mantenere KarmaroundNetwork ma con stile coerente (nodi oro su navy, non colori diversi).
4. **Regole operative**: numeri in gold, bordi sottili. Animazione stagger al reveal.
5. **CTA finale**: fullscreen navy con spirale watermark.

#### F. Legalens (`src/pages/Legalens.jsx` + `.css`)
1. **Riscrittura CSS**: stesso design system.
2. **Hero**: titolo "Legalens" in Instrument Serif, non Plus Jakarta Sans. Tagline in gold.
3. **Steps**: layout a 3 colonne su desktop, non asimmetrico forzato. Ogni step ha un bordo oro a sinistra.
4. **Sidebar sticky**: rimuovere la sidebar dark; integrare la citazione nel flusso naturale.

#### G. Contatti (`src/pages/Contatti.jsx` + `.css`)
1. **Riscrittura CSS**: stesso design system.
2. **Hero**: titolo "Parliamone" in Instrument Serif fullscreen.
3. **Cards**: usare `.card` globale con modificatore `--editorial`. Bordo oro superiore, interno navy, testo cream. Hover: shift sottile verso l'alto + glow oro.
4. **Form newsletter**: input con bordo inferiore oro (non box completo). Focus: linea che si espande.

#### H. Componenti di Motion
1. **TextReveal → LineReveal**: nuovo componente che usa clip-path `inset(0 0 100% 0)` → `inset(0 0 0% 0)` per rivelare linee di testo.
2. **Reveal**: aggiungere opzione `parallax` (±20px su Y).
3. **CustomCursor**: riattivare con stati: default (piccolo cerchio), hover (cerchio espanso + testo "ESPLORA"), click (cerchio contratto).
4. **FilmGrain**: riattivare.
5. **PageTransition**: migliorare con clip-path reveal invece di semplice opacity.

#### I. Lenis Smooth Scroll
1. Integrare `src/lib/lenisInstance.js` in `App.jsx` o `main.jsx`.
2. Configurare con `lerp: 0.08`, `smoothWheel: true`.
3. Assicurare che tutti i componenti che usano `useProgressLoop` continuino a funzionare con Lenis (il progetto sembra già progettato per questo).

---

## Fase 8 — Premium Detail Pass (Checklist)

- [ ] Optical alignment: verificare che i testi siano allineati alla griglia di base (baseline grid 8px)
- [ ] Consistent border-radius: tutto a 0px o 2px, mai variazioni
- [ ] Consistent border-weight: 1px per sottili, 2px per accenti, 3px solo per CTA principali
- [ ] Line-height check: nessun titolo con line-height < 1.05
- [ ] Image crops: tutte le foto in aspect-ratio definiti (3:2, 16:9, 1:1)
- [ ] Button proportions: padding verticale/ orizzontale in ratio ~1:2
- [ ] Transition timing: tutte le transizioni tra 300ms e 500ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`
- [ ] Focus states: visibili e coerenti (oro, 2px)
- [ ] Mobile typography: nessun titolo > 3rem su schermo < 400px
- [ ] Touch targets: minimo 44×44px per ogni elemento interattivo

---

## Fase 9-10 — Test 5-Secondi / 30-Secondi

**5-secondi (Hero)**:
- "Karma" — brand chiaro
- "Ogni decisione educa il futuro" — value proposition chiara
- Navy + oro — atmosfera premium, istituzionale
- "Conosciamoci" — azione chiara

**30-secondi (Prima viewport + sezioni successive)**:
- "Non ci fermiamo a dirti cosa fare" — differenziazione dal consulting tradizionale
- La spirale — elemento mnemonico
- Il bisso — metafora del filo che tiene insieme
- La mappa — concretezza del metodo

---

## Fase 11 — Mobile

- Hero: spirale ridimensionata, titolo max 2.4rem
- Sezioni: padding ridotto a `--space-rhythm-mobile: clamp(48px, 8vh, 80px)`
- Nav: hamburger → overlay fullscreen
- SpiralStage: height ridotto a 180vh
- Cards: stack verticale, full-width
- Footer: stack verticale, centrato

---

## Fase 12 — Loop Engineering

### Loop 01 — Visuale
1. Unificare le due palette in una sola
2. Allineare la tipografia su tutte le pagine a Instrument Serif display + Manrope body
3. Aumentare whitespace nelle sezioni dense
4. Ridurre il numero di font-size ad-hoc
5. Aggiungere texture grain su navy
6. Migliorare il trattamento foto bisso
7. Sottigliare i bordi eccessivi
8. Aggiungere gradienti morbidi tra TUTTE le sezioni (anche pagine interne)
9. Rendere la spirale watermark più coerente
10. Uniformare i bottoni

### Loop 02 — UX
1. Nav trasformativa su tutte le pagine
2. Menu mobile fullscreen
3. Ridurre le sezioni Home
4. Aggiungere scroll-to-section nella Home (anchor navigation)
5. Migliorare la gerarchia dei CTA
6. Rendere il KarmaroundNetwork interattivo e comprensibile
7. Aggiungere microcopy di supporto dove necessario
8. Ottimizzare i tempi di reveal (alcuni troppo lenti)
9. Migliorare il contrasto su alcuni testi secondari
10. Aggiungere stati di caricamento per immagini

### Loop 03 — Premium
1. Clip-path reveal per tutti i titoli
2. Custom cursor attivo
3. Lenis smooth scroll
4. Hover states sofisticati su link (non solo underline)
5. Magnetic buttons su tutti i CTA principali
6. Parallax sottile sulle immagini
7. Preloader con spirale che si disegna (già presente, perfezionare)
8. Page transitions con clip-path
9. Ombre sofisticate (layered) sulle card
10. Audio feedback? No, troppo invasivo. Focus visivo invece.

---

## File coinvolti (modifica)

| File | Azione |
|------|--------|
| `src/index.css` | Riscrittura completa design system |
| `src/App.jsx` | Integrazione Lenis, unificazione Header/Footer |
| `src/main.jsx` | Avvio Lenis |
| `src/pages/Home.jsx` | Ristrutturazione sezioni, unificazione componenti |
| `src/pages/Home.css` | Riscrittura completa |
| `src/pages/Approccio.jsx` | Refactoring con nuovo design system |
| `src/pages/Approccio.css` | Riscrittura completa |
| `src/pages/Legalens.jsx` | Refactoring con nuovo design system |
| `src/pages/Legalens.css` | Riscrittura completa |
| `src/pages/Contatti.jsx` | Refactoring con nuovo design system |
| `src/pages/Contatti.css` | Riscrittura completa |
| `src/components/Nav.jsx` | Comportamento trasformativo, menu fullscreen |
| `src/components/Nav.css` | Riscrittura completa |
| `src/components/Footer.jsx` | Layout unificato |
| `src/components/Footer.css` | Riscrittura completa |
| `src/components/HomeHeader.jsx` | Eliminare (assorbito da Nav) |
| `src/components/HomeHeader.css` | Eliminare |
| `src/components/HomeFooter.jsx` | Eliminare (assorbito da Footer) |
| `src/components/HomeFooter.css` | Eliminare |
| `src/components/TextReveal.jsx` | Migliorare con clip-path |
| `src/components/TextReveal.css` | Aggiornare |
| `src/components/Reveal.jsx` | Aggiungere parallax option |
| `src/components/CustomCursor.jsx` | Riattivare, aggiungere stati |
| `src/components/CustomCursor.css` | Aggiornare |
| `src/components/FilmGrain.jsx` | Riattivare |
| `src/components/PageTransition.jsx` | Migliorare con clip-path |
| `src/components/Preloader.jsx` | Perfezionare animazione |

---

## Rischi e Mitigazioni

| Rischio | Mitigazione |
|---------|-------------|
| Breaking changes su routing | Testare tutte le rotte dopo ogni modifica |
| Performance con Lenis + molte animazioni | Testare su dispositivo medio, aggiungere `@media (prefers-reduced-motion)` |
| Accessibilità con cursor custom | Nascondere cursor custom su touch, mantenere focus visibili |
| Manutenzione con CSS duplicato | Usare solo classi utility dal design system, zero stili inline |

---

## Domande per l'utente

1. **Legalens**: il marchio "Legalens" deve essere trattato come un sotto-marchio (logo proprio) o come un prodotto Karma? Questo influenza il layout dell'hero (logo a sinistra vs titolo editoriale).
2. **Fotografia**: hai altre foto di alta qualità da inserire? La pagina Approccio ha solo una foto; la Home ha il bisso. Più foto editoriali aumenterebbero il senso di lusso.
3. **Scope**: il piano copre tutte le 4 pagine + componenti globali. Se preferisci concentrarci solo sulla Home per primo, lo segnalo.
