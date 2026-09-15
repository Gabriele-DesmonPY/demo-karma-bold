# Karma — Nuova Home: architettura, copy e direzione visual

**Base:** brief strategico di Francesca (9 settembre 2026), tesi "Karma aiuta le imprese ad abitare la propria complessità".
**Obiettivo di questo documento:** proposta completa da validare (con Gabry e poi con Francesca) prima di riscrivere `Home.jsx`/`Home.css`. Non è ancora codice.

---

## 1. Cosa cambia rispetto alla Home attuale

La Home attuale (hero "Non ci fermiamo a dirti cosa fare" → "A chi parliamo" → "Posizionamento" → "Cosa facciamo" a 4 card → citazione cliente → CTA) resta valida come tono, ma è costruita sul vecchio posizionamento (orientamento + esecuzione, PMI, catalogo di 4 aree). Il nuovo brief chiede una tesi diversa e più specifica — l'interdipendenza tra le parti dell'impresa — e la vieta esplicitamente di essere raccontata come elenco di servizi. Serve quindi una nuova architettura, non un restyling della vecchia.

Tre vincoli del brief guidano ogni scelta sotto: **(a)** l'hero deve far riconoscere una dinamica reale prima di spiegare qualcosa, **(b)** il design deve mostrare relazioni e reti, mai silos o box isolati, **(c)** niente metafore tessili letterali (ago, filo, telaio) nonostante "trama/filo" restino lessico di sfondo.

## 2. Architettura (8 sezioni)

| # | Sezione | Intensità visiva | Funzione |
|---|---|---|---|
| 1 | Apertura | Alta (navy) | Riconoscimento di una dinamica reale |
| 2 | Il segnale | Bassa | Il problema visibile come indizio, non come tutta la storia |
| 3 | Abitare la complessità | Alta (oro) | La tesi, tradotta subito in azioni |
| 4 | Karmaround | Media/alta — momento visivo forte | Come Karma legge un progetto: rete, non checklist |
| 5 | Metodo | Bassa, pulita | Il percorso è ricorsivo, non lineare |
| 6 | Le capacità | Media | Le 4 aree, connesse tra loro |
| 7 | Il risultato che resta | Alta (navy-soft) | Cosa resta all'azienda dopo Karma |
| 8 | Ingresso nella relazione | Alta (navy) | CTA |

L'alternanza alto/basso resta quella già validata nel round di rifinitura di stamattina (mai due sezioni "wow" di fila, tranne le ultime due, che sono il crescendo verso la CTA — pattern già presente e approvato nella Home attuale).

## 3. Copy completo

### 1 — Apertura (hero)
Niente "complessità" qui: deve emergere una dinamica riconoscibile, non un concetto.

> Eyebrow: **Karma — Business Consulting**
>
> **Assumi una persona.**
> **Cambiano i carichi di un team.**
> **Apri un mercato.**
> **Cambiano i margini di un altro.**
>
> Ogni scelta, in azienda, si muove insieme alle altre.

CTA: un solo bottone primario — **Parliamone**. (Tolgo il secondo bottone "Il nostro approccio": in questa hero deve restare un solo invito, coerente con la gerarchia CTA già fissata nel round precedente.)

### 2 — Il segnale
> Eyebrow: **Il segnale**
>
> «**Il problema che vedi potrebbe non essere il vero problema.**»
>
> Una tensione in un reparto può nascere altrove. Un ritardo può essere l'effetto di una decisione presa mesi prima, in un'altra funzione. Prima di intervenire, Karma ricostruisce da dove viene ciò che si vede.

### 3 — Abitare la complessità
> Eyebrow: **Abitare la complessità**
>
> **Karma aiuta le imprese ad abitare la propria complessità.**
>
> Le parti di un'azienda, osservate da sole, raccontano solo frammenti. Il significato emerge nella relazione tra loro.
>
> Abitare la complessità significa vedere le connessioni, riconoscere ciò che conta, scegliere una direzione e trasformarla in qualcosa che l'organizzazione sia realmente in grado di sostenere.

### 4 — Karmaround
> Eyebrow: **Karmaround**
>
> **Karmaround è il modo in cui Karma abita la complessità dell'impresa.**
>
> Mercato, organizzazione, processi, persone, tecnologia, dati, responsabilità, fornitori, tempi, priorità e vincoli entrano nel lavoro quando incidono sul progetto — e si influenzano a vicenda. Non è un elenco fisso: è la mappa che cambia a ogni progetto.

*(Diagramma a rete — vedi §4)*

### 5 — Metodo
> Eyebrow: **Metodo**
>
> **Un percorso che si rilegge mentre avanza.**
>
> Leggere. Riconoscere ciò che conta. Scegliere. Costruire. Accompagnare. Osservare gli effetti. Adattare. Ogni fase resta in relazione con la vista d'insieme: l'esecuzione produce informazioni nuove, e la direzione si aggiorna quando serve.

### 6 — Le capacità che entrano nel progetto
> Eyebrow: **Le capacità**
>
> **Le competenze restano. Cambia da dove iniziamo.**
>
> Sviluppo e crescita, organizzazione e processi, project management, dati e privacy: le attiviamo in base a cosa serve al progetto, non come caselle da spuntare in un catalogo.

*(Le 4 aree in riga connessa, non 4 card isolate — vedi §4)*

### 7 — Il risultato che resta
> Eyebrow: **Il risultato**
>
> **Se dopo di noi il progetto cammina senza di noi, abbiamo lavorato bene.**
>
> Non lasciamo solo una decisione. Lasciamo un'azienda più capace di leggere, scegliere e governare quello che viene dopo.
>
> «*Finalmente qualcuno che prende in mano questa cosa insieme a me.*» *(citazione cliente, spostata qui dal centro pagina — funziona meglio come conferma finale che come interruzione a metà lettura)*

### 8 — Ingresso nella relazione (CTA)
> **Racconta a Karma cosa stai cercando di far funzionare.**
>
> [ Prenota una conversazione ]

## 4. Direzione visual

**Karmaround (sezione 4) — il momento forte della pagina.** Un diagramma a rete: nodi (mercato, organizzazione, persone, tecnologia, dati, tempi — 5-6 etichette, non tutte e 11 per leggibilità) collegati da linee sottili oro/navy che si disegnano una volta sola al passaggio in vista (reveal-on-scroll, non loop continuo — coerente con la regola "pochi effetti fatti bene" già applicata al resto del sito). È l'unico momento a "effetto wow" della pagina: tutte le altre sezioni restano tipografiche e pulite, per rispettare il ritmo alto/basso.

**Le capacità (sezione 6) — evoluzione del sistema card esistente, non sostituzione.** Le 4 card restano (stesso componente `.card` già unificato), ma disposte in riga con un piccolo connettore/etichetta tra una e l'altra (es. tra "Organizzazione e processi" e "Project management": *avanzamento, dipendenze*) invece che in griglia isolata con solo gap tra loro. Basta una linea sottile e un'etichetta di 2-3 parole: comunica la connessione senza diventare un secondo diagramma pesante.

**Metodo (sezione 5) — la spirale del logo torna con un significato, non come decorazione.** Il motivo a spirale (già nel marchio reale) accompagna qui i 6 verbi del metodo disposti in un percorso che si avvolge, non in fila dritta: il ciclo leggere→adattare è visivamente ricorsivo, non lineare. È un solo elemento piccolo, statico o con un accenno di movimento leggerissimo — non la spirale grande e ruotante già tolta nel round precedente.

**Il segnale (sezione 2) — riuso del trattamento "quote" già esistente** (virgolette dorate giganti dietro il testo, stile della citazione cliente attuale), spostato qui in apertura invece che a metà pagina.

**Nessuna iconografia di ago/filo/telaio**, nessuna fotografia di tessuti: "trama" e "filo" restano solo nel lessico dei paragrafi (comparse con misura, come nel copy sopra: "ricostruisce da dove viene", "resta in relazione"), mai come immagine letterale — rispetta il vincolo esplicito del brief.

## 5. Microcopy, transizioni, animazioni

- Hero: resta il pattern attuale (`TextReveal` riga per riga, `Reveal` per bottone) — funziona già bene, nessun cambio tecnico.
- Il segnale: reveal singolo del pull-quote, nessuna nuova libreria.
- Karmaround: linee del diagramma disegnate via CSS (`stroke-dashoffset` in transizione) triggerate da `IntersectionObserver`, stesso meccanismo di `Reveal` già in uso — zero dipendenze nuove.
- Metodo: nessuna animazione oltre al reveal standard; la spirale resta ferma o con un drift lentissimo indipendente dallo scroll (mai loop infinito vistoso, come da round precedente).
- CTA finale: invariata.

## 6. Motivazione sintetica delle scelte principali

- **L'hero non nomina "complessità"**: il brief chiede riconoscimento prima di spiegazione — una dinamica concreta (assunzione → carichi, mercato → margini) fa capire l'interdipendenza senza il concetto astratto.
- **Il quote "il problema che vedi..." apre la sezione 2, non sta più a metà pagina**: segue l'ordine cronologico corretto del brief — prima il sintomo visibile, poi la tesi (sezione 3).
- **Karmaround diventa l'unico momento "wow" visivo**: coerente con "pochi effetti fatti bene" del round di rifinitura di stamattina — non si aggiunge decorazione, si concentra l'unico effetto forte dove ha significato reale (mostrare la rete, non abbellire la pagina).
- **Le 4 aree diventano nodi connessi, non card isolate**: risponde alla richiesta esplicita del brief ("evitare box autosufficienti"), riusando il sistema `.card` già unificato — si evolve un componente esistente, non se ne inventa uno nuovo.
- **La spirale torna con un ruolo narrativo** (il metodo è ricorsivo) invece di restare solo un marchio decorativo — coerente con l'aver già tolto la spirale grande e animata come puro ornamento.
- **La citazione cliente si sposta vicino al risultato finale**: funziona meglio come conferma prima della CTA che come pausa a metà lettura.
- **Nessuna metafora tessile letterale**: rispetta il vincolo esplicito del brief pur mantenendo "trama/filo" nel lessico, con misura.

## 7. Prossimo passo

Questa è la proposta di direzione (architettura + copy + visual), non ancora implementata nel codice. Prima di riscrivere `Home.jsx`/`Home.css`:
1. Validare qui il copy e l'architettura (specialmente le due frasi nuove non "da proteggere": hero e sezione "Metodo").
2. Se confermato, procedo con l'implementazione reale nel sito.
