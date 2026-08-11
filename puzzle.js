var currentType = 'maze';
var rng;

function seededRandom(seed) {
  var s = seed;
  return function() {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function setType(t, btn) {
  currentType = t;
  var buttons = document.querySelectorAll('.btn-type');
  for (var i = 0; i < buttons.length; i++) buttons[i].classList.remove('active');
  btn.classList.add('active');
}

function generate() {
  var area = document.getElementById('puzzleArea');
  var diff = document.getElementById('difficulty').value;
  var nameVal = document.getElementById('nameInput').value.trim();
  var name = nameVal || '';
  rng = seededRandom(Date.now() % 999983);
  area.innerHTML = '';
  if      (currentType === 'maze')     generateMaze(area, diff, name);
  else if (currentType === 'words')    generateWordSearch(area, diff, name);
  else if (currentType === 'sudoku')   generateSudoku(area, diff, name);
  else if (currentType === 'color')    generateColor(area, diff, name);
  else if (currentType === 'count')    generateCount(area, diff, name);
  else if (currentType === 'sequence') generateSequence(area, diff, name);
  else if (currentType === 'path')     generatePath(area, diff, name);
  else if (currentType === 'cancel')   generateCancel(area, diff, name);
  else if (currentType === 'rule')     generateRule(area, diff, name);
  else if (currentType === 'sudokujunior') generateSudokuJunior(area, diff, name);
  else if (currentType === 'mirror') generateMirror(area, diff, name);
  else if (currentType === 'pairs') generateCoppie(area, diff, name);
  else if (currentType === 'oddone') generateIntruso(area, diff, name);
  else if (currentType === 'diff') generateDifferences(area, diff, name);
  else if (currentType === 'calc') generateCalcolo(area, diff, name);
  else if (currentType === 'tables') generateTabelline(area, diff, name);
  else if (currentType === 'anagram') generateAnagrammi(area, diff, name);
  else if (currentType === 'missingletter') generateLetteraMancante(area, diff, name);
  else if (currentType === 'pregraf') generatePregrafismo(area, diff, name);
  else if (currentType === 'picross') generatePicross(area, diff, name);
  else if (currentType === 'synant') generateSinonimiContrari(area, diff, name);
  else if (currentType === 'sentence') generateOrdinaFrase(area, diff, name);
  else if (currentType === 'vocaben') generateVocabolarioEN(area, diff, name);
  else if (currentType === 'anagramen') generateAnagrammiEN(area, diff, name);
  else if (currentType === 'missingletteren') generateLetteraMancanteEN(area, diff, name);
  else if (currentType === 'frasien') generateFrasiITEN(area, diff, name);
  else if (currentType === 'numseq') generateSequenzeNumeriche(area, diff, name);
  else if (currentType === 'flags') generateBandiereCapitali(area, diff, name);
  else if (currentType === 'emotion') generateRiconosciEmozione(area, diff, name);
  else if (currentType === 'timeline') generateLineaDelTempo(area, diff, name);
  else if (currentType === 'followinstr') generateSegueIstruzioni(area, diff, name);
}

function makeCard(title, subtitle, name) {
  var card = document.createElement('div');
  card.className = 'puzzle-card';
  var nameHtml = name ? '<div class="puzzle-name">Puzzle per ' + name + '</div>' : '';
  card.innerHTML =
    '<div class="puzzle-title">' + title + '</div>' +
    '<div class="puzzle-subtitle">' + subtitle + '</div>' +
    nameHtml;
  return card;
}

var parentGuides = {
  maze: 'Il labirinto allena la pianificazione visiva, la perseveranza e il controllo dell\'impulsività. Suggerite al bambino di "guardare tutto" prima di iniziare. Se si blocca: "Prova a tornare indietro". Per bambini con ADHD lavorate su un labirinto alla volta e celebrate ogni vicolo cieco come esperienza di apprendimento.',
  words: 'Il cerca parole allena la discriminazione visiva e la concentrazione selettiva. Suggerite di cercare una parola alla volta, scandendo le lettere ad alta voce. Per bambini con DSA potete coprire parte della griglia con un foglio bianco per ridurre il carico visivo.',
  sudoku: 'Il sudoku sviluppa ragionamento logico e memoria di lavoro. Partite dai quadrati con più numeri già inseriti. Rassicurate il bambino: non ci sono calcoli, solo logica.',
  color: 'Colorare liberamente stimola creatività, concentrazione e motricità fine. Lasciate il bambino libero di scegliere i colori senza correggerlo. Usate la pagina come spunto: "Cosa sta facendo il dinosauro?" aiuta a sviluppare il linguaggio e la narrazione.',
  count: 'Questa scheda allena l\'attenzione sostenuta e la discriminazione visiva: il bambino deve scandire l\'intera griglia senza saltare celle. Suggerite di procedere riga per riga, magari usando un dito o una matita come guida, invece di "cercare a occhio" in modo disordinato. Per bambini con ADHD è utile far segnare ogni simbolo trovato con un puntino leggero, così il conteggio resta tracciabile anche se l\'attenzione si interrompe.',
  sequence: 'Questa scheda allena la memoria di lavoro visiva, cioè la capacità di trattenere un\'informazione per il tempo necessario a riutilizzarla. Lasciate che il bambino osservi la prima pagina per un tempo libero (non cronometrato la prima volta), poi giri pagina da solo. Se sbaglia l\'ordine non è un errore da correggere subito: chiedete "quale ricordi per primo?" per allenare la strategia, non solo il risultato.',
  path: 'Questa scheda allena la pianificazione motoria e lo scanning visivo guidato da una regola. È importante che il bambino comprenda la regola PRIMA di iniziare a tracciare: fatevela ripetere a voce con parole sue. Per bambini con difficoltà di pianificazione, permettete di seguire il percorso con il dito prima di tracciarlo con la matita.',
  cancel: 'Questa scheda allena l\'attenzione selettiva e il controllo inibitorio: il bambino deve ignorare tutti gli elementi che assomigliano al bersaglio ma non lo sono del tutto (stessa forma ma colore diverso, o viceversa). Fatevi ripetere la regola a voce prima di iniziare, per essere sicuri l\'abbia capita. Per bambini con ADHD è utile far segnare con una matita leggera ogni elemento appena trovato, così il conteggio resta tracciabile anche se l\'attenzione si interrompe. Nella variante "cerchia tutto tranne..." si allena anche l\'inibizione di una risposta automatica.',
  rule: 'Questa scheda allena il ragionamento induttivo: il bambino deve scoprire da solo la logica nascosta in una sequenza, senza che gliela spieghiate prima. Lasciatelo formulare un\'ipotesi ad alta voce ("secondo me viene dopo...") prima di guardare le opzioni. Se sbaglia, non correggete subito: chiedete "cosa ti ha fatto pensare a quella risposta?" per allenare la strategia di ragionamento, non solo il risultato finale.',
  sudokujunior: 'Questa versione a simboli allena la stessa logica del sudoku classico (ogni elemento una sola volta per riga, colonna e riquadro) ma senza bisogno di saper contare fino a 9: perfetta come primo approccio al ragionamento logico-spaziale. Fate nominare ad alta voce gli animali già presenti in ogni riga/colonna prima di provare a riempire una casella vuota, così il bambino impara a "scandire" sistematicamente invece di tentare a caso.',
  mirror: 'Questa scheda allena la percezione spaziale e la pianificazione visiva: il bambino deve capire come si "rovescia" un disegno rispetto a una linea, non semplicemente copiarlo. Fategli nominare ad alta voce la posizione di ogni elemento ("in alto a sinistra c\'è un quadrato rosso") prima di disegnarne il riflesso: aiuta a trasformare un compito visivo in uno verbale, più facile da autocontrollare per il bambino stesso.',
  pairs: 'Questa scheda allena la memoria visiva a breve termine e la scansione sistematica della griglia: il bambino deve tenere a mente dove ha già visto un simbolo mentre continua a cercare. Suggerite di procedere riga per riga invece che a salti casuali, e di segnare leggermente ogni simbolo trovato per non doverlo ricontrollare più volte.',
  oddone: 'Questa scheda allena la categorizzazione e il ragionamento per esclusione: il bambino deve prima capire cosa hanno in comune gli elementi del gruppo, poi trovare quello che non rispetta la regola. Per le fasce più piccole la categoria è indicata esplicitamente come aiuto; per le fasce più grandi va scoperta da soli, il che rende l\'esercizio più impegnativo di quanto sembri a prima vista.',
  diff: 'Questa scheda allena l\'attenzione selettiva e il confronto visivo sistematico: il bambino deve scandire i due riquadri in parallelo invece di guardarli separatamente. Suggerite di confrontare una riga alla volta tra i due disegni, invece di cercare "a occhio" su tutta la griglia in una volta.',
  calc: 'Questa scheda allena l\'automatismo di calcolo, utile sia a scuola sia nella vita quotidiana. Non serve cronometrare, specialmente le prime volte: l\'obiettivo è la correttezza, la velocità arriva con la pratica. Per le operazioni in colonna, ricordate al bambino di allineare bene le cifre per unità/decine/centinaia prima di sommare o sottrarre — è spesso la causa principale degli errori, non il calcolo in sé.',
  tables: 'Questa scheda allena la memoria a lungo termine dei fatti numerici (le tabelline), non il ragionamento: l\'obiettivo è il richiamo automatico, non il "ricalcolo" ogni volta. Le tabelline sono mescolate tra loro apposta, non una alla volta in ordine: così il bambino richiama ogni fatto singolarmente invece di sfruttare la sequenza per indovinare il successivo. Se il bambino conta ancora sulle dita o si aiuta con le addizioni ripetute, va benissimo così nelle prime fasi — è un passaggio naturale prima della memorizzazione vera.',
  anagram: 'Questa scheda allena la consapevolezza fonologica e ortografica: il bambino deve riconoscere una parola indipendentemente dall\'ordine delle lettere, il che rinforza la sua rappresentazione mentale della parola stessa. Suggerite di leggere le lettere ad alta voce una alla volta prima di provare a ricomporle, e di partire dalle lettere che "sembrano familiari" insieme (es. sillabe comuni). Per le fasce più piccole l\'iniziale della parola è indicata come aiuto: se il bambino la ignora e prova comunque a indovinare a caso, è utile fargliela notare esplicitamente.',
  missingletter: 'Questa scheda allena la memoria ortografica: il bambino deve richiamare come si scrive una parola, non solo riconoscerla. È un compito diverso e più impegnativo del semplice leggere. Se il bambino resta bloccato, fatelo pronunciare la parola intera ad alta voce, sillaba per sillaba: spesso il suono suggerisce la lettera mancante meglio di quanto non faccia guardare lo spazio vuoto sulla carta.',
  pregraf: 'Questa scheda allena la motricità fine e la coordinazione occhio-mano, le abilità di base che preparano alla scrittura vera e propria: il bambino ripassa con la matita linee, onde, cerchi e spirali tratteggiate. È pensata specificamente per la fascia 3-5 anni, quindi ignora volutamente la selezione dell\'età. Lasciate che tenga la matita con la presa più naturale per lui in questa fase, senza correggerlo troppo presto: conta il movimento fluido del polso, non la precisione millimetrica. Uscire dalla linea tratteggiata è normalissimo a questa età, non è un errore da segnalare.',
  picross: 'Questa scheda introduce la logica a griglia: i numeri accanto a ogni riga e colonna indicano quante celle consecutive vanno colorate, e in quanti gruppi. Se una riga ha scritto "3 2" significa un blocco di 3 celle colorate, poi almeno una casella vuota, poi un blocco di 2. Colorando le celle giuste emerge un disegno a sorpresa! È logica deduttiva più impegnativa del solito: aiutate il bambino a partire dalle righe o colonne con i numeri più alti (spesso si deducono quasi subito) e a procedere per esclusione. Ogni scheda è verificata al computer prima di essere generata, per garantire che si risolva sempre con la sola logica, senza bisogno di indovinare.',
  synant: 'Questa scheda allena il vocabolario collegando ogni parola al suo sinonimo (stesso significato) o contrario (significato opposto) — la scheda sceglie a caso quale delle due relazioni proporre, quindi controllate il sottotitolo prima di iniziare. Il bambino deve tracciare una linea tra la parola a sinistra e la risposta corretta a destra, che sono mescolate apposta. Se una parola non è familiare, è un\'ottima occasione per parlarne insieme: chiedete al bambino di provare a indovinare dal contesto o dal suono della parola prima di darvi la risposta.',
  sentence: 'Questa scheda allena la sintassi: il bambino deve riordinare parole mescolate per formare una frase di senso compiuto, poi riscriverla sulla riga. Suggerite di leggere le parole ad alta voce in ordini diversi finché "non suona giusto" — l\'orecchio spesso riconosce l\'ordine corretto prima della logica esplicita. La lettera maiuscola indica sempre quale parola apre la frase, e il punto finale indica quale la chiude: sono indizi validi, non un imbroglio, fatene usare consapevolmente il bambino.',
  vocaben: 'Prima scheda di inglese dell\'app: il bambino collega ogni parola italiana (con la sua emoji) alla traduzione inglese corretta. Leggete le parole inglesi ad alta voce insieme a lui: la pronuncia inglese spesso non corrisponde a come la parola è scritta, quindi sentirla è importante quanto vederla scritta. Per le fasce più grandi alcune emoji rappresentano concetti astratti (es. 🕊️ per "libertà") in modo simbolico, non letterale — è un\'occasione per parlare del significato della parola insieme, non solo per tradurla meccanicamente.',
  anagramen: 'Come Anagrammi in italiano, ma con parole inglesi: il bambino riordina le lettere mescolate per ricostruire la parola. La traduzione italiana è sempre mostrata come aiuto, perché senza sapere quale parola si sta cercando indovinare l\'ordine delle lettere in una lingua straniera è quasi impossibile. Fate provare il bambino a pronunciare la parola inglese una volta ricostruita: la scrittura e la pronuncia inglese spesso non coincidono, ed è un\'occasione in più per allenare l\'orecchio.',
  missingletteren: 'Come Lettera mancante in italiano, ma con parole inglesi: il bambino completa le lettere mancanti mantenendo l\'ordine corretto. La traduzione italiana è sempre mostrata, perché il richiamo ortografico in una lingua straniera richiede un aggancio al significato — a differenza dell\'italiano, dove il bambino può spesso affidarsi al suono della parola.',
  frasien: 'Questa scheda allena la traduzione in contesto: il bambino legge la frase in italiano, poi sceglie dalla banca di 3 parole quella inglese giusta per completare la frase corrispondente. A differenza del semplice abbinamento parola-parola, qui la parola va capita all\'interno di una frase intera — un passo più vicino all\'uso reale della lingua. Se il bambino esita tra due opzioni plausibili, fatelo tradurre l\'intera frase italiana ad alta voce prima di scegliere: spesso il significato della frase intera scioglie il dubbio.',
  numseq: 'Questa scheda allena il ragionamento matematico, non il calcolo puro: il bambino deve scoprire la regola nascosta di ogni sequenza (aggiungere sempre lo stesso numero, moltiplicare, alternare...) prima di poter completare i numeri mancanti. Se si blocca, fatelo concentrare sulla differenza tra una coppia di numeri consecutivi già visibili invece che sull\'intera sequenza tutta insieme: spesso basta isolare "quanto cambia da un numero al successivo" per sbloccare il resto.',
  flags: 'Questa scheda allena la geografia in modo ludico. Per i più piccoli l\'esercizio collega la bandiera al nome del paese; dai 6 anni in su collega invece il paese alla sua capitale, un concetto più astratto. Un mappamondo o un planisfero accanto al bambino, anche solo su uno schermo, rende l\'esercizio molto più concreto: vedere dove si trova un paese aiuta a memorizzarne il nome più di quanto non faccia la sola associazione testuale.',
  emotion: 'Questa scheda allena il vocabolario delle emozioni, una base importante dell\'intelligenza emotiva: il bambino deve riconoscere quale faccina esprime l\'emozione indicata tra alcune opzioni simili. Fatelo provare a imitare lui stesso l\'espressione richiesta davanti a uno specchio prima di cerchiare la risposta: il rinforzo fisico/kinestetico aiuta a fissare il legame tra la parola e il vissuto emotivo, non solo tra la parola e l\'immagine.',
  timeline: 'Questa scheda allena il ragionamento sequenziale e causale: il bambino deve riordinare delle tappe mescolate scrivendo il numero corretto sotto ciascuna. Per le fasce più piccole sono cicli naturali concreti (la crescita di una farfalla, le stagioni); per quelle più grandi sono processi storici o tecnologici. Se il bambino fatica, fatelo partire dagli estremi che riconosce con più sicurezza (il primo e l\'ultimo passo) e poi riempire il centro, invece di procedere rigidamente da sinistra a destra.',
  followinstr: 'Questa scheda introduce il pensiero computazionale in modo giocoso: il bambino deve eseguire una sequenza di comandi direzionali (su, giù, sinistra, destra) partendo dal pallino verde, disegnando il percorso passo per passo sulla griglia. È essenzialmente programmazione "a mano": ogni comando va eseguito nell\'ordine esatto, uno alla volta, senza saltarne o anticiparne nessuno. Se il bambino sbaglia strada, fatelo ripartire dall\'ultimo comando eseguito correttamente invece che dall\'inizio: aiuta a isolare dove si è verificato l\'errore.'
};

function showGuide(type) {
  var existing = document.getElementById('parentGuide');
  if (existing) { existing.remove(); return; }
  var text = parentGuides[type];
  if (!text) return;
  var div = document.createElement('div');
  div.id = 'parentGuide';
  div.className = 'parent-guide';
  div.innerHTML = '<div class="guide-text">' + text + '</div><button class="guide-close" onclick="document.getElementById(\'parentGuide\').remove()">Chiudi</button>';
  var area = document.getElementById('puzzleArea');
  area.insertBefore(div, area.firstChild);
}

function addGuideBtn(card, type) {
  var gb = document.createElement('button');
  gb.className = 'guide-btn';
  gb.textContent = 'Guida per genitori';
  gb.onclick = function() { showGuide(type); };
  card.appendChild(gb);
}

/* ==================== ADATTAMENTO A PIENA PAGINA IN STAMPA ====================
   Ogni generatore avvolge il proprio contenuto "visivo" principale (canvas,
   griglia, immagine...) in una coppia .print-scale-content > .print-scale-inner.
   Al momento della stampa calcoliamo lo spazio disponibile e ingrandiamo il
   contenuto con transform:scale() cosi' che riempia l'intero foglio A4,
   invece di lasciare grandi zone bianche. Dopo la stampa il fattore viene
   azzerato per non alterare la vista a schermo. */
function makePrintWrap() {
  var outer = document.createElement('div');
  outer.className = 'print-scale-content';
  var inner = document.createElement('div');
  inner.className = 'print-scale-inner';
  outer.appendChild(inner);
  return { outer: outer, inner: inner };
}

function fitPrintScale() {
  var wraps = document.querySelectorAll('.print-scale-content');
  for (var i = 0; i < wraps.length; i++) {
    var outer = wraps[i];
    var inner = outer.querySelector('.print-scale-inner');
    if (!inner) continue;
    inner.style.transform = 'none';
    var ow = outer.clientWidth, oh = outer.clientHeight;
    var iw = inner.scrollWidth, ih = inner.scrollHeight;
    if (ow <= 0 || oh <= 0 || iw <= 0 || ih <= 0) continue;
    var scale = Math.min(ow / iw, oh / ih);
    if (scale > 5) scale = 5;
    if (scale < 0.1) scale = 0.1;
    inner.style.transform = 'scale(' + scale + ')';
  }
}

function resetPrintScale() {
  var inners = document.querySelectorAll('.print-scale-inner');
  for (var i = 0; i < inners.length; i++) inners[i].style.transform = 'none';
}

window.onbeforeprint = fitPrintScale;
window.onafterprint = resetPrintScale;

/* ==================== LABIRINTO ==================== */
function generateMaze(area, diff, name) {
  var sizes = { explorer:9, curious:13, growing:17, challenge:23 };
  var size = sizes[diff] || 13;
  var cellSize = Math.min(26, Math.floor(520 / size));
  var w = size, h = size;
  var N=1,S=2,E=4,W=8;
  var opp={}; opp[N]=S;opp[S]=N;opp[E]=W;opp[W]=E;
  var dx={}; dx[N]=0;dx[S]=0;dx[E]=1;dx[W]=-1;
  var dy={}; dy[N]=-1;dy[S]=1;dy[E]=0;dy[W]=0;
  var grid=[],visited=[],r,c;
  for(r=0;r<h;r++){grid.push([]);visited.push([]);for(c=0;c<w;c++){grid[r].push(15);visited[r].push(false);}}
  function carve(x,y){
    visited[y][x]=true;
    var dirs=[N,S,E,W];dirs.sort(function(){return rng()-0.5;});
    for(var i=0;i<dirs.length;i++){var d=dirs[i],nx=x+dx[d],ny=y+dy[d];if(nx>=0&&nx<w&&ny>=0&&ny<h&&!visited[ny][nx]){grid[y][x]&=~d;grid[ny][nx]&=~opp[d];carve(nx,ny);}}
  }

  /* NUOVO: entrata/uscita su angoli randomizzati (4 combinazioni possibili)
     invece di sempre alto-sinistra -> basso-destra. Seconda fonte di
     variabilita' richiesta dalla Regola di Randomizzazione. */
  var cornerDefs = {
    TL: { x:0,   y:0,   side:'left'   },
    TR: { x:w-1, y:0,   side:'top'    },
    BL: { x:0,   y:h-1, side:'bottom' },
    BR: { x:w-1, y:h-1, side:'right'  }
  };
  var diagonals = [ ['TL','BR'], ['TR','BL'] ];
  var pair = diagonals[Math.floor(rng()*2)];
  if (rng() < 0.5) { pair = [pair[1], pair[0]]; }
  var startC = cornerDefs[pair[0]];
  var endC   = cornerDefs[pair[1]];

  carve(startC.x, startC.y);

  var pad=10;
  var cvs=document.createElement('canvas');
  cvs.width=w*cellSize+pad*2; cvs.height=h*cellSize+pad*2;
  var ctx=cvs.getContext('2d');
  ctx.fillStyle='#fafaf7';ctx.fillRect(0,0,cvs.width,cvs.height);
  ctx.strokeStyle='#2d2416';ctx.lineWidth=2;ctx.lineCap='square';
  var x,y,px,py;
  for(y=0;y<h;y++) for(x=0;x<w;x++){
    px=x*cellSize+pad;py=y*cellSize+pad;
    if(grid[y][x]&N){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+cellSize,py);ctx.stroke();}
    if(grid[y][x]&W){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,py+cellSize);ctx.stroke();}
    if(x===w-1){ctx.beginPath();ctx.moveTo(px+cellSize,py);ctx.lineTo(px+cellSize,py+cellSize);ctx.stroke();}
    if(y===h-1){ctx.beginPath();ctx.moveTo(px,py+cellSize);ctx.lineTo(px+cellSize,py+cellSize);ctx.stroke();}
  }

  function clearOpening(cnr) {
    var opx = cnr.x*cellSize+pad, opy = cnr.y*cellSize+pad;
    if (cnr.side==='left')   ctx.clearRect(opx, opy, 2, cellSize);
    else if (cnr.side==='right')  ctx.clearRect(opx+cellSize-2, opy, 2, cellSize);
    else if (cnr.side==='top')    ctx.clearRect(opx, opy, cellSize, 2);
    else if (cnr.side==='bottom') ctx.clearRect(opx, opy+cellSize-2, cellSize, 2);
  }
  clearOpening(startC);
  clearOpening(endC);

  var sLabelX = startC.x*cellSize+pad+1, sLabelY = startC.y*cellSize+pad+cellSize-4;
  var eLabelX = endC.x*cellSize+pad+1,   eLabelY = endC.y*cellSize+pad+cellSize-4;
  ctx.fillStyle='#4caf7d';ctx.font='bold 11px sans-serif';ctx.fillText('GO',sLabelX,sLabelY);
  ctx.fillStyle='#e04f4f';ctx.fillText('OK',eLabelX,eLabelY);

  var card=makeCard('Labirinto',"Trova la via d'uscita! (GO = inizio, OK = fine)",name);
  var wrap=makePrintWrap(); wrap.inner.appendChild(cvs); card.appendChild(wrap.outer);
  addGuideBtn(card,'maze');area.appendChild(card);
}

/* ==================== CERCA PAROLE ==================== */
/* Vocabolario condiviso: usato sia da generateWordSearch sia da
   generateAnagrammi. Se si aggiungono/tolgono parole, verificare che
   generateAnagrammi abbia ancora abbastanza parole entro i suoi limiti
   di lunghezza per ogni fascia (vedi il generatore per i dettagli). */
var WORD_VOCAB = {
  explorer:['CANE','GATTO','SOLE','LUNA','MARE','FIORE','RANA','PANE','MELA','PERA','UOVO','LUCE','NASO','MANO','CASA','PORTA','LAGO','PINO','ROSA','ORSO','LUPO','ANATRA','TOPO','GALLO','CAPRA','DADO','PALLA','LETTO','FICO','UVA','RISO','ARCO','VASO','SEDIA','KIWI','ORCA','VOLPE','LEPRE','AQUILA','CIGNO'],
  curious:['FARFALLA','CONIGLIO','CASTELLO','GIRAFFA','ELEFANTE','TARTARUGA','DELFINO','PINGUINO','COCCODRILLO','PAPPAGALLO','LEONESSA','SERPENTE','PANTERA','GORILLA','GHEPARDO','STRUZZO','PAVONE','GABBIANO','RONDINE','PICCHIO','LONTRA','CASTORO','FRAGOLA','LAMPONE','MIRTILLO','ANANAS','MELONE','ARANCIA','LIMONE','AVOCADO','MONTAGNA','VULCANO','FORESTA','PORCOSPINO','PROCIONE','PIRANHA','ARAGOSTA','GRANCHIO','MEDUSA','CAPIBARA'],
  growing:['TIRANNOSAURO','PTERODATTILO','TRICERATOPO','STEGOSAURO','VELOCIRAPTOR','DIPLODOCO','MEGALODONTE','CHIMPANZE','ORANGUTAN','MANDRILLO','CAMOSCIO','STAMBECCO','CARIBU','BISONTE','ANACONDA','PITONE','MAMBA','COBRA','CONDOR','FENICOTTERO','TUCANO','PLATESSA','SALMONE','STORIONE','CARAPACE','TENTACOLO','CLOROFILLA','ASTEROIDE','COSTELLAZIONE','GALASSIA','NEBULOSA','SUPERNOVA','PRISMA','TELESCOPIO','MICROSCOPIO','CIOCCOLATO','MARMELLATA','PASTICCERIA','GELATERIA','ORCHESTRA'],
  challenge:['BIOLUMINESCENZA','FOTOSINTESI','METAMORFOSI','IBERNAZIONE','MIMETISMO','ECOSISTEMA','BIODIVERSITA','VULCANOLOGIA','PALEONTOLOGIA','ENTOMOLOGIA','NEUROSCIENZE','CRITTOGRAFIA','ALGORITMO','INTELLIGENZA','TERMODINAMICA','NANOTECNOLOGIA','BIOTECNOLOGIA','ARCHEOLOGIA','COSMOLOGIA','ASTROFISICA','BIOINFORMATICA','IMMUNOLOGIA','MICROBIOLOGIA','GEOMORFOLOGIA','CLIMATOLOGIA','OCEANOGRAFIA','SISMOLOGIA','GLACIOLOGIA','FITOCHIMICA','ZOOPLANCTON','CLOROFILLA','MITOCONDRIO','CROMOSOMA','RIBOSOMA','PROTEINA','ENZIMA','CATALIZZATORE','POLIMERO','ELETTROLITA','CRISTALLOGRAFIA']
};

function generateWordSearch(area, diff, name) {
  var pool=(WORD_VOCAB[diff]||WORD_VOCAB['curious']).slice().sort(function(){return rng()-0.5;});
  var maxLen=diff==='explorer'?5:diff==='curious'?9:diff==='growing'?13:18;
  var minLen=diff==='explorer'?3:diff==='curious'?5:diff==='growing'?7:9;
  var selected=[];
  for(var pi=0;pi<pool.length&&selected.length<8;pi++){if(pool[pi].length>=minLen&&pool[pi].length<=maxLen)selected.push(pool[pi]);}
  if(selected.length<6)selected=pool.slice(0,6);
  var allWords=selected.slice(0,6);
  var gridSize=diff==='explorer'?10:diff==='curious'?13:diff==='growing'?16:20;
  var LETTERS='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var grid=[],r,c;
  for(r=0;r<gridSize;r++){grid.push([]);for(c=0;c<gridSize;c++)grid[r].push('');}
  function placeWord(word){
    var dirs=[{dx:1,dy:0},{dx:0,dy:1},{dx:1,dy:1},{dx:-1,dy:1}];
    var dir=dirs[Math.floor(rng()*dirs.length)];
    for(var attempt=0;attempt<300;attempt++){
      var sx=Math.floor(rng()*gridSize),sy=Math.floor(rng()*gridSize),ok=true,cells=[],i,nx,ny;
      for(i=0;i<word.length;i++){nx=sx+dir.dx*i;ny=sy+dir.dy*i;if(nx<0||nx>=gridSize||ny<0||ny>=gridSize){ok=false;break;}if(grid[ny][nx]!==''&&grid[ny][nx]!==word[i]){ok=false;break;}cells.push({x:nx,y:ny});}
      if(ok){for(var j=0;j<cells.length;j++)grid[cells[j].y][cells[j].x]=word[j];return;}
    }
  }
  var wi;
  for(wi=0;wi<allWords.length;wi++)placeWord(allWords[wi]);
  for(r=0;r<gridSize;r++)for(c=0;c<gridSize;c++)if(grid[r][c]==='')grid[r][c]=LETTERS[Math.floor(rng()*26)];
  var container=document.createElement('div');container.className='word-grid';
  var gy,gx,row,cell;
  for(gy=0;gy<gridSize;gy++){
    row=document.createElement('div');row.className='word-grid-row';
    for(gx=0;gx<gridSize;gx++){cell=document.createElement('div');cell.className='word-cell';cell.textContent=grid[gy][gx];row.appendChild(cell);}
    container.appendChild(row);
  }
  var wordListDiv=document.createElement('div');wordListDiv.className='wordlist';
  for(wi=0;wi<allWords.length;wi++){var chip=document.createElement('span');chip.className='word-chip';chip.textContent=allWords[wi];wordListDiv.appendChild(chip);}
  var card=makeCard('Cerca le parole','Trova tutte le parole elencate qui sotto nella griglia!',name);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);
  card.appendChild(wordListDiv);addGuideBtn(card,'words');area.appendChild(card);
}

/* ==================== SUDOKU — motore vero (backtracking) ====================
   Sostituisce il precedente "shuffle di UNA griglia base" (segnalato non
   conforme alla Regola di Randomizzazione). Ora la griglia risolta viene
   generata da zero ad ogni chiamata con backtracking randomizzato, e le
   celle vengono rimosse una a una SOLO se il puzzle risultante mantiene
   una soluzione UNICA (verificata con un secondo backtracking che conta
   le soluzioni e si ferma appena ne trova 2, per restare veloce).
   Generalizzato su N (dimensione griglia) e br/bc (righe/colonne del
   riquadro, con br*bc=N) cosi' lo stesso motore serve sia il Sudoku
   classico 9x9 (br=3,bc=3) sia il Sudoku Junior a griglie piu' piccole
   (4x4 br=2,bc=2 — 6x6 br=2,bc=3). */
function sudokuIsValid(board, r, c, val, N, br, bc) {
  var i, j, boxR, boxC;
  for (i=0;i<N;i++) { if (board[r][i]===val) return false; if (board[i][c]===val) return false; }
  boxR = Math.floor(r/br)*br; boxC = Math.floor(c/bc)*bc;
  for (i=0;i<br;i++) for (j=0;j<bc;j++) if (board[boxR+i][boxC+j]===val) return false;
  return true;
}

function sudokuFindEmpty(board, N) {
  for (var r=0;r<N;r++) for (var c=0;c<N;c++) if (board[r][c]===0) return [r,c];
  return null;
}

function sudokuGenerateFull(N, br, bc) {
  var board=[], r, c;
  for (r=0;r<N;r++){ var row=[]; for (c=0;c<N;c++) row.push(0); board.push(row); }
  function fill() {
    var empty = sudokuFindEmpty(board, N);
    if (!empty) return true;
    var er=empty[0], ec=empty[1];
    var nums=[]; for (var n=1;n<=N;n++) nums.push(n);
    nums.sort(function(){ return rng()-0.5; });
    for (var i=0;i<nums.length;i++) {
      var val=nums[i];
      if (sudokuIsValid(board, er, ec, val, N, br, bc)) {
        board[er][ec]=val;
        if (fill()) return true;
        board[er][ec]=0;
      }
    }
    return false;
  }
  fill();
  return board;
}

function sudokuCountSolutions(board, limit, N, br, bc) {
  var count=0;
  function solve() {
    if (count>=limit) return;
    var empty = sudokuFindEmpty(board, N);
    if (!empty) { count++; return; }
    var r=empty[0], c=empty[1];
    for (var val=1; val<=N; val++) {
      if (count>=limit) return;
      if (sudokuIsValid(board, r, c, val, N, br, bc)) {
        board[r][c]=val;
        solve();
        board[r][c]=0;
      }
    }
  }
  solve();
  return count;
}

function generateSudoku(area, diff, name) {
  var N=9, br=3, bc=3;
  var solved = sudokuGenerateFull(N, br, bc);
  var removeTarget = diff==='explorer'?25:diff==='curious'?35:diff==='growing'?45:52;

  var puzzle=[], r, c;
  for (r=0;r<N;r++) puzzle.push(solved[r].slice());

  var positions=[];
  for (r=0;r<N;r++) for (c=0;c<N;c++) positions.push([r,c]);
  positions.sort(function(){ return rng()-0.5; });

  var removed=0, pi;
  for (pi=0; pi<positions.length && removed<removeTarget; pi++) {
    var pr=positions[pi][0], pc=positions[pi][1];
    var backup = puzzle[pr][pc];
    if (backup===0) continue;
    puzzle[pr][pc]=0;
    var testBoard=[];
    for (r=0;r<N;r++) testBoard.push(puzzle[r].slice());
    var solCount = sudokuCountSolutions(testBoard, 2, N, br, bc);
    if (solCount===1) { removed++; }
    else { puzzle[pr][pc]=backup; }
  }

  var container=document.createElement('div');container.className='sudoku-grid';
  var cell;
  for(r=0;r<N;r++)for(c=0;c<N;c++){
    cell=document.createElement('div');cell.className='sudoku-cell'+(puzzle[r][c]!==0?' given':'');
    if((c+1)%bc===0&&c<N-1)cell.classList.add('box-right');
    if((r+1)%br===0&&r<N-1)cell.classList.add('box-bottom');
    if(puzzle[r][c]!==0)cell.textContent=puzzle[r][c];
    container.appendChild(cell);
  }
  var card=makeCard('Sudoku','Ogni numero da 1 a 9 deve comparire una sola volta per riga, colonna e quadrato 3x3.',name);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);
  addGuideBtn(card,'sudoku');area.appendChild(card);
}

/* ==================== SUDOKU JUNIOR (a simboli) ====================
   Riusa lo stesso motore generico di generateSudoku (backtracking +
   verifica di soluzione unica), qui su griglie piu' piccole di N=9,
   pensate per bambini troppo piccoli per la griglia classica: 4x4
   (riquadri 2x2) per i piu' piccoli, 6x6 (riquadri 2x3) per le fasce
   successive. Simboli/animali al posto delle cifre, cosi' non serve
   nemmeno saper contare fino a 9 per giocare. Il set di simboli usato
   viene rimescolato ad ogni generazione (stessi 4/6 slot logici, ma
   animali diversi ogni volta) come ulteriore fonte di variabilita'. */
function generateSudokuJunior(area, diff, name) {
  var symbolPool = ['🐶','🐱','🐰','🦊','🐻','🦁','🐼','🐸','🐵','🐨','🦉','🐢'];
  var cfg = {
    explorer:  { N:4, br:2, bc:2, remove:6  },
    curious:   { N:6, br:2, bc:3, remove:14 },
    growing:   { N:6, br:2, bc:3, remove:20 },
    challenge: { N:6, br:2, bc:3, remove:24 }
  };
  var c = cfg[diff] || cfg.curious;

  var shuffledSymbols = symbolPool.slice().sort(function(){ return rng()-0.5; });
  var symbols = shuffledSymbols.slice(0, c.N);

  var solved = sudokuGenerateFull(c.N, c.br, c.bc);
  var puzzle=[], r, col;
  for (r=0;r<c.N;r++) puzzle.push(solved[r].slice());

  var positions=[];
  for (r=0;r<c.N;r++) for (col=0;col<c.N;col++) positions.push([r,col]);
  positions.sort(function(){ return rng()-0.5; });

  var removed=0, pi;
  for (pi=0; pi<positions.length && removed<c.remove; pi++) {
    var pr=positions[pi][0], pc=positions[pi][1];
    var backup = puzzle[pr][pc];
    if (backup===0) continue;
    puzzle[pr][pc]=0;
    var testBoard=[];
    for (r=0;r<c.N;r++) testBoard.push(puzzle[r].slice());
    var solCount = sudokuCountSolutions(testBoard, 2, c.N, c.br, c.bc);
    if (solCount===1) { removed++; }
    else { puzzle[pr][pc]=backup; }
  }

  var container=document.createElement('div'); container.className='sudoku-grid junior';
  container.style.gridTemplateColumns = 'repeat(' + c.N + ', 44px)';
  var cell;
  for (r=0;r<c.N;r++) for (col=0;col<c.N;col++){
    cell=document.createElement('div'); cell.className='sudoku-cell'+(puzzle[r][col]!==0?' given':'');
    if ((col+1)%c.bc===0 && col<c.N-1) cell.classList.add('box-right');
    if ((r+1)%c.br===0 && r<c.N-1) cell.classList.add('box-bottom');
    if (puzzle[r][col]!==0) cell.textContent = symbols[puzzle[r][col]-1];
    container.appendChild(cell);
  }

  var card=makeCard('Sudoku Junior','Ogni simbolo deve comparire una sola volta per riga, colonna e riquadro!',name);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);
  addGuideBtn(card,'sudokujunior');
  area.appendChild(card);
}

/* ==================== COLORA LIBERAMENTE ==================== */
function generateColor(area, diff, name) {
  /* -------------------------------------------------------
     ISTRUZIONI PER AGGIUNGERE NUOVE IMMAGINI:
     1. Carica il file nella cartella /images/color/ del repo
     2. Chiamalo col numero progressivo (es. 5.jpg, 6.jpg…)
     3. Aggiorna SOLO il numero qui sotto:
  ------------------------------------------------------- */
  var totalImages = 3; /* <-- aggiorna questo numero quando aggiungi immagini */

  var idx = Math.floor(rng() * totalImages) + 1;
  var src = 'images/color/' + idx + '.jpg';

  var card = makeCard('Colora liberamente', 'Usa matite o pennarelli e colora come preferisci!', name);

  var wrap = makePrintWrap();
  var loading = document.createElement('div');
  loading.style.cssText = 'padding:2rem;color:#8a7a60;font-size:0.9rem;font-weight:700;';
  loading.textContent = 'Caricamento immagine...';
  wrap.inner.appendChild(loading);
  card.appendChild(wrap.outer);

  var img = new Image();
  img.onload = function() {
    loading.remove();
    img.style.cssText = 'max-width:100%;border-radius:8px;border:1.5px solid #e8e0d0;display:block;';
    wrap.inner.appendChild(img);
  };
  img.onerror = function() {
    loading.textContent = 'coming soon...';
    loading.style.color = '#e04f4f';
  };
  img.src = src;

  addGuideBtn(card, 'color');
  area.appendChild(card);
}

/* ==================== PUNTA E CONTA ====================
   Fonti di variabilita': pool di 30 simboli + posizionamento
   generativo + dimensioni griglia/numero simboli distinti per fascia. */
function generateCount(area, diff, name) {
  var symbolPool = ['🐶','🐱','🐰','🦊','🐻','🐼','🐸','🐵','🦁','🐷','🐨','🐯','🦉','🐢','🐳','⭐','🌸','🍎','🍊','🍇','🌙','☀️','⚽','🎈','🚗','🚀','❤️','🔵','🟢','🟡'];
  var gridCfg = {
    explorer: { rows:5, cols:5, distinct:3 },
    curious:  { rows:6, cols:7, distinct:4 },
    growing:  { rows:7, cols:8, distinct:5 },
    challenge:{ rows:8, cols:10,distinct:6 }
  };
  var cfg = gridCfg[diff] || gridCfg.curious;

  var shuffled = symbolPool.slice().sort(function(){ return rng()-0.5; });
  var chosen = shuffled.slice(0, cfg.distinct);
  var target = chosen[Math.floor(rng()*chosen.length)];

  var grid=[], r, c, sym, targetCount=0;
  for (r=0;r<cfg.rows;r++){
    var row=[];
    for (c=0;c<cfg.cols;c++){
      sym = chosen[Math.floor(rng()*chosen.length)];
      if (sym===target) targetCount++;
      row.push(sym);
    }
    grid.push(row);
  }
  if (targetCount < 2) {
    var need = 2 - targetCount;
    for (var k=0;k<need;k++){
      var rr=Math.floor(rng()*cfg.rows), cc=Math.floor(rng()*cfg.cols);
      if (grid[rr][cc] !== target) { grid[rr][cc]=target; targetCount++; }
    }
  }

  var container=document.createElement('div'); container.className='count-grid';
  for (r=0;r<cfg.rows;r++){
    var rowDiv=document.createElement('div'); rowDiv.className='count-grid-row';
    for (c=0;c<cfg.cols;c++){
      var cell=document.createElement('div'); cell.className='count-cell'; cell.textContent=grid[r][c];
      rowDiv.appendChild(cell);
    }
    container.appendChild(rowDiv);
  }

  var targetBox=document.createElement('div'); targetBox.className='count-target-box';
  targetBox.innerHTML = 'Quante volte trovi questo simbolo? <span style="font-size:1.5rem;margin-left:6px;">'+target+'</span>';

  var answerBox=document.createElement('div'); answerBox.className='count-answer';
  answerBox.innerHTML = 'Scrivi qui il numero: <input type="text" maxlength="3">';

  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzione per il genitore: ' + targetCount;

  var card=makeCard('Punta e conta','Osserva bene la griglia e conta con attenzione, riga per riga!',name);
  card.appendChild(targetBox);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);
  card.appendChild(answerBox);
  card.appendChild(key);
  addGuideBtn(card,'count');
  area.appendChild(card);
}

/* ==================== SEQUENZA DA RICORDARE ====================
   Fonti di variabilita': pool di 18 simboli + lunghezza sequenza
   variabile per fascia + ordine sempre nuovo. Genera UNA sola scheda
   divisa in due meta' uguali (sopra: sequenza da osservare; sotto:
   caselle vuote da riempire a memoria) separate da una linea
   tratteggiata: il genitore piega il foglio esattamente su quella
   linea, cosi' si stampa un solo foglio invece di due. */
function generateSequence(area, diff, name) {
  var symbolPool = ['🔴','🔵','🟢','🟡','🟣','⭐','❤️','🔺','⬛','⬜','🍀','🌙','☀️','🐾','🎵','✳️','🔶','🔷'];
  var lengthCfg = { explorer:4, curious:6, growing:8, challenge:10 };
  var len = lengthCfg[diff] || 6;

  var shuffled = symbolPool.slice().sort(function(){ return rng()-0.5; });
  var seq=[], i;
  for (i=0;i<len;i++){ seq.push(shuffled[i % shuffled.length]); }
  seq = seq.sort(function(){ return rng()-0.5; });

  var card=makeCard('Sequenza da ricordare','Osserva la parte in alto, poi piega il foglio lungo la riga tratteggiata e riscrivi la sequenza a memoria in basso!',name);

  var foldWrap=document.createElement('div'); foldWrap.className='sequence-fold-wrap';

  var topHalf=document.createElement('div'); topHalf.className='sequence-half';
  var topLabel=document.createElement('div'); topLabel.className='sequence-label'; topLabel.textContent='👀 Osserva e memorizza:';
  var topWrap=makePrintWrap();
  var row1=document.createElement('div'); row1.className='sequence-row';
  for (i=0;i<len;i++){
    var item=document.createElement('div'); item.className='sequence-item'; item.textContent=seq[i];
    row1.appendChild(item);
  }
  topWrap.inner.appendChild(row1);
  topHalf.appendChild(topLabel);
  topHalf.appendChild(topWrap.outer);

  var divider=document.createElement('div'); divider.className='sequence-divider';
  divider.innerHTML='<span>✂️ piega qui</span>';

  var bottomHalf=document.createElement('div'); bottomHalf.className='sequence-half';
  var bottomLabel=document.createElement('div'); bottomLabel.className='sequence-label'; bottomLabel.textContent='✏️ Scrivila a memoria:';
  var bottomWrap=makePrintWrap();
  var row2=document.createElement('div'); row2.className='sequence-row';
  for (i=0;i<len;i++){
    var empty=document.createElement('div'); empty.className='sequence-item empty';
    row2.appendChild(empty);
  }
  bottomWrap.inner.appendChild(row2);
  bottomHalf.appendChild(bottomLabel);
  bottomHalf.appendChild(bottomWrap.outer);

  foldWrap.appendChild(topHalf);
  foldWrap.appendChild(divider);
  foldWrap.appendChild(bottomHalf);
  card.appendChild(foldWrap);

  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Sequenza originale per il genitore: ' + seq.join(' ');
  card.appendChild(key);

  addGuideBtn(card,'sequence');
  area.appendChild(card);
}

/* ==================== PERCORSO GUIDATO ====================
   Fonti di variabilita': percorso generato con random-walk (sempre
   diverso) + pool di 2 tipi di regola (colore / frecce) + parametro
   della regola scelto a caso (colore target, direzione).
   NOTA: la variante "numeri" (collega 1,2,3... in ordine) e' stata
   rimossa in via definitiva: i numeri distrattori potevano duplicare
   numeri gia' usati nel percorso corretto (ambiguita' reale), e il
   contrasto colore usato per leggibilita' (scuro sul percorso, grigio
   spento sui distrattori) finiva per evidenziare visivamente la
   soluzione, esattamente cio' che il progetto evita ovunque (vedi
   nota "NO highlighting" nel cerca-parole). Non reintrodurre senza
   prima risolvere entrambi i problemi alla radice. */
function generatePath(area, diff, name) {
  var gridCfg = { explorer:6, curious:8, growing:10, challenge:12 };
  var size = gridCfg[diff] || 8;
  var w=size, h=size;

  var path=[];
  var y = Math.floor(rng()*h);
  var x = 0;
  path.push({x:x,y:y});
  while (x < w-1) {
    var choice, roll = rng();
    if (roll < 0.55) { choice='right'; }
    else {
      var opts=['right'];
      if (y>0) opts.push('up');
      if (y<h-1) opts.push('down');
      choice = opts[Math.floor(rng()*opts.length)];
    }
    if (choice==='right') { x++; }
    else if (choice==='up') { y--; }
    else if (choice==='down') { y++; }
    path.push({x:x,y:y});
  }

  var pathSet={}, pi;
  for (pi=0;pi<path.length;pi++){ pathSet[path[pi].x+'_'+path[pi].y]=pi; }

  var ruleType = Math.floor(rng()*2);
  var colorPalette=['#e05f8e','#4a90d9','#4caf7d','#f47c2f','#7c5cbf','#c99a2e'];
  var targetColor = colorPalette[Math.floor(rng()*colorPalette.length)];
  var arrowChars={ right:'➡️', up:'⬆️', down:'⬇️' };
  var ruleText='';

  var grid=[], r, c;
  for (r=0;r<h;r++){
    var row=[];
    for (c=0;c<w;c++){ row.push({}); }
    grid.push(row);
  }

  if (ruleType===0) {
    ruleText = 'Segui solo i pallini di questo colore, dalla P alla A: <span style="display:inline-block;width:15px;height:15px;border-radius:50%;background:'+targetColor+';vertical-align:middle;margin-left:4px;"></span>';
    for (r=0;r<h;r++) for (c=0;c<w;c++){
      var k1=c+'_'+r;
      if (pathSet.hasOwnProperty(k1)) { grid[r][c].symbol='●'; grid[r][c].color=targetColor; }
      else { grid[r][c].symbol='●'; grid[r][c].color=colorPalette[Math.floor(rng()*colorPalette.length)]; }
    }
  } else {
    ruleText = 'Segui le frecce dalla partenza (P) fino all\'arrivo (A)!';
    for (pi=0;pi<path.length-1;pi++){
      var cur=path[pi], next=path[pi+1];
      var dir = next.x>cur.x ? 'right' : (next.y<cur.y ? 'up' : 'down');
      grid[cur.y][cur.x].symbol = arrowChars[dir];
      grid[cur.y][cur.x].color = '#2d2416';
    }
    grid[path[path.length-1].y][path[path.length-1].x].symbol='🏁';
    grid[path[path.length-1].y][path[path.length-1].x].color='#2d2416';
    var dirsAll=['right','up','down'];
    for (r=0;r<h;r++) for (c=0;c<w;c++){
      if (!grid[r][c].symbol) { grid[r][c].symbol=arrowChars[dirsAll[Math.floor(rng()*3)]]; grid[r][c].color='#8a7a60'; }
    }
  }

  /* i pallini colorati hanno bisogno di celle piu' grandi delle frecce
     per distinguere bene colori simili (es. rosa vs viola) */
  var cellPx = (ruleType===0) ? 40 : 32;
  var container=document.createElement('div'); container.className='path-grid';
  container.style.gridTemplateColumns = 'repeat(' + w + ', ' + cellPx + 'px)';
  container.style.gridTemplateRows = 'repeat(' + h + ', ' + cellPx + 'px)';
  for (r=0;r<h;r++){
    for (c=0;c<w;c++){
      var cell=document.createElement('div'); cell.className='path-cell' + (ruleType===0 ? ' dot-cell' : '');
      var isStart = (c===path[0].x && r===path[0].y);
      var isEnd = (c===path[path.length-1].x && r===path[path.length-1].y);
      if (isStart) { cell.classList.add('start'); cell.textContent='P'; }
      else if (isEnd) { cell.classList.add('end'); cell.textContent='A'; }
      else {
        cell.textContent = grid[r][c].symbol;
        cell.style.color = grid[r][c].color;
      }
      container.appendChild(cell);
    }
  }

  var ruleDiv=document.createElement('div'); ruleDiv.className='path-rule'; ruleDiv.innerHTML=ruleText;
  var card=makeCard('Percorso guidato','Trova il percorso corretto seguendo la regola qui sotto!',name);
  card.appendChild(ruleDiv);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);
  addGuideBtn(card,'path');
  area.appendChild(card);
}

/* ==================== CANCELLAZIONE SELETTIVA ====================
   Motore di regole: pool di forme x pool di colori, tipo di regola
   scelto a caso tra 4 (colore singolo / forma singola / combinazione
   forma+colore / negazione), con bersaglio scelto a caso ad ogni
   generazione. Fonti di variabilita': generativa (forma+colore casuali
   per cella) + pool ampio di combinazioni possibili + la regola stessa
   e' randomizzata, non fissa. Fasce piu' giovani usano solo regole a
   singolo attributo; le fasce piu' grandi anche congiunzione/negazione. */
function generateCancel(area, diff, name) {
  var shapesPool = ['●','■','▲','★','♥'];
  var colorPalette = ['#e05f8e','#4a90d9','#4caf7d','#f47c2f','#7c5cbf','#c99a2e'];
  var gridCfg = {
    explorer:  { rows:5, cols:5,  shapes:2, colors:3, rules:[1,2] },
    curious:   { rows:6, cols:7,  shapes:3, colors:3, rules:[1,2] },
    growing:   { rows:7, cols:8,  shapes:3, colors:4, rules:[0,1,2] },
    challenge: { rows:8, cols:10, shapes:4, colors:5, rules:[0,3] }
  };
  var cfg = gridCfg[diff] || gridCfg.curious;

  var shapes = shapesPool.slice(0, cfg.shapes);
  var colorsShuffled = colorPalette.slice().sort(function(){ return rng()-0.5; });
  var colors = colorsShuffled.slice(0, cfg.colors);

  var ruleType = cfg.rules[Math.floor(rng()*cfg.rules.length)];
  var targetShape = shapes[Math.floor(rng()*shapes.length)];
  var targetColor = colors[Math.floor(rng()*colors.length)];

  function isMatch(s, col) {
    if (ruleType===0) return (s===targetShape && col===targetColor);
    if (ruleType===1) return (col===targetColor);
    if (ruleType===2) return (s===targetShape);
    return !(s===targetShape && col===targetColor);
  }

  var swatchHtml = '<span style="display:inline-block;width:15px;height:15px;border-radius:50%;background:'+targetColor+';vertical-align:middle;margin:0 3px;"></span>';
  var shapeHtml = '<span style="color:'+targetColor+';font-size:1.2rem;vertical-align:middle;">'+targetShape+'</span>';
  var shapeHtmlPlain = '<span style="font-size:1.2rem;vertical-align:middle;">'+targetShape+'</span>';
  var ruleText;
  if (ruleType===0)      ruleText = 'Cerchia SOLO le forme uguali a questa: ' + shapeHtml;
  else if (ruleType===1) ruleText = 'Cerchia tutte le forme di questo colore, di qualsiasi tipo: ' + swatchHtml;
  else if (ruleType===2) ruleText = 'Cerchia tutte le forme uguali a questa, di qualsiasi colore: ' + shapeHtmlPlain;
  else                    ruleText = 'Cerchia TUTTO tranne le forme uguali a questa: ' + shapeHtml;

  var grid=[], r, cx;
  for (r=0;r<cfg.rows;r++){
    var row=[];
    for (cx=0;cx<cfg.cols;cx++){
      var s = shapes[Math.floor(rng()*shapes.length)];
      var col = colors[Math.floor(rng()*colors.length)];
      row.push({shape:s, color:col});
    }
    grid.push(row);
  }

  var k;
  if (ruleType===3) {
    var exceptions=0;
    for (r=0;r<cfg.rows;r++) for (cx=0;cx<cfg.cols;cx++) if (grid[r][cx].shape===targetShape && grid[r][cx].color===targetColor) exceptions++;
    var needExc = 2 - exceptions;
    for (k=0;k<needExc;k++){
      var er=Math.floor(rng()*cfg.rows), ec=Math.floor(rng()*cfg.cols);
      grid[er][ec] = { shape:targetShape, color:targetColor };
    }
  } else {
    var matchCheck=0;
    for (r=0;r<cfg.rows;r++) for (cx=0;cx<cfg.cols;cx++) if (isMatch(grid[r][cx].shape, grid[r][cx].color)) matchCheck++;
    if (matchCheck < 3) {
      var need = 3 - matchCheck;
      for (k=0;k<need;k++){
        var fr=Math.floor(rng()*cfg.rows), fc=Math.floor(rng()*cfg.cols);
        if (!isMatch(grid[fr][fc].shape, grid[fr][fc].color)) { grid[fr][fc] = { shape:targetShape, color:targetColor }; }
      }
    }
  }

  var matchCount=0;
  for (r=0;r<cfg.rows;r++) for (cx=0;cx<cfg.cols;cx++) if (isMatch(grid[r][cx].shape, grid[r][cx].color)) matchCount++;

  var container=document.createElement('div'); container.className='cancel-grid';
  for (r=0;r<cfg.rows;r++){
    var rowDiv=document.createElement('div'); rowDiv.className='cancel-grid-row';
    for (cx=0;cx<cfg.cols;cx++){
      var cell=document.createElement('div'); cell.className='cancel-cell';
      cell.style.color = grid[r][cx].color;
      cell.textContent = grid[r][cx].shape;
      rowDiv.appendChild(cell);
    }
    container.appendChild(rowDiv);
  }

  var ruleDiv2=document.createElement('div'); ruleDiv2.className='path-rule'; ruleDiv2.innerHTML=ruleText;
  var card=makeCard('Cancellazione selettiva','Segui la regola qui sotto e cerchia solo le forme giuste!',name);
  card.appendChild(ruleDiv2);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);

  var answerBox=document.createElement('div'); answerBox.className='count-answer';
  answerBox.innerHTML = 'Quante ne hai cerchiate? <input type="text" maxlength="3">';
  card.appendChild(answerBox);

  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzione per il genitore: ' + matchCount + ' forme corrispondono alla regola.';
  card.appendChild(key);

  addGuideBtn(card,'cancel');
  area.appendChild(card);
}

/* ==================== TROVA LA REGOLA — motore di pattern ====================
   Helper generici, riutilizzati da piu' famiglie di regole qualitativamente
   diverse (non solo valori diversi della stessa regola, per evitare
   ripetitivita' come discusso). */
function repeatStr(str, n) {
  var out = '';
  for (var i=0;i<n;i++) out += str;
  return out;
}

function buildCyclicPattern(pool, cycleLen) {
  var shuffled = pool.slice().sort(function(){ return rng()-0.5; });
  var cycle = shuffled.slice(0, cycleLen);
  var extra = Math.floor(rng()*cycleLen);
  var shown = cycleLen*2 + extra;
  var seq=[], idx;
  for (idx=0; idx<shown; idx++) seq.push(cycle[idx % cycleLen]);
  var correct = cycle[shown % cycleLen];
  var prevVal = cycle[(shown-1) % cycleLen];
  var distractors=[prevVal];
  var extraCandidate=null, di;
  for (di=0; di<cycle.length; di++){
    if (cycle[di]!==correct && cycle[di]!==prevVal) { extraCandidate=cycle[di]; break; }
  }
  if (extraCandidate===null){
    for (di=0; di<pool.length; di++){
      if (pool[di]!==correct && pool[di]!==prevVal) { extraCandidate=pool[di]; break; }
    }
  }
  distractors.push(extraCandidate);
  return { seq: seq, correct: correct, distractors: distractors };
}

function buildArithmeticPattern(start, step, shownLength) {
  var seq=[], i;
  for (i=0;i<shownLength;i++) seq.push(start + step*i);
  var correct = start + step*shownLength;
  var prevVal = start + step*(shownLength-1);
  var distractors=[prevVal];
  var alt = correct + 1;
  if (alt===prevVal || alt===correct) alt = correct - 1;
  distractors.push(alt);
  return { seq: seq, correct: correct, distractors: distractors };
}

function renderRuleValue(cell, family, value, fixedSymbol) {
  if (family==='cycleSymbol') { cell.textContent = value; }
  else if (family==='cycleColor') { cell.classList.add('swatch'); cell.style.background = value; }
  else if (family==='sizeAlt') { cell.textContent = fixedSymbol; cell.style.fontSize = value + 'rem'; }
  else if (family==='countGrowth') { cell.textContent = repeatStr(fixedSymbol, value); cell.classList.add('wide'); }
  else { cell.textContent = String(value); cell.classList.add('numeric'); }
}

/* ==================== TROVA LA REGOLA ====================
   Fonti di variabilita': pool di 5 "famiglie" di regole qualitativamente
   diverse (simboli ciclici, colori ciclici, dimensione alternata, quantita'
   crescente, sequenza numerica) scelte a caso in base alla fascia, ognuna
   con parametri interni random (simboli/colori coinvolti, lunghezza ciclo,
   punto di partenza, passo, offset). Risposta a scelta multipla (3 opzioni,
   2 distrattori plausibili "quasi giusti") per restare verificabile su
   carta stampata senza ambiguita'. */
function generateRule(area, diff, name) {
  var symbolPool = ['🐶','🐱','🐰','🦊','🐻','🐼','🐸','🐵','🦁','🐷','🐨','🐯','🦉','🐢','🐳','⭐','🌸','🍎','🍊','🍇','🌙','☀️','⚽','🎈','🚗','🚀','❤️'];
  var colorPalette = ['#e05f8e','#4a90d9','#4caf7d','#f47c2f','#7c5cbf','#c99a2e'];
  var sizePool = [1.1, 1.8, 2.6];

  var families;
  if (diff==='explorer')      families = ['cycleSymbol','countGrowth'];
  else if (diff==='curious')  families = ['cycleSymbol','sizeAlt','countGrowth'];
  else if (diff==='growing')  families = ['cycleSymbol','cycleColor','numeric'];
  else                        families = ['cycleColor','numeric','cycleSymbol'];
  var family = families[Math.floor(rng()*families.length)];

  var fixedSymbol = symbolPool[Math.floor(rng()*symbolPool.length)];
  var pattern, ruleText;

  if (family==='cycleSymbol') {
    var cLen = (diff==='explorer') ? 2 : (diff==='challenge' ? 4 : 3);
    pattern = buildCyclicPattern(symbolPool, cLen);
    ruleText = 'Osserva bene la sequenza di simboli: quale viene dopo?';
  } else if (family==='cycleColor') {
    var cLen2 = (diff==='challenge') ? 4 : 3;
    pattern = buildCyclicPattern(colorPalette, cLen2);
    ruleText = 'Osserva bene la sequenza di colori: quale viene dopo?';
  } else if (family==='sizeAlt') {
    pattern = buildCyclicPattern(sizePool, 3);
    ruleText = 'Osserva come cambia la dimensione: quale misura viene dopo?';
  } else if (family==='countGrowth') {
    var start = 1 + Math.floor(rng()*2);
    var shownLen = (diff==='explorer') ? 3 : 4;
    pattern = buildArithmeticPattern(start, 1, shownLen);
    ruleText = 'Osserva come cresce la quantità: quanti simboli vengono dopo?';
  } else {
    var start2 = 1 + Math.floor(rng()*8);
    var stepPool = (diff==='challenge') ? [2,3,4,5] : [1,2,3];
    var step = stepPool[Math.floor(rng()*stepPool.length)];
    var shownLen2 = (diff==='challenge') ? 6 : 5;
    pattern = buildArithmeticPattern(start2, step, shownLen2);
    ruleText = 'Osserva la sequenza di numeri: quale viene dopo?';
  }

  var row=document.createElement('div'); row.className='rule-row';
  var i;
  for (i=0;i<pattern.seq.length;i++){
    var cell=document.createElement('div'); cell.className='rule-item';
    renderRuleValue(cell, family, pattern.seq[i], fixedSymbol);
    row.appendChild(cell);
  }
  var blank=document.createElement('div'); blank.className='rule-item rule-blank'; blank.textContent='❓';
  row.appendChild(blank);

  var options = [ {v:pattern.correct, ok:true}, {v:pattern.distractors[0], ok:false}, {v:pattern.distractors[1], ok:false} ];
  options.sort(function(){ return rng()-0.5; });

  var letters=['A','B','C'];
  var correctLetter='';
  var optWrap=document.createElement('div'); optWrap.className='rule-options';
  for (i=0;i<options.length;i++){
    var optBox=document.createElement('div'); optBox.className='rule-option';
    var optCell=document.createElement('div'); optCell.className='rule-item';
    renderRuleValue(optCell, family, options[i].v, fixedSymbol);
    var optLabel=document.createElement('div'); optLabel.className='rule-option-label'; optLabel.textContent=letters[i];
    optBox.appendChild(optCell);
    optBox.appendChild(optLabel);
    optWrap.appendChild(optBox);
    if (options[i].ok) correctLetter = letters[i];
  }

  var block=document.createElement('div'); block.className='rule-block';
  block.appendChild(row);
  block.appendChild(optWrap);

  var ruleDiv3=document.createElement('div'); ruleDiv3.className='path-rule'; ruleDiv3.textContent=ruleText;
  var card=makeCard('Trova la regola','Scopri la logica della sequenza e cerchia la risposta giusta!',name);
  card.appendChild(ruleDiv3);
  var wrap=makePrintWrap(); wrap.inner.appendChild(block); card.appendChild(wrap.outer);

  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Risposta corretta per il genitore: opzione ' + correctLetter;
  card.appendChild(key);

  addGuideBtn(card,'rule');
  area.appendChild(card);
}

/* ==================== RIFLESSO ====================
   Rivalutata dall'elenco delle schede rimosse in v7 e reintrodotta in
   v15 in forma astratta (griglia di forme colorate, non un disegno
   figurativo) proprio per evitare il problema di precisione grafica
   che affliggeva la versione originale con canvas. Fonti di
   variabilita': asse di simmetria scelto a caso (verticale/orizzontale)
   + forma/colore casuali per cella + densita' di celle piene variabile
   per fascia + dimensione griglia variabile per fascia. */
function generateMirror(area, diff, name) {
  var shapesPool = ['●','■','▲','★','♥'];
  var colorPalette = ['#e05f8e','#4a90d9','#4caf7d','#f47c2f','#7c5cbf','#c99a2e'];
  var gridCfg = {
    explorer:  { w:6,  h:4, density:0.6  },
    curious:   { w:8,  h:6, density:0.55 },
    growing:   { w:10, h:6, density:0.5  },
    challenge: { w:12, h:8, density:0.45 }
  };
  var cfg = gridCfg[diff] || gridCfg.curious;
  var w = cfg.w, h = cfg.h;
  var axis = rng() < 0.5 ? 'vertical' : 'horizontal';

  var grid=[], r, col;
  for (r=0;r<h;r++){ var row=[]; for (col=0;col<w;col++) row.push(null); grid.push(row); }

  if (axis==='vertical') {
    for (r=0;r<h;r++) for (col=0;col<w/2;col++) {
      if (rng() < cfg.density) grid[r][col] = { shape: shapesPool[Math.floor(rng()*shapesPool.length)], color: colorPalette[Math.floor(rng()*colorPalette.length)] };
    }
  } else {
    for (r=0;r<h/2;r++) for (col=0;col<w;col++) {
      if (rng() < cfg.density) grid[r][col] = { shape: shapesPool[Math.floor(rng()*shapesPool.length)], color: colorPalette[Math.floor(rng()*colorPalette.length)] };
    }
  }

  var container=document.createElement('div'); container.className='mirror-grid';
  container.style.gridTemplateColumns = 'repeat(' + w + ', 34px)';
  for (r=0;r<h;r++){
    for (col=0;col<w;col++){
      var cell=document.createElement('div'); cell.className='mirror-cell';
      var isSource = (axis==='vertical') ? (col < w/2) : (r < h/2);
      if (!isSource) { cell.classList.add('blank'); }
      else if (grid[r][col]) { cell.textContent = grid[r][col].shape; cell.style.color = grid[r][col].color; }
      if (axis==='vertical' && col === w/2-1) cell.classList.add('axis-right');
      if (axis==='horizontal' && r === h/2-1) cell.classList.add('axis-bottom');
      container.appendChild(cell);
    }
  }

  var ruleDiv=document.createElement('div'); ruleDiv.className='path-rule';
  ruleDiv.textContent = 'Disegna il riflesso speculare del disegno nella metà vuota!';
  var card=makeCard('Riflesso','Immagina uno specchio lungo la linea colorata e completa il disegno.',name);
  card.appendChild(ruleDiv);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);
  addGuideBtn(card,'mirror');
  area.appendChild(card);
}

/* ==================== COPPIE ====================
   Rivalutata e reintrodotta in v15 come "trova le coppie di simboli
   identici" (memory su carta), non abbinamenti semantici che
   richiederebbero contenuti curati a mano. Fonti di variabilita':
   pool ampio di 32 simboli + selezione casuale del sottoinsieme usato
   + mescolamento completo delle posizioni in griglia. */
function generateCoppie(area, diff, name) {
  var symbolPool = ['🐶','🐱','🐰','🦊','🐻','🐼','🐸','🐵','🦁','🐷','🐨','🐯','🦉','🐢','🐳','⭐','🌸','🍎','🍊','🍇','🌙','☀️','⚽','🎈','🚗','🚀','❤️','🔵','🟢','🟡','🎵','🍀'];
  var gridCfg = {
    explorer:  { rows:4, cols:4 },
    curious:   { rows:5, cols:6 },
    growing:   { rows:6, cols:6 },
    challenge: { rows:6, cols:8 }
  };
  var cfg = gridCfg[diff] || gridCfg.curious;
  var totalCells = cfg.rows*cfg.cols;
  var numPairs = Math.floor(totalCells/2);

  var shuffledPool = symbolPool.slice().sort(function(){ return rng()-0.5; });
  var chosenSymbols = shuffledPool.slice(0, numPairs);
  var deck=[], i;
  for (i=0;i<numPairs;i++) { deck.push(chosenSymbols[i]); deck.push(chosenSymbols[i]); }
  if (deck.length < totalCells) deck.push(chosenSymbols[0]);
  deck.sort(function(){ return rng()-0.5; });

  var container=document.createElement('div'); container.className='count-grid';
  var idx=0, r, col;
  for (r=0;r<cfg.rows;r++){
    var rowDiv=document.createElement('div'); rowDiv.className='count-grid-row';
    for (col=0;col<cfg.cols;col++){
      var cell=document.createElement('div'); cell.className='count-cell'; cell.textContent=deck[idx]; idx++;
      rowDiv.appendChild(cell);
    }
    container.appendChild(rowDiv);
  }

  var ruleDiv=document.createElement('div'); ruleDiv.className='path-rule';
  ruleDiv.textContent = 'Trova ogni coppia di simboli identici e depennali (barrali con una riga) man mano che li trovi!';
  var card=makeCard('Trova le coppie','Ci sono ' + numPairs + ' coppie nascoste nella griglia: trovale tutte!',name);
  card.appendChild(ruleDiv);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);

  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzione per il genitore: ci sono ' + numPairs + ' coppie in totale.';
  card.appendChild(key);

  addGuideBtn(card,'pairs');
  area.appendChild(card);
}

/* ==================== INTRUSO ====================
   Rivalutata e reintrodotta in v15 su pool di categorie a emoji (zero
   rischio di precisione grafica, solo testo/emoji). Fonti di
   variabilita': pool di 7 categorie x 6-8 membri + categoria bersaglio
   casuale + membri campionati a caso + categoria/membro dell'intruso
   casuali + ordine finale mescolato. Per le fasce piu' piccole la
   categoria viene rivelata come aiuto; per le fasce piu' grandi va
   dedotta, aumentando la difficolta' reale. */
function generateIntruso(area, diff, name) {
  var categories = {
    'frutta':    ['🍎','🍊','🍇','🍌','🍓','🍒','🍍','🥝'],
    'animali':   ['🐶','🐱','🐰','🦊','🐻','🐼','🦁','🐯'],
    'veicoli':   ['🚗','🚕','🚙','🚌','🚓','🚑','🚒','🚚'],
    'vestiti':   ['👕','👖','🧦','🧤','👗','🧥','🧢','👟'],
    'strumenti musicali': ['🎸','🥁','🎺','🎻','🎹','🎷','🪕','🎤'],
    'meteo':     ['☀️','🌙','⭐','☁️','🌈','⚡','❄️','🌧️'],
    'dolci':     ['🍦','🍩','🍪','🎂','🍫','🍭','🧁','🍬']
  };
  var catNames = Object.keys(categories);
  var mainCat = catNames[Math.floor(rng()*catNames.length)];
  var otherCats = [];
  var ci;
  for (ci=0;ci<catNames.length;ci++) if (catNames[ci]!==mainCat) otherCats.push(catNames[ci]);
  var intruderCat = otherCats[Math.floor(rng()*otherCats.length)];

  var lengthCfg = { explorer:4, curious:5, growing:6, challenge:7 };
  var groupSize = lengthCfg[diff] || 5;

  var mainMembers = categories[mainCat].slice().sort(function(){ return rng()-0.5; });
  var chosenMembers = mainMembers.slice(0, groupSize);
  var intruderMembers = categories[intruderCat];
  var intruderItem = intruderMembers[Math.floor(rng()*intruderMembers.length)];

  var items = chosenMembers.slice();
  items.push(intruderItem);
  var order=[]; var oi;
  for (oi=0;oi<items.length;oi++) order.push(oi);
  order.sort(function(){ return rng()-0.5; });

  var row=document.createElement('div'); row.className='rule-row';
  var intruderPosition=-1, oi2;
  for (oi2=0;oi2<order.length;oi2++){
    var itemIdx = order[oi2];
    var cell=document.createElement('div'); cell.className='rule-item'; cell.textContent = items[itemIdx];
    row.appendChild(cell);
    if (itemIdx === items.length-1) intruderPosition = oi2+1;
  }

  var showHint = (diff==='explorer' || diff==='curious');
  var ruleText = showHint ? ('Un elemento non fa parte della categoria "' + mainCat + '": quale?') : 'Un elemento non appartiene al gruppo degli altri: trova quale, e perché!';
  var ruleDiv=document.createElement('div'); ruleDiv.className='path-rule'; ruleDiv.textContent=ruleText;

  var card=makeCard('Trova l\'intruso','Osserva bene gli elementi e cerchia quello che non c\'entra!',name);
  card.appendChild(ruleDiv);
  var wrap=makePrintWrap(); wrap.inner.appendChild(row); card.appendChild(wrap.outer);

  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzione per il genitore: l\'intruso è ' + intruderItem + ' (posizione ' + intruderPosition + '), perché gli altri appartengono alla categoria "' + mainCat + '".';
  card.appendChild(key);

  addGuideBtn(card,'oddone');
  area.appendChild(card);
}

/* ==================== TROVA LE DIFFERENZE ====================
   Rivalutata dall'elenco delle schede rimosse in v7 e reintrodotta in
   v15 in forma astratta (due griglie di forme colorate affiancate),
   NON come scenetta illustrata — evita cosi' il rischio di precisione
   grafica scadente discusso con Salvo. Fonti di variabilita': forma e
   colore casuali per ogni cella della griglia base + posizioni delle
   differenze scelte a caso + nuovo valore della differenza garantito
   diverso dall'originale + dimensione griglia/numero differenze
   variabile per fascia. */
function generateDifferences(area, diff, name) {
  var shapesPool = ['●','■','▲','★','♥'];
  var colorPalette = ['#e05f8e','#4a90d9','#4caf7d','#f47c2f','#7c5cbf','#c99a2e'];
  var gridCfg = {
    explorer:  { size:4, diffs:3 },
    curious:   { size:5, diffs:4 },
    growing:   { size:6, diffs:5 },
    challenge: { size:7, diffs:6 }
  };
  var cfg = gridCfg[diff] || gridCfg.curious;
  var n = cfg.size;

  var gridA=[], r, col;
  for (r=0;r<n;r++){
    var row=[];
    for (col=0;col<n;col++){
      row.push({ shape: shapesPool[Math.floor(rng()*shapesPool.length)], color: colorPalette[Math.floor(rng()*colorPalette.length)] });
    }
    gridA.push(row);
  }
  var gridB=[];
  for (r=0;r<n;r++) gridB.push(gridA[r].slice());

  var diffPositions=[], used={};
  while (diffPositions.length < cfg.diffs) {
    var dr=Math.floor(rng()*n), dc=Math.floor(rng()*n);
    var dkey=dr+'_'+dc;
    if (used[dkey]) continue;
    used[dkey]=true;
    var orig = gridA[dr][dc];
    var newShape, newColor, tries=0;
    do {
      newShape = shapesPool[Math.floor(rng()*shapesPool.length)];
      newColor = colorPalette[Math.floor(rng()*colorPalette.length)];
      tries++;
    } while ((newShape===orig.shape && newColor===orig.color) && tries<50);
    gridB[dr][dc] = { shape:newShape, color:newColor };
    diffPositions.push({r:dr, c:dc});
  }

  function buildGridEl(grid, label) {
    var gWrap=document.createElement('div'); gWrap.className='diff-single';
    var labelDiv=document.createElement('div'); labelDiv.className='diff-label-badge'; labelDiv.textContent=label;
    var g=document.createElement('div'); g.className='cancel-grid';
    var rr, cc;
    for (rr=0; rr<n; rr++){
      var rowDiv=document.createElement('div'); rowDiv.className='cancel-grid-row';
      for (cc=0; cc<n; cc++){
        var cell=document.createElement('div'); cell.className='cancel-cell';
        cell.style.color = grid[rr][cc].color;
        cell.textContent = grid[rr][cc].shape;
        rowDiv.appendChild(cell);
      }
      g.appendChild(rowDiv);
    }
    gWrap.appendChild(labelDiv);
    gWrap.appendChild(g);
    return gWrap;
  }

  var pairWrap=document.createElement('div'); pairWrap.className='diff-pair';
  pairWrap.appendChild(buildGridEl(gridA, 'A'));
  pairWrap.appendChild(buildGridEl(gridB, 'B'));

  var ruleDiv=document.createElement('div'); ruleDiv.className='path-rule';
  ruleDiv.textContent = 'Trova le ' + cfg.diffs + ' differenze tra il disegno A e il disegno B!';
  var card=makeCard('Trova le differenze','Confronta con attenzione i due riquadri e cerchia ogni differenza che trovi.',name);
  card.appendChild(ruleDiv);
  var wrap=makePrintWrap(); wrap.inner.appendChild(pairWrap); card.appendChild(wrap.outer);

  var keyParts=[], ki;
  for (ki=0;ki<diffPositions.length;ki++) keyParts.push('riga ' + (diffPositions[ki].r+1) + '-colonna ' + (diffPositions[ki].c+1));
  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzione per il genitore — differenze in: ' + keyParts.join(', ') + '.';
  card.appendChild(key);

  addGuideBtn(card,'diff');
  area.appendChild(card);
}

/* ==================== CALCOLO ====================
   Prima scheda della categoria "pratica scolastica" della roadmap.
   Fonti di variabilita': operazione scelta a caso per ogni singolo
   problema (tra quelle ammesse per la fascia) + operandi randomizzati
   entro un intervallo scalato per fascia + numero di problemi variabile.
   Formato verticale in colonna per addizioni/sottrazioni (come si
   esercita a scuola), orizzontale per moltiplicazioni/divisioni. */
function randIntCalc(min, max) { return min + Math.floor(rng()*(max-min+1)); }

function generateCalcolo(area, diff, name) {
  var cfg = {
    explorer:  { ops:['add'],                   addMin:1,  addMax:5,  mulMin:2, mulMax:5,  count:8  },
    curious:   { ops:['add','sub'],              addMin:1,  addMax:20, mulMin:2, mulMax:6,  count:10 },
    growing:   { ops:['add','sub','mul'],        addMin:10, addMax:99, mulMin:2, mulMax:10, count:12 },
    challenge: { ops:['add','sub','mul','div'],  addMin:100,addMax:999,mulMin:2, mulMax:12, count:15 }
  };
  var c = cfg[diff] || cfg.curious;

  var problems=[], answers=[], i;
  for (i=0;i<c.count;i++){
    var op = c.ops[Math.floor(rng()*c.ops.length)];
    var a, b, ans;
    if (op==='add') {
      a = randIntCalc(c.addMin, c.addMax); b = randIntCalc(c.addMin, c.addMax); ans = a+b;
    } else if (op==='sub') {
      a = randIntCalc(c.addMin, c.addMax); b = randIntCalc(c.addMin, a); ans = a-b;
    } else if (op==='mul') {
      a = randIntCalc(c.mulMin, c.mulMax); b = randIntCalc(c.mulMin, c.mulMax); ans = a*b;
    } else {
      var q = randIntCalc(c.mulMin, c.mulMax), d = randIntCalc(c.mulMin, c.mulMax);
      a = q*d; b = d; ans = q;
    }
    problems.push({op:op, a:a, b:b});
    answers.push(ans);
  }

  var opSymbols = { add:'+', sub:'−', mul:'×', div:'÷' };
  var container=document.createElement('div'); container.className='calc-grid';
  for (i=0;i<problems.length;i++){
    var p = problems[i];
    var cell=document.createElement('div'); cell.className='calc-problem';
    if (p.op==='add' || p.op==='sub') {
      cell.innerHTML =
        '<div class="calc-vertical">' +
          '<div class="calc-num">' + p.a + '</div>' +
          '<div class="calc-op-row"><span class="calc-op">' + opSymbols[p.op] + '</span><span class="calc-num">' + p.b + '</span></div>' +
          '<div class="calc-line"></div>' +
          '<div class="calc-answer-box"></div>' +
        '</div>';
    } else {
      cell.innerHTML =
        '<div class="calc-horizontal">' + p.a + ' ' + opSymbols[p.op] + ' ' + p.b + ' = <span class="calc-blank"></span></div>';
    }
    container.appendChild(cell);
  }

  var card=makeCard('Pratica di calcolo','Risolvi tutte le operazioni qui sotto!',name);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);

  var keyParts=[];
  for (i=0;i<answers.length;i++) keyParts.push((i+1) + ') ' + answers[i]);
  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzioni per il genitore: ' + keyParts.join(' — ');
  card.appendChild(key);

  addGuideBtn(card,'calc');
  area.appendChild(card);
}

/* ==================== TABELLINE ====================
   Separata da "Calcolo" su richiesta esplicita di Salvo per motivi di
   intuitivita': le tabelline sono un esercizio scolastico con
   un'identita' propria e riconoscibile, diverso dal ripasso misto di
   operazioni. Fonti di variabilita': tabellina scelta a caso ad ogni
   generazione (entro un intervallo scalato per fascia) + ordine dei
   moltiplicatori mescolato (non sequenziale) cosi' il bambino richiama
   il singolo fatto numerico invece di recitare la sequenza a memoria. */
function generateTabelline(area, diff, name) {
  var cfg = {
    explorer:  { tableMax:3,  multMax:10, count:10 },
    curious:   { tableMax:12, multMax:10, count:15 },
    growing:   { tableMax:12, multMax:10, count:15 },
    challenge: { tableMax:12, multMax:12, count:15 }
  };
  var c = cfg[diff] || cfg.curious;

  var used={}, problems=[], tries=0;
  while (problems.length < c.count && tries < 500) {
    tries++;
    var table = randIntCalc(2, c.tableMax);
    var mult = randIntCalc(1, c.multMax);
    var key = table + '_' + mult;
    if (used[key]) continue;
    used[key] = true;
    problems.push({ table:table, mult:mult });
  }

  var container=document.createElement('div'); container.className='calc-grid';
  var answers=[], i;
  for (i=0;i<problems.length;i++){
    var p = problems[i];
    var ans = p.table*p.mult;
    answers.push(ans);
    var cell=document.createElement('div'); cell.className='calc-problem';
    cell.innerHTML = '<div class="calc-horizontal">' + p.table + ' × ' + p.mult + ' = <span class="calc-blank"></span></div>';
    container.appendChild(cell);
  }

  var card=makeCard('Tabelline','Esercitati con le tabelline!',name);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);

  var keyParts=[];
  for (i=0;i<problems.length;i++) keyParts.push(problems[i].table + '×' + problems[i].mult + '=' + answers[i]);
  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzioni per il genitore: ' + keyParts.join(' — ');
  card.appendChild(key);

  addGuideBtn(card,'tables');
  area.appendChild(card);
}

/* ==================== ANAGRAMMI ====================
   Prima scheda della categoria "linguistico" della roadmap. Riusa
   WORD_VOCAB (lo stesso vocabolario di generateWordSearch) invece di
   duplicare le liste di parole. Fonti di variabilita': selezione
   casuale del sottoinsieme di parole + mescolamento completo delle
   lettere per ciascuna (con garanzia che il risultato sia sempre
   diverso dalla parola originale) + numero di parole/lunghezza massima
   variabile per fascia. */
function scrambleWord(word) {
  var letters = word.split('');
  var scrambled, tries = 0;
  do {
    var arr = letters.slice();
    arr.sort(function(){ return rng()-0.5; });
    scrambled = arr.join('');
    tries++;
  } while (scrambled === word && tries < 20);
  return scrambled;
}

function generateAnagrammi(area, diff, name) {
  var pool = (WORD_VOCAB[diff] || WORD_VOCAB.curious).slice().sort(function(){ return rng()-0.5; });
  var countCfg = { explorer:5, curious:8, growing:10, challenge:12 };
  var count = countCfg[diff] || 8;
  var maxLenCfg = { explorer:5, curious:7, growing:10, challenge:13 };
  var maxLen = maxLenCfg[diff] || 7;

  var selected=[], pi;
  for (pi=0; pi<pool.length && selected.length<count; pi++) {
    if (pool[pi].length <= maxLen) selected.push(pool[pi]);
  }
  if (selected.length < count) selected = pool.slice(0, count);

  var showHint = (diff==='explorer' || diff==='curious');

  var container=document.createElement('div'); container.className='anagram-list';
  var i, j;
  for (i=0; i<selected.length; i++){
    var word = selected[i];
    var scrambled = scrambleWord(word);
    var row=document.createElement('div'); row.className='anagram-row';

    var tiles=document.createElement('div'); tiles.className='anagram-tiles';
    for (j=0;j<scrambled.length;j++){
      var tile=document.createElement('div'); tile.className='anagram-tile'; tile.textContent=scrambled[j];
      tiles.appendChild(tile);
    }
    row.appendChild(tiles);

    var arrow=document.createElement('div'); arrow.className='anagram-arrow'; arrow.textContent='→';
    row.appendChild(arrow);

    if (showHint) {
      var hint=document.createElement('span'); hint.className='anagram-hint'; hint.textContent='(inizia con ' + word[0] + ')';
      row.appendChild(hint);
    }

    var blank=document.createElement('div'); blank.className='anagram-blank';
    row.appendChild(blank);

    container.appendChild(row);
  }

  var card=makeCard('Anagrammi','Riordina le lettere per scoprire la parola nascosta!',name);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);

  var keyParts=[];
  for (i=0;i<selected.length;i++) keyParts.push((i+1) + ') ' + selected[i]);
  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzioni per il genitore: ' + keyParts.join(' — ');
  card.appendChild(key);

  addGuideBtn(card,'anagram');
  area.appendChild(card);
}

/* ==================== LETTERA MANCANTE ====================
   Secondo pezzo della categoria "linguistico". Riusa WORD_VOCAB come
   generateAnagrammi, ma invece di mescolare le lettere ne nasconde
   alcune mantenendo l'ordine corretto — abilita complementare
   (richiamo ortografico vs riordino). Fonti di variabilita':
   selezione casuale delle parole + numero di lacune randomizzato
   entro un intervallo per fascia + posizioni delle lacune scelte a
   caso per ogni parola (non sempre le stesse, es. non sempre l'ultima
   lettera). */
function generateLetteraMancante(area, diff, name) {
  var pool = (WORD_VOCAB[diff] || WORD_VOCAB.curious).slice().sort(function(){ return rng()-0.5; });
  var countCfg = { explorer:5, curious:8, growing:10, challenge:12 };
  var count = countCfg[diff] || 8;
  var maxLenCfg = { explorer:6, curious:8, growing:11, challenge:14 };
  var maxLen = maxLenCfg[diff] || 8;
  var blankRangeCfg = { explorer:[1,1], curious:[1,2], growing:[2,3], challenge:[3,4] };
  var blankRange = blankRangeCfg[diff] || [1,2];

  var selected=[], pi;
  for (pi=0; pi<pool.length && selected.length<count; pi++) {
    if (pool[pi].length <= maxLen && pool[pi].length >= 3) selected.push(pool[pi]);
  }
  if (selected.length < count) selected = pool.slice(0, count);

  var container=document.createElement('div'); container.className='anagram-list';
  var i, j;
  for (i=0;i<selected.length;i++){
    var word = selected[i];
    var wantBlanks = blankRange[0] + Math.floor(rng()*(blankRange[1]-blankRange[0]+1));
    var maxBlanks = Math.max(1, word.length-2);
    var numBlanks = Math.min(wantBlanks, maxBlanks);

    var positions=[]; for (j=0;j<word.length;j++) positions.push(j);
    positions.sort(function(){ return rng()-0.5; });
    var blankPositions = positions.slice(0, numBlanks);
    var blankSet = {};
    for (j=0;j<blankPositions.length;j++) blankSet[blankPositions[j]]=true;

    var row=document.createElement('div'); row.className='anagram-row';
    var tiles=document.createElement('div'); tiles.className='anagram-tiles';
    for (j=0;j<word.length;j++){
      var tile=document.createElement('div'); tile.className='anagram-tile';
      if (blankSet[j]) { tile.classList.add('blank'); }
      else { tile.textContent = word[j]; }
      tiles.appendChild(tile);
    }
    row.appendChild(tiles);
    container.appendChild(row);
  }

  var card=makeCard('Lettera mancante','Scopri quali lettere mancano e completa ogni parola!',name);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);

  var keyParts=[];
  for (i=0;i<selected.length;i++) keyParts.push((i+1) + ') ' + selected[i]);
  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzioni per il genitore: ' + keyParts.join(' — ');
  card.appendChild(key);

  addGuideBtn(card,'missingletter');
  area.appendChild(card);
}

/* ==================== SINONIMI E CONTRARI ====================
   Prima scheda della categoria "linguistica avanzata". A differenza di
   Anagrammi/Lettera mancante (riempi lo spazio vuoto), qui il bambino
   deve collegare con una linea due colonne — meccanismo diverso per
   dare varieta' all'app. Fonti di variabilita': (1) pool di 12 coppie
   parola/sinonimo/contrario per fascia; (2) selezione casuale del
   sottoinsieme e del loro ordine; (3) scelta casuale ad ogni scheda se
   lavorare su sinonimi o contrari (solo contrari per explorer, concetto
   piu' intuitivo per i piccoli); (4) la colonna di destra viene
   mescolata garantendo che NESSUna risposta resti sulla riga corretta
   per puro caso (altrimenti sarebbe un aiuto gratuito). */
var SYNANT_VOCAB = {
  explorer: [
    {word:'GRANDE', syn:'ENORME', ant:'PICCOLO'},
    {word:'CALDO', syn:'BOLLENTE', ant:'FREDDO'},
    {word:'ALTO', syn:'LUNGO', ant:'BASSO'},
    {word:'VELOCE', syn:'RAPIDO', ant:'LENTO'},
    {word:'FELICE', syn:'CONTENTO', ant:'TRISTE'},
    {word:'FORTE', syn:'POTENTE', ant:'DEBOLE'},
    {word:'PULITO', syn:'IMMACOLATO', ant:'SPORCO'},
    {word:'PIENO', syn:'COLMO', ant:'VUOTO'},
    {word:'CHIARO', syn:'LUMINOSO', ant:'SCURO'},
    {word:'DOLCE', syn:'ZUCCHERINO', ant:'AMARO'},
    {word:'DURO', syn:'RIGIDO', ant:'MORBIDO'},
    {word:'NUOVO', syn:'RECENTE', ant:'VECCHIO'}
  ],
  curious: [
    {word:'CORAGGIOSO', syn:'AUDACE', ant:'PAUROSO'},
    {word:'GENEROSO', syn:'MUNIFICO', ant:'AVARO'},
    {word:'SILENZIOSO', syn:'QUIETO', ant:'RUMOROSO'},
    {word:'ORDINATO', syn:'METICOLOSO', ant:'DISORDINATO'},
    {word:'GENTILE', syn:'CORTESE', ant:'SGARBATO'},
    {word:'ONESTO', syn:'SINCERO', ant:'BUGIARDO'},
    {word:'PAZIENTE', syn:'TOLLERANTE', ant:'IMPAZIENTE'},
    {word:'CURIOSO', syn:'INTERESSATO', ant:'INDIFFERENTE'},
    {word:'ALLEGRO', syn:'GIOIOSO', ant:'MALINCONICO'},
    {word:'FACILE', syn:'SEMPLICE', ant:'DIFFICILE'},
    {word:'RICCO', syn:'BENESTANTE', ant:'POVERO'},
    {word:'LEGGERO', syn:'ESILE', ant:'PESANTE'}
  ],
  growing: [
    {word:'PERSPICACE', syn:'ACUTO', ant:'OTTUSO'},
    {word:'METICOLOSO', syn:'SCRUPOLOSO', ant:'TRASCURATO'},
    {word:'TENACE', syn:'OSTINATO', ant:'ARRENDEVOLE'},
    {word:'MAGNANIMO', syn:'GENEROSO', ant:'MESCHINO'},
    {word:'LACONICO', syn:'CONCISO', ant:'PROLISSO'},
    {word:'EFFIMERO', syn:'FUGACE', ant:'DURATURO'},
    {word:'AUDACE', syn:'INTREPIDO', ant:'TIMOROSO'},
    {word:'PROSPERO', syn:'FLORIDO', ant:'STENTATO'},
    {word:'LUCIDO', syn:'RAZIONALE', ant:'CONFUSO'},
    {word:'AUTENTICO', syn:'GENUINO', ant:'FASULLO'},
    {word:'ARDUO', syn:'IMPERVIO', ant:'AGEVOLE'},
    {word:'FERTILE', syn:'RIGOGLIOSO', ant:'ARIDO'}
  ],
  challenge: [
    {word:'PERENTORIO', syn:'INDEROGABILE', ant:'OPZIONALE'},
    {word:'EFFERATO', syn:'SPIETATO', ant:'MITE'},
    {word:'PARSIMONIOSO', syn:'ECONOMO', ant:'DISPENDIOSO'},
    {word:'IMPERSCRUTABILE', syn:'ENIGMATICO', ant:'TRASPARENTE'},
    {word:'VERBOSO', syn:'PROLISSO', ant:'CONCISO'},
    {word:'PERVICACE', syn:'OSTINATO', ant:'REMISSIVO'},
    {word:'ALACRE', syn:'SOLERTE', ant:'SVOGLIATO'},
    {word:'SARDONICO', syn:'BEFFARDO', ant:'BONARIO'},
    {word:'INTRANSIGENTE', syn:'RIGIDO', ant:'ACCOMODANTE'},
    {word:'MAGNILOQUENTE', syn:'ENFATICO', ant:'DIMESSO'},
    {word:'PUSILLANIME', syn:'VILE', ant:'PRODE'},
    {word:'ECLETTICO', syn:'POLIEDRICO', ant:'MONOCORDE'}
  ]
};

function generateSinonimiContrari(area, diff, name) {
  var pool = (SYNANT_VOCAB[diff] || SYNANT_VOCAB.curious).slice().sort(function(){ return rng()-0.5; });
  var countCfg = { explorer:5, curious:6, growing:7, challenge:8 };
  var count = Math.min(countCfg[diff] || 6, pool.length);
  var selected = pool.slice(0, count);

  var relationType = diff === 'explorer' ? 'ant' : (rng() < 0.5 ? 'syn' : 'ant');

  var items = [], i;
  for (i=0; i<selected.length; i++) {
    items.push({ letter: String.fromCharCode(65+i), left: selected[i].word, right: selected[i][relationType] });
  }

  /* Mescolo la colonna di destra garantendo nessun punto fermo
     (nessuna risposta resta sulla riga corretta per puro caso). */
  var rightOrder, tries = 0, hasFixedPoint;
  do {
    rightOrder = items.slice().sort(function(){ return rng()-0.5; });
    hasFixedPoint = false;
    for (i=0; i<rightOrder.length; i++) { if (rightOrder[i] === items[i]) { hasFixedPoint = true; break; } }
    tries++;
  } while (hasFixedPoint && tries < 30);

  var wrapDiv = document.createElement('div'); wrapDiv.className = 'synant-columns';

  var colLeft = document.createElement('div'); colLeft.className = 'synant-col left';
  for (i=0; i<items.length; i++) {
    var rowL = document.createElement('div'); rowL.className = 'synant-item';
    var tagL = document.createElement('span'); tagL.className = 'synant-tag'; tagL.textContent = items[i].letter + '.';
    var textL = document.createElement('span'); textL.textContent = items[i].left;
    var dotL = document.createElement('div'); dotL.className = 'synant-dot';
    rowL.appendChild(tagL); rowL.appendChild(textL); rowL.appendChild(dotL);
    colLeft.appendChild(rowL);
  }

  var colRight = document.createElement('div'); colRight.className = 'synant-col right';
  for (i=0; i<rightOrder.length; i++) {
    var rowR = document.createElement('div'); rowR.className = 'synant-item';
    var dotR = document.createElement('div'); dotR.className = 'synant-dot';
    var textR = document.createElement('span'); textR.textContent = rightOrder[i].right;
    rowR.appendChild(dotR); rowR.appendChild(textR);
    colRight.appendChild(rowR);
  }

  wrapDiv.appendChild(colLeft); wrapDiv.appendChild(colRight);

  var subtitle = relationType === 'syn'
    ? 'Collega ogni parola al suo SINONIMO (stesso significato)!'
    : 'Collega ogni parola al suo CONTRARIO (significato opposto)!';
  var card = makeCard('Sinonimi e Contrari', subtitle, name);
  var wrap = makePrintWrap(); wrap.inner.appendChild(wrapDiv); card.appendChild(wrap.outer);

  var keyParts = [];
  for (i=0; i<items.length; i++) keyParts.push(items[i].letter + ') ' + items[i].left + ' → ' + items[i].right);
  var key = document.createElement('div'); key.className = 'answer-key';
  key.textContent = 'Soluzioni per il genitore: ' + keyParts.join(' — ');
  card.appendChild(key);

  addGuideBtn(card, 'synant');
  area.appendChild(card);
}

/* ==================== ORDINA LA FRASE ====================
   Secondo pezzo della categoria "linguistica avanzata". Stesso
   linguaggio visivo di Anagrammi (tessere mescolate + riga per
   riscrivere) ma a livello di PAROLA invece che di lettera: allena
   la sintassi invece dell'ortografia. Fonti di variabilita': (1)
   pool di 12 frasi curate per fascia (lunghezza/complessita'
   crescente); (2) selezione casuale del sottoinsieme; (3)
   mescolamento delle parole per ciascuna frase, garantito sempre
   diverso dall'ordine originale (stesso schema di scrambleWord). */
var SENTENCE_VOCAB = {
  explorer: [
    "Il gatto dorme sul letto.",
    "La mamma cucina la pasta.",
    "Il sole splende nel cielo.",
    "Io mangio una mela rossa.",
    "Il cane corre nel prato.",
    "La nonna legge un libro.",
    "Il bimbo gioca con la palla.",
    "Noi guardiamo le stelle di notte.",
    "Il pesce nuota nel mare blu.",
    "La farfalla vola sopra i fiori.",
    "Il papà lava la macchina rossa.",
    "Io bevo un bicchiere di latte."
  ],
  curious: [
    "Ogni mattina il gallo canta nel cortile della fattoria.",
    "La maestra spiega la lezione con grande pazienza.",
    "Durante l'estate andiamo spesso al mare con gli amici.",
    "Il pompiere ha spento l'incendio in poco tempo.",
    "I bambini costruiscono un castello di sabbia sulla spiaggia.",
    "Il nonno racconta sempre storie divertenti prima di dormire.",
    "La squadra ha vinto la partita con grande entusiasmo.",
    "Gli uccellini costruiscono il nido tra i rami dell'albero.",
    "Ogni sera laviamo i denti prima di andare a letto.",
    "Il fornaio prepara il pane fresco ogni mattina presto.",
    "I ragazzi giocano a calcio nel campo vicino a scuola.",
    "La pioggia ha bagnato tutte le strade della città."
  ],
  growing: [
    "Gli scienziati hanno scoperto una nuova specie di farfalla tropicale.",
    "Durante la gita scolastica abbiamo visitato un antico castello medievale.",
    "Il fiume attraversa la valle formando piccole cascate cristalline.",
    "I contadini raccolgono il grano maturo nei campi dorati d'estate.",
    "L'astronauta ha osservato la Terra dalla finestra della navicella spaziale.",
    "La biblioteca comunale organizza ogni settimana laboratori di lettura per ragazzi.",
    "Gli esploratori hanno attraversato la foresta pluviale senza incontrare pericoli.",
    "Il meccanico ha riparato il motore rotto in appena due ore.",
    "La squadra di nuoto si allena ogni giorno prima delle lezioni.",
    "Un arcobaleno colorato è apparso subito dopo il temporale estivo.",
    "I ricercatori studiano il comportamento dei delfini nell'oceano Pacifico.",
    "Il vulcano è rimasto silenzioso per più di cento anni."
  ],
  challenge: [
    "Nonostante le previsioni avverse, gli alpinisti hanno raggiunto la vetta prima del tramonto.",
    "L'archeologa ha rinvenuto un manufatto antico durante gli scavi nella valle sommersa.",
    "Il governo ha approvato una nuova legge per tutelare le foreste pluviali minacciate.",
    "Gli ingegneri hanno progettato un ponte sospeso capace di resistere ai forti terremoti.",
    "La comunità scientifica discute animatamente le implicazioni etiche della clonazione genetica.",
    "Dopo mesi di allenamento estenuante, l'atleta ha finalmente battuto il record mondiale.",
    "I diplomatici hanno negoziato un accordo di pace dopo lunghe trattative internazionali.",
    "L'astrofisica ha calcolato con precisione la distanza tra la Terra e quella galassia.",
    "Il romanzo racconta la storia di un'esploratrice coraggiosa nell'Antartide inesplorata.",
    "Le nuove tecnologie stanno trasformando radicalmente il modo in cui comunichiamo ogni giorno.",
    "Il chirurgo ha eseguito un intervento delicato con l'aiuto di un braccio robotico.",
    "Gli storici dibattono ancora sulle vere cause del declino di quell'antica civiltà."
  ]
};

function scrambleSentence(words) {
  var scrambled, tries = 0, original = words.join(' ');
  do {
    var arr = words.slice();
    arr.sort(function(){ return rng()-0.5; });
    scrambled = arr;
    tries++;
  } while (scrambled.join(' ') === original && tries < 20);
  return scrambled;
}

function generateOrdinaFrase(area, diff, name) {
  var pool = (SENTENCE_VOCAB[diff] || SENTENCE_VOCAB.curious).slice().sort(function(){ return rng()-0.5; });
  var countCfg = { explorer:4, curious:5, growing:5, challenge:6 };
  var count = Math.min(countCfg[diff] || 5, pool.length);
  var selected = pool.slice(0, count);

  var container = document.createElement('div'); container.className = 'sentence-list';
  var i, j;
  for (i=0; i<selected.length; i++) {
    var words = selected[i].split(' ');
    var scrambled = scrambleSentence(words);

    var row = document.createElement('div'); row.className = 'sentence-row';

    var tilesRow = document.createElement('div'); tilesRow.className = 'sentence-tiles';
    var numLabel = document.createElement('span'); numLabel.className = 'sentence-number'; numLabel.textContent = (i+1) + '.';
    tilesRow.appendChild(numLabel);
    for (j=0; j<scrambled.length; j++) {
      var tile = document.createElement('span'); tile.className = 'sentence-tile'; tile.textContent = scrambled[j];
      tilesRow.appendChild(tile);
    }
    row.appendChild(tilesRow);

    var blank = document.createElement('div'); blank.className = 'sentence-blank';
    row.appendChild(blank);

    container.appendChild(row);
  }

  var card = makeCard('Ordina la frase', 'Riordina le parole per formare una frase con senso compiuto, poi riscrivila sulla riga!', name);
  var wrap = makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);

  var keyParts = [];
  for (i=0; i<selected.length; i++) keyParts.push((i+1) + ') ' + selected[i]);
  var key = document.createElement('div'); key.className = 'answer-key';
  key.textContent = 'Soluzioni per il genitore: ' + keyParts.join(' — ');
  card.appendChild(key);

  addGuideBtn(card, 'sentence');
  area.appendChild(card);
}

/* ==================== VOCABOLARIO IT-EN ====================
   Prima scheda della categoria "lingue straniere". Riusa il layout
   a due colonne collegabili gia' costruito per Sinonimi e Contrari
   (stesse classi CSS .synant-*), ma abbina parola italiana (con
   emoji come rinforzo visivo, "vocabolario illustrato") a
   traduzione inglese, invece di sinonimo/contrario — su richiesta
   esplicita di Salvo di unire le due idee discusse. Le emoji
   sostituiscono immagini caricate, evitando dipendenze da asset
   esterni. Fonti di variabilita': pool di ~60 coppie IT-EN-emoji
   (14-16 per fascia) + selezione casuale sottoinsieme/ordine +
   mescolamento colonna destra senza punti fermi (stesso schema di
   generateSinonimiContrari). */
var EN_VOCAB = {
  explorer: [
    {it:'CANE', en:'DOG', emoji:'🐶'}, {it:'GATTO', en:'CAT', emoji:'🐱'},
    {it:'SOLE', en:'SUN', emoji:'☀️'}, {it:'LUNA', en:'MOON', emoji:'🌙'},
    {it:'MELA', en:'APPLE', emoji:'🍎'}, {it:'CASA', en:'HOUSE', emoji:'🏠'},
    {it:'LIBRO', en:'BOOK', emoji:'📚'}, {it:'PALLA', en:'BALL', emoji:'⚽'},
    {it:'PESCE', en:'FISH', emoji:'🐟'}, {it:'UCCELLO', en:'BIRD', emoji:'🐦'},
    {it:'FIORE', en:'FLOWER', emoji:'🌸'}, {it:'STELLA', en:'STAR', emoji:'⭐'},
    {it:'ALBERO', en:'TREE', emoji:'🌳'}, {it:'LATTE', en:'MILK', emoji:'🥛'},
    {it:'TRENO', en:'TRAIN', emoji:'🚂'}, {it:'OMBRELLO', en:'UMBRELLA', emoji:'☂️'}
  ],
  curious: [
    {it:'FARFALLA', en:'BUTTERFLY', emoji:'🦋'}, {it:'ELEFANTE', en:'ELEPHANT', emoji:'🐘'},
    {it:'ZAINO', en:'BACKPACK', emoji:'🎒'}, {it:'MATITA', en:'PENCIL', emoji:'✏️'},
    {it:'OROLOGIO', en:'CLOCK', emoji:'🕐'}, {it:'SCARPA', en:'SHOE', emoji:'👟'},
    {it:'CAPPELLO', en:'HAT', emoji:'🎩'}, {it:'PIOGGIA', en:'RAIN', emoji:'🌧️'},
    {it:'NEVE', en:'SNOW', emoji:'❄️'}, {it:'GELATO', en:'ICE CREAM', emoji:'🍦'},
    {it:'TORTA', en:'CAKE', emoji:'🎂'}, {it:'CHITARRA', en:'GUITAR', emoji:'🎸'},
    {it:'BICICLETTA', en:'BICYCLE', emoji:'🚲'}, {it:'AEREO', en:'AIRPLANE', emoji:'✈️'},
    {it:'MONTAGNA', en:'MOUNTAIN', emoji:'⛰️'}, {it:'ISOLA', en:'ISLAND', emoji:'🏝️'}
  ],
  growing: [
    {it:'VULCANO', en:'VOLCANO', emoji:'🌋'}, {it:'FORESTA', en:'FOREST', emoji:'🌲'},
    {it:'DESERTO', en:'DESERT', emoji:'🏜️'}, {it:'TEMPESTA', en:'STORM', emoji:'⛈️'},
    {it:'RAZZO', en:'ROCKET', emoji:'🚀'}, {it:'PIANETA', en:'PLANET', emoji:'🪐'},
    {it:'UNIVERSO', en:'UNIVERSE', emoji:'🌌'}, {it:'MICROSCOPIO', en:'MICROSCOPE', emoji:'🔬'},
    {it:'POMPIERE', en:'FIREFIGHTER', emoji:'🚒'}, {it:'MEDICO', en:'DOCTOR', emoji:'🩺'},
    {it:'CASTELLO', en:'CASTLE', emoji:'🏰'}, {it:'TESORO', en:'TREASURE', emoji:'💰'},
    {it:'BUSSOLA', en:'COMPASS', emoji:'🧭'}, {it:'FULMINE', en:'LIGHTNING', emoji:'⚡'},
    {it:'ARCOBALENO', en:'RAINBOW', emoji:'🌈'}, {it:'GHIACCIAIO', en:'GLACIER', emoji:'🧊'}
  ],
  challenge: [
    {it:'CORAGGIOSO', en:'BRAVE', emoji:'🦸'}, {it:'VELOCE', en:'FAST', emoji:'⚡'},
    {it:'SILENZIOSO', en:'QUIET', emoji:'🤫'}, {it:'GENEROSO', en:'GENEROUS', emoji:'🎁'},
    {it:'AVVENTURA', en:'ADVENTURE', emoji:'🗺️'}, {it:'MISTERO', en:'MYSTERY', emoji:'🔍'},
    {it:'LIBERTÀ', en:'FREEDOM', emoji:'🕊️'}, {it:'AMICIZIA', en:'FRIENDSHIP', emoji:'🤝'},
    {it:'CURIOSITÀ', en:'CURIOSITY', emoji:'🧐'}, {it:'IMMAGINAZIONE', en:'IMAGINATION', emoji:'💭'},
    {it:'CONOSCENZA', en:'KNOWLEDGE', emoji:'📖'}, {it:'DETERMINAZIONE', en:'DETERMINATION', emoji:'💪'},
    {it:'PAZIENZA', en:'PATIENCE', emoji:'⏳'}, {it:'GRATITUDINE', en:'GRATITUDE', emoji:'🙏'}
  ]
};

function generateVocabolarioEN(area, diff, name) {
  var pool = (EN_VOCAB[diff] || EN_VOCAB.curious).slice().sort(function(){ return rng()-0.5; });
  var countCfg = { explorer:6, curious:7, growing:8, challenge:9 };
  var count = Math.min(countCfg[diff] || 7, pool.length);
  var selected = pool.slice(0, count);

  var items = [], i;
  for (i=0; i<selected.length; i++) {
    items.push({ letter: String.fromCharCode(65+i), it: selected[i].it, en: selected[i].en, emoji: selected[i].emoji });
  }

  var rightOrder, tries = 0, hasFixedPoint;
  do {
    rightOrder = items.slice().sort(function(){ return rng()-0.5; });
    hasFixedPoint = false;
    for (i=0; i<rightOrder.length; i++) { if (rightOrder[i] === items[i]) { hasFixedPoint = true; break; } }
    tries++;
  } while (hasFixedPoint && tries < 30);

  var wrapDiv = document.createElement('div'); wrapDiv.className = 'synant-columns';

  var colLeft = document.createElement('div'); colLeft.className = 'synant-col left';
  for (i=0; i<items.length; i++) {
    var rowL = document.createElement('div'); rowL.className = 'synant-item';
    var tagL = document.createElement('span'); tagL.className = 'synant-tag'; tagL.textContent = items[i].letter + '.';
    var emojiL = document.createElement('span'); emojiL.textContent = items[i].emoji;
    var textL = document.createElement('span'); textL.textContent = items[i].it;
    var dotL = document.createElement('div'); dotL.className = 'synant-dot';
    rowL.appendChild(tagL); rowL.appendChild(emojiL); rowL.appendChild(textL); rowL.appendChild(dotL);
    colLeft.appendChild(rowL);
  }

  var colRight = document.createElement('div'); colRight.className = 'synant-col right';
  for (i=0; i<rightOrder.length; i++) {
    var rowR = document.createElement('div'); rowR.className = 'synant-item';
    var dotR = document.createElement('div'); dotR.className = 'synant-dot';
    var textR = document.createElement('span'); textR.textContent = rightOrder[i].en;
    rowR.appendChild(dotR); rowR.appendChild(textR);
    colRight.appendChild(rowR);
  }

  wrapDiv.appendChild(colLeft); wrapDiv.appendChild(colRight);

  var card = makeCard('Vocabolario IT-EN', 'Collega ogni parola italiana alla sua traduzione in inglese!', name);
  var wrap = makePrintWrap(); wrap.inner.appendChild(wrapDiv); card.appendChild(wrap.outer);

  var keyParts = [];
  for (i=0; i<items.length; i++) keyParts.push(items[i].letter + ') ' + items[i].it + ' → ' + items[i].en);
  var key = document.createElement('div'); key.className = 'answer-key';
  key.textContent = 'Soluzioni per il genitore: ' + keyParts.join(' — ');
  card.appendChild(key);

  addGuideBtn(card, 'vocaben');
  area.appendChild(card);
}

/* ==================== ANAGRAMMI IN INGLESE ====================
   Riusa il motore di generateAnagrammi (stessa scrambleWord, stesso
   markup .anagram-*) ma su un pool di parole inglesi con traduzione
   italiana abbinata. L'hint (traduzione) e' SEMPRE mostrato, a
   differenza della versione italiana dove compare solo per le fasce
   piu' piccole — senza sapere quale parola cercare, ricostruire
   l'ordine delle lettere in una lingua straniera e' arbitrario. */
var EN_WORD_VOCAB = {
  explorer: [
    {en:'CAT',it:'gatto'}, {en:'DOG',it:'cane'}, {en:'SUN',it:'sole'}, {en:'HAT',it:'cappello'},
    {en:'CUP',it:'tazza'}, {en:'BOX',it:'scatola'}, {en:'PEN',it:'penna'}, {en:'BED',it:'letto'},
    {en:'EGG',it:'uovo'}, {en:'BUS',it:'autobus'}, {en:'STAR',it:'stella'}, {en:'FISH',it:'pesce'}
  ],
  curious: [
    {en:'APPLE',it:'mela'}, {en:'HOUSE',it:'casa'}, {en:'WATER',it:'acqua'}, {en:'HAPPY',it:'felice'},
    {en:'TABLE',it:'tavolo'}, {en:'CHAIR',it:'sedia'}, {en:'MUSIC',it:'musica'}, {en:'GREEN',it:'verde'},
    {en:'SMILE',it:'sorriso'}, {en:'CLOUD',it:'nuvola'}, {en:'BREAD',it:'pane'}, {en:'RIVER',it:'fiume'}
  ],
  growing: [
    {en:'GARDEN',it:'giardino'}, {en:'WINDOW',it:'finestra'}, {en:'FRIEND',it:'amico'}, {en:'ANIMAL',it:'animale'},
    {en:'PICTURE',it:'immagine'}, {en:'KITCHEN',it:'cucina'}, {en:'JOURNEY',it:'viaggio'}, {en:'WEATHER',it:'tempo meteorologico'},
    {en:'FOREST',it:'foresta'}, {en:'CASTLE',it:'castello'}, {en:'ISLAND',it:'isola'}, {en:'DOCTOR',it:'medico'}
  ],
  challenge: [
    {en:'ADVENTURE',it:'avventura'}, {en:'KNOWLEDGE',it:'conoscenza'}, {en:'MOUNTAIN',it:'montagna'}, {en:'ELEPHANT',it:'elefante'},
    {en:'CHOCOLATE',it:'cioccolato'}, {en:'BUTTERFLY',it:'farfalla'}, {en:'TELESCOPE',it:'telescopio'}, {en:'DISCOVERY',it:'scoperta'},
    {en:'FRIENDSHIP',it:'amicizia'}, {en:'IMAGINATION',it:'immaginazione'}, {en:'STRENGTH',it:'forza'}, {en:'CHALLENGE',it:'sfida'}
  ]
};

function generateAnagrammiEN(area, diff, name) {
  var pool = (EN_WORD_VOCAB[diff] || EN_WORD_VOCAB.curious).slice().sort(function(){ return rng()-0.5; });
  var countCfg = { explorer:5, curious:8, growing:10, challenge:12 };
  var count = countCfg[diff] || 8;
  var maxLenCfg = { explorer:5, curious:7, growing:10, challenge:13 };
  var maxLen = maxLenCfg[diff] || 7;

  var selected=[], pi;
  for (pi=0; pi<pool.length && selected.length<count; pi++) {
    if (pool[pi].en.length <= maxLen) selected.push(pool[pi]);
  }
  if (selected.length < count) selected = pool.slice(0, count);

  var container=document.createElement('div'); container.className='anagram-list';
  var i, j;
  for (i=0; i<selected.length; i++){
    var word = selected[i].en;
    var scrambled = scrambleWord(word);
    var row=document.createElement('div'); row.className='anagram-row';

    var tiles=document.createElement('div'); tiles.className='anagram-tiles';
    for (j=0;j<scrambled.length;j++){
      var tile=document.createElement('div'); tile.className='anagram-tile'; tile.textContent=scrambled[j];
      tiles.appendChild(tile);
    }
    row.appendChild(tiles);

    var arrow=document.createElement('div'); arrow.className='anagram-arrow'; arrow.textContent='→';
    row.appendChild(arrow);

    var hint=document.createElement('span'); hint.className='anagram-hint'; hint.textContent='(ITA: ' + selected[i].it + ')';
    row.appendChild(hint);

    var blank=document.createElement('div'); blank.className='anagram-blank';
    row.appendChild(blank);

    container.appendChild(row);
  }

  var card=makeCard('Anagrammi in inglese','Riordina le lettere per scoprire la parola inglese nascosta!',name);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);

  var keyParts=[];
  for (i=0;i<selected.length;i++) keyParts.push((i+1) + ') ' + selected[i].en + ' (' + selected[i].it + ')');
  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzioni per il genitore: ' + keyParts.join(' — ');
  card.appendChild(key);

  addGuideBtn(card,'anagramen');
  area.appendChild(card);
}

/* ==================== LETTERA MANCANTE IN INGLESE ====================
   Riusa il motore di generateLetteraMancante sullo stesso pool
   EN_WORD_VOCAB di generateAnagrammiEN. A differenza della versione
   italiana, mostra sempre la traduzione: il richiamo ortografico in
   lingua straniera ha bisogno di un aggancio al significato, non solo
   al suono della parola. */
function generateLetteraMancanteEN(area, diff, name) {
  var pool = (EN_WORD_VOCAB[diff] || EN_WORD_VOCAB.curious).slice().sort(function(){ return rng()-0.5; });
  var countCfg = { explorer:5, curious:8, growing:10, challenge:12 };
  var count = countCfg[diff] || 8;
  var maxLenCfg = { explorer:6, curious:8, growing:11, challenge:14 };
  var maxLen = maxLenCfg[diff] || 8;
  var blankRangeCfg = { explorer:[1,1], curious:[1,2], growing:[2,3], challenge:[3,4] };
  var blankRange = blankRangeCfg[diff] || [1,2];

  var selected=[], pi;
  for (pi=0; pi<pool.length && selected.length<count; pi++) {
    if (pool[pi].en.length <= maxLen && pool[pi].en.length >= 3) selected.push(pool[pi]);
  }
  if (selected.length < count) selected = pool.slice(0, count);

  var container=document.createElement('div'); container.className='anagram-list';
  var i, j;
  for (i=0;i<selected.length;i++){
    var word = selected[i].en;
    var wantBlanks = blankRange[0] + Math.floor(rng()*(blankRange[1]-blankRange[0]+1));
    var maxBlanks = Math.max(1, word.length-2);
    var numBlanks = Math.min(wantBlanks, maxBlanks);

    var positions=[]; for (j=0;j<word.length;j++) positions.push(j);
    positions.sort(function(){ return rng()-0.5; });
    var blankPositions = positions.slice(0, numBlanks);
    var blankSet = {};
    for (j=0;j<blankPositions.length;j++) blankSet[blankPositions[j]]=true;

    var row=document.createElement('div'); row.className='anagram-row';
    var tiles=document.createElement('div'); tiles.className='anagram-tiles';
    for (j=0;j<word.length;j++){
      var tile=document.createElement('div'); tile.className='anagram-tile';
      if (blankSet[j]) { tile.classList.add('blank'); }
      else { tile.textContent = word[j]; }
      tiles.appendChild(tile);
    }
    row.appendChild(tiles);

    var hint=document.createElement('span'); hint.className='anagram-hint'; hint.textContent='(ITA: ' + selected[i].it + ')';
    row.appendChild(hint);

    container.appendChild(row);
  }

  var card=makeCard('Lettera mancante in inglese','Scopri quali lettere mancano e completa ogni parola inglese!',name);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);

  var keyParts=[];
  for (i=0;i<selected.length;i++) keyParts.push((i+1) + ') ' + selected[i].en + ' (' + selected[i].it + ')');
  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzioni per il genitore: ' + keyParts.join(' — ');
  card.appendChild(key);

  addGuideBtn(card,'missingletteren');
  area.appendChild(card);
}

/* ==================== FRASI DA COMPLETARE IT-EN ====================
   Terza scheda della categoria "lingue straniere". A differenza di
   Vocabolario IT-EN (parola isolata), qui la parola inglese va capita
   dentro una frase intera — un passo verso l'uso reale della lingua.
   Ogni voce del pool ancora il significato tramite la frase italiana
   completa, cosi' la parola corretta non e' ambigua anche se altre
   parole del "word bank" sarebbero grammaticalmente plausibili.
   Fonti di variabilita': pool di 48 frasi (12x4 fasce) + selezione
   casuale sottoinsieme + banca di 3 parole (risposta + 2 distrattori
   pescati a caso dalle altre frasi della stessa fascia) mescolata. */
var FRASI_VOCAB = {
  explorer: [
    {it:'Il gatto è nero.', en:'The cat is ___.', answer:'black'},
    {it:'Il sole è caldo.', en:'The sun is ___.', answer:'hot'},
    {it:'Ho un cane.', en:'I have a ___.', answer:'dog'},
    {it:'La mela è rossa.', en:'The apple is ___.', answer:'red'},
    {it:'Il libro è grande.', en:'The book is ___.', answer:'big'},
    {it:'Il pesce nuota.', en:'The fish can ___.', answer:'swim'},
    {it:'La palla è blu.', en:'The ball is ___.', answer:'blue'},
    {it:'Il latte è bianco.', en:'The milk is ___.', answer:'white'},
    {it:'L\'uccello vola.', en:'The bird can ___.', answer:'fly'},
    {it:'La casa è piccola.', en:'The house is ___.', answer:'small'},
    {it:'Il treno è veloce.', en:'The train is ___.', answer:'fast'},
    {it:'Il fiore è giallo.', en:'The flower is ___.', answer:'yellow'}
  ],
  curious: [
    {it:'Il bambino gioca in giardino.', en:'The child plays in the ___.', answer:'garden'},
    {it:'Mia sorella legge un libro.', en:'My sister reads a ___.', answer:'book'},
    {it:'Noi mangiamo la colazione la mattina.', en:'We eat ___ in the morning.', answer:'breakfast'},
    {it:'Il cielo diventa scuro di notte.', en:'The sky becomes ___ at night.', answer:'dark'},
    {it:'Lei indossa un cappello rosso.', en:'She wears a red ___.', answer:'hat'},
    {it:'Il cane abbaia forte.', en:'The dog barks ___.', answer:'loudly'},
    {it:'Noi andiamo a scuola in autobus.', en:'We go to school by ___.', answer:'bus'},
    {it:'Il gelato si scioglie al sole.', en:'The ice cream melts in the ___.', answer:'sun'},
    {it:'Lui ha molti amici.', en:'He has many ___.', answer:'friends'},
    {it:'La pioggia cade dal cielo.', en:'The rain falls from the ___.', answer:'sky'},
    {it:'Il fiume scorre verso il mare.', en:'The river flows to the ___.', answer:'sea'},
    {it:'I bambini ridono felici.', en:'The children laugh ___.', answer:'happily'}
  ],
  growing: [
    {it:'Gli scienziati studiano il comportamento degli animali.', en:'Scientists study animal ___.', answer:'behavior'},
    {it:'La squadra ha vinto il campionato.', en:'The team won the ___.', answer:'championship'},
    {it:'L\'astronauta ha esplorato lo spazio.', en:'The astronaut explored ___.', answer:'space'},
    {it:'Il vulcano è rimasto silenzioso per anni.', en:'The volcano remained ___ for years.', answer:'silent'},
    {it:'I ricercatori hanno scoperto una nuova specie.', en:'Researchers discovered a new ___.', answer:'species'},
    {it:'La biblioteca è aperta ogni giorno.', en:'The library is ___ every day.', answer:'open'},
    {it:'Il fiume attraversa la valle.', en:'The river crosses the ___.', answer:'valley'},
    {it:'Gli esploratori hanno attraversato la foresta.', en:'The explorers crossed the ___.', answer:'forest'},
    {it:'Il meccanico ha riparato il motore.', en:'The mechanic repaired the ___.', answer:'engine'},
    {it:'Un arcobaleno è apparso dopo il temporale.', en:'A rainbow appeared after the ___.', answer:'storm'},
    {it:'I delfini vivono nell\'oceano.', en:'Dolphins live in the ___.', answer:'ocean'},
    {it:'Il contadino raccoglie il grano.', en:'The farmer harvests the ___.', answer:'wheat'}
  ],
  challenge: [
    {it:'Gli alpinisti hanno raggiunto la vetta prima del tramonto.', en:'The climbers reached the ___ before sunset.', answer:'summit'},
    {it:'L\'archeologa ha scoperto un manufatto antico.', en:'The archaeologist discovered an ancient ___.', answer:'artifact'},
    {it:'Il governo ha approvato una nuova legge.', en:'The government passed a new ___.', answer:'law'},
    {it:'Gli ingegneri hanno progettato un ponte resistente.', en:'The engineers designed a sturdy ___.', answer:'bridge'},
    {it:'La comunità scientifica discute questioni etiche.', en:'The scientific community discusses ethical ___.', answer:'issues'},
    {it:'L\'atleta ha battuto il record mondiale.', en:'The athlete broke the world ___.', answer:'record'},
    {it:'I diplomatici hanno negoziato un accordo di pace.', en:'The diplomats negotiated a peace ___.', answer:'agreement'},
    {it:'Il chirurgo ha eseguito un intervento delicato.', en:'The surgeon performed a delicate ___.', answer:'operation'},
    {it:'Gli storici dibattono sulle cause del declino.', en:'Historians debate the causes of the ___.', answer:'decline'},
    {it:'Le nuove tecnologie trasformano la comunicazione.', en:'New technologies transform ___.', answer:'communication'},
    {it:'Il romanzo racconta una storia di coraggio.', en:'The novel tells a story of ___.', answer:'courage'},
    {it:'Gli studenti hanno presentato un progetto innovativo.', en:'The students presented an innovative ___.', answer:'project'}
  ]
};

function generateFrasiITEN(area, diff, name) {
  var fullPool = FRASI_VOCAB[diff] || FRASI_VOCAB.curious;
  var shuffledPool = fullPool.slice().sort(function(){ return rng()-0.5; });
  var countCfg = { explorer:4, curious:5, growing:5, challenge:6 };
  var count = Math.min(countCfg[diff] || 5, shuffledPool.length);
  var selected = shuffledPool.slice(0, count);

  var container = document.createElement('div'); container.className = 'frasi-list';
  var i, b;
  for (i=0; i<selected.length; i++) {
    var item = selected[i];
    var others = fullPool.filter(function(o){ return o.answer.toLowerCase() !== item.answer.toLowerCase(); });
    others = others.slice().sort(function(){ return rng()-0.5; });
    var distractors = others.slice(0,2).map(function(o){ return o.answer; });
    var bank = [item.answer].concat(distractors);
    bank.sort(function(){ return rng()-0.5; });

    var itemDiv = document.createElement('div'); itemDiv.className = 'frasi-en-item';

    var itLine = document.createElement('div'); itLine.className = 'frasi-it-line';
    itLine.textContent = (i+1) + '. ' + item.it;
    itemDiv.appendChild(itLine);

    var enLine = document.createElement('div'); enLine.className = 'frasi-en-line';
    var parts = item.en.split('___');
    enLine.appendChild(document.createTextNode(parts[0]));
    var blankSpan = document.createElement('span'); blankSpan.className = 'frasi-inline-blank';
    enLine.appendChild(blankSpan);
    enLine.appendChild(document.createTextNode(parts[1] !== undefined ? parts[1] : ''));
    itemDiv.appendChild(enLine);

    var bankDiv = document.createElement('div'); bankDiv.className = 'frasi-bank';
    for (b=0; b<bank.length; b++) {
      var btile = document.createElement('span'); btile.className = 'sentence-tile'; btile.textContent = bank[b];
      bankDiv.appendChild(btile);
    }
    itemDiv.appendChild(bankDiv);

    container.appendChild(itemDiv);
  }

  var card = makeCard('Frasi da completare IT-EN', 'Leggi la frase in italiano, poi scegli dalla banca la parola inglese giusta per completare la frase!', name);
  var wrap = makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);

  var keyParts = [];
  for (i=0; i<selected.length; i++) keyParts.push((i+1) + ') ' + selected[i].en.replace('___', selected[i].answer.toUpperCase()));
  var key = document.createElement('div'); key.className = 'answer-key';
  key.textContent = 'Soluzioni per il genitore: ' + keyParts.join(' — ');
  card.appendChild(key);

  addGuideBtn(card, 'frasien');
  area.appendChild(card);
}

/* ==================== SEQUENZE NUMERICHE ====================
   Fonti di variabilita': (1) generativa pura, ogni sequenza calcolata
   da una formula parametrica; (2) pool di 6 famiglie di regola
   qualitativamente diverse (aritmetica crescente/decrescente,
   geometrica, alternata, Fibonacci, quadrati), scalate per fascia;
   (3) parametri (passo, rapporto, punto di partenza) randomizzati.
   Tutti i rami sono costruiti per non produrre mai numeri negativi
   (margine di sicurezza calcolato analiticamente, non per tentativi). */
function numseqGenerateOne(diff, length) {
  var rulePool;
  if (diff === 'explorer') rulePool = ['arith_asc'];
  else if (diff === 'curious') rulePool = ['arith_asc','arith_desc'];
  else if (diff === 'growing') rulePool = ['arith_asc','arith_desc','geometric'];
  else rulePool = ['arith_asc','arith_desc','geometric','alternating','fibonacci','squares'];

  var rule = rulePool[Math.floor(rng()*rulePool.length)];
  var terms, i;
  if (rule === 'arith_asc') {
    var sr = { explorer:[1,3], curious:[2,6], growing:[3,10], challenge:[3,12] }[diff] || [2,6];
    var step = sr[0] + Math.floor(rng()*(sr[1]-sr[0]+1));
    var start = 1 + Math.floor(rng()*15);
    terms = []; for (i=0;i<length;i++) terms.push(start + i*step);
  } else if (rule === 'arith_desc') {
    var sr2 = { curious:[2,6], growing:[3,10], challenge:[3,12] }[diff] || [2,6];
    var step2 = sr2[0] + Math.floor(rng()*(sr2[1]-sr2[0]+1));
    var maxDrop = step2*(length-1);
    var start2 = maxDrop + 5 + Math.floor(rng()*20);
    terms = []; for (i=0;i<length;i++) terms.push(start2 - i*step2);
  } else if (rule === 'geometric') {
    var ratio = [2,3][Math.floor(rng()*2)];
    var start3 = 1 + Math.floor(rng()*5);
    terms = []; var v=start3; for (i=0;i<length;i++){ terms.push(v); v=v*ratio; }
  } else if (rule === 'alternating') {
    var a = 2+Math.floor(rng()*6), b = 1+Math.floor(rng()*4);
    var start4 = (a+b)*length + 5;
    terms = [start4]; var v4=start4;
    for (i=1;i<length;i++){ v4 = (i%2===1) ? v4+a : v4-b; terms.push(v4); }
  } else if (rule === 'fibonacci') {
    var a5=1+Math.floor(rng()*5), b5=1+Math.floor(rng()*5);
    terms=[a5,b5];
    for (i=2;i<length;i++) terms.push(terms[i-1]+terms[i-2]);
  } else {
    var startIdx = 1+Math.floor(rng()*3);
    terms=[]; for (i=0;i<length;i++) terms.push((startIdx+i)*(startIdx+i));
  }
  return terms;
}

function generateSequenzeNumeriche(area, diff, name) {
  var length = { explorer:6, curious:6, growing:6, challenge:7 }[diff] || 6;
  var count = { explorer:6, curious:6, growing:5, challenge:5 }[diff] || 6;
  var numBlanks = { explorer:1, curious:1, growing:2, challenge:2 }[diff] || 1;

  var container = document.createElement('div'); container.className='numseq-list';
  var solutions = [], p, ti, idx, bi;
  for (p=0; p<count; p++) {
    var terms = numseqGenerateOne(diff, length);
    solutions.push(terms.slice());

    var candidatePositions = [];
    for (idx=1; idx<length; idx++) candidatePositions.push(idx);
    candidatePositions.sort(function(){ return rng()-0.5; });
    var blankPositions = candidatePositions.slice(0, Math.min(numBlanks, candidatePositions.length));
    var blankSet = {};
    for (bi=0; bi<blankPositions.length; bi++) blankSet[blankPositions[bi]] = true;

    var row = document.createElement('div'); row.className='numseq-row';
    var label = document.createElement('span'); label.className='numseq-number'; label.textContent=(p+1)+'.';
    row.appendChild(label);
    for (ti=0; ti<terms.length; ti++) {
      var item = document.createElement('div'); item.className='numseq-item';
      if (blankSet[ti]) { item.className += ' blank'; }
      else { item.textContent = terms[ti]; }
      row.appendChild(item);
    }
    container.appendChild(row);
  }

  var card = makeCard('Sequenze numeriche', 'Scopri la regola nascosta e completa i numeri mancanti!', name);
  var wrap = makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);

  var keyParts=[];
  for (p=0; p<solutions.length; p++) keyParts.push((p+1)+') '+solutions[p].join(', '));
  var key = document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzioni per il genitore: ' + keyParts.join(' — ');
  card.appendChild(key);

  addGuideBtn(card, 'numseq');
  area.appendChild(card);
}

/* ==================== BANDIERE E CAPITALI ====================
   Riusa il layout a due colonne (.synant-*). Fascia explorer: bandiera
   -> nome del paese (concetto piu' intuitivo). Fasce successive: paese
   -> capitale. Stesso schema di derangement delle altre schede a due
   colonne. */
var FLAG_VOCAB = {
  explorer: [
    {country:'ITALIA', capital:'ROMA', flag:'🇮🇹'}, {country:'FRANCIA', capital:'PARIGI', flag:'🇫🇷'},
    {country:'SPAGNA', capital:'MADRID', flag:'🇪🇸'}, {country:'GERMANIA', capital:'BERLINO', flag:'🇩🇪'},
    {country:'STATI UNITI', capital:'WASHINGTON', flag:'🇺🇸'}, {country:'GIAPPONE', capital:'TOKYO', flag:'🇯🇵'},
    {country:'BRASILE', capital:'BRASILIA', flag:'🇧🇷'}, {country:'REGNO UNITO', capital:'LONDRA', flag:'🇬🇧'},
    {country:'CINA', capital:'PECHINO', flag:'🇨🇳'}, {country:'CANADA', capital:'OTTAWA', flag:'🇨🇦'},
    {country:'MESSICO', capital:'CITTA\' DEL MESSICO', flag:'🇲🇽'}, {country:'AUSTRALIA', capital:'CANBERRA', flag:'🇦🇺'}
  ],
  curious: [
    {country:'ITALIA', capital:'ROMA', flag:'🇮🇹'}, {country:'FRANCIA', capital:'PARIGI', flag:'🇫🇷'},
    {country:'SPAGNA', capital:'MADRID', flag:'🇪🇸'}, {country:'GERMANIA', capital:'BERLINO', flag:'🇩🇪'},
    {country:'REGNO UNITO', capital:'LONDRA', flag:'🇬🇧'}, {country:'GIAPPONE', capital:'TOKYO', flag:'🇯🇵'},
    {country:'STATI UNITI', capital:'WASHINGTON', flag:'🇺🇸'}, {country:'RUSSIA', capital:'MOSCA', flag:'🇷🇺'},
    {country:'CINA', capital:'PECHINO', flag:'🇨🇳'}, {country:'CANADA', capital:'OTTAWA', flag:'🇨🇦'},
    {country:'BRASILE', capital:'BRASILIA', flag:'🇧🇷'}, {country:'GRECIA', capital:'ATENE', flag:'🇬🇷'}
  ],
  growing: [
    {country:'PORTOGALLO', capital:'LISBONA', flag:'🇵🇹'}, {country:'PAESI BASSI', capital:'AMSTERDAM', flag:'🇳🇱'},
    {country:'SVIZZERA', capital:'BERNA', flag:'🇨🇭'}, {country:'AUSTRIA', capital:'VIENNA', flag:'🇦🇹'},
    {country:'POLONIA', capital:'VARSAVIA', flag:'🇵🇱'}, {country:'SVEZIA', capital:'STOCCOLMA', flag:'🇸🇪'},
    {country:'NORVEGIA', capital:'OSLO', flag:'🇳🇴'}, {country:'EGITTO', capital:'IL CAIRO', flag:'🇪🇬'},
    {country:'INDIA', capital:'NUOVA DELHI', flag:'🇮🇳'}, {country:'ARGENTINA', capital:'BUENOS AIRES', flag:'🇦🇷'},
    {country:'SUDAFRICA', capital:'PRETORIA', flag:'🇿🇦'}, {country:'TURCHIA', capital:'ANKARA', flag:'🇹🇷'}
  ],
  challenge: [
    {country:'FINLANDIA', capital:'HELSINKI', flag:'🇫🇮'}, {country:'DANIMARCA', capital:'COPENAGHEN', flag:'🇩🇰'},
    {country:'IRLANDA', capital:'DUBLINO', flag:'🇮🇪'}, {country:'UNGHERIA', capital:'BUDAPEST', flag:'🇭🇺'},
    {country:'REPUBBLICA CECA', capital:'PRAGA', flag:'🇨🇿'}, {country:'COREA DEL SUD', capital:'SEUL', flag:'🇰🇷'},
    {country:'THAILANDIA', capital:'BANGKOK', flag:'🇹🇭'}, {country:'INDONESIA', capital:'JAKARTA', flag:'🇮🇩'},
    {country:'NUOVA ZELANDA', capital:'WELLINGTON', flag:'🇳🇿'}, {country:'KENYA', capital:'NAIROBI', flag:'🇰🇪'},
    {country:'CILE', capital:'SANTIAGO', flag:'🇨🇱'}, {country:'MAROCCO', capital:'RABAT', flag:'🇲🇦'}
  ]
};

function generateBandiereCapitali(area, diff, name) {
  var pool = (FLAG_VOCAB[diff] || FLAG_VOCAB.curious).slice().sort(function(){ return rng()-0.5; });
  var count = Math.min({ explorer:6, curious:7, growing:7, challenge:8 }[diff] || 7, pool.length);
  var selected = pool.slice(0, count);
  var isExplorer = diff === 'explorer';

  var items=[], i;
  for (i=0;i<selected.length;i++) items.push({ letter:String.fromCharCode(65+i), flag:selected[i].flag, country:selected[i].country, capital:selected[i].capital });

  var rightOrder, tries=0, hasFixedPoint;
  do {
    rightOrder = items.slice().sort(function(){ return rng()-0.5; });
    hasFixedPoint = false;
    for (i=0;i<rightOrder.length;i++){ if (rightOrder[i]===items[i]){ hasFixedPoint=true; break; } }
    tries++;
  } while (hasFixedPoint && tries<30);

  var wrapDiv=document.createElement('div'); wrapDiv.className='synant-columns';
  var colLeft=document.createElement('div'); colLeft.className='synant-col left';
  for (i=0;i<items.length;i++){
    var rowL=document.createElement('div'); rowL.className='synant-item';
    var tagL=document.createElement('span'); tagL.className='synant-tag'; tagL.textContent=items[i].letter+'.';
    var emojiL=document.createElement('span'); emojiL.style.fontSize='1.3rem'; emojiL.textContent=items[i].flag;
    rowL.appendChild(tagL); rowL.appendChild(emojiL);
    if (!isExplorer) {
      var textL=document.createElement('span'); textL.textContent=items[i].country;
      rowL.appendChild(textL);
    }
    var dotL=document.createElement('div'); dotL.className='synant-dot';
    rowL.appendChild(dotL);
    colLeft.appendChild(rowL);
  }
  var colRight=document.createElement('div'); colRight.className='synant-col right';
  for (i=0;i<rightOrder.length;i++){
    var rowR=document.createElement('div'); rowR.className='synant-item';
    var dotR=document.createElement('div'); dotR.className='synant-dot';
    var textR=document.createElement('span'); textR.textContent = isExplorer ? rightOrder[i].country : rightOrder[i].capital;
    rowR.appendChild(dotR); rowR.appendChild(textR);
    colRight.appendChild(rowR);
  }
  wrapDiv.appendChild(colLeft); wrapDiv.appendChild(colRight);

  var subtitle = isExplorer ? 'Collega ogni bandiera al nome del suo paese!' : 'Collega ogni paese alla sua capitale!';
  var card = makeCard('Bandiere e Capitali', subtitle, name);
  var wrap = makePrintWrap(); wrap.inner.appendChild(wrapDiv); card.appendChild(wrap.outer);

  var keyParts=[];
  for (i=0;i<items.length;i++) keyParts.push(items[i].letter + ') ' + items[i].country + (isExplorer ? '' : ' → ' + items[i].capital));
  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzioni per il genitore: ' + keyParts.join(' — ');
  card.appendChild(key);

  addGuideBtn(card, 'flags');
  area.appendChild(card);
}

/* ==================== RICONOSCI L'EMOZIONE ====================
   Meccanismo diverso dalle altre schede linguistiche (scelta multipla
   invece di collega-le-colonne, per varieta' visiva): per ogni round
   il bambino cerchia, tra 4 faccine, quella che esprime l'emozione
   indicata. Fascia explorer/curious: solo le 6 emozioni di base.
   growing/challenge: pool completo di 14, incluse emozioni piu'
   sfumate. */
var EMOTION_VOCAB = [
  {name:'FELICE', emoji:'😊'}, {name:'TRISTE', emoji:'😢'}, {name:'ARRABBIATO', emoji:'😠'},
  {name:'SORPRESO', emoji:'😲'}, {name:'SPAVENTATO', emoji:'😨'}, {name:'ASSONNATO', emoji:'😴'},
  {name:'ANNOIATO', emoji:'😑'}, {name:'CONFUSO', emoji:'😕'}, {name:'ORGOGLIOSO', emoji:'😌'},
  {name:'IMBARAZZATO', emoji:'😳'}, {name:'INNAMORATO', emoji:'😍'}, {name:'PREOCCUPATO', emoji:'😟'},
  {name:'DIVERTITO', emoji:'😂'}, {name:'DELUSO', emoji:'😞'}
];

function generateRiconosciEmozione(area, diff, name) {
  var basicNames = ['FELICE','TRISTE','ARRABBIATO','SORPRESO','SPAVENTATO','ASSONNATO'];
  var fullPool = (diff==='explorer' || diff==='curious')
    ? EMOTION_VOCAB.filter(function(e){ return basicNames.indexOf(e.name)!==-1; })
    : EMOTION_VOCAB.slice();

  var rounds = Math.min({ explorer:4, curious:5, growing:6, challenge:6 }[diff] || 5, fullPool.length);
  var targets = fullPool.slice().sort(function(){ return rng()-0.5; }).slice(0, rounds);

  var container = document.createElement('div'); container.className='emotion-list';
  var keyParts=[], i, j;
  for (i=0;i<targets.length;i++){
    var target = targets[i];
    var others = fullPool.filter(function(e){ return e.name!==target.name; });
    others = others.slice().sort(function(){ return rng()-0.5; });
    var distractors = others.slice(0, Math.min(3, others.length));
    var options = [target].concat(distractors);
    options.sort(function(){ return rng()-0.5; });

    var round=document.createElement('div'); round.className='emotion-round';
    var targetLabel=document.createElement('div'); targetLabel.className='emotion-target'; targetLabel.textContent=(i+1)+'. Trova: '+target.name;
    round.appendChild(targetLabel);
    var optsDiv=document.createElement('div'); optsDiv.className='emotion-options';
    for (j=0;j<options.length;j++){
      var opt=document.createElement('div'); opt.className='emotion-option'; opt.textContent=options[j].emoji;
      optsDiv.appendChild(opt);
    }
    round.appendChild(optsDiv);
    container.appendChild(round);

    keyParts.push((i+1)+') '+target.name+' '+target.emoji);
  }

  var card = makeCard('Riconosci l\'emozione', 'Cerchia la faccina che esprime l\'emozione indicata!', name);
  var wrap = makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);

  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzioni per il genitore: ' + keyParts.join(' — ');
  card.appendChild(key);

  addGuideBtn(card, 'emotion');
  area.appendChild(card);
}

/* ==================== LINEA DEL TEMPO ====================
   Variante di Ordina la frase a livello di "tappa" invece che di
   parola: il bambino scrive il numero corretto (1,2,3...) sotto ogni
   tappa mescolata invece di riscrivere tutto. Riusa scrambleSentence
   (funzione generica di shuffle-finche'-diverso su array di stringhe,
   gia' scritta per Ordina la frase — nessun nuovo helper necessario).
   Fascia explorer/curious: cicli naturali concreti. growing/challenge:
   processi storici/tecnologici, fatti generalmente noti e non
   controversi. */
var TIMELINE_VOCAB = {
  explorer: [
    {title:'Il ciclo di vita della farfalla', events:['Uovo','Bruco','Crisalide','Farfalla']},
    {title:'Come cresce una pianta', events:['Seme','Germoglio','Pianta','Fiore']},
    {title:'Le fasi della giornata', events:['Mattina','Pomeriggio','Sera','Notte']},
    {title:'Le quattro stagioni', events:['Primavera','Estate','Autunno','Inverno']},
    {title:'Il ciclo di vita della rana', events:['Uovo','Girino','Ranocchio','Rana']},
    {title:'Prepararsi al mattino', events:['Svegliarsi','Lavarsi','Vestirsi','Fare colazione']}
  ],
  curious: [
    {title:'Come si fa il pane', events:['Semina del grano','Raccolto','Macinazione','Impasto','Cottura']},
    {title:'Il ciclo dell\'acqua', events:['Evaporazione','Formazione delle nuvole','Condensazione','Pioggia','Raccolta nei fiumi']},
    {title:'La costruzione di una casa', events:['Fondamenta','Muri','Tetto','Finestre e porte','Finiture']},
    {title:'La crescita di un albero', events:['Seme','Germoglio','Alberello','Albero giovane','Albero maturo']},
    {title:'Preparare una torta', events:['Ingredienti','Impasto','Cottura in forno','Raffreddamento','Decorazione']},
    {title:'Il percorso di una lettera', events:['Scrittura','Imbustamento','Consegna alla posta','Smistamento','Consegna al destinatario']}
  ],
  growing: [
    {title:'Storia dei trasporti', events:['Cavallo','Carrozza','Treno a vapore','Automobile','Aereo']},
    {title:'Evoluzione della comunicazione a distanza', events:['Piccioni viaggiatori','Telegrafo','Telefono','Televisione','Internet']},
    {title:'Storia della scrittura', events:['Pittogrammi','Geroglifici','Alfabeto fenicio','Stampa a caratteri mobili','Computer']},
    {title:'Il ciclo di vita di una stella come il Sole', events:['Nebulosa','Protostella','Stella adulta','Gigante rossa','Nana bianca']},
    {title:'La rivoluzione industriale', events:['Agricoltura tradizionale','Macchina a vapore','Fabbriche','Ferrovie','Produzione di massa']},
    {title:'Storia dell\'illuminazione', events:['Fuoco','Candele','Lampade a olio','Lampadina elettrica','LED']}
  ],
  challenge: [
    {title:'Storia del volo umano', events:['Mongolfiera (1783)','Dirigibile','Primo aereo dei fratelli Wright (1903)','Aerei a reazione','Missione sulla Luna (1969)']},
    {title:'Evoluzione dei computer', events:['Abaco','Calcolatrice meccanica','Primo computer elettronico','Personal computer','Smartphone']},
    {title:'Storia di internet', events:['ARPANET (1969)','Invenzione dell\'email','World Wide Web (1991)','Social network','Internet mobile']},
    {title:'Storia della fotografia', events:['Camera oscura','Prima fotografia permanente (1826)','Pellicola fotografica','Fotocamera digitale','Smartphone con fotocamera']},
    {title:'Evoluzione della musica registrata', events:['Fonografo','Disco in vinile','Musicassetta','CD','Streaming digitale']},
    {title:'Storia dell\'esplorazione spaziale', events:['Primo satellite artificiale (1957)','Primo uomo nello spazio (1961)','Sbarco sulla Luna (1969)','Stazione Spaziale Internazionale','Missioni su Marte']}
  ]
};

function generateLineaDelTempo(area, diff, name) {
  var pool = (TIMELINE_VOCAB[diff] || TIMELINE_VOCAB.curious).slice().sort(function(){ return rng()-0.5; });
  var count = Math.min({ explorer:1, curious:2, growing:2, challenge:2 }[diff] || 2, pool.length);
  var selected = pool.slice(0, count);

  var container = document.createElement('div'); container.className='timeline-list';
  var keyParts=[], bi, ei;
  for (bi=0; bi<selected.length; bi++){
    var theme = selected[bi];
    var shuffledEvents = scrambleSentence(theme.events);

    var block=document.createElement('div'); block.className='timeline-block';
    var titleEl=document.createElement('div'); titleEl.className='timeline-title'; titleEl.textContent=theme.title;
    block.appendChild(titleEl);

    var tilesDiv=document.createElement('div'); tilesDiv.className='timeline-tiles';
    for (ei=0; ei<shuffledEvents.length; ei++){
      var tileWrap=document.createElement('div'); tileWrap.className='timeline-tile';
      var tileText=document.createElement('div'); tileText.className='timeline-tile-text'; tileText.textContent=shuffledEvents[ei];
      var numBox=document.createElement('div'); numBox.className='timeline-numbox';
      tileWrap.appendChild(tileText); tileWrap.appendChild(numBox);
      tilesDiv.appendChild(tileWrap);
    }
    block.appendChild(tilesDiv);
    container.appendChild(block);

    keyParts.push(theme.title + ': ' + theme.events.join(' → '));
  }

  var card = makeCard('Linea del tempo', 'Scrivi il numero giusto (1, 2, 3...) sotto ogni tappa per rimetterle in ordine cronologico!', name);
  var wrap = makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);

  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Soluzioni per il genitore: ' + keyParts.join(' — ');
  card.appendChild(key);

  addGuideBtn(card, 'timeline');
  area.appendChild(card);
}

/* ==================== SEGUI LE ISTRUZIONI ====================
   Introduzione al pensiero computazionale: sequenza di comandi
   direzionali da eseguire passo-passo su una griglia partendo dal
   pallino verde. Il percorso e' generato per rejection sampling
   (si scartano le sequenze che uscirebbero dalla griglia e se ne
   genera un'altra) con un fallback deterministico di sicurezza mai
   osservato necessario nei test. Anteprima soluzione in miniatura
   (canvas, solo schermo) analoga a quella di Picross/v25. */
function generateSegueIstruzioni(area, diff, name) {
  var size = { explorer:4, curious:5, growing:6, challenge:7 }[diff] || 5;
  var numCmd = { explorer:4, curious:5, growing:6, challenge:7 }[diff] || 5;
  var cellPx = { explorer:44, curious:38, growing:34, challenge:30 }[diff] || 38;

  var DIRS = [
    {dir:'up', dr:-1, dc:0, icon:'⬆️', label:'Su'},
    {dir:'down', dr:1, dc:0, icon:'⬇️', label:'Giù'},
    {dir:'left', dr:0, dc:-1, icon:'⬅️', label:'Sinistra'},
    {dir:'right', dr:0, dc:1, icon:'➡️', label:'Destra'}
  ];

  var startR, startC, commands, path, valid=false, attempts=0;
  while (!valid && attempts<200) {
    attempts++;
    startR = 1 + Math.floor(rng()*(size-2));
    startC = 1 + Math.floor(rng()*(size-2));
    var r=startR, c=startC, p=[{r:r,c:c}], cmds=[], ok=true, k;
    for (k=0;k<numCmd;k++){
      var d = DIRS[Math.floor(rng()*DIRS.length)];
      var nr=r+d.dr, nc=c+d.dc;
      if (nr<0||nr>=size||nc<0||nc>=size){ ok=false; break; }
      cmds.push(d); r=nr; c=nc; p.push({r:r,c:c});
    }
    if (ok) { valid=true; commands=cmds; path=p; }
  }
  if (!valid) {
    startR=Math.floor(size/2); startC=0; path=[{r:startR,c:startC}]; commands=[];
    var rr=startR, cc=startC, maxSteps=Math.min(numCmd, size-1), k2;
    for (k2=0;k2<maxSteps;k2++){ cc++; commands.push(DIRS[3]); path.push({r:rr,c:cc}); }
  }

  var gridWrap=document.createElement('div');
  var grid=document.createElement('div'); grid.className='instr-grid';
  grid.style.gridTemplateColumns = 'repeat(' + size + ', ' + cellPx + 'px)';
  var r2,c2;
  for (r2=0;r2<size;r2++){
    for (c2=0;c2<size;c2++){
      var cell=document.createElement('div'); cell.className='instr-cell';
      cell.style.width=cellPx+'px'; cell.style.height=cellPx+'px';
      if (r2===startR && c2===startC) {
        cell.className += ' start';
        var lbl=document.createElement('span'); lbl.className='instr-start-label'; lbl.textContent='P';
        cell.appendChild(lbl);
      }
      grid.appendChild(cell);
    }
  }
  gridWrap.appendChild(grid);

  var cmdsDiv=document.createElement('div'); cmdsDiv.className='instr-commands';
  var ci;
  for (ci=0; ci<commands.length; ci++){
    var chip=document.createElement('div'); chip.className='instr-cmd';
    var numSpan=document.createElement('span'); numSpan.className='instr-cmd-num'; numSpan.textContent=(ci+1)+'.';
    var iconSpan=document.createElement('span'); iconSpan.textContent=commands[ci].icon;
    var labelSpan=document.createElement('span'); labelSpan.textContent=commands[ci].label;
    chip.appendChild(numSpan); chip.appendChild(iconSpan); chip.appendChild(labelSpan);
    cmdsDiv.appendChild(chip);
  }

  var card = makeCard('Segui le istruzioni', 'Parti dal pallino verde ed esegui i comandi in ordine, segnando il percorso sulla griglia. Dove arrivi?', name);
  var wrap = makePrintWrap(); wrap.inner.appendChild(gridWrap); wrap.inner.appendChild(cmdsDiv); card.appendChild(wrap.outer);

  var mini=document.createElement('canvas'); var scale=10;
  mini.width=size*scale; mini.height=size*scale;
  var mctx=mini.getContext('2d');
  mctx.fillStyle='#fffdf7'; mctx.fillRect(0,0,mini.width,mini.height);
  var pi;
  for (pi=0; pi<path.length; pi++){
    mctx.fillStyle = pi===0 ? '#4caf7d' : (pi===path.length-1 ? '#e05f5f' : '#7c5cbf');
    mctx.fillRect(path[pi].c*scale, path[pi].r*scale, scale, scale);
  }
  var key=document.createElement('div'); key.className='answer-key';
  key.style.cssText='display:flex;align-items:center;gap:8px;';
  var keyLabel=document.createElement('span'); keyLabel.textContent='Anteprima percorso e arrivo (solo per te, non compare in stampa):';
  key.appendChild(keyLabel); key.appendChild(mini);
  card.appendChild(key);

  addGuideBtn(card, 'followinstr');
  area.appendChild(card);
}

/* ==================== PREGRAFISMO ====================
   Categoria pensata specificamente per la fascia 3-5 anni: come
   generateColor, ignora volontariamente il selettore età (su
   richiesta esplicita) e genera sempre alla stessa complessità
   "esploratore". Fonti di variabilita': (1) generativa pura, ogni
   tracciato e' calcolato da una formula parametrica; (2) pool ampio
   di 8 famiglie di tracciato diverse; (3) parametri geometrici
   (ampiezza, frequenza, angolo, raggio, posizione) randomizzati ad
   ogni generazione. Ad ogni foglio vengono scelti 3 tracciati
   distinti a caso dal pool. */

function pregrafLine(ctx, box, rngFn, orient) {
  var margin = box.w * 0.09;
  if (orient === 'h') {
    var y = box.y + box.h * (0.35 + rngFn() * 0.3);
    return { pts: [ {x: box.x + margin, y: y}, {x: box.x + box.w - margin, y: y} ] };
  } else if (orient === 'v') {
    var x = box.x + box.w * (0.35 + rngFn() * 0.3);
    return { pts: [ {x: x, y: box.y + margin}, {x: x, y: box.y + box.h - margin} ] };
  } else {
    var goingDown = rngFn() < 0.5;
    var x1 = box.x + margin, x2 = box.x + box.w - margin;
    var y1 = goingDown ? box.y + margin : box.y + box.h - margin;
    var y2 = goingDown ? box.y + box.h - margin : box.y + margin;
    return { pts: [ {x: x1, y: y1}, {x: x2, y: y2} ] };
  }
}

function pregrafWave(ctx, box, rngFn) {
  var margin = box.w * 0.09;
  var x1 = box.x + margin, x2 = box.x + box.w - margin;
  var midY = box.y + box.h / 2;
  var amp = box.h * 0.2 + rngFn() * box.h * 0.12;
  var cycles = 1 + Math.floor(rngFn() * 2.2);
  var steps = 60, pts = [], i, t, x, y;
  for (i = 0; i <= steps; i++) {
    t = i / steps;
    x = x1 + (x2 - x1) * t;
    y = midY + Math.sin(t * Math.PI * 2 * cycles) * amp;
    pts.push({x: x, y: y});
  }
  return { pts: pts };
}

function pregrafZigzag(ctx, box, rngFn) {
  var margin = box.w * 0.09;
  var x1 = box.x + margin, x2 = box.x + box.w - margin;
  var midY = box.y + box.h / 2;
  var amp = box.h * 0.2 + rngFn() * box.h * 0.1;
  var peaks = 3 + Math.floor(rngFn() * 3);
  var pts = [], i, x, y;
  for (i = 0; i <= peaks; i++) {
    x = x1 + (x2 - x1) * (i / peaks);
    y = midY + (i % 2 === 0 ? -amp : amp);
    pts.push({x: x, y: y});
  }
  return { pts: pts };
}

function pregrafCircle(ctx, box, rngFn) {
  var minSide = Math.min(box.w, box.h);
  var r = minSide * 0.26 + rngFn() * minSide * 0.08;
  var cx = box.x + box.w / 2, cy = box.y + box.h / 2;
  var steps = 60, pts = [], i, ang;
  for (i = 0; i <= steps; i++) {
    ang = -Math.PI / 2 + (i / steps) * Math.PI * 2;
    pts.push({x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r});
  }
  return { pts: pts, closed: true };
}

function pregrafSpiral(ctx, box, rngFn) {
  var minSide = Math.min(box.w, box.h);
  var cx = box.x + box.w / 2, cy = box.y + box.h / 2;
  var maxR = minSide * 0.36;
  var turns = 1.4 + rngFn() * 0.7;
  var steps = 80, pts = [], i, t, ang, r;
  for (i = 0; i <= steps; i++) {
    t = i / steps;
    ang = t * turns * Math.PI * 2;
    r = t * maxR;
    pts.push({x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r});
  }
  return { pts: pts };
}

function pregrafArc(ctx, box, rngFn) {
  var minSide = Math.min(box.w, box.h);
  var r = minSide * 0.3 + rngFn() * minSide * 0.08;
  var cx = box.x + box.w / 2, cy = box.y + box.h / 2 + r * 0.25;
  var upward = rngFn() < 0.5;
  var startAng = upward ? Math.PI : 0;
  var endAng = upward ? 0 : Math.PI;
  var steps = 50, pts = [], i, t, ang;
  for (i = 0; i <= steps; i++) {
    t = i / steps;
    ang = startAng + (endAng - startAng) * t;
    pts.push({x: cx + Math.cos(ang) * r, y: cy - Math.sin(ang) * r});
  }
  return { pts: pts };
}

var PREGRAF_TYPES = [
  function(ctx, box, rngFn) { return pregrafLine(ctx, box, rngFn, 'h'); },
  function(ctx, box, rngFn) { return pregrafLine(ctx, box, rngFn, 'v'); },
  function(ctx, box, rngFn) { return pregrafLine(ctx, box, rngFn, 'd'); },
  pregrafWave,
  pregrafZigzag,
  pregrafCircle,
  pregrafSpiral,
  pregrafArc
];

function pregrafDrawDashed(ctx, pts, closed) {
  ctx.save();
  ctx.strokeStyle = '#b5a781';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.setLineDash([11, 9]);
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  var i;
  for (i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  if (closed) ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function pregrafDrawMarker(ctx, pt, color, letter) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, pt.x, pt.y + 1);
  ctx.restore();
}

function generatePregrafismo(area, diff, name) {
  var pad = 24, traceH = 160, gap = 22, w = 700;
  var h = pad * 2 + traceH * 3 + gap * 2;

  var pool = PREGRAF_TYPES.slice().sort(function(){ return rng() - 0.5; });
  var chosen = pool.slice(0, 3);

  var cvs = document.createElement('canvas');
  cvs.width = w; cvs.height = h;
  var ctx = cvs.getContext('2d');
  ctx.fillStyle = '#fffdf7';
  ctx.fillRect(0, 0, w, h);

  var i, box, result;
  for (i = 0; i < chosen.length; i++) {
    box = { x: pad, y: pad + i * (traceH + gap), w: w - pad * 2, h: traceH };
    ctx.fillStyle = '#8a7a60';
    ctx.font = 'bold 14px Nunito, sans-serif';
    ctx.fillText((i + 1) + '.', box.x, box.y + 16);

    result = chosen[i](ctx, box, rng);
    pregrafDrawDashed(ctx, result.pts, !!result.closed);
    pregrafDrawMarker(ctx, result.pts[0], '#4caf7d', 'P');
    if (!result.closed) {
      pregrafDrawMarker(ctx, result.pts[result.pts.length - 1], '#e05f5f', 'A');
    }
  }

  var card = makeCard('Pregrafismo', 'Ripassa con la matita la linea tratteggiata: parti da P e arriva ad A!', name);
  var wrap = makePrintWrap();
  wrap.inner.appendChild(cvs);
  card.appendChild(wrap.outer);

  addGuideBtn(card, 'pregraf');
  area.appendChild(card);
}

/* ==================== DISEGNA CON I NUMERI (nonogram/picross) ====================
   Prima scheda della categoria "logica visiva" (ultimo punto della roadmap
   §12). Fonti di variabilita': (1) pool di 10 disegni disegnati a mano;
   (2) ogni disegno viene ruotato/specchiato a caso (8 orientamenti,
   gruppo diedrale); (3) per le fasce curious/challenge il disegno viene
   inserito con un offset casuale dentro una griglia piu' ampia (bordo
   vuoto variabile). Analogamente al Sudoku (v13), un nonogram scelto a
   caso NON garantisce che i suoi indizi numerici abbiano una soluzione
   deducibile con la sola logica (potrebbe servire "indovinare", il che
   lo rende inadatto a una scheda di carta per bambini) — quindi ogni
   combinazione generata viene verificata con un vero motore di
   risoluzione (line-solving per righe/colonne, iterato fino a
   convergenza) prima di essere accettata; altrimenti si scarta e si
   riprova. */

var PICROSS_SMALL = [
  [ [0,0,1,0,0], [0,0,1,0,0], [1,1,1,1,1], [0,0,1,0,0], [0,0,1,0,0] ], /* croce */
  [ [0,1,0,1,0], [1,1,1,1,1], [1,1,1,1,1], [0,1,1,1,0], [0,0,1,0,0] ], /* cuore */
  [ [0,0,1,0,0], [0,1,1,1,0], [1,1,1,1,1], [0,1,1,1,0], [0,0,1,0,0] ], /* rombo */
  [ [0,0,1,0,0], [0,1,1,1,0], [1,1,1,1,1], [1,0,1,0,1], [1,1,1,1,1] ], /* casa */
  [ [0,0,1,0,0], [0,0,1,0,0], [0,1,1,1,0], [1,1,1,1,1], [0,1,1,1,0] ], /* barca */
  [ [0,1,0,1,0], [1,1,1,1,1], [0,1,1,1,0], [0,0,1,0,0], [0,0,1,0,0] ]  /* fiore */
];

var PICROSS_LARGE = [
  [ [1,0,0,0,0,0,0,0,0,1], [1,1,0,0,0,0,0,0,1,1], [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0], [0,1,1,0,1,1,0,1,1,0], [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,0,0,1,1,1,0], [0,1,1,1,1,1,1,1,1,0], [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0] ], /* gatto */
  [ [0,0,0,0,1,1,0,0,0,0], [0,0,0,1,1,1,1,0,0,0], [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0], [1,1,1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0], [0,0,1,1,1,1,1,1,0,0], [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,0,0,0,0] ], /* rombo grande */
  [ [0,0,0,0,1,1,0,0,0,0], [0,0,0,1,1,1,1,0,0,0], [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0], [0,0,1,1,1,1,1,1,0,0], [1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,1,1,0,0,0,0], [0,0,0,0,1,1,0,0,0,0], [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0] ], /* albero */
  [ [0,0,0,1,1,1,1,0,0,0], [0,0,1,1,1,1,1,1,0,0], [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1], [0,0,0,0,1,0,0,0,0,0], [0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0], [0,0,0,0,1,0,0,0,0,0], [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,0,0,0] ]  /* ombrello */
];

function picrossRotate90(m) {
  var n = m.length, out = [], i, j, row;
  for (i = 0; i < n; i++) {
    row = [];
    for (j = 0; j < n; j++) row.push(m[n - 1 - j][i]);
    out.push(row);
  }
  return out;
}
function picrossFlipH(m) {
  var out = [], i;
  for (i = 0; i < m.length; i++) out.push(m[i].slice().reverse());
  return out;
}
function picrossAllTransforms(base) {
  var t0 = base, t90 = picrossRotate90(t0), t180 = picrossRotate90(t90), t270 = picrossRotate90(t180);
  return [ t0, t90, t180, t270, picrossFlipH(t0), picrossFlipH(t90), picrossFlipH(t180), picrossFlipH(t270) ];
}
function picrossPad(tpl, canvasSize, offR, offC) {
  var grid = [], r, c;
  for (r = 0; r < canvasSize; r++) {
    var row = [];
    for (c = 0; c < canvasSize; c++) row.push(0);
    grid.push(row);
  }
  var tn = tpl.length;
  for (r = 0; r < tn; r++) {
    for (c = 0; c < tn; c++) {
      grid[offR + r][offC + c] = tpl[r][c];
    }
  }
  return grid;
}
function picrossComputeClues(grid) {
  var rows = grid.length, cols = grid[0].length, r, c, count;
  var rowClues = [], colClues = [];
  for (r = 0; r < rows; r++) {
    var runs = []; count = 0;
    for (c = 0; c < cols; c++) {
      if (grid[r][c] === 1) count++;
      else { if (count > 0) { runs.push(count); count = 0; } }
    }
    if (count > 0) runs.push(count);
    rowClues.push(runs);
  }
  for (c = 0; c < cols; c++) {
    var runs2 = []; count = 0;
    for (r = 0; r < rows; r++) {
      if (grid[r][c] === 1) count++;
      else { if (count > 0) { runs2.push(count); count = 0; } }
    }
    if (count > 0) runs2.push(count);
    colClues.push(runs2);
  }
  return { rowClues: rowClues, colClues: colClues };
}

/* Motore di risoluzione logica (line-solving): per una singola riga o
   colonna, enumera tutte le disposizioni di blocchi compatibili con le
   celle gia' note e restituisce solo le celle che risultano identiche
   in TUTTE le disposizioni valide (le uniche deducibili con certezza). */
function picrossEnumerate(clue, length, known, onEach) {
  var n = clue.length;
  var cells = new Array(length);
  function fillRestAndEmit(pos) {
    var k;
    for (k = pos; k < length; k++) {
      if (known[k] === 1) return;
      cells[k] = 0;
    }
    onEach(cells.slice());
  }
  function backtrack(idx, pos) {
    if (idx === n) { fillRestAndEmit(pos); return; }
    var blockLen = clue[idx];
    var remaining = 0, rr;
    for (rr = idx + 1; rr < n; rr++) remaining += clue[rr] + 1;
    var maxStart = length - remaining - blockLen;
    var start, g, b, ok, gapIdx;
    for (start = pos; start <= maxStart; start++) {
      ok = true;
      for (g = pos; g < start; g++) { if (known[g] === 1) { ok = false; break; } }
      if (!ok) continue;
      for (b = start; b < start + blockLen; b++) { if (known[b] === 0) { ok = false; break; } }
      if (!ok) continue;
      gapIdx = start + blockLen;
      if (gapIdx < length && known[gapIdx] === 1) continue;
      for (g = pos; g < start; g++) cells[g] = 0;
      for (b = start; b < start + blockLen; b++) cells[b] = 1;
      if (gapIdx < length) cells[gapIdx] = 0;
      backtrack(idx + 1, gapIdx + 1);
    }
  }
  if (n === 0) {
    var e, validEmpty = true;
    for (e = 0; e < length; e++) { if (known[e] === 1) { validEmpty = false; break; } }
    if (validEmpty) {
      var emptyCells = new Array(length);
      for (e = 0; e < length; e++) emptyCells[e] = 0;
      onEach(emptyCells);
    }
    return;
  }
  backtrack(0, 0);
}
function picrossSolveLine(clue, length, known) {
  var possibleFill = new Array(length), possibleEmpty = new Array(length), total = 0, i;
  for (i = 0; i < length; i++) { possibleFill[i] = 0; possibleEmpty[i] = 0; }
  picrossEnumerate(clue, length, known, function(cells) {
    total++;
    for (var j = 0; j < length; j++) { if (cells[j] === 1) possibleFill[j]++; else possibleEmpty[j]++; }
  });
  var result = known.slice();
  if (total === 0) return result;
  for (i = 0; i < length; i++) {
    if (result[i] === -1) {
      if (possibleFill[i] === total) result[i] = 1;
      else if (possibleEmpty[i] === total) result[i] = 0;
    }
  }
  return result;
}
/* Propaga riga-per-riga e colonna-per-colonna fino a convergenza.
   Restituisce true SOLO se ogni cella risulta univocamente deducibile
   (nessuna cella resta "sconosciuta") — cioe' la scheda si puo'
   risolvere con la sola logica, senza indovinare. */
function picrossFullySolvable(rowClues, colClues, rows, cols) {
  var grid = [], r, c;
  for (r = 0; r < rows; r++) { var row = []; for (c = 0; c < cols; c++) row.push(-1); grid.push(row); }
  var changed = true, iterations = 0, maxIter = (rows + cols) * 3 + 10;
  while (changed && iterations < maxIter) {
    changed = false; iterations++;
    for (r = 0; r < rows; r++) {
      var newRow = picrossSolveLine(rowClues[r], cols, grid[r]);
      for (c = 0; c < cols; c++) { if (newRow[c] !== grid[r][c]) { grid[r][c] = newRow[c]; changed = true; } }
    }
    for (c = 0; c < cols; c++) {
      var colKnown = []; for (r = 0; r < rows; r++) colKnown.push(grid[r][c]);
      var newCol = picrossSolveLine(colClues[c], rows, colKnown);
      for (r = 0; r < rows; r++) { if (newCol[r] !== colKnown[r]) { grid[r][c] = newCol[r]; changed = true; } }
    }
  }
  for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) if (grid[r][c] === -1) return false;
  return true;
}

function generatePicross(area, diff, name) {
  var cfg = {
    explorer:  { canvas: 5,  pad: 0, pool: PICROSS_SMALL },
    curious:   { canvas: 8,  pad: 3, pool: PICROSS_SMALL },
    growing:   { canvas: 10, pad: 0, pool: PICROSS_LARGE },
    challenge: { canvas: 13, pad: 3, pool: PICROSS_LARGE }
  };
  var c = cfg[diff] || cfg.curious;
  var size = c.canvas, pad = c.pad, pool = c.pool;

  var finalGrid = null, rowClues = null, colClues = null;
  var attempts = 0, maxAttempts = 60;
  while (attempts < maxAttempts && !finalGrid) {
    attempts++;
    var baseTpl = pool[Math.floor(rng() * pool.length)];
    var transforms = picrossAllTransforms(baseTpl);
    var tform = transforms[Math.floor(rng() * transforms.length)];
    var offR = pad > 0 ? Math.floor(rng() * (pad + 1)) : 0;
    var offC = pad > 0 ? Math.floor(rng() * (pad + 1)) : 0;
    var grid = picrossPad(tform, size, offR, offC);
    var clues = picrossComputeClues(grid);
    if (picrossFullySolvable(clues.rowClues, clues.colClues, size, size)) {
      finalGrid = grid; rowClues = clues.rowClues; colClues = clues.colClues;
    }
  }
  if (!finalGrid) {
    /* Fallback di sicurezza (non dovrebbe mai servire in pratica):
       primo template, nessuna trasformazione, nessun offset. */
    finalGrid = picrossPad(pool[0], size, 0, 0);
    var fc = picrossComputeClues(finalGrid);
    rowClues = fc.rowClues; colClues = fc.colClues;
  }

  var cellSizeCfg = { explorer: 38, curious: 30, growing: 30, challenge: 24 };
  var cellPx = cellSizeCfg[diff] || 30;

  var table = document.createElement('table'); table.className = 'picross-table';
  var thead = document.createElement('tr');
  var corner = document.createElement('th'); corner.className = 'picross-corner';
  thead.appendChild(corner);
  var c2, k;
  for (c2 = 0; c2 < size; c2++) {
    var th = document.createElement('th'); th.className = 'picross-colclue'; th.style.width = cellPx + 'px';
    var stack = document.createElement('div'); stack.className = 'picross-clue-stack';
    var clueArr = colClues[c2].length ? colClues[c2] : [0];
    for (k = 0; k < clueArr.length; k++) {
      var num = document.createElement('div'); num.textContent = clueArr[k];
      stack.appendChild(num);
    }
    th.appendChild(stack);
    thead.appendChild(th);
  }
  table.appendChild(thead);

  var r2;
  for (r2 = 0; r2 < size; r2++) {
    var tr = document.createElement('tr');
    var rowTh = document.createElement('th'); rowTh.className = 'picross-rowclue';
    var rowStack = document.createElement('div'); rowStack.className = 'picross-clue-row';
    var rArr = rowClues[r2].length ? rowClues[r2] : [0];
    rowStack.textContent = rArr.join(' ');
    rowTh.appendChild(rowStack);
    tr.appendChild(rowTh);
    for (c2 = 0; c2 < size; c2++) {
      var td = document.createElement('td'); td.className = 'picross-cell';
      td.style.width = cellPx + 'px'; td.style.height = cellPx + 'px';
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  var card = makeCard('Disegna con i numeri', 'Segui i numeri di ogni riga e colonna: colora le celle giuste e scoprirai un disegno a sorpresa!', name);
  var wrap = makePrintWrap();
  wrap.inner.appendChild(table);
  card.appendChild(wrap.outer);

  /* Anteprima soluzione in miniatura — solo per il genitore, solo a
     schermo (la classe .answer-key e' nascosta in stampa). */
  var mini = document.createElement('canvas');
  var scale = 5;
  mini.width = size * scale; mini.height = size * scale;
  var mctx = mini.getContext('2d');
  mctx.fillStyle = '#fffdf7'; mctx.fillRect(0, 0, mini.width, mini.height);
  var mr, mc;
  for (mr = 0; mr < size; mr++) {
    for (mc = 0; mc < size; mc++) {
      if (finalGrid[mr][mc] === 1) { mctx.fillStyle = '#2d2416'; mctx.fillRect(mc * scale, mr * scale, scale, scale); }
    }
  }
  var key = document.createElement('div'); key.className = 'answer-key';
  key.style.cssText = 'display:flex;align-items:center;gap:8px;';
  var keyLabel = document.createElement('span'); keyLabel.textContent = 'Anteprima soluzione (solo per te, non compare in stampa):';
  key.appendChild(keyLabel);
  key.appendChild(mini);
  card.appendChild(key);

  addGuideBtn(card, 'picross');
  area.appendChild(card);
}
