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
  tables: 'Questa scheda allena la memoria a lungo termine dei fatti numerici (le tabelline), non il ragionamento: l\'obiettivo è il richiamo automatico, non il "ricalcolo" ogni volta. Se il bambino conta ancora sulle dita o si aiuta con le addizioni ripetute, va benissimo così nelle prime fasi — è un passaggio naturale prima della memorizzazione vera. L\'ordine mescolato è voluto: se recita la tabellina in sequenza da capo ogni volta, probabilmente la sta ancora imparando "a canzoncina" invece che a memoria vera, ed è un segnale utile per voi genitori.',
  anagram: 'Questa scheda allena la consapevolezza fonologica e ortografica: il bambino deve riconoscere una parola indipendentemente dall\'ordine delle lettere, il che rinforza la sua rappresentazione mentale della parola stessa. Suggerite di leggere le lettere ad alta voce una alla volta prima di provare a ricomporle, e di partire dalle lettere che "sembrano familiari" insieme (es. sillabe comuni). Per le fasce più piccole l\'iniziale della parola è indicata come aiuto: se il bambino la ignora e prova comunque a indovinare a caso, è utile fargliela notare esplicitamente.',
  missingletter: 'Questa scheda allena la memoria ortografica: il bambino deve richiamare come si scrive una parola, non solo riconoscerla. È un compito diverso e più impegnativo del semplice leggere. Se il bambino resta bloccato, fatelo pronunciare la parola intera ad alta voce, sillaba per sillaba: spesso il suono suggerisce la lettera mancante meglio di quanto non faccia guardare lo spazio vuoto sulla carta.'
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
    loading.textContent = 'Immagine non trovata. Controlla che il file ' + src + ' esista nella cartella /images/color/.';
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
    ruleText = 'Segui solo i pallini di questo colore, dalla S alla E: <span style="display:inline-block;width:15px;height:15px;border-radius:50%;background:'+targetColor+';vertical-align:middle;margin-left:4px;"></span>';
    for (r=0;r<h;r++) for (c=0;c<w;c++){
      var k1=c+'_'+r;
      if (pathSet.hasOwnProperty(k1)) { grid[r][c].symbol='●'; grid[r][c].color=targetColor; }
      else { grid[r][c].symbol='●'; grid[r][c].color=colorPalette[Math.floor(rng()*colorPalette.length)]; }
    }
  } else {
    ruleText = 'Segui le frecce dalla partenza (S) fino all\'arrivo (E)!';
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
      if (isStart) { cell.classList.add('start'); cell.textContent='S'; }
      else if (isEnd) { cell.classList.add('end'); cell.textContent='E'; }
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
  ruleDiv.textContent = 'Cerchia con la matita ogni coppia di simboli identici che trovi!';
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
    explorer:  { tableMin:2, tableMax:3,  multMax:5,  count:5  },
    curious:   { tableMin:2, tableMax:5,  multMax:10, count:8  },
    growing:   { tableMin:2, tableMax:10, multMax:10, count:10 },
    challenge: { tableMin:2, tableMax:12, multMax:12, count:12 }
  };
  var c = cfg[diff] || cfg.curious;
  var table = randIntCalc(c.tableMin, c.tableMax);

  var multipliers=[], i;
  for (i=1;i<=c.multMax;i++) multipliers.push(i);
  multipliers.sort(function(){ return rng()-0.5; });
  var chosen = multipliers.slice(0, c.count);

  var container=document.createElement('div'); container.className='calc-grid';
  var answers=[];
  for (i=0;i<chosen.length;i++){
    var mult = chosen[i];
    var ans = table*mult;
    answers.push(ans);
    var cell=document.createElement('div'); cell.className='calc-problem';
    cell.innerHTML = '<div class="calc-horizontal">' + table + ' × ' + mult + ' = <span class="calc-blank"></span></div>';
    container.appendChild(cell);
  }

  var card=makeCard('Tabelline','Esercitati con la tabellina del ' + table + '!',name);
  var wrap=makePrintWrap(); wrap.inner.appendChild(container); card.appendChild(wrap.outer);

  var keyParts=[];
  for (i=0;i<answers.length;i++) keyParts.push(table + '×' + chosen[i] + '=' + answers[i]);
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
