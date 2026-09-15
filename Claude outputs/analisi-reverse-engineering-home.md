# Reverse engineering Home Karma — mio sito vs. riferimento editoriale

**Riferimento esterno analizzato:** file `Karma_Home.html` allegato — è l'export "Bundled Page" di un Artifact claude.ai, non un sito terzo. Contenuto: dominio `karmabc.it`, CTA "La prima conversazione con Karma dura 30 minuti... Mappa Karma" — è un'altra esplorazione di design per lo **stesso brief Karma** (probabilmente un round/sessione diversa, mai arrivata nella cronologia scritta in `prompt-demo-karma-tempesta.md`), non un sito di un concorrente esterno. Palette #002C3A/#C7A14A (diversa dai HEX reali di brand #0A2545/#C69A57 già estratti dal logo), font Instrument Serif (corsivo) + Manrope, 16 sezioni narrative.

**Mio sito analizzato:** `Home.jsx`/`Home.css`/`index.css` reali in `demo-karma-bold`, stato attuale dopo ~30 round di iterazione con la cliente (Francesca Tempesta) documentati in `prompt-demo-karma-tempesta.md`.

---

## 0. Perché questa analisi parte con una cautela

Prima dei confronti: il mio sito non è un progetto vergine da rifare da zero. È un cliente reale, con una storia di feedback molto specifici e già decisi — frasi "da proteggere" testuali, un rifiuto esplicito di diagrammi a nodi generici, un conflitto già gestito sul giallo (la cliente lo aveva scartato in una call, Gabry ha scelto consapevolmente di tenerlo), una geometria della spina esatta richiesta da uno schizzo a mano della cliente. Il prompt di reverse engineering è generico e non conosce questa storia. Ne tengo conto in ogni raccomandazione: dove il riferimento suggerisce qualcosa che la cliente ha già rifiutato in altra forma, lo segnalo come rischio, non lo propongo come miglioria.

---

## 1. Analisi del mio sito (Home attuale)

**Struttura:** mosaico d'ingresso a 7 riquadri scroll-linked (`ZoomParallaxIntro`, 300vh, scale 4×–9×, porting fedele di un componente di riferimento) → gold-break (ponte) → timeline a 3 tappe con spina dorata unica e continua (curva a bezier per aggirare la fascia Karma) → gold-break (ponte a Legalens) → CTA finale.

**Design:** navy #0A2545/oro #C69A57 reali (campionati dal logo), Plus Jakarta Sans (display+body) + Manrope (label), scala tipografica a 4 token espliciti, sistema `.card` unico, bottoni con 3 varianti coerenti, spacing a step (8→148px). Motion rigorosamente vincolato: solo `transform`/`opacity`, animazioni via `requestAnimationFrame` unificato per evitare disallineamenti, gating di visibilità (IntersectionObserver) per fermare i loop fuori schermo, `prefers-reduced-motion` rispettato ovunque.

**Punti di forza reali (non da toccare):**
- Palette e font sono i veri asset di brand, verificati per campionamento pixel — non un'approssimazione.
- Il sistema di card/bottoni è unificato e disciplinato (lezione imparata da round di correzioni).
- La spina che aggira la fascia Karma con una geometria calcolata a runtime (ResizeObserver) è una soluzione tecnica elegante e specificamente richiesta dalla cliente via schizzo — è un asset, non un compromesso.
- Motion performante: gating di visibilità, niente `transition: all`, unico rAF loop per evitare desync — livello di rigore superiore alla media.
- Il copy segue vincoli editoriali precisi (niente "non è X è Y", niente domande retoriche come CTA, frasi protette) — disciplina che il riferimento non ha.

**Punti debol/rischi (confermati dalla cronologia, non opinioni nuove):**
- Il sito ha oscillato per ~15 round tra "troppo simmetrico/centrato" e "rotto" prima di arrivare all'attuale timeline — è un impianto convergente ma probabilmente ancora fragile ad altre richieste di variazione.
- Un solo "momento wow" dichiarato (il mosaico) più le rivelazioni scroll-linked della timeline: la minuta cliente chiede *un solo* effetto wow — punto aperto già segnalato nei prossimi passi del progetto, non risolto da questa sessione.
- Nessuna sezione "prova sociale" (loghi clienti, risultati, team) — assente per scelta della cliente finora (rimandata), non un difetto di design.
- Le tre tappe della timeline sono cromaticamente quasi identiche (chiaro → navy pieno → chiaro): la variazione di intensità è minima rispetto al respiro cromatico del riferimento.

---

## 2. Analisi del riferimento

**Struttura (16 sezioni):** Hero → Le molte verità → Il contesto → Decidere è tenere insieme → La domanda → Entrare nella spirale → Ecologia della decisione → Il centro → Coerenza dinamica → Capacità decisionale → Accompagnamento → Le competenze → La scelta vive → Ciò che resta → Mappa Karma → Conosciamoci.

**Cosa rende il riferimento "premium" (i pattern, non il contenuto):**
- **Sfondo come narrazione continua**: i colori di sezione non cambiano a blocchi netti, ma con `linear-gradient` che passa da crema a teal-scuro *dentro* la stessa sezione (es. `#F7F5F0 0% → #F7F5F0 62% → #002C3A 100%`) — l'occhio non percepisce "sezioni", percepisce un unico gradiente di luce che scende. È l'esatto contrario del blocco a piena larghezza netto usato nel mio sito (gold-break, timeline__band) — non necessariamente migliore, ma un principio diverso e coerente.
- **Linee SVG come tessuto connettivo astratto**, non diagrammi: `data-anim="draw"`/`"weave"`, path bézier morbide senza nodi né etichette, che si disegnano lentamente o restano ferme come texture di sfondo (opacità 0.15–0.55). Non sono diagrammi "a nodi generici" (il cliché già rifiutato più volte in questo progetto) — sono linee decorative pure, senza pretesa di spiegare una struttura. Distinzione importante da preservare in qualsiasi ripresa: linee-come-texture sì, diagrammi-che-spiegano-relazioni no.
- **Motivo a spirale animato, quasi impercettibile**: rotazione 260–420 secondi per giro (praticamente ferma a occhio nudo, si nota solo come "presenza viva" ambientale) usata come sfondo ricorrente in Hero/Entrare nella spirale/Il centro/Conosciamoci — stesso principio dello zoom-parallax già nel mio sito (`data-anim="spiral" data-from/data-to`, sticky + scale scroll-linked), applicato però come motivo di marca ricorrente e a bassa intensità, non come mosaico a piena esplosione.
- **Instrument Serif (corsivo/maiuscolo) per i momenti emotivi**: usato con parsimonia, solo per 1 riga per sezione (mai per il body), sempre in contrasto con Manrope per il resto — crea un secondo registro tipografico riservato alle affermazioni-chiave.
- **Header a `mix-blend-mode: difference`**: nav sempre leggibile sopra qualsiasi sfondo senza bisogno di stati "scrolled/non scrolled" gestiti in JS.
- **Molte più tappe, ciascuna più breve**: 16 sezioni brevi vs. le mie 3 lunghe — il ritmo di lettura è più frequente ma ogni "colpo" è più piccolo.

**Cosa NON funziona / cosa evitare (onestà, non solo lode):**
- Diverse sezioni hanno template `{{ placeholder }}` non risolti (`{{ armsWide }}`, `{{ gold }}`, `{{ contextWords }}`) — è materiale di lavorazione, non un artefatto finito: da trattare come esplorazione di pattern, non come riferimento pixel-perfect.
- 16 sezioni per una pagina "biglietto da visita" sono probabilmente troppe per il brief reale di Karma (sito vetrina/corporate, non un microsite editoriale a tema) — il mio sito a 3 tappe è più adatto alla lunghezza che la cliente ha sempre chiesto ("meno cose, più importanti", "meno testo").
- L'header a `mix-blend-mode: difference` è elegante ma fragile su immagini/foto reali (può produrre colori imprevedibili) — da validare, non da copiare a scatola chiusa.

---

## 3. Mappa strutturale del copy di riferimento (funzione, non testo)

Solo per capire l'architettura narrativa — nessuna frase qui va riusata:

`Hero`: eyebrow ambientale (parole fluttuanti) → headline emotiva → nessuna CTA immediata (si scrolla).
`Le molte verità` → `Il contesto`: doppia apertura che mostra la complessità come fatto (non come problema da risolvere subito) prima di nominare Karma.
`Decidere è tenere insieme` → `La domanda`: frizione, una domanda-lente (stesso pattern già presente in "Ecologia della decisione" nel mio sito).
`Entrare nella spirale` → `Il centro`: climax visivo-verbale, una sola riga-manifesto per sezione, pinned scroll.
`Coerenza dinamica`: tre paragrafi progressivi (spiegazione → manifesto → chiosa in corsivo) — pattern "spiega, poi condensa in una riga, poi commenta" riutilizzabile.
`Capacità decisionale` → `Accompagnamento` → `Le competenze`: le competenze arrivano tarde e mostrate, non elencate — stesso principio già seguito nella tappa Karma del mio sito.
`La scelta vive` → `Ciò che resta`: chiusura del cerchio tematico prima della CTA.
`Mappa Karma` → `Conosciamoci`: CTA a basso impegno (30 minuti, gratuita) + nome prodotto della CTA stessa ("una prima Mappa Karma") — CTA con un nome proprio, non un verbo generico.

---

## 4. Matrice comparativa (sintesi)

| Categoria | Mio sito | Riferimento | Cosa adottare |
|---|---|---|---|
| Palette | HEX reali verificati, uso disciplinato | HEX di lavoro, diversi dal brand vero | Restano i miei HEX — non negoziabile, sono il brand reale |
| Tipografia | Plus Jakarta Sans + Manrope, scala a 4 token | + Instrument Serif corsivo per 1 riga/sezione | Valutare un **terzo registro corsivo/serif solo per le frasi protette e la domanda-lente**, non ovunque — già le uso in corsivo oro, manca solo il cambio di font |
| Transizioni tra sezioni | Blocchi netti (gold-break, timeline__band) | Gradiente continuo cross-sezione | Provare il gradiente **solo** nel passaggio più critico (entrata/uscita della fascia Karma), non su tutta la pagina — rischio di annacquare il "blocco deciso" che la cliente ha approvato |
| Elementi grafici astratti | Nessuno tranne mosaico e spina | Linee bézier come texture ambientale, spirale a rotazione lentissima | La spirale del logo già esiste come filigrana in altre pagine (Approccio/Contatti) — riportarla in Home come texture ambientale a bassissima opacità è coerente col brand, **non** un nuovo diagramma |
| Ritmo sezioni | 3 tappe lunghe + 2 ponti | 16 tappe brevi | Non replicare 16: il brief "biglietto da visita" e il feedback cliente vogliono meno testo, non di più. Eventualmente **spezzare le tappe più lunghe** (Karma ha 5 paragrafi) in 2 respiri via gradiente interno, senza aumentare il conteggio di sezioni |
| Motion performance | Rigoroso: rAF unico, gating IO, reduced-motion | Nessuna gestione di performance visibile (loop `infinite` senza gating) | Non prendere nulla qui — il mio sito è più maturo su questo fronte, il riferimento è materiale di design, non di engineering |
| CTA | 2 CTA standard + booking generico | CTA con nome proprio ("Mappa Karma"), tempo dichiarato (30 min), gratuità dichiarata | Idea di merito: dare un nome proprio all'esito della prima conversazione, e dichiarare tempo/costo — riduce l'attrito, coerente col tono diretto già richiesto dalla cliente |
| Header | Nav statica esistente | `mix-blend-mode:difference` | Non prioritario, rischio di rendering su foto reali — solo se emerge un problema di contrasto nav su sfondo variabile |

---

## 5. Cosa mantenere dal mio sito (non negoziabile)

Palette/font reali; sistema `.card`/`.btn` unico; disciplina motion (rAF unico, gating, reduced-motion); frasi protette invariate; geometria della spina che aggira Karma (richiesta esplicita via schizzo cliente); vincoli di copy (niente "non è X è Y", niente domande come CTA); niente diagrammi a nodi/etichette.

## 6. Cosa prendere dal riferimento (a basso rischio, coerente col brief)

1. **CTA finale con nome proprio + attrito dichiarato** ("30 minuti", "gratuita") — piccola riscrittura di copy, zero rischio strutturale, coerente col tono diretto della cliente.
2. **Spirale di brand come texture ambientale a bassissima opacità** in Home (già usata così in Approccio/Contatti) — non un nuovo elemento, un riuso più esteso di un asset già approvato.
3. **Un secondo registro tipografico corsivo/serif riservato alle frasi protette e alla domanda-lente** — oggi sono solo corsivo nello stesso font; un font serif diverso (es. un'italic serif discreta) le farebbe risaltare senza aggiungere elementi grafici nuovi. Da testare, reversibile in un round.
4. **Gradiente di colore nell'ingresso/uscita della fascia Karma** (invece del bordo netto attuale) — solo lì, per ammorbidire l'unico punto in cui il sito passa da chiaro a navy pieno e ritorno, senza toccare gold-break (che la cliente ha già visto e approvato in quella forma).

## 7. Cosa NON prendere (rischio concreto documentato)

- 16 sezioni / narrazione estesa — contraddice "meno testo, più spazio" già richiesto due volte.
- Qualsiasi diagramma a nodi/etichette — già rifiutato 3 volte in questo progetto specifico.
- Oro come sfondo estensivo di sezioni multiple — la cliente lo ha esplicitamente giudicato "azzardato e poco professionale" in call; Gabry ha scelto di tenerne *due* piccoli blocchi consapevolmente, non di espanderli.
- Mosaico a 7 immagini nell'ingresso — la minuta cliente chiede 3-4 immagini massimo, punto già aperto e non ancora risolto: andrebbe ridotto, non ispirato a fare altrettanto (il riferimento non ha nemmeno questo elemento, è un problema mio preesistente).

---

## Nota operativa

Questa è l'analisi (Fasi 0-7 del prompt). Le fasi 8-12 (implementazione, motion plan, responsive plan, loop di correzione) richiedono una decisione su **dove** applicare le 4 migliorie a basso rischio del punto 6: direttamente su `Home.jsx`/`Home.css` in produzione (il PC del cliente, via bridge — irreversibile senza un nuovo round di verifica cliente), oppure prima come bozza isolata da mostrare a Gabry, come già prassi stabilita in questo progetto per ogni cambiamento strutturale (vedi round "via i diagrammi a nodi" — bozze isolate prima di toccare il sito).
