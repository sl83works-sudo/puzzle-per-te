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
  path: 'Questa scheda allena la pianificazione motoria e lo scanning visivo guidato da una regola. È importante che il bambino comprenda la regola PRIMA di iniziare a tracciare: fatevela ripetere a voce con parole sue. Per bambini con difficoltà di pianificazione, permettete di seguire il percorso con il dito prima di tracciarlo con la matita.'
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
  card.appendChild(cvs);addGuideBtn(card,'maze');area.appendChild(card);
}

/* ==================== CERCA PAROLE ==================== */
function generateWordSearch(area, diff, name) {
  var vocab={
    explorer:['CANE','GATTO','SOLE','LUNA','MARE','FIORE','RANA','PANE','MELA','PERA','UOVO','LUCE','NASO','MANO','CASA','PORTA','LAGO','PINO','ROSA','ORSO','LUPO','ANATRA','TOPO','GALLO','CAPRA','DADO','PALLA','LETTO','FICO','UVA','RISO','ARCO','VASO','SEDIA','KIWI','ORCA','VOLPE','LEPRE','AQUILA','CIGNO'],
    curious:['FARFALLA','CONIGLIO','CASTELLO','GIRAFFA','ELEFANTE','TARTARUGA','DELFINO','PINGUINO','COCCODRILLO','PAPPAGALLO','LEONESSA','SERPENTE','PANTERA','GORILLA','GHEPARDO','STRUZZO','PAVONE','GABBIANO','RONDINE','PICCHIO','LONTRA','CASTORO','FRAGOLA','LAMPONE','MIRTILLO','ANANAS','MELONE','ARANCIA','LIMONE','AVOCADO','MONTAGNA','VULCANO','FORESTA','PORCOSPINO','PROCIONE','PIRANHA','ARAGOSTA','GRANCHIO','MEDUSA','CAPIBARA'],
    growing:['TIRANNOSAURO','PTERODATTILO','TRICERATOPO','STEGOSAURO','VELOCIRAPTOR','DIPLODOCO','MEGALODONTE','CHIMPANZE','ORANGUTAN','MANDRILLO','CAMOSCIO','STAMBECCO','CARIBU','BISONTE','ANACONDA','PITONE','MAMBA','COBRA','CONDOR','FENICOTTERO','TUCANO','PLATESSA','SALMONE','STORIONE','CARAPACE','TENTACOLO','CLOROFILLA','ASTEROIDE','COSTELLAZIONE','GALASSIA','NEBULOSA','SUPERNOVA','PRISMA','TELESCOPIO','MICROSCOPIO','CIOCCOLATO','MARMELLATA','PASTICCERIA','GELATERIA','ORCHESTRA'],
    challenge:['BIOLUMINESCENZA','FOTOSINTESI','METAMORFOSI','IBERNAZIONE','MIMETISMO','ECOSISTEMA','BIODIVERSITA','VULCANOLOGIA','PALEONTOLOGIA','ENTOMOLOGIA','NEUROSCIENZE','CRITTOGRAFIA','ALGORITMO','INTELLIGENZA','TERMODINAMICA','NANOTECNOLOGIA','BIOTECNOLOGIA','ARCHEOLOGIA','COSMOLOGIA','ASTROFISICA','BIOINFORMATICA','IMMUNOLOGIA','MICROBIOLOGIA','GEOMORFOLOGIA','CLIMATOLOGIA','OCEANOGRAFIA','SISMOLOGIA','GLACIOLOGIA','FITOCHIMICA','ZOOPLANCTON','CLOROFILLA','MITOCONDRIO','CROMOSOMA','RIBOSOMA','PROTEINA','ENZIMA','CATALIZZATORE','POLIMERO','ELETTROLITA','CRISTALLOGRAFIA']
  };
  var pool=(vocab[diff]||vocab['curious']).slice().sort(function(){return rng()-0.5;});
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
  card.appendChild(container);card.appendChild(wordListDiv);addGuideBtn(card,'words');area.appendChild(card);
}

/* ==================== SUDOKU ==================== */
function generateSudoku(area, diff, name) {
  var base=[[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],[8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],[9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]];
  var i,box,r1,r2,c1,c2,r,tmp;
  for(i=0;i<10;i++){box=Math.floor(rng()*3)*3;r1=box+Math.floor(rng()*3);r2=box+Math.floor(rng()*3);tmp=base[r1];base[r1]=base[r2];base[r2]=tmp;}
  for(i=0;i<10;i++){box=Math.floor(rng()*3)*3;c1=box+Math.floor(rng()*3);c2=box+Math.floor(rng()*3);for(r=0;r<9;r++){tmp=base[r][c1];base[r][c1]=base[r][c2];base[r][c2]=tmp;}}
  var remove=diff==='explorer'?25:diff==='curious'?35:diff==='growing'?45:52;
  var puzzle=[],pr,pc;
  for(r=0;r<9;r++)puzzle.push(base[r].slice());
  var removed=0;
  while(removed<remove){pr=Math.floor(rng()*9);pc=Math.floor(rng()*9);if(puzzle[pr][pc]!==0){puzzle[pr][pc]=0;removed++;}}
  var container=document.createElement('div');container.className='sudoku-grid';
  var c,cell;
  for(r=0;r<9;r++)for(c=0;c<9;c++){
    cell=document.createElement('div');cell.className='sudoku-cell'+(puzzle[r][c]!==0?' given':'');
    if((c+1)%3===0&&c<8)cell.classList.add('box-right');
    if((r+1)%3===0&&r<8)cell.classList.add('box-bottom');
    if(puzzle[r][c]!==0)cell.textContent=puzzle[r][c];
    container.appendChild(cell);
  }
  var card=makeCard('Sudoku','Ogni numero da 1 a 9 deve comparire una sola volta per riga, colonna e quadrato 3x3.',name);
  card.appendChild(container);addGuideBtn(card,'sudoku');area.appendChild(card);
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

  var loading = document.createElement('div');
  loading.style.cssText = 'padding:2rem;color:#8a7a60;font-size:0.9rem;font-weight:700;';
  loading.textContent = 'Caricamento immagine...';
  card.appendChild(loading);

  var img = new Image();
  img.onload = function() {
    loading.remove();
    img.style.cssText = 'max-width:100%;border-radius:8px;border:1.5px solid #e8e0d0;display:block;';
    card.insertBefore(img, card.querySelector('.guide-btn'));
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
  card.appendChild(container);
  card.appendChild(answerBox);
  card.appendChild(key);
  addGuideBtn(card,'count');
  area.appendChild(card);
}

/* ==================== SEQUENZA DA RICORDARE ====================
   Fonti di variabilita': pool di 18 simboli + lunghezza sequenza
   variabile per fascia + ordine sempre nuovo. Genera due schede
   (osservazione + richiamo) che si stampano su due pagine separate. */
function generateSequence(area, diff, name) {
  var symbolPool = ['🔴','🔵','🟢','🟡','🟣','⭐','❤️','🔺','⬛','⬜','🍀','🌙','☀️','🐾','🎵','✳️','🔶','🔷'];
  var lengthCfg = { explorer:4, curious:6, growing:8, challenge:10 };
  var len = lengthCfg[diff] || 6;

  var shuffled = symbolPool.slice().sort(function(){ return rng()-0.5; });
  var seq=[], i;
  for (i=0;i<len;i++){ seq.push(shuffled[i % shuffled.length]); }
  seq = seq.sort(function(){ return rng()-0.5; });

  var card1=makeCard('Sequenza da ricordare','Osserva bene questa sequenza con calma, poi gira pagina e prova a ricordarla!',name);
  var row1=document.createElement('div'); row1.className='sequence-row';
  for (i=0;i<len;i++){
    var item=document.createElement('div'); item.className='sequence-item'; item.textContent=seq[i];
    row1.appendChild(item);
  }
  card1.appendChild(row1);
  addGuideBtn(card1,'sequence');
  area.appendChild(card1);

  var card2=makeCard('Ora scrivila a memoria!','Disegna o scrivi i simboli nell\'ordine in cui li ricordi, nelle caselle qui sotto.',name);
  var row2=document.createElement('div'); row2.className='sequence-row';
  for (i=0;i<len;i++){
    var empty=document.createElement('div'); empty.className='sequence-item empty';
    row2.appendChild(empty);
  }
  card2.appendChild(row2);
  var key=document.createElement('div'); key.className='answer-key';
  key.textContent = 'Sequenza originale per il genitore: ' + seq.join(' ');
  card2.appendChild(key);
  addGuideBtn(card2,'sequence');
  area.appendChild(card2);
}

/* ==================== PERCORSO GUIDATO ====================
   Fonti di variabilita': percorso generato con random-walk (sempre
   diverso) + pool di 3 tipi di regola (colore / frecce / numeri) +
   parametro della regola scelto a caso (colore target, direzione). */
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

  var ruleType = Math.floor(rng()*3);
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
  } else if (ruleType===1) {
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
  } else {
    ruleText = 'Collega i numeri in ordine crescente da 1 a '+path.length+', partendo dalla S!';
    for (pi=0;pi<path.length;pi++){
      grid[path[pi].y][path[pi].x].symbol = String(pi+1);
      grid[path[pi].y][path[pi].x].color = '#2d2416';
    }
    for (r=0;r<h;r++) for (c=0;c<w;c++){
      if (!grid[r][c].symbol) {
        var randNum = Math.floor(rng()*(path.length*2))+1;
        grid[r][c].symbol = String(randNum);
        grid[r][c].color = '#8a7a60';
      }
    }
  }

  var container=document.createElement('div'); container.className='path-grid';
  container.style.gridTemplateColumns = 'repeat(' + w + ', 32px)';
  container.style.gridTemplateRows = 'repeat(' + h + ', 32px)';
  for (r=0;r<h;r++){
    for (c=0;c<w;c++){
      var cell=document.createElement('div'); cell.className='path-cell';
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
  card.appendChild(container);
  addGuideBtn(card,'path');
  area.appendChild(card);
}
