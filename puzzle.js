/* ============================================================
   PUZZLE PER TE! — puzzle_v5.js
   Fasce d'età: explorer(3-5), curious(6-8), growing(9-11), challenge(12+)
   ============================================================ */

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
  if      (currentType === 'maze')        generateMaze(area, diff, name);
  else if (currentType === 'wordsearch')  generateWordSearch(area, diff, name);
  else if (currentType === 'differences') generateDifferences(area, diff, name);
  else if (currentType === 'sudoku')      generateSudoku(area, diff, name);
  else if (currentType === 'connect')     generateConnect(area, diff, name);
  else if (currentType === 'stickman')    generateStickman(area, diff, name);
  else if (currentType === 'colorbynumber') generateColorByNumber(area, diff, name);
  else if (currentType === 'sequence')    generateSequence(area, diff, name);
  else if (currentType === 'mirror')      generateMirror(area, diff, name);
  else if (currentType === 'intruder')    generateIntruder(area, diff, name);
  else if (currentType === 'pairs')       generatePairs(area, diff, name);
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

/* ---- Sezione per genitori ---- */
var parentGuides = {
  maze: {
    title: 'Labirinto — Guida per genitori e operatori',
    text: 'Il labirinto allena la pianificazione visiva, la perseveranza e il controllo dell\'impulsività. Prima di iniziare, invitate il bambino a "guardare tutto" il labirinto per qualche secondo. Se si blocca, ditegli: "Prova a tornare indietro". Per bambini con ADHD, lavorate su un labirinto alla volta e celebrate ogni uscita dal vicolo cieco come un successo.'
  },
  wordsearch: {
    title: 'Cerca parole — Guida per genitori e operatori',
    text: 'Il cerca parole allena la discriminazione visiva, la concentrazione selettiva e il riconoscimento ortografico. Suggerite al bambino di cercare una parola alla volta, scandendone le lettere ad alta voce. Per bambini con DSA, potete coprire parte della griglia con un foglio bianco per ridurre il carico visivo.'
  },
  differences: {
    title: 'Trova le differenze — Guida per genitori e operatori',
    text: 'Questo puzzle allena l\'attenzione sostenuta e la scansione sistematica. Insegnate al bambino a esplorare le immagini dall\'alto verso il basso, zona per zona. Per bambini con deficit attentivo, potete dividere l\'immagine in quadranti con un dito e cercare le differenze un quadrante alla volta.'
  },
  sudoku: {
    title: 'Sudoku — Guida per genitori e operatori',
    text: 'Il sudoku sviluppa il ragionamento logico, la memoria di lavoro e la tolleranza alla frustrazione. Partite sempre dai quadrati con più numeri già inseriti. Per bambini più piccoli, usate prima la versione 4x4 disegnata a mano. Ricordate: non ci sono calcoli, solo logica — rassicurate il bambino che "non è matematica".'
  },
  connect: {
    title: 'Unisci i punti — Guida per genitori e operatori',
    text: 'Questo esercizio allena la coordinazione occhio-mano, la sequenzialità e la gratificazione differita. Incoraggiate il bambino a nominare i numeri ad alta voce mentre li collega. La forma che emerge alla fine è una ricompensa visiva potente. Per bambini con difficoltà motorie, usate pennarelli più grandi.'
  },
  stickman: {
    title: 'Stickman — Guida per genitori e operatori',
    text: 'Le carte stickman sviluppano il riconoscimento dei colori, la copia di modelli e la coordinazione visuo-motoria. Mostrate una carta alla volta al bambino e chiedetegli di identificare prima i colori, poi la postura. Potete usare le carte come istruzioni per movimenti corporei reali: "Metti il braccio come l\'omino rosso!" — ottimo anche come gioco motorio.'
  },
  colorbynumber: {
    title: 'Colora per numero — Guida per genitori e operatori',
    text: 'Questo esercizio allena l\'associazione simbolo-colore, la motricità fine e la concentrazione. Preparate prima i pennarelli o matite colorata numerandoli. Incoraggiate il bambino a completare tutte le zone dello stesso colore prima di cambiare. Per bambini con ADHD, iniziate con sagome semplici e poche zone.'
  },
  sequence: {
    title: 'Completa la sequenza — Guida per genitori e operatori',
    text: 'Le sequenze sviluppano il pensiero logico, il riconoscimento di pattern e la memoria a breve termine. Prima di rispondere, chiedete al bambino di descrivere ad alta voce cosa vede: "Cosa cambia ogni volta?". Per bambini con difficoltà cognitive, mostrate la sequenza con oggetti fisici reali dopo aver visto quella stampata.'
  },
  mirror: {
    title: 'Disegna il riflesso — Guida per genitori e operatori',
    text: 'Questo puzzle allena la coordinazione visuo-spaziale, la lateralità e il controllo motorio. Spiegate prima il concetto di "specchio" con un riflesso reale. Per bambini più piccoli, potete aiutarli tenendo insieme la matita. Elogiate il processo, non la perfezione del risultato.'
  },
  intruder: {
    title: 'Trova l\'intruso — Guida per genitori e operatori',
    text: 'Trovare l\'intruso allena la discriminazione visiva, la categorizzazione e il ragionamento induttivo. Dopo che il bambino trova l\'intruso, chiedetegli sempre: "Perché è diverso?" per stimolare la verbalizzazione del ragionamento. Per bambini con deficit attentivo, iniziate con serie corte di 4 elementi.'
  },
  pairs: {
    title: 'Associa le coppie — Guida per genitori e operatori',
    text: 'Associare coppie sviluppa la memoria semantica, le connessioni logiche e il vocabolario. Potete giocare in due: un adulto indica un elemento, il bambino trova la coppia. Per bambini con difficoltà linguistiche, nominate insieme ogni elemento prima di cercare le associazioni. Celebrate ogni collegamento trovato.'
  }
};

function showGuide(type) {
  var existing = document.getElementById('parentGuide');
  if (existing) { existing.remove(); return; }
  var guide = parentGuides[type];
  if (!guide) return;
  var div = document.createElement('div');
  div.id = 'parentGuide';
  div.className = 'parent-guide';
  div.innerHTML = '<div class="guide-title">' + guide.title + '</div><div class="guide-text">' + guide.text + '</div><button class="guide-close" onclick="document.getElementById(\'parentGuide\').remove()">Chiudi</button>';
  var area = document.getElementById('puzzleArea');
  area.insertBefore(div, area.firstChild);
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
  carve(0,0);
  var pad=10;
  var cvs=document.createElement('canvas');
  cvs.width=w*cellSize+pad*2;cvs.height=h*cellSize+pad*2;
  var ctx=cvs.getContext('2d');
  ctx.fillStyle='#fafaf7';ctx.fillRect(0,0,cvs.width,cvs.height);
  ctx.strokeStyle='#2d2416';ctx.lineWidth=2;ctx.lineCap='square';
  var x,y,px,py;
  for(y=0;y<h;y++)for(x=0;x<w;x++){
    px=x*cellSize+pad;py=y*cellSize+pad;
    if(grid[y][x]&N){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+cellSize,py);ctx.stroke();}
    if(grid[y][x]&W){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,py+cellSize);ctx.stroke();}
    if(x===w-1){ctx.beginPath();ctx.moveTo(px+cellSize,py);ctx.lineTo(px+cellSize,py+cellSize);ctx.stroke();}
    if(y===h-1){ctx.beginPath();ctx.moveTo(px,py+cellSize);ctx.lineTo(px+cellSize,py+cellSize);ctx.stroke();}
  }
  ctx.clearRect(pad,pad,2,cellSize);
  ctx.clearRect(pad+(w-1)*cellSize,pad+(h-1)*cellSize,2,cellSize+2);
  ctx.fillStyle='#4caf7d';ctx.font='bold 11px sans-serif';ctx.fillText('GO',pad+1,pad+cellSize-4);
  ctx.fillStyle='#e04f4f';ctx.fillText('OK',pad+(w-1)*cellSize,pad+(h-1)*cellSize+cellSize-3);
  var card=makeCard('Labirinto',"Trova la via d'uscita! (GO = inizio, OK = fine)",name);
  card.appendChild(cvs);
  var gb=document.createElement('button');gb.className='guide-btn';gb.textContent='Guida per genitori';gb.onclick=function(){showGuide('maze');};
  card.appendChild(gb);area.appendChild(card);
}

/* ==================== CERCA PAROLE ==================== */
function generateWordSearch(area, diff, name) {
  var vocab = {
    explorer: [
      'CANE','GATTO','SOLE','LUNA','MARE','FIORE','RANA','PANE','MELA','PERA',
      'UOVO','LUCE','NASO','MANO','CASA','PORTA','LAGO','PINO','ROSA','ORSO',
      'LUPO','ANATRA','TOPO','GALLO','CAPRA','ELMO','DADO','PALLA','LETTO','FICO',
      'UVA','RISO','RETE','ARCO','VASO','SEDIA','KIWI','ORCA','VOLPE','LEPRE'
    ],
    curious: [
      'FARFALLA','CONIGLIO','CASTELLO','GIRAFFA','ELEFANTE','TARTARUGA','DELFINO',
      'PINGUINO','COCCODRILLO','PAPPAGALLO','LEONESSA','SERPENTE','PANTERA','GORILLA',
      'GHEPARDO','STRUZZO','PAVONE','GABBIANO','CARDELLINO','RONDINE','PICCHIO',
      'LONTRA','CASTORO','FRAGOLA','LAMPONE','MIRTILLO','ANANAS','COCCO','MELONE',
      'ARANCIA','LIMONE','AVOCADO','CASTELLO','GIARDINO','MONTAGNA','VULCANO',
      'FORESTA','DESERTO','PORCOSPINO','PROCIONE','ORNITORINCO','CAMALEONTE',
      'PIRANHA','ARAGOSTA','GRANCHIO','MEDUSA','LIBELLULA','CICOGNA','CAPIBARA'
    ],
    growing: [
      'TIRANNOSAURO','PTERODATTILO','TRICERATOPO','STEGOSAURO','VELOCIRAPTOR',
      'DIPLODOCO','MEGALODONTE','CHIMPANZE','ORANGUTAN','MANDRILLO','BABBUINO',
      'CAMOSCIO','STAMBECCO','CARIBU','BISONTE','ANACONDA','PITONE','MAMBA',
      'COBRA','CONDOR','FENICOTTERO','MARABOU','TUCANO','PLATESSA','SALMONE',
      'STORIONE','CARAPACE','TENTACOLO','CLOROFILLA','FOTOSINTESI','ASTEROIDE',
      'COSTELLAZIONE','GALASSIA','NEBULOSA','SUPERNOVA','CALEIDOSCOPIO','PRISMA',
      'PERISCOPO','TELESCOPIO','MICROSCOPIO','CIOCCOLATO','MARMELLATA','CARAMELLA',
      'PASTICCERIA','GELATERIA','PIZZERIA','BIBLIOTECARIO','MATEMATICA','ORCHESTRA'
    ],
    challenge: [
      'BIOLUMINESCENZA','FOTOSINTESI','METAMORFOSI','IBERNAZIONE','MIMETISMO',
      'ECOSISTEMA','BIODIVERSITA','VULCANOLOGIA','PALEONTOLOGIA','ENTOMOLOGIA',
      'NEUROSCIENZE','CRITTOGRAFIA','ALGORITMO','INTELLIGENZA','CIBERNETICA',
      'TERMODINAMICA','ELETTROMAGNETISMO','NANOTECNOLOGIA','BIOTECNOLOGIA',
      'ARCHEOLOGIA','ANTROPOLOGIA','COSMOLOGIA','ASTROFISICA','BIOINFORMATICA',
      'ENDOCRINOLOGIA','IMMUNOLOGIA','MICROBIOLOGIA','GEOMORFOLOGIA','IDROGEOLOGIA',
      'CLIMATOLOGIA','OCEANOGRAFIA','VULCANOLOGIA','SISMOLOGIA','GLACIOLOGIA',
      'FITOCHIMICA','ZOOPLANCTON','FITOPLANCTON','CLOROFILLA','MITOCONDRIO',
      'CROMOSOMA','RIBOSOMA','PROTEINA','ENZIMA','CATALIZZATORE','POLIMERO',
      'ELETTROLITA','SUPERCONDUTTORE','FERMENTAZIONE','CRISTALLOGRAFIA'
    ]
  };

  var pool = vocab[diff] || vocab['curious'];
  pool = pool.slice().sort(function(){return rng()-0.5;});
  var maxLen = diff==='explorer'?5:diff==='curious'?9:diff==='growing'?13:18;
  var minLen = diff==='explorer'?3:diff==='curious'?5:diff==='growing'?7:9;
  var selected=[];
  for(var pi=0;pi<pool.length&&selected.length<8;pi++){
    if(pool[pi].length>=minLen&&pool[pi].length<=maxLen) selected.push(pool[pi]);
  }
  if(selected.length<6) selected=pool.slice(0,6);
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
      for(i=0;i<word.length;i++){
        nx=sx+dir.dx*i;ny=sy+dir.dy*i;
        if(nx<0||nx>=gridSize||ny<0||ny>=gridSize){ok=false;break;}
        if(grid[ny][nx]!==''&&grid[ny][nx]!==word[i]){ok=false;break;}
        cells.push({x:nx,y:ny});
      }
      if(ok){for(var j=0;j<cells.length;j++)grid[cells[j].y][cells[j].x]=word[j];return;}
    }
  }
  var wi;
  for(wi=0;wi<allWords.length;wi++) placeWord(allWords[wi]);
  for(r=0;r<gridSize;r++) for(c=0;c<gridSize;c++) if(grid[r][c]==='') grid[r][c]=LETTERS[Math.floor(rng()*26)];
  var container=document.createElement('div');container.className='word-grid';
  var gy,gx,row,cell;
  for(gy=0;gy<gridSize;gy++){
    row=document.createElement('div');row.className='word-grid-row';
    for(gx=0;gx<gridSize;gx++){
      cell=document.createElement('div');cell.className='word-cell';
      cell.textContent=grid[gy][gx];row.appendChild(cell);
    }
    container.appendChild(row);
  }
  var wordListDiv=document.createElement('div');wordListDiv.className='wordlist';
  for(wi=0;wi<allWords.length;wi++){
    var chip=document.createElement('span');chip.className='word-chip';
    chip.textContent=allWords[wi];wordListDiv.appendChild(chip);
  }
  var card=makeCard('Cerca le parole','Trova tutte le parole elencate qui sotto nella griglia!',name);
  card.appendChild(container);card.appendChild(wordListDiv);
  var gb=document.createElement('button');gb.className='guide-btn';gb.textContent='Guida per genitori';gb.onclick=function(){showGuide('wordsearch');};
  card.appendChild(gb);area.appendChild(card);
}

/* ==================== TROVA LE DIFFERENZE ==================== */
function generateDifferences(area, diff, name) {
  var numDiff = diff==='explorer'?2:diff==='curious'?4:diff==='growing'?6:8;
  var W=260, H=200;

  var scenes = [
    { name:'Casetta', fn: function(ctx,m){
      ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#7ec850';ctx.fillRect(0,130,W,70);
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(210,35,22,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#f5e6d0';ctx.fillRect(65,95,80,65);
      ctx.fillStyle='#c0392b';ctx.beginPath();ctx.moveTo(58,95);ctx.lineTo(105,55);ctx.lineTo(152,95);ctx.closePath();ctx.fill();
      ctx.fillStyle='#8B4513';ctx.fillRect(92,125,22,35);
      if(!m[0]){ctx.fillStyle='#87ceeb';ctx.fillRect(118,105,18,16);ctx.strokeStyle='#999';ctx.lineWidth=1;ctx.strokeRect(118,105,18,16);}
      ctx.fillStyle='#795548';ctx.fillRect(m[1]?168:173,112,10,35);
      ctx.fillStyle='#4caf7d';ctx.beginPath();ctx.arc(m[1]?173:178,102,m[2]?14:20,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='white';var cx=48;
      ctx.beginPath();ctx.arc(cx,42,13,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(cx+14,37,16,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(cx+28,42,12,0,Math.PI*2);ctx.fill();
      if(m[3]){ctx.fillStyle='white';ctx.beginPath();ctx.arc(170,22,11,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(181,18,13,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(192,22,10,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#795548';ctx.fillRect(125,62,11,m[4]?20:30);
      ctx.fillStyle='#d4b483';ctx.fillRect(99,152,20,48);
      if(m[5]){ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(105,120,5,0,Math.PI*2);ctx.fill();}
      if(!m[6]){ctx.fillStyle='#4caf7d';ctx.fillRect(65,155,30,8);ctx.fillRect(65,166,30,8);}
      if(m[7]){ctx.fillStyle='#795548';ctx.fillRect(20,100,18,58);}
      ctx.fillStyle='#f5c842';for(var bi=0;bi<(m[8]?2:4);bi++){ctx.beginPath();ctx.arc(20+bi*12,35,3,0,Math.PI*2);ctx.fill();}
      if(!m[9]){ctx.fillStyle='#c0392b';ctx.beginPath();ctx.arc(210,35,8,0,Math.PI*2);ctx.fill();}
    }},
    { name:'Spiaggia', fn: function(ctx,m){
      ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,W,120);
      ctx.fillStyle='#4a90d9';ctx.fillRect(0,108,W,92);
      ctx.fillStyle='#f4d03f';ctx.fillRect(0,128,W,72);
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(225,38,26,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(85,88,m[0]?30:42,Math.PI,0);ctx.fill();
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(85,88,m[0]?15:21,Math.PI,0);ctx.fill();
      ctx.fillStyle='#795548';ctx.fillRect(83,88,4,m[1]?38:50);
      ctx.fillStyle='#d4b483';ctx.fillRect(155,138,55,28);ctx.fillRect(163,128,14,14);ctx.fillRect(181,128,14,14);
      if(m[2]){ctx.fillRect(171,118,14,14);}
      ctx.fillStyle='#f39c12';ctx.beginPath();ctx.arc(128,152,m[3]?8:14,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.moveTo(22,100);ctx.lineTo(62,100);ctx.lineTo(57,115);ctx.lineTo(27,115);ctx.closePath();ctx.fill();
      ctx.fillStyle='white';ctx.beginPath();ctx.moveTo(42,76);ctx.lineTo(42,100);ctx.lineTo(60,100);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#aaddff';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(0,118);ctx.quadraticCurveTo(65,106,130,118);ctx.quadraticCurveTo(195,130,260,118);ctx.stroke();
      if(m[5]){ctx.beginPath();ctx.moveTo(0,110);ctx.quadraticCurveTo(65,98,130,110);ctx.quadraticCurveTo(195,122,260,110);ctx.stroke();}
      ctx.fillStyle='#e74c3c';for(var si=0;si<(m[6]?2:4);si++){ctx.beginPath();ctx.arc(40+si*18,145,5,0,Math.PI*2);ctx.fill();}
      if(m[7]){ctx.fillStyle='#4a90d9';ctx.beginPath();ctx.arc(200,80,16,0,Math.PI*2);ctx.fill();ctx.fillStyle='white';ctx.beginPath();ctx.arc(200,80,8,0,Math.PI*2);ctx.fill();}
      if(!m[8]){ctx.fillStyle='#795548';ctx.beginPath();ctx.arc(165,155,6,0,Math.PI*2);ctx.fill();}
      if(m[9]){ctx.fillStyle='#f4d03f';ctx.fillRect(200,130,30,10);ctx.fillRect(205,120,20,12);}
    }},
    { name:'Spazio', fn: function(ctx,m){
      ctx.fillStyle='#0a0a2e';ctx.fillRect(0,0,W,H);
      var stars=[[20,15],[50,30],[80,10],[120,25],[160,8],[200,20],[240,35],[15,60],[90,55],[180,50],[230,65],[40,80],[130,70],[210,80],[70,40],[150,45]];
      ctx.fillStyle='white';for(var si=0;si<stars.length;si++){ctx.beginPath();ctx.arc(stars[si][0],stars[si][1],1.5,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#7c5cbf';ctx.beginPath();ctx.arc(200,130,42,0,Math.PI*2);ctx.fill();
      if(!m[0]){ctx.strokeStyle='#aaaaff';ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(200,130,62,18,0,0,Math.PI*2);ctx.stroke();}
      ctx.fillStyle='#ddeeff';ctx.beginPath();ctx.arc(62,48,m[1]?18:25,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#0a0a2e';ctx.beginPath();ctx.arc(70,43,m[1]?12:18,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#aaaaaa';ctx.beginPath();ctx.ellipse(82,152,28,13,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#4a90d9';ctx.beginPath();ctx.arc(82,140,11,Math.PI,0);ctx.fill();
      ctx.fillStyle='#f39c12';ctx.beginPath();ctx.moveTo(70,165);ctx.lineTo(82,m[2]?190:182);ctx.lineTo(94,165);ctx.closePath();ctx.fill();
      ctx.fillStyle='#888866';ctx.beginPath();ctx.arc(172,58,m[3]?18:12,0,Math.PI*2);ctx.fill();
      if(m[4]){ctx.fillStyle='#888866';ctx.beginPath();ctx.arc(140,40,8,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(220,18);ctx.lineTo(m[5]?175:185,48);ctx.stroke();
      if(!m[6]){ctx.fillStyle='#e04f4f';ctx.beginPath();ctx.arc(30,140,10,0,Math.PI*2);ctx.fill();}
      var nStars=m[7]?3:5;ctx.fillStyle='#f5c842';for(var ni=0;ni<nStars;ni++){ctx.beginPath();ctx.arc(30+ni*22,170,4,0,Math.PI*2);ctx.fill();}
      if(m[8]){ctx.fillStyle='#4caf7d';ctx.beginPath();ctx.arc(230,100,12,0,Math.PI*2);ctx.fill();}
      if(!m[9]){ctx.fillStyle='#aaaaaa';ctx.fillRect(190,170,20,8);ctx.fillRect(196,163,8,8);}
    }},
    { name:'Giungla', fn: function(ctx,m){
      ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,W,110);
      ctx.fillStyle='#2d5a1b';ctx.fillRect(0,120,W,80);
      ctx.fillStyle='#4caf7d';ctx.fillRect(0,110,W,18);
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(38,38,20,0,Math.PI*2);ctx.fill();
      var treeX=[28,95,175,238];
      for(var ti=0;ti<treeX.length;ti++){
        ctx.fillStyle='#5d4037';ctx.fillRect(treeX[ti]-5,100,10,80);
        ctx.fillStyle='#4caf7d';ctx.beginPath();ctx.arc(treeX[ti],92,28,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.arc(treeX[ti],72,m[0]&&ti===1?16:20,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle='#795548';ctx.beginPath();ctx.arc(128,92,16,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#a1887f';ctx.beginPath();ctx.arc(128,97,9,0,Math.PI);ctx.fill();
      ctx.fillStyle='#4e342e';ctx.beginPath();ctx.arc(122,88,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(134,88,3,0,Math.PI*2);ctx.fill();
      if(!m[1]){ctx.strokeStyle='#5d4037';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(128,108);ctx.quadraticCurveTo(100,100,95,85);ctx.stroke();}
      ctx.fillStyle='#4a90d9';ctx.fillRect(0,152,W,48);
      ctx.fillStyle='#4caf7d';ctx.fillRect(55,154,m[2]?60:80,16);
      ctx.beginPath();ctx.arc(m[2]?115:135,162,10,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.ellipse(195,78,16,9,-0.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(213,78,16,9,0.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#333';ctx.fillRect(203,73,4,9);
      if(!m[3]){ctx.fillStyle='#e74c3c';for(var fi=0;fi<6;fi++){var fa=fi*Math.PI/3;ctx.beginPath();ctx.arc(48+Math.cos(fa)*9,148+Math.sin(fa)*9,7,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(48,148,6,0,Math.PI*2);ctx.fill();}
      if(m[4]){ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(210,145,8,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(155,28,16,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(170,23,13,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(183,28,14,0,Math.PI*2);ctx.fill();
      if(m[5]){ctx.beginPath();ctx.arc(197,25,11,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#4e342e';for(var ei=0;ei<(m[6]?2:4);ei++){ctx.fillRect(10+ei*8,155,5,12);}
      if(!m[7]){ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(230,148,7,0,Math.PI*2);ctx.fill();}
      if(!m[9]){ctx.strokeStyle='#4caf7d';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(160,110);ctx.quadraticCurveTo(175,90,190,110);ctx.stroke();}
    }},
    { name:'Citta', fn: function(ctx,m){
      ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#7f8c8d';ctx.fillRect(0,H-35,W,35);
      ctx.fillStyle='#bdc3c7';ctx.fillRect(0,H-38,W,5);
      var blds=[{x:0,w:38,h:128},{x:42,w:52,h:158},{x:98,w:42,h:118},{x:144,w:48,h:175},{x:196,w:52,h:138}];
      for(var bi=0;bi<blds.length;bi++){
        var b=blds[bi];ctx.fillStyle='#95a5a6';ctx.fillRect(b.x,H-35-b.h,b.w,b.h);
        ctx.fillStyle='#f1c40f';for(var wr=0;wr<5;wr++)for(var wc=0;wc<3;wc++){if((bi+wr+wc)%3!==0)ctx.fillRect(b.x+5+wc*12,H-35-b.h+10+wr*22,8,12);}
      }
      if(!m[0]){ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(225,38,22,0,Math.PI*2);ctx.fill();}
      else{ctx.fillStyle='#ddeeff';ctx.beginPath();ctx.arc(225,38,22,0,Math.PI*2);ctx.fill();ctx.fillStyle='#87ceeb';ctx.beginPath();ctx.arc(233,33,16,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#e74c3c';ctx.fillRect(28,H-55,58,20);ctx.fillStyle='#85c1e9';ctx.fillRect(36,H-63,42,15);
      ctx.fillStyle='#333';ctx.beginPath();ctx.arc(43,H-35,7,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(76,H-35,7,0,Math.PI*2);ctx.fill();
      if(!m[1]){ctx.fillStyle='white';ctx.fillRect(128,H-80,48,12);ctx.fillRect(146,H-88,14,8);ctx.fillRect(168,H-78,8,20);}
      ctx.fillStyle='#333';ctx.fillRect(178,H-70,7,38);ctx.fillRect(174,H-72,15,40);
      ctx.fillStyle='#e04f4f';ctx.beginPath();ctx.arc(181,H-65,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(181,H-55,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=m[2]?'#ffffff':'#4caf7d';ctx.beginPath();ctx.arc(181,H-45,4,0,Math.PI*2);ctx.fill();
      if(m[3]){ctx.fillStyle='#e74c3c';ctx.fillRect(130,H-55,55,20);ctx.fillStyle='#85c1e9';ctx.fillRect(138,H-62,38,13);ctx.fillStyle='#333';ctx.beginPath();ctx.arc(137,H-35,7,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(175,H-35,7,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(60,30,14,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(74,25,17,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(90,30,13,0,Math.PI*2);ctx.fill();
      if(!m[4]){ctx.beginPath();ctx.arc(104,28,11,0,Math.PI*2);ctx.fill();}
      if(m[5]){ctx.fillStyle='#aaaaaa';ctx.fillRect(105,H-100,6,68);}
      var nWindows=m[6]?2:4;for(var nwi=0;nwi<nWindows;nwi++){ctx.fillStyle='#f1c40f';ctx.fillRect(144+nwi*10,H-165,7,10);}
      if(!m[7]){ctx.fillStyle='#795548';ctx.fillRect(5,H-140,12,108);}
      if(m[8]){ctx.fillStyle='#4a90d9';ctx.beginPath();ctx.arc(50,60,12,0,Math.PI*2);ctx.fill();}
      if(!m[9]){ctx.fillStyle='#e04f4f';ctx.fillRect(195,H-90,10,58);}
    }},
    { name:'Parco giochi', fn: function(ctx,m){
      ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#7ec850';ctx.fillRect(0,145,W,55);
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(230,32,22,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#795548';ctx.fillRect(20,60,5,90);ctx.fillRect(70,60,5,90);
      ctx.strokeStyle='#795548';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(22,62);ctx.lineTo(72,62);ctx.stroke();
      ctx.beginPath();ctx.moveTo(35,62);ctx.lineTo(35,110);ctx.stroke();ctx.beginPath();ctx.moveTo(58,62);ctx.lineTo(58,110);ctx.stroke();
      ctx.fillStyle='#8B4513';ctx.fillRect(28,110,m[0]?20:30,6);
      ctx.fillStyle='#e74c3c';ctx.fillRect(100,70,15,80);
      ctx.strokeStyle='#c0392b';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(115,72);ctx.lineTo(m[1]?158:150,148);ctx.stroke();
      ctx.strokeStyle='#795548';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(100,72);ctx.lineTo(100,148);ctx.stroke();
      for(var ri=0;ri<(m[2]?3:5);ri++){ctx.beginPath();ctx.moveTo(85,80+ri*16);ctx.lineTo(100,80+ri*16);ctx.stroke();}
      ctx.fillStyle='#f39c12';ctx.fillRect(170,130,m[3]?50:70,10);
      ctx.fillStyle='#795548';ctx.fillRect(200,110,5,22);
      ctx.fillStyle='#3498db';ctx.fillRect(185,85,40,45);
      ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.moveTo(182,86);ctx.lineTo(205,65);ctx.lineTo(228,86);ctx.closePath();ctx.fill();
      if(!m[4]){ctx.fillStyle='#f1c40f';ctx.fillRect(198,100,12,10);}
      ctx.fillStyle='#f4d03f';ctx.fillRect(m[5]?5:10,155,60,35);ctx.strokeStyle='#8B4513';ctx.lineWidth=3;ctx.strokeRect(m[5]?5:10,155,60,35);
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(38,105,10,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e74c3c';ctx.fillRect(32,115,12,20);
      if(!m[6]){ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(38,100,5,0,Math.PI*2);ctx.fill();}
      if(!m[7]){ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(155,162,12,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(80,22,12,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(93,18,15,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(106,22,11,0,Math.PI*2);ctx.fill();
      if(m[8]){ctx.beginPath();ctx.arc(120,20,10,0,Math.PI*2);ctx.fill();}
      if(!m[9]){ctx.fillStyle='#4caf7d';ctx.fillRect(230,150,20,8);ctx.fillRect(230,160,20,8);}
    }},
    { name:'Fattoria', fn: function(ctx,m){
      ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,W,H);ctx.fillStyle='#7ec850';ctx.fillRect(0,128,W,72);
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(30,35,18,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#c0392b';ctx.fillRect(148,78,88,88);ctx.beginPath();ctx.moveTo(142,78);ctx.lineTo(192,42);ctx.lineTo(242,78);ctx.closePath();ctx.fill();
      ctx.fillStyle='#f39c12';ctx.fillRect(173,118,38,48);
      ctx.fillStyle='white';ctx.fillRect(38,122,58,34);ctx.fillRect(53,108,28,18);
      ctx.fillStyle='#333';ctx.beginPath();ctx.arc(62,106,4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(74,106,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e74c3c';ctx.fillRect(58,118,20,5);
      ctx.fillStyle='#333';for(var si=0;si<(m[0]?2:4);si++){ctx.beginPath();ctx.arc(42+si*14,135,4,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#8B4513';for(var fi=0;fi<6;fi++){ctx.fillRect(8+fi*35,138,5,28);}
      ctx.fillRect(8,145,240,5);ctx.fillRect(8,158,240,5);
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(118,142,m[1]?10:14,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(118,128,m[1]?8:10,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e74c3c';ctx.fillRect(122,124,8,5);ctx.fillStyle='#f5c842';ctx.fillRect(125,131,5,4);
      ctx.fillStyle='#bdc3c7';ctx.fillRect(5,88,28,68);ctx.fillStyle='#7f8c8d';ctx.beginPath();ctx.arc(19,88,7,0,Math.PI*2);ctx.fill();
      if(!m[2]){for(var wi=0;wi<4;wi++){var wa=wi*Math.PI/2;ctx.fillStyle='#7f8c8d';ctx.fillRect(19+Math.cos(wa)*7-2,88+Math.sin(wa)*7-14,4,18);}}
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(100,28,16,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(116,23,13,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(130,28,m[3]?8:14,0,Math.PI*2);ctx.fill();
      if(m[4]){ctx.fillStyle='#4a90d9';ctx.beginPath();ctx.arc(192,62,12,0,Math.PI*2);ctx.fill();}
      if(!m[5]){ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(165,155,6,0,Math.PI*2);ctx.fill();}
      if(m[6]){ctx.fillStyle='#795548';ctx.fillRect(220,128,10,50);}
      if(!m[8]){ctx.fillStyle='#4caf7d';ctx.fillRect(40,160,22,8);}
      if(m[9]){ctx.fillStyle='#e74c3c';ctx.fillRect(210,80,18,30);}
    }},
    { name:'Pirata', fn: function(ctx,m){
      ctx.fillStyle='#1a5276';ctx.fillRect(0,0,W,H);ctx.fillStyle='#2980b9';ctx.fillRect(0,120,W,80);ctx.fillStyle='#f4d03f';ctx.fillRect(0,158,W,42);
      ctx.fillStyle='#8B4513';ctx.beginPath();ctx.moveTo(20,130);ctx.lineTo(40,90);ctx.lineTo(220,90);ctx.lineTo(240,130);ctx.closePath();ctx.fill();
      ctx.fillStyle='#5d4037';ctx.fillRect(118,40,8,52);
      ctx.fillStyle='white';ctx.beginPath();ctx.moveTo(126,42);ctx.lineTo(126,88);ctx.lineTo(m[0]?170:180,88);ctx.closePath();ctx.fill();
      if(!m[1]){ctx.fillStyle='black';ctx.fillRect(118,30,30,20);ctx.fillStyle='white';ctx.beginPath();ctx.arc(133,40,6,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#333';ctx.beginPath();ctx.ellipse(60,130,18,10,0,0,Math.PI*2);ctx.fill();ctx.fillRect(68,125,m[2]?20:30,10);
      ctx.fillStyle='#8B4513';ctx.fillRect(165,100,40,28);ctx.fillStyle='#f5c842';ctx.fillRect(163,100,44,8);ctx.fillRect(182,100,8,28);
      if(!m[3]){ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(186,115,5,0,Math.PI*2);ctx.fill();}
      if(!m[4]){ctx.strokeStyle='white';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(30,60);ctx.quadraticCurveTo(40,50,50,60);ctx.stroke();ctx.beginPath();ctx.moveTo(55,55);ctx.quadraticCurveTo(65,45,75,55);ctx.stroke();}
      ctx.fillStyle='#f4d03f';ctx.beginPath();ctx.ellipse(220,155,m[5]?25:35,12,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#5d4037';ctx.fillRect(218,128,4,28);ctx.fillStyle='#4caf7d';ctx.beginPath();ctx.arc(220,122,14,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#8e44ad';ctx.beginPath();ctx.arc(m[6]?155:160,145,12,Math.PI,0);ctx.fill();
      if(!m[7]){ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(85,162,7,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(110,168,m[8]?5:9,0,Math.PI*2);ctx.fill();
      if(m[9]){ctx.fillStyle='#ddeeff';ctx.beginPath();ctx.arc(40,30,16,0,Math.PI*2);ctx.fill();ctx.fillStyle='#1a5276';ctx.beginPath();ctx.arc(47,26,12,0,Math.PI*2);ctx.fill();}
    }},
    { name:'Sottomarino', fn: function(ctx,m){
      ctx.fillStyle='#1a5276';ctx.fillRect(0,0,W,H);ctx.fillStyle='#2980b9';ctx.fillRect(0,0,W,80);ctx.fillStyle='#7ec850';ctx.fillRect(0,178,W,22);
      ctx.fillStyle='rgba(255,255,255,0.3)';
      var bubbles=[[30,40,8],[80,20,5],[150,50,10],[220,30,6],[240,60,4]];
      for(var bbi=0;bbi<(m[0]?3:5);bbi++){ctx.beginPath();ctx.arc(bubbles[bbi][0],bubbles[bbi][1],bubbles[bbi][2],0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.ellipse(130,120,90,30,0,0,Math.PI*2);ctx.fill();ctx.fillRect(105,90,50,32);ctx.fillStyle='#e6b800';ctx.fillRect(118,80,12,12);
      if(!m[1]){ctx.fillStyle='#e6b800';ctx.fillRect(138,75,5,18);}
      for(var oi=0;oi<(m[2]?2:4);oi++){ctx.fillStyle='#87ceeb';ctx.beginPath();ctx.arc(60+oi*42,120,10,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#e6b800';ctx.lineWidth=2;ctx.beginPath();ctx.arc(60+oi*42,120,10,0,Math.PI*2);ctx.stroke();}
      ctx.fillStyle='#e6b800';for(var eli=0;eli<4;eli++){var ea=eli*Math.PI/2;ctx.beginPath();ctx.ellipse(40+Math.cos(ea)*12,120+Math.sin(ea)*12,10,4,ea,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.ellipse(210,155,22,10,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(232,148);ctx.lineTo(248,138);ctx.lineTo(248,162);ctx.closePath();ctx.fill();
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(202,152,4,0,Math.PI*2);ctx.fill();
      if(m[3]){ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.ellipse(210,175,16,8,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(226,169);ctx.lineTo(238,162);ctx.lineTo(238,182);ctx.closePath();ctx.fill();}
      ctx.fillStyle='#4caf7d';if(!m[4]){ctx.fillRect(18,158,8,22);ctx.fillRect(22,148,8,22);}
      ctx.fillRect(240,162,8,18);ctx.fillRect(244,152,8,18);
      if(m[5]){ctx.fillStyle='#f39c12';ctx.beginPath();ctx.arc(180,170,10,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#8e44ad';ctx.beginPath();ctx.arc(m[6]?65:70,168,16,Math.PI,0);ctx.fill();
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(63,164,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(73,164,3,0,Math.PI*2);ctx.fill();
      if(!m[7]){ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(190,85,8,0,Math.PI*2);ctx.fill();}
      if(!m[9]){ctx.fillStyle='#7ec850';ctx.fillRect(115,178,20,22);}
    }},
    { name:'Circo', fn: function(ctx,m){
      ctx.fillStyle='#fff0f0';ctx.fillRect(0,0,W,H);ctx.fillStyle='#7ec850';ctx.fillRect(0,162,W,38);
      var stripes=['#e74c3c','#f5c842','#e74c3c','#f5c842','#e74c3c'];
      for(var sti=0;sti<5;sti++){ctx.fillStyle=stripes[sti];ctx.fillRect(sti*52,0,52,80);}
      ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.moveTo(0,80);ctx.lineTo(130,35);ctx.lineTo(260,80);ctx.closePath();ctx.fill();
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.moveTo(0,80);ctx.lineTo(65,58);ctx.lineTo(130,80);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(130,80);ctx.lineTo(195,58);ctx.lineTo(260,80);ctx.closePath();ctx.fill();
      ctx.fillStyle='#795548';ctx.fillRect(127,35,6,130);
      ctx.fillStyle='#bdc3c7';ctx.beginPath();ctx.ellipse(65,148,38,25,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(95,135,18,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#bdc3c7';ctx.fillRect(35,165,12,25);ctx.fillRect(52,165,12,25);ctx.fillRect(72,165,12,25);ctx.fillRect(88,165,12,25);
      ctx.fillStyle='#333';ctx.beginPath();ctx.arc(100,132,3,0,Math.PI*2);ctx.fill();
      if(!m[0]){ctx.strokeStyle='#bdc3c7';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(100,138);ctx.quadraticCurveTo(120,145,115,162);ctx.stroke();}
      var ballColors=['#e74c3c','#f5c842','#4a90d9','#4caf7d','#8e44ad'];
      for(var bai=0;bai<(m[1]?3:5);bai++){ctx.fillStyle=ballColors[bai];ctx.beginPath();ctx.arc(165+bai*14,m[2]?55:45,10,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#795548';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(165+bai*14,m[2]?65:55);ctx.lineTo(163+bai*14,90);ctx.stroke();}
      ctx.fillStyle='#e74c3c';ctx.fillRect(m[3]?155:160,95,12,30);
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(m[3]?161:166,90,10,0,Math.PI*2);ctx.fill();
      if(!m[4]){ctx.fillStyle='#e74c3c';ctx.fillRect(145,100,30,5);}
      ctx.fillStyle='#f39c12';ctx.beginPath();ctx.arc(210,155,22,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(210,155,15,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#333';ctx.beginPath();ctx.arc(205,151,2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(215,151,2,0,Math.PI*2);ctx.fill();
      if(!m[5]){ctx.fillStyle='#f39c12';ctx.fillRect(225,152,20,6);ctx.fillRect(238,150,10,5);}
      if(m[6]){ctx.fillStyle='#f5c842';for(var sci=0;sci<5;sci++){ctx.beginPath();ctx.arc(12+sci*20,170,6,0,Math.PI*2);ctx.fill();}}
      if(!m[7]){ctx.fillStyle='#8e44ad';ctx.beginPath();ctx.arc(130,168,10,0,Math.PI*2);ctx.fill();}
      if(m[8]){ctx.strokeStyle='#795548';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(100,120);ctx.lineTo(158,105);ctx.stroke();}
      if(!m[9]){ctx.fillStyle='white';ctx.beginPath();ctx.arc(28,30,10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(28,30,5,0,Math.PI*2);ctx.fill();}
    }}
  ];

  var sceneIdx=Math.floor(rng()*scenes.length);
  var scene=scenes[sceneIdx];
  var allIdxs=[0,1,2,3,4,5,6,7,8,9];
  allIdxs.sort(function(){return rng()-0.5;});
  var chosen=allIdxs.slice(0,numDiff);
  var chosenMap={};
  for(var ci=0;ci<chosen.length;ci++) chosenMap[chosen[ci]]=true;
  var wrap=document.createElement('div');wrap.className='diff-row';
  var labels=['Immagine A','Immagine B'];
  for(var idx=0;idx<2;idx++){
    var div=document.createElement('div');div.className='diff-canvas-wrap';
    var cvs=document.createElement('canvas');cvs.width=W;cvs.height=H;
    scene.fn(cvs.getContext('2d'),idx===1?chosenMap:{});
    var p=document.createElement('p');p.textContent=labels[idx];
    div.appendChild(cvs);div.appendChild(p);wrap.appendChild(div);
  }
  var card=makeCard('Trova le differenze \u2014 '+scene.name,'Ci sono '+numDiff+' differenze tra le due immagini.',name);
  card.appendChild(wrap);
  var gb=document.createElement('button');gb.className='guide-btn';gb.textContent='Guida per genitori';gb.onclick=function(){showGuide('differences');};
  card.appendChild(gb);area.appendChild(card);
}

/* ==================== SUDOKU ==================== */
function generateSudoku(area, diff, name) {
  var base=[
    [5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]
  ];
  var i,box,r1,r2,c1,c2,r,tmp;
  for(i=0;i<10;i++){box=Math.floor(rng()*3)*3;r1=box+Math.floor(rng()*3);r2=box+Math.floor(rng()*3);tmp=base[r1];base[r1]=base[r2];base[r2]=tmp;}
  for(i=0;i<10;i++){box=Math.floor(rng()*3)*3;c1=box+Math.floor(rng()*3);c2=box+Math.floor(rng()*3);for(r=0;r<9;r++){tmp=base[r][c1];base[r][c1]=base[r][c2];base[r][c2]=tmp;}}
  var remove=diff==='explorer'?25:diff==='curious'?35:diff==='growing'?45:52;
  var puzzle=[],pr,pc;
  for(r=0;r<9;r++) puzzle.push(base[r].slice());
  var removed=0;
  while(removed<remove){pr=Math.floor(rng()*9);pc=Math.floor(rng()*9);if(puzzle[pr][pc]!==0){puzzle[pr][pc]=0;removed++;}}
  var container=document.createElement('div');container.className='sudoku-grid';
  var c,cell;
  for(r=0;r<9;r++) for(c=0;c<9;c++){
    cell=document.createElement('div');cell.className='sudoku-cell'+(puzzle[r][c]!==0?' given':'');
    if((c+1)%3===0&&c<8) cell.classList.add('box-right');
    if((r+1)%3===0&&r<8) cell.classList.add('box-bottom');
    if(puzzle[r][c]!==0) cell.textContent=puzzle[r][c];
    container.appendChild(cell);
  }
  var card=makeCard('Sudoku','Ogni numero da 1 a 9 deve comparire una sola volta per riga, colonna e quadrato 3x3.',name);
  card.appendChild(container);
  var gb=document.createElement('button');gb.className='guide-btn';gb.textContent='Guida per genitori';gb.onclick=function(){showGuide('sudoku');};
  card.appendChild(gb);area.appendChild(card);
}

/* ==================== UNISCI I PUNTI ==================== */
function generateConnect(area, diff, name) {
  var W=480,H=340;
  function norm(pts){
    var minX=9999,minY=9999,maxX=-9999,maxY=-9999,i;
    for(i=0;i<pts.length;i++){if(pts[i].x<minX)minX=pts[i].x;if(pts[i].y<minY)minY=pts[i].y;if(pts[i].x>maxX)maxX=pts[i].x;if(pts[i].y>maxY)maxY=pts[i].y;}
    var pw=maxX-minX||1,ph=maxY-minY||1;
    var scale=Math.min((W-100)/pw,(H-80)/ph);
    var ox=(W-pw*scale)/2-minX*scale,oy=(H-ph*scale)/2-minY*scale;
    for(i=0;i<pts.length;i++){pts[i].x=Math.round(pts[i].x*scale+ox);pts[i].y=Math.round(pts[i].y*scale+oy);}
    return pts;
  }
  function circ(n,rfn,cx,cy){var pts=[],i,a,r;for(i=0;i<n;i++){a=i*(Math.PI*2/n)-Math.PI/2;r=rfn(i,n);pts.push({x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)});}return pts;}
  function safeLabels(pts){
    var offsets=[],i,j,ox,oy;
    var dirs=[{dx:8,dy:-6},{dx:-18,dy:-6},{dx:8,dy:12},{dx:-18,dy:12},{dx:14,dy:3},{dx:-22,dy:3},{dx:0,dy:-14},{dx:0,dy:16}];
    for(i=0;i<pts.length;i++){
      ox=8;oy=-6;
      for(var d=0;d<dirs.length;d++){
        ox=dirs[d].dx;oy=dirs[d].dy;var ok=true;
        for(j=0;j<offsets.length;j++){if(Math.abs(pts[i].x+ox-(pts[j].x+offsets[j].dx))<16&&Math.abs(pts[i].y+oy-(pts[j].y+offsets[j].dy))<12){ok=false;break;}}
        if(ok){for(j=0;j<pts.length;j++){if(j===i)continue;if(Math.abs(pts[i].x+ox-pts[j].x)<12&&Math.abs(pts[i].y+oy-pts[j].y)<12){ok=false;break;}}}
        if(ok) break;
      }
      offsets.push({dx:ox,dy:oy});
    }
    return offsets;
  }

  var allShapes={
    explorer:[
      {name:'Stella',fn:function(){return norm(circ(10,function(i){return i%2===0?100:42;},130,100));}},
      {name:'Cuore',fn:function(){var pts=[],i,t,n=16,s;for(i=0;i<n;i++){t=(i/n)*Math.PI*2;s=Math.sin(t);pts.push({x:130+70*(16*s*s*s)/16,y:100-60*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/13});}return norm(pts);}},
      {name:'Casa',fn:function(){return norm([{x:0,y:60},{x:60,y:0},{x:120,y:60},{x:100,y:60},{x:100,y:130},{x:70,y:130},{x:70,y:95},{x:50,y:95},{x:50,y:130},{x:20,y:130},{x:20,y:60}]);}},
      {name:'Pesce',fn:function(){return norm([{x:0,y:55},{x:0,y:15},{x:0,y:95},{x:0,y:55},{x:25,y:42},{x:60,y:35},{x:105,y:40},{x:145,y:55},{x:165,y:55},{x:145,y:70},{x:105,y:75},{x:60,y:72},{x:25,y:68}]);}},
      {name:'Fungo',fn:function(){return norm([{x:50,y:130},{x:30,y:130},{x:30,y:90},{x:10,y:90},{x:0,y:70},{x:5,y:40},{x:25,y:15},{x:50,y:0},{x:75,y:15},{x:95,y:40},{x:100,y:70},{x:90,y:90},{x:70,y:90},{x:70,y:130}]);}},
      {name:'Sole',fn:function(){return norm(circ(16,function(i){return i%2===0?100:72;},130,100));}},
      {name:'Luna',fn:function(){var pts=[],i,t,n=14;for(i=0;i<n;i++){t=Math.PI/2+(i/(n-1))*Math.PI;pts.push({x:100+80*Math.cos(t),y:100+80*Math.sin(t)});}pts.push({x:100+30*Math.cos(Math.PI*0.6),y:100+80*Math.sin(Math.PI*0.6)});return norm(pts);}},
      {name:'Diamante',fn:function(){return norm([{x:50,y:0},{x:100,y:0},{x:130,y:45},{x:75,y:130},{x:20,y:45}]);}},
      {name:'Barca',fn:function(){return norm([{x:0,y:80},{x:10,y:120},{x:110,y:120},{x:120,y:80},{x:0,y:80},{x:55,y:0},{x:55,y:80}]);}},
      {name:'Fiore',fn:function(){return norm(circ(12,function(i){return i%2===0?90:55;},130,100));}},
      {name:'Pallone',fn:function(){return norm(circ(12,function(){return 100;},130,110));}},
      {name:'Cupcake',fn:function(){return norm([{x:10,y:80},{x:20,y:130},{x:90,y:130},{x:100,y:80},{x:10,y:80},{x:15,y:60},{x:25,y:40},{x:35,y:20},{x:55,y:5},{x:75,y:20},{x:85,y:40},{x:95,y:60},{x:85,y:75}]);}},
      {name:'Aquilone',fn:function(){return norm([{x:50,y:0},{x:100,y:60},{x:50,y:120},{x:0,y:60},{x:50,y:0},{x:50,y:120},{x:45,y:140},{x:55,y:155},{x:45,y:170},{x:55,y:185}]);}},
      {name:'Farfalla',fn:function(){var pts=[],i,t,n=20,r2;for(i=0;i<n;i++){t=(i/n)*Math.PI*2;r2=80+38*Math.cos(2*t);pts.push({x:130+r2*Math.cos(t),y:100+r2*Math.sin(t)*0.55});}return norm(pts);}},
      {name:'Omino',fn:function(){return norm([{x:50,y:20},{x:60,y:0},{x:70,y:20},{x:65,y:22},{x:80,y:40},{x:65,y:60},{x:85,y:85},{x:70,y:90},{x:60,y:68},{x:55,y:90},{x:40,y:85},{x:55,y:60},{x:40,y:40},{x:50,y:20}]);}}
    ],
    curious:[
      {name:'Razzo',fn:function(){return norm([{x:50,y:0},{x:70,y:40},{x:65,y:40},{x:65,y:100},{x:80,y:100},{x:80,y:130},{x:65,y:130},{x:65,y:155},{x:50,y:175},{x:35,y:155},{x:35,y:130},{x:20,y:130},{x:20,y:100},{x:35,y:100},{x:35,y:40},{x:30,y:40}]);}},
      {name:'Aereo',fn:function(){return norm([{x:0,y:55},{x:55,y:45},{x:95,y:0},{x:120,y:12},{x:90,y:55},{x:165,y:50},{x:185,y:60},{x:165,y:70},{x:90,y:65},{x:120,y:108},{x:95,y:120},{x:55,y:75},{x:0,y:65}]);}},
      {name:'Dinosauro',fn:function(){return norm([{x:10,y:100},{x:0,y:70},{x:15,y:40},{x:35,y:20},{x:60,y:10},{x:80,y:20},{x:90,y:40},{x:85,y:60},{x:100,y:55},{x:120,y:30},{x:140,y:35},{x:130,y:60},{x:110,y:75},{x:100,y:90},{x:110,y:120},{x:100,y:150},{x:80,y:160},{x:70,y:140},{x:65,y:120},{x:45,y:120},{x:40,y:140},{x:20,y:150},{x:10,y:130}]);}},
      {name:'Castello',fn:function(){return norm([{x:0,y:160},{x:0,y:60},{x:15,y:60},{x:15,y:40},{x:30,y:40},{x:30,y:60},{x:45,y:60},{x:45,y:40},{x:60,y:40},{x:60,y:60},{x:60,y:80},{x:80,y:80},{x:80,y:20},{x:95,y:20},{x:95,y:0},{x:110,y:0},{x:110,y:20},{x:125,y:20},{x:125,y:80},{x:145,y:80},{x:145,y:60},{x:160,y:60},{x:160,y:40},{x:175,y:40},{x:175,y:60},{x:190,y:60},{x:190,y:160}]);}},
      {name:'Balena',fn:function(){return norm([{x:0,y:60},{x:10,y:30},{x:40,y:10},{x:80,y:0},{x:130,y:5},{x:170,y:25},{x:200,y:55},{x:205,y:85},{x:185,y:100},{x:200,y:115},{x:185,y:140},{x:155,y:130},{x:120,y:110},{x:80,y:100},{x:50,y:105},{x:20,y:95},{x:0,y:80}]);}},
      {name:'Robot',fn:function(){return norm([{x:30,y:0},{x:70,y:0},{x:70,y:20},{x:90,y:20},{x:90,y:70},{x:110,y:70},{x:110,y:120},{x:90,y:120},{x:90,y:160},{x:75,y:160},{x:75,y:180},{x:60,y:180},{x:60,y:160},{x:40,y:160},{x:40,y:180},{x:25,y:180},{x:25,y:160},{x:10,y:160},{x:10,y:120},{x:-10,y:120},{x:-10,y:70},{x:10,y:70},{x:10,y:20},{x:30,y:20}]);}},
      {name:'Cavallo',fn:function(){return norm([{x:20,y:150},{x:10,y:120},{x:0,y:80},{x:10,y:50},{x:30,y:30},{x:50,y:20},{x:60,y:0},{x:80,y:10},{x:85,y:35},{x:95,y:25},{x:115,y:30},{x:110,y:55},{x:100,y:70},{x:115,y:90},{x:120,y:120},{x:110,y:150},{x:95,y:165},{x:80,y:155},{x:75,y:130},{x:55,y:120},{x:50,y:140},{x:40,y:160}]);}},
      {name:'Orsetto',fn:function(){return norm([{x:25,y:50},{x:10,y:30},{x:20,y:10},{x:40,y:0},{x:55,y:10},{x:70,y:0},{x:90,y:10},{x:100,y:30},{x:85,y:50},{x:100,y:70},{x:105,y:100},{x:95,y:130},{x:80,y:150},{x:60,y:160},{x:40,y:150},{x:25,y:130},{x:15,y:100},{x:20,y:70}]);}},
      {name:'Coniglio',fn:function(){return norm([{x:45,y:170},{x:20,y:160},{x:10,y:130},{x:20,y:100},{x:10,y:60},{x:15,y:20},{x:30,y:0},{x:45,y:15},{x:40,y:50},{x:50,y:60},{x:60,y:50},{x:55,y:15},{x:70,y:0},{x:85,y:20},{x:90,y:60},{x:80,y:100},{x:90,y:130},{x:80,y:160},{x:55,y:170}]);}},
      {name:'Ancora',fn:function(){return norm([{x:50,y:0},{x:70,y:0},{x:70,y:20},{x:90,y:40},{x:80,y:45},{x:70,y:40},{x:70,y:120},{x:90,y:110},{x:100,y:120},{x:80,y:140},{x:60,y:130},{x:60,y:140},{x:40,y:130},{x:20,y:140},{x:0,y:120},{x:10,y:110},{x:30,y:120},{x:30,y:40},{x:20,y:45},{x:10,y:40},{x:30,y:20},{x:30,y:0}]);}},
      {name:'Volpe',fn:function(){return norm([{x:0,y:100},{x:0,y:60},{x:20,y:20},{x:30,y:0},{x:45,y:20},{x:55,y:40},{x:65,y:20},{x:80,y:0},{x:90,y:20},{x:110,y:60},{x:110,y:100},{x:95,y:120},{x:100,y:150},{x:80,y:160},{x:70,y:140},{x:55,y:160},{x:40,y:140},{x:30,y:160},{x:10,y:150},{x:15,y:120}]);}},
      {name:'Aquila',fn:function(){return norm([{x:60,y:0},{x:80,y:10},{x:100,y:5},{x:140,y:0},{x:160,y:20},{x:130,y:35},{x:110,y:30},{x:100,y:40},{x:120,y:60},{x:110,y:80},{x:90,y:70},{x:80,y:80},{x:80,y:110},{x:65,y:120},{x:55,y:110},{x:55,y:80},{x:45,y:70},{x:25,y:80},{x:15,y:60},{x:35,y:40},{x:25,y:30},{x:0,y:35},{x:20,y:15},{x:50,y:20}]);}},
      {name:'Chitarra',fn:function(){return norm([{x:50,y:0},{x:30,y:20},{x:10,y:50},{x:20,y:80},{x:50,y:90},{x:55,y:140},{x:50,y:170},{x:30,y:190},{x:40,y:210},{x:70,y:220},{x:100,y:210},{x:110,y:190},{x:90,y:170},{x:85,y:140},{x:90,y:90},{x:120,y:80},{x:130,y:50},{x:110,y:20},{x:90,y:0}]);}},
      {name:'Treno',fn:function(){return norm([{x:0,y:50},{x:0,y:100},{x:15,y:115},{x:15,y:100},{x:185,y:100},{x:185,y:115},{x:200,y:100},{x:200,y:50},{x:185,y:35},{x:150,y:35},{x:150,y:10},{x:120,y:10},{x:120,y:35},{x:80,y:35},{x:80,y:10},{x:50,y:10},{x:50,y:35},{x:15,y:35}]);}}
    ],
    growing:[
      {name:'Gatto',fn:function(){return norm([{x:20,y:160},{x:10,y:130},{x:0,y:100},{x:10,y:70},{x:5,y:40},{x:20,y:15},{x:30,y:0},{x:40,y:15},{x:35,y:35},{x:50,y:20},{x:60,y:10},{x:65,y:25},{x:60,y:45},{x:75,y:30},{x:85,y:20},{x:90,y:35},{x:85,y:55},{x:95,y:70},{x:100,y:100},{x:90,y:130},{x:80,y:160},{x:70,y:175},{x:55,y:180},{x:50,y:160},{x:40,y:175},{x:30,y:175}]);}},
      {name:'Fenicottero',fn:function(){return norm([{x:60,y:0},{x:70,y:20},{x:65,y:40},{x:50,y:55},{x:30,y:60},{x:15,y:75},{x:10,y:95},{x:20,y:115},{x:40,y:120},{x:55,y:110},{x:60,y:130},{x:50,y:160},{x:35,y:190},{x:30,y:220},{x:40,y:230},{x:60,y:220},{x:65,y:200},{x:70,y:180},{x:75,y:160},{x:80,y:190},{x:90,y:220},{x:100,y:230},{x:110,y:220},{x:100,y:200},{x:90,y:170},{x:85,y:140},{x:90,y:120},{x:105,y:110},{x:120,y:115},{x:130,y:100},{x:125,y:80},{x:110,y:65},{x:95,y:55},{x:80,y:40},{x:75,y:20}]);}},
      {name:'Sirena',fn:function(){return norm([{x:55,y:0},{x:70,y:10},{x:75,y:35},{x:65,y:55},{x:80,y:65},{x:90,y:55},{x:100,y:65},{x:85,y:80},{x:70,y:75},{x:65,y:90},{x:70,y:115},{x:80,y:140},{x:75,y:165},{x:60,y:175},{x:45,y:185},{x:30,y:195},{x:20,y:185},{x:35,y:170},{x:55,y:160},{x:60,y:145},{x:55,y:120},{x:50,y:95},{x:40,y:80},{x:25,y:85},{x:10,y:75},{x:20,y:60},{x:35,y:60},{x:45,y:55},{x:38,y:35},{x:40,y:10}]);}},
      {name:'Drago',fn:function(){return norm([{x:90,y:0},{x:120,y:15},{x:130,y:40},{x:120,y:65},{x:140,y:55},{x:165,y:60},{x:155,y:80},{x:130,y:80},{x:115,y:95},{x:130,y:115},{x:120,y:140},{x:100,y:155},{x:80,y:165},{x:60,y:155},{x:55,y:130},{x:65,y:110},{x:50,y:100},{x:35,y:115},{x:20,y:105},{x:30,y:85},{x:15,y:70},{x:0,y:55},{x:20,y:50},{x:40,y:60},{x:55,y:50},{x:50,y:30},{x:65,y:15},{x:80,y:10}]);}},
      {name:'Unicorno',fn:function(){return norm([{x:50,y:0},{x:60,y:20},{x:55,y:45},{x:70,y:35},{x:90,y:40},{x:100,y:60},{x:90,y:80},{x:100,y:100},{x:95,y:125},{x:80,y:145},{x:70,y:170},{x:60,y:185},{x:55,y:200},{x:45,y:200},{x:40,y:185},{x:30,y:165},{x:15,y:145},{x:5,y:120},{x:10,y:95},{x:20,y:75},{x:10,y:55},{x:25,y:40},{x:40,y:45},{x:42,y:22}]);}},
      {name:'Astronave',fn:function(){return norm([{x:70,y:0},{x:90,y:0},{x:100,y:20},{x:120,y:20},{x:140,y:40},{x:150,y:65},{x:140,y:85},{x:120,y:95},{x:115,y:115},{x:130,y:130},{x:125,y:145},{x:100,y:140},{x:80,y:155},{x:60,y:140},{x:35,y:145},{x:30,y:130},{x:45,y:115},{x:40,y:95},{x:20,y:85},{x:10,y:65},{x:20,y:40},{x:40,y:20},{x:60,y:20}]);}},
      {name:'Scorpione',fn:function(){return norm([{x:80,y:0},{x:100,y:10},{x:110,y:30},{x:100,y:50},{x:110,y:65},{x:100,y:80},{x:85,y:75},{x:75,y:85},{x:90,y:100},{x:85,y:120},{x:70,y:125},{x:60,y:115},{x:65,y:100},{x:50,y:95},{x:35,y:100},{x:30,y:115},{x:20,y:120},{x:5,y:110},{x:0,y:90},{x:15,y:80},{x:5,y:65},{x:15,y:50},{x:10,y:30},{x:25,y:15},{x:45,y:10},{x:55,y:20},{x:55,y:40},{x:65,y:50},{x:75,y:40},{x:75,y:20}]);}},
      {name:'Granchio',fn:function(){return norm([{x:50,y:60},{x:30,y:40},{x:10,y:50},{x:0,y:70},{x:15,y:80},{x:30,y:70},{x:20,y:100},{x:10,y:120},{x:20,y:130},{x:35,y:120},{x:30,y:140},{x:20,y:155},{x:35,y:160},{x:50,y:148},{x:45,y:165},{x:40,y:180},{x:55,y:180},{x:65,y:165},{x:75,y:180},{x:90,y:180},{x:85,y:165},{x:80,y:148},{x:95,y:160},{x:110,y:155},{x:100,y:140},{x:90,y:120},{x:105,y:130},{x:120,y:120},{x:130,y:100},{x:120,y:80},{x:135,y:70},{x:150,y:50},{x:130,y:40},{x:110,y:60},{x:90,y:65},{x:80,y:50},{x:70,y:60}]);}},
      {name:'Mago',fn:function(){return norm([{x:50,y:0},{x:70,y:20},{x:65,y:45},{x:80,y:40},{x:95,y:50},{x:90,y:70},{x:75,y:72},{x:80,y:90},{x:90,y:110},{x:85,y:140},{x:70,y:165},{x:75,y:185},{x:60,y:195},{x:50,y:185},{x:55,y:165},{x:40,y:140},{x:35,y:110},{x:45,y:90},{x:50,y:72},{x:35,y:70},{x:30,y:50},{x:45,y:40},{x:55,y:45}]);}},
      {name:'Nave',fn:function(){return norm([{x:10,y:120},{x:0,y:140},{x:10,y:160},{x:190,y:160},{x:200,y:140},{x:190,y:120},{x:160,y:120},{x:155,y:40},{x:145,y:40},{x:140,y:120},{x:115,y:120},{x:110,y:20},{x:100,y:0},{x:90,y:20},{x:85,y:120},{x:60,y:120},{x:55,y:60},{x:45,y:60},{x:40,y:120}]);}},
      {name:'Tartaruga marina',fn:function(){return norm([{x:60,y:0},{x:90,y:5},{x:115,y:25},{x:120,y:55},{x:110,y:80},{x:130,y:70},{x:150,y:75},{x:145,y:95},{x:120,y:100},{x:115,y:120},{x:95,y:140},{x:70,y:150},{x:45,y:140},{x:25,y:120},{x:20,y:100},{x:0,y:95},{x:0,y:75},{x:20,y:70},{x:10,y:45},{x:20,y:20},{x:40,y:5}]);}},
      {name:'Ragno',fn:function(){return norm([{x:60,y:30},{x:80,y:20},{x:100,y:30},{x:110,y:55},{x:100,y:75},{x:115,y:70},{x:130,y:50},{x:145,y:55},{x:135,y:80},{x:115,y:90},{x:110,y:110},{x:100,y:130},{x:90,y:150},{x:70,y:160},{x:50,y:150},{x:40,y:130},{x:30,y:110},{x:25,y:90},{x:5,y:80},{x:0,y:55},{x:10,y:50},{x:25,y:70},{x:40,y:75},{x:30,y:55},{x:20,y:30}]);}},
      {name:'Medusa',fn:function(){var pts=[],i,t,n=20,r3;for(i=0;i<n;i++){t=(i/n)*Math.PI*2;r3=80+25*Math.sin(5*t);pts.push({x:120+r3*Math.cos(t),y:80+r3*Math.sin(t)*0.7});}return norm(pts);}}
    ],
    challenge:[
      {name:'Fenice',fn:function(){return norm([{x:80,y:0},{x:100,y:30},{x:120,y:10},{x:130,y:40},{x:150,y:20},{x:145,y:55},{x:160,y:70},{x:140,y:80},{x:155,y:100},{x:130,y:105},{x:140,y:130},{x:110,y:120},{x:100,y:150},{x:80,y:165},{x:60,y:150},{x:50,y:120},{x:20,y:130},{x:30,y:105},{x:0,y:100},{x:15,y:80},{x:0,y:70},{x:15,y:55},{x:10,y:20},{x:30,y:40},{x:40,y:10},{x:60,y:30}]);}},
      {name:'Drago a due teste',fn:function(){return norm([{x:10,y:20},{x:0,y:0},{x:20,y:10},{x:30,y:30},{x:50,y:20},{x:60,y:0},{x:80,y:10},{x:90,y:35},{x:80,y:55},{x:95,y:65},{x:110,y:50},{x:130,y:60},{x:125,y:85},{x:100,y:90},{x:85,y:105},{x:100,y:125},{x:90,y:150},{x:70,y:160},{x:60,y:145},{x:65,y:120},{x:45,y:115},{x:40,y:135},{x:20,y:145},{x:10,y:130},{x:20,y:110},{x:40,y:100},{x:30,y:80},{x:15,y:75},{x:5,y:55},{x:20,y:40}]);}},
      {name:'Guerriero',fn:function(){return norm([{x:50,y:0},{x:65,y:15},{x:60,y:40},{x:75,y:35},{x:90,y:45},{x:80,y:65},{x:90,y:80},{x:75,y:85},{x:80,y:110},{x:100,y:120},{x:95,y:145},{x:75,y:155},{x:70,y:180},{x:55,y:190},{x:40,y:180},{x:35,y:155},{x:15,y:145},{x:10,y:120},{x:30,y:110},{x:35,y:85},{x:20,y:80},{x:30,y:65},{x:20,y:45},{x:35,y:35},{x:40,y:40},{x:42,y:15}]);}},
      {name:'Astronauta',fn:function(){return norm([{x:40,y:0},{x:60,y:0},{x:75,y:20},{x:80,y:45},{x:70,y:65},{x:90,y:70},{x:110,y:65},{x:120,y:80},{x:105,y:95},{x:90,y:90},{x:80,y:105},{x:85,y:130},{x:75,y:155},{x:65,y:165},{x:55,y:155},{x:60,y:130},{x:50,y:105},{x:30,y:90},{x:15,y:95},{x:0,y:80},{x:10,y:65},{x:30,y:70},{x:30,y:65},{x:20,y:45},{x:25,y:20}]);}},
      {name:'Cavaliere',fn:function(){return norm([{x:55,y:0},{x:70,y:10},{x:75,y:35},{x:60,y:55},{x:80,y:60},{x:100,y:55},{x:110,y:75},{x:100,y:95},{x:115,y:110},{x:105,y:135},{x:85,y:130},{x:80,y:155},{x:65,y:170},{x:50,y:165},{x:40,y:145},{x:45,y:120},{x:30,y:125},{x:15,y:110},{x:25,y:90},{x:10,y:75},{x:20,y:55},{x:40,y:60},{x:25,y:35},{x:35,y:10}]);}},
      {name:'Robot avanzato',fn:function(){return norm([{x:35,y:0},{x:65,y:0},{x:70,y:25},{x:90,y:15},{x:100,y:35},{x:85,y:50},{x:95,y:65},{x:110,y:75},{x:105,y:100},{x:85,y:110},{x:90,y:135},{x:80,y:160},{x:70,y:180},{x:55,y:185},{x:40,y:180},{x:30,y:160},{x:20,y:135},{x:25,y:110},{x:5,y:100},{x:0,y:75},{x:15,y:65},{x:25,y:50},{x:15,y:35},{x:25,y:15},{x:40,y:25}]);}},
      {name:'Polpo gigante',fn:function(){return norm([{x:60,y:0},{x:90,y:5},{x:110,y:25},{x:115,y:55},{x:100,y:75},{x:120,y:80},{x:140,y:70},{x:150,y:90},{x:130,y:100},{x:115,y:95},{x:110,y:115},{x:120,y:140},{x:110,y:160},{x:95,y:165},{x:85,y:150},{x:90,y:130},{x:80,y:120},{x:70,y:130},{x:60,y:150},{x:45,y:165},{x:30,y:160},{x:20,y:140},{x:30,y:115},{x:20,y:95},{x:5,y:100},{x:0,y:80},{x:20,y:70},{x:30,y:80},{x:25,y:55},{x:30,y:25}]);}},
      {name:'Strega',fn:function(){return norm([{x:50,y:0},{x:60,y:15},{x:55,y:35},{x:70,y:28},{x:85,y:38},{x:78,y:58},{x:90,y:70},{x:80,y:88},{x:95,y:100},{x:85,y:122},{x:65,y:130},{x:68,y:155},{x:55,y:170},{x:42,y:155},{x:45,y:130},{x:25,y:122},{x:15,y:100},{x:30,y:88},{x:20,y:70},{x:32,y:58},{x:25,y:38},{x:40,y:28},{x:45,y:35}]);}},
      {name:'Ciclista',fn:function(){return norm([{x:60,y:0},{x:72,y:15},{x:68,y:38},{x:85,y:45},{x:105,y:60},{x:110,y:90},{x:90,y:110},{x:65,y:115},{x:40,y:110},{x:20,y:90},{x:25,y:60},{x:45,y:45},{x:32,y:38},{x:28,y:15},{x:40,y:0},{x:42,y:22},{x:58,y:22}]);}},
      {name:'Surfista',fn:function(){return norm([{x:0,y:110},{x:20,y:90},{x:55,y:85},{x:70,y:70},{x:60,y:50},{x:75,y:35},{x:95,y:42},{x:100,y:65},{x:88,y:80},{x:110,y:78},{x:140,y:82},{x:160,y:100},{x:140,y:115},{x:110,y:112},{x:88,y:120},{x:65,y:130},{x:40,y:130},{x:20,y:120}]);}},
      {name:'Violinista',fn:function(){return norm([{x:55,y:0},{x:68,y:18},{x:62,y:42},{x:80,y:38},{x:95,y:50},{x:88,y:72},{x:105,y:80},{x:98,y:105},{x:80,y:112},{x:85,y:138},{x:72,y:158},{x:58,y:165},{x:44,y:158},{x:30,y:138},{x:35,y:112},{x:18,y:105},{x:10,y:80},{x:28,y:72},{x:22,y:50},{x:35,y:38},{x:48,y:42}]);}},
      {name:'Ballerino',fn:function(){return norm([{x:50,y:0},{x:65,y:18},{x:60,y:42},{x:78,y:35},{x:95,y:42},{x:92,y:68},{x:80,y:78},{x:98,y:90},{x:105,y:118},{x:90,y:138},{x:72,y:132},{x:68,y:158},{x:55,y:170},{x:42,y:158},{x:38,y:132},{x:20,y:138},{x:5,y:118},{x:12,y:90},{x:30,y:78},{x:18,y:68},{x:15,y:42},{x:32,y:35},{x:40,y:42}]);}},
      {name:'Ninja',fn:function(){return norm([{x:50,y:0},{x:62,y:12},{x:58,y:35},{x:72,y:28},{x:88,y:38},{x:82,y:60},{x:95,y:72},{x:85,y:92},{x:95,y:108},{x:82,y:130},{x:65,y:138},{x:68,y:162},{x:55,y:175},{x:42,y:162},{x:45,y:138},{x:28,y:130},{x:15,y:108},{x:25,y:92},{x:15,y:72},{x:28,y:60},{x:22,y:38},{x:38,y:28}]);}},
      {name:'Sassofonista',fn:function(){return norm([{x:52,y:0},{x:65,y:15},{x:60,y:38},{x:78,y:32},{x:92,y:45},{x:85,y:68},{x:98,y:80},{x:88,y:102},{x:105,y:115},{x:95,y:140},{x:78,y:148},{x:72,y:172},{x:58,y:182},{x:44,y:172},{x:38,y:148},{x:22,y:140},{x:12,y:115},{x:28,y:102},{x:15,y:80},{x:25,y:68},{x:18,y:45},{x:32,y:32}]);}},
      {name:'Supereroe',fn:function(){return norm([{x:50,y:0},{x:65,y:15},{x:72,y:40},{x:90,y:30},{x:108,y:42},{x:100,y:68},{x:118,y:78},{x:110,y:105},{x:92,y:115},{x:88,y:142},{x:72,y:158},{x:55,y:165},{x:38,y:158},{x:22,y:142},{x:18,y:115},{x:0,y:105},{x:-8,y:78},{x:10,y:68},{x:2,y:42},{x:20,y:30},{x:38,y:40}]);}}
    ]
  };

  var pool = allShapes[diff] || allShapes['curious'];
  var shapeIdx = Math.floor(rng()*pool.length);
  var shape = pool[shapeIdx];
  var pts;
  try { pts = shape.fn(); } catch(e) { pts = norm(circ(10,function(i){return i%2===0?100:42;},130,100)); }

  var cvs = document.createElement('canvas');
  cvs.width=W;cvs.height=H;
  var ctx=cvs.getContext('2d');
  ctx.fillStyle='#fafaf7';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(180,160,120,0.12)';ctx.lineWidth=1.5;ctx.setLineDash([3,4]);
  ctx.beginPath();
  var pi;
  for(pi=0;pi<pts.length;pi++){if(pi===0)ctx.moveTo(pts[pi].x,pts[pi].y);else ctx.lineTo(pts[pi].x,pts[pi].y);}
  ctx.closePath();ctx.stroke();ctx.setLineDash([]);
  var offsets=safeLabels(pts);
  for(pi=0;pi<pts.length;pi++){
    ctx.fillStyle='#4a90d9';ctx.beginPath();ctx.arc(pts[pi].x,pts[pi].y,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#2d2416';ctx.font='bold 10px sans-serif';
    ctx.fillText(pi+1,pts[pi].x+offsets[pi].dx,pts[pi].y+offsets[pi].dy);
  }
  var card=makeCard('Unisci i punti \u2014 '+shape.name,"Collega i numeri in ordine e scopri l'immagine!",name);
  card.appendChild(cvs);
  var gb=document.createElement('button');gb.className='guide-btn';gb.textContent='Guida per genitori';gb.onclick=function(){showGuide('connect');};
  card.appendChild(gb);area.appendChild(card);
}

/* ==================== STICKMAN ==================== */
function generateStickman(area, diff, name) {
  var numCards = 4;
  var W = 130, H = 170;

  var colors = ['#e04f4f','#4a90d9','#4caf7d','#f5c842','#7c5cbf','#f47c2f','#e05f8e','#00bcd4'];
  var partNames = ['testa','corpo','braccio sinistro','braccio destro','gamba sinistra','gamba destra'];

  var poses = [
    /* 0 In piedi */
    function(ctx,cols){
      ctx.strokeStyle=cols[0];ctx.lineWidth=3;ctx.beginPath();ctx.arc(65,22,14,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle=cols[1];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(65,36);ctx.lineTo(65,95);ctx.stroke();
      ctx.strokeStyle=cols[2];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,55);ctx.lineTo(35,75);ctx.stroke();
      ctx.strokeStyle=cols[3];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,55);ctx.lineTo(95,75);ctx.stroke();
      ctx.strokeStyle=cols[4];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,95);ctx.lineTo(48,140);ctx.stroke();
      ctx.strokeStyle=cols[5];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,95);ctx.lineTo(82,140);ctx.stroke();
    },
    /* 1 Che corre */
    function(ctx,cols){
      ctx.strokeStyle=cols[0];ctx.lineWidth=3;ctx.beginPath();ctx.arc(70,20,14,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle=cols[1];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(68,34);ctx.lineTo(60,90);ctx.stroke();
      ctx.strokeStyle=cols[2];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,52);ctx.lineTo(30,40);ctx.stroke();
      ctx.strokeStyle=cols[3];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,52);ctx.lineTo(95,65);ctx.stroke();
      ctx.strokeStyle=cols[4];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(60,90);ctx.lineTo(35,125);ctx.stroke();
      ctx.strokeStyle=cols[5];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(60,90);ctx.lineTo(85,110);ctx.lineTo(100,140);ctx.stroke();
    },
    /* 2 Che salta */
    function(ctx,cols){
      ctx.strokeStyle=cols[0];ctx.lineWidth=3;ctx.beginPath();ctx.arc(65,18,14,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle=cols[1];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(65,32);ctx.lineTo(65,88);ctx.stroke();
      ctx.strokeStyle=cols[2];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,50);ctx.lineTo(28,30);ctx.stroke();
      ctx.strokeStyle=cols[3];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,50);ctx.lineTo(102,30);ctx.stroke();
      ctx.strokeStyle=cols[4];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,88);ctx.lineTo(35,130);ctx.stroke();
      ctx.strokeStyle=cols[5];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,88);ctx.lineTo(95,130);ctx.stroke();
    },
    /* 3 Seduto */
    function(ctx,cols){
      ctx.strokeStyle=cols[0];ctx.lineWidth=3;ctx.beginPath();ctx.arc(65,22,14,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle=cols[1];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(65,36);ctx.lineTo(65,85);ctx.stroke();
      ctx.strokeStyle=cols[2];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,52);ctx.lineTo(35,70);ctx.stroke();
      ctx.strokeStyle=cols[3];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,52);ctx.lineTo(95,65);ctx.stroke();
      ctx.strokeStyle=cols[4];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,85);ctx.lineTo(65,115);ctx.lineTo(30,115);ctx.stroke();
      ctx.strokeStyle=cols[5];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,85);ctx.lineTo(65,115);ctx.lineTo(100,115);ctx.stroke();
    },
    /* 4 Che balla */
    function(ctx,cols){
      ctx.strokeStyle=cols[0];ctx.lineWidth=3;ctx.beginPath();ctx.arc(58,20,14,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle=cols[1];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(60,34);ctx.lineTo(55,88);ctx.stroke();
      ctx.strokeStyle=cols[2];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(58,52);ctx.lineTo(25,42);ctx.stroke();
      ctx.strokeStyle=cols[3];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(58,52);ctx.lineTo(90,35);ctx.stroke();
      ctx.strokeStyle=cols[4];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(55,88);ctx.lineTo(30,120);ctx.stroke();
      ctx.strokeStyle=cols[5];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(55,88);ctx.lineTo(80,105);ctx.lineTo(100,135);ctx.stroke();
    },
    /* 5 Che lancia */
    function(ctx,cols){
      ctx.strokeStyle=cols[0];ctx.lineWidth=3;ctx.beginPath();ctx.arc(60,22,14,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle=cols[1];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(60,36);ctx.lineTo(58,92);ctx.stroke();
      ctx.strokeStyle=cols[2];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(60,52);ctx.lineTo(30,65);ctx.stroke();
      ctx.strokeStyle=cols[3];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(60,50);ctx.lineTo(95,25);ctx.stroke();
      ctx.strokeStyle=cols[4];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(58,92);ctx.lineTo(42,138);ctx.stroke();
      ctx.strokeStyle=cols[5];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(58,92);ctx.lineTo(74,138);ctx.stroke();
    },
    /* 6 Yoga - albero */
    function(ctx,cols){
      ctx.strokeStyle=cols[0];ctx.lineWidth=3;ctx.beginPath();ctx.arc(65,20,14,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle=cols[1];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(65,34);ctx.lineTo(65,92);ctx.stroke();
      ctx.strokeStyle=cols[2];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,50);ctx.lineTo(35,38);ctx.stroke();
      ctx.strokeStyle=cols[3];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,50);ctx.lineTo(95,38);ctx.stroke();
      ctx.strokeStyle=cols[4];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,92);ctx.lineTo(65,145);ctx.stroke();
      ctx.strokeStyle=cols[5];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(65,105);ctx.lineTo(40,85);ctx.stroke();
    },
    /* 7 Che nuota */
    function(ctx,cols){
      ctx.strokeStyle=cols[0];ctx.lineWidth=3;ctx.beginPath();ctx.arc(20,65,13,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle=cols[1];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(33,65);ctx.lineTo(95,65);ctx.stroke();
      ctx.strokeStyle=cols[2];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(50,65);ctx.lineTo(35,42);ctx.stroke();
      ctx.strokeStyle=cols[3];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(50,65);ctx.lineTo(35,88);ctx.stroke();
      ctx.strokeStyle=cols[4];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(95,65);ctx.lineTo(112,48);ctx.stroke();
      ctx.strokeStyle=cols[5];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(95,65);ctx.lineTo(112,82);ctx.stroke();
    }
  ];

  var card = makeCard('Stickman','Costruisci il tuo omino seguendo i colori di ogni carta!',name);
  var grid = document.createElement('div');
  grid.style.cssText='display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:8px;';

  /* Genera 4 carte con pose e combinazioni di colori diversi */
  var usedPoses = [];
  for (var ci = 0; ci < numCards; ci++) {
    var poseIdx;
    do { poseIdx = Math.floor(rng()*poses.length); } while(usedPoses.indexOf(poseIdx)>=0 && usedPoses.length<poses.length);
    usedPoses.push(poseIdx);

    /* Mescola i colori in modo diverso per ogni carta */
    var shuffledColors = colors.slice().sort(function(){return rng()-0.5;});
    var cardColors = shuffledColors.slice(0,6);

    var wrap = document.createElement('div');
    wrap.style.cssText='text-align:center;';
    var cvs = document.createElement('canvas');
    cvs.width=W;cvs.height=H;
    var ctx = cvs.getContext('2d');
    ctx.fillStyle='#fafaf7';ctx.fillRect(0,0,W,H);

    /* Bordo carta */
    ctx.strokeStyle='#e8e0d0';ctx.lineWidth=1.5;ctx.strokeRect(2,2,W-4,H-4);

    /* Numero carta */
    ctx.fillStyle='#8a7a60';ctx.font='bold 11px sans-serif';
    ctx.fillText('Carta '+(ci+1),8,15);

    poses[poseIdx](ctx,cardColors);

    /* Legenda colori */
    var legendY = 148;
    ctx.font='8px sans-serif';ctx.fillStyle='#555';
    for(var li=0;li<6;li++){
      ctx.fillStyle=cardColors[li];
      ctx.fillRect(8+(li%3)*42,legendY+Math.floor(li/3)*12,8,8);
      ctx.fillStyle='#333';
      ctx.fillText(partNames[li].split(' ')[0],18+(li%3)*42,legendY+6+Math.floor(li/3)*12);
    }

    wrap.appendChild(cvs);
    grid.appendChild(wrap);
  }

  card.appendChild(grid);
  var gb=document.createElement('button');gb.className='guide-btn';gb.textContent='Guida per genitori';gb.onclick=function(){showGuide('stickman');};
  card.appendChild(gb);area.appendChild(card);
}

/* ==================== COLORA PER NUMERO ==================== */
function generateColorByNumber(area, diff, name) {
  var W=400, H=320;

  var colorMap = {
    1:'#e04f4f', 2:'#4a90d9', 3:'#4caf7d', 4:'#f5c842',
    5:'#7c5cbf', 6:'#f47c2f', 7:'#e05f8e', 8:'#795548'
  };

  var subjects = [
    { name:'Sole e nuvole', fn:function(ctx,fill){
      if(fill){ctx.fillStyle=colorMap[4];ctx.beginPath();ctx.arc(200,120,60,0,Math.PI*2);ctx.fill();}
      else{ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.beginPath();ctx.arc(200,120,60,0,Math.PI*2);ctx.stroke();}
      var rays=8;for(var i=0;i<rays;i++){var a=i*(Math.PI*2/rays);if(fill){ctx.fillStyle=colorMap[4];}else{ctx.strokeStyle='#333';ctx.lineWidth=2;}ctx.beginPath();ctx.moveTo(200+70*Math.cos(a),120+70*Math.sin(a));ctx.lineTo(200+90*Math.cos(a),120+90*Math.sin(a));if(!fill)ctx.stroke();}
      var clouds=[[80,60],[320,50],[60,180],[340,180]];
      for(var ci=0;ci<clouds.length;ci++){
        if(fill){ctx.fillStyle=colorMap[2];}else{ctx.strokeStyle='#333';ctx.lineWidth=2;}
        ctx.beginPath();ctx.arc(clouds[ci][0],clouds[ci][1],25,0,Math.PI*2);if(fill)ctx.fill();else ctx.stroke();
        ctx.beginPath();ctx.arc(clouds[ci][0]+20,clouds[ci][1]-5,18,0,Math.PI*2);if(fill)ctx.fill();else ctx.stroke();
        ctx.beginPath();ctx.arc(clouds[ci][0]+38,clouds[ci][1],22,0,Math.PI*2);if(fill)ctx.fill();else ctx.stroke();
      }
      if(fill){ctx.fillStyle=colorMap[3];ctx.fillRect(0,260,W,60);}else{ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.strokeRect(0,260,W,60);}
    }},
    { name:'Gatto', fn:function(ctx,fill){
      var fc=fill?function(c){ctx.fillStyle=colorMap[c];ctx.fill();}:function(){ctx.stroke();};
      ctx.beginPath();ctx.arc(200,140,75,0,Math.PI*2);if(fill){ctx.fillStyle=colorMap[4];}else{ctx.strokeStyle='#333';ctx.lineWidth=2;}ctx.beginPath();ctx.arc(200,140,75,0,Math.PI*2);if(fill)ctx.fill();else ctx.stroke();
      /* orecchie */
      ctx.beginPath();ctx.moveTo(148,80);ctx.lineTo(130,40);ctx.lineTo(175,68);ctx.closePath();if(fill){ctx.fillStyle=colorMap[4];}else{ctx.strokeStyle='#333';}if(fill)ctx.fill();else ctx.stroke();
      ctx.beginPath();ctx.moveTo(252,80);ctx.lineTo(270,40);ctx.lineTo(225,68);ctx.closePath();if(fill)ctx.fill();else ctx.stroke();
      /* occhi */
      ctx.beginPath();ctx.arc(175,130,18,0,Math.PI*2);if(fill){ctx.fillStyle=colorMap[2];}else{ctx.strokeStyle='#333';}if(fill)ctx.fill();else ctx.stroke();
      ctx.beginPath();ctx.arc(225,130,18,0,Math.PI*2);if(fill)ctx.fill();else ctx.stroke();
      /* naso */
      ctx.beginPath();ctx.arc(200,158,8,0,Math.PI*2);if(fill){ctx.fillStyle=colorMap[1];}else{ctx.strokeStyle='#333';}if(fill)ctx.fill();else ctx.stroke();
      /* corpo */
      ctx.beginPath();ctx.ellipse(200,255,55,55,0,0,Math.PI*2);if(fill){ctx.fillStyle=colorMap[4];}else{ctx.strokeStyle='#333';ctx.lineWidth=2;}if(fill)ctx.fill();else ctx.stroke();
      /* coda */
      ctx.strokeStyle=fill?colorMap[6]:'#333';ctx.lineWidth=fill?8:2;ctx.beginPath();ctx.moveTo(255,280);ctx.quadraticCurveTo(310,240,320,200);ctx.stroke();
    }},
    { name:'Casa nel bosco', fn:function(ctx,fill){
      /* cielo */
      if(fill){ctx.fillStyle=colorMap[2];ctx.fillRect(0,0,W,200);}else{ctx.strokeStyle='#333';ctx.lineWidth=1;ctx.strokeRect(0,0,W,200);}
      /* erba */
      if(fill){ctx.fillStyle=colorMap[3];ctx.fillRect(0,200,W,120);}else{ctx.strokeRect(0,200,W,120);}
      /* casa */
      if(fill){ctx.fillStyle=colorMap[4];}else{ctx.strokeStyle='#333';ctx.lineWidth=2;}
      ctx.beginPath();if(fill){ctx.fillRect(110,160,180,120);}else{ctx.strokeRect(110,160,180,120);}
      /* tetto */
      ctx.beginPath();ctx.moveTo(95,162);ctx.lineTo(200,80);ctx.lineTo(305,162);ctx.closePath();if(fill){ctx.fillStyle=colorMap[1];}if(fill)ctx.fill();else ctx.stroke();
      /* porta */
      ctx.beginPath();if(fill){ctx.fillStyle=colorMap[8];ctx.fillRect(178,222,44,58);}else{ctx.strokeRect(178,222,44,58);}
      /* finestra */
      ctx.beginPath();if(fill){ctx.fillStyle=colorMap[2];ctx.fillRect(120,185,40,35);}else{ctx.strokeRect(120,185,40,35);}
      ctx.beginPath();if(fill){ctx.fillRect(240,185,40,35);}else{ctx.strokeRect(240,185,40,35);}
      /* albero */
      if(fill){ctx.fillStyle=colorMap[8];ctx.fillRect(48,195,14,85);}else{ctx.strokeRect(48,195,14,85);}
      ctx.beginPath();ctx.arc(55,180,35,0,Math.PI*2);if(fill){ctx.fillStyle=colorMap[3];}if(fill)ctx.fill();else ctx.stroke();
    }},
    { name:'Fiore', fn:function(ctx,fill){
      var petals=8;
      for(var pi=0;pi<petals;pi++){
        var a=pi*(Math.PI*2/petals);
        ctx.beginPath();ctx.ellipse(200+60*Math.cos(a),160+60*Math.sin(a),25,18,a,0,Math.PI*2);
        if(fill){ctx.fillStyle=pi%2===0?colorMap[1]:colorMap[7];}else{ctx.strokeStyle='#333';ctx.lineWidth=2;}
        if(fill)ctx.fill();else ctx.stroke();
      }
      ctx.beginPath();ctx.arc(200,160,35,0,Math.PI*2);if(fill){ctx.fillStyle=colorMap[4];}else{ctx.strokeStyle='#333';ctx.lineWidth=2;}if(fill)ctx.fill();else ctx.stroke();
      /* stelo */
      if(fill){ctx.strokeStyle=colorMap[3];}else{ctx.strokeStyle='#333';}ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(200,195);ctx.lineTo(200,300);ctx.stroke();
      /* foglia */
      ctx.beginPath();ctx.ellipse(172,255,25,12,-0.5,0,Math.PI*2);if(fill){ctx.fillStyle=colorMap[3];}else{ctx.strokeStyle='#333';ctx.lineWidth=2;}if(fill)ctx.fill();else ctx.stroke();
    }},
    { name:'Arcobaleno', fn:function(ctx,fill){
      var rainbowColors=[colorMap[1],colorMap[6],colorMap[4],colorMap[3],colorMap[2],colorMap[5]];
      for(var ri=0;ri<6;ri++){
        var rad=210-ri*22;
        ctx.beginPath();ctx.arc(200,250,rad,Math.PI,0);
        if(fill){ctx.strokeStyle=rainbowColors[ri];}else{ctx.strokeStyle='#333';}
        ctx.lineWidth=fill?18:2;ctx.stroke();
      }
      /* nuvole */
      var nc=[[70,230],[330,230]];
      for(var ni=0;ni<nc.length;ni++){
        ctx.beginPath();ctx.arc(nc[ni][0],nc[ni][1],30,0,Math.PI*2);if(fill){ctx.fillStyle=colorMap[2];}else{ctx.strokeStyle='#333';ctx.lineWidth=2;}if(fill)ctx.fill();else ctx.stroke();
        ctx.beginPath();ctx.arc(nc[ni][0]+22,nc[ni][1]-8,22,0,Math.PI*2);if(fill)ctx.fill();else ctx.stroke();
        ctx.beginPath();ctx.arc(nc[ni][0]+42,nc[ni][1],26,0,Math.PI*2);if(fill)ctx.fill();else ctx.stroke();
      }
      /* erba */
      if(fill){ctx.fillStyle=colorMap[3];ctx.fillRect(0,270,W,50);}else{ctx.strokeStyle='#333';ctx.lineWidth=1;ctx.strokeRect(0,270,W,50);}
    }},
    { name:'Aquario', fn:function(ctx,fill){
      /* acqua */
      if(fill){ctx.fillStyle=colorMap[2];ctx.fillRect(0,0,W,H);}
      /* pesci */
      var fishData=[[100,100,1,1],[250,150,6,2],[150,220,3,3],[300,80,4,1]];
      for(var fi=0;fi<fishData.length;fi++){
        var fx=fishData[fi][0],fy=fishData[fi][1],fc=fishData[fi][2],fs=fishData[fi][3];
        ctx.beginPath();ctx.ellipse(fx,fy,35*fs/2,18*fs/2,0,0,Math.PI*2);
        if(fill){ctx.fillStyle=colorMap[fc];}else{ctx.strokeStyle='#333';ctx.lineWidth=2;}if(fill)ctx.fill();else ctx.stroke();
        ctx.beginPath();ctx.moveTo(fx+35*fs/2,fy-12*fs/2);ctx.lineTo(fx+55*fs/2,fy-22*fs/2);ctx.lineTo(fx+55*fs/2,fy+22*fs/2);ctx.lineTo(fx+35*fs/2,fy+12*fs/2);ctx.closePath();if(fill)ctx.fill();else ctx.stroke();
      }
      /* alghe */
      ctx.lineWidth=fill?6:2;for(var ai=0;ai<4;ai++){if(fill)ctx.strokeStyle=colorMap[3];else ctx.strokeStyle='#333';ctx.beginPath();ctx.moveTo(50+ai*80,H);ctx.quadraticCurveTo(40+ai*80,H-50,55+ai*80,H-100);ctx.stroke();}
      /* sabbia */
      if(fill){ctx.fillStyle=colorMap[4];ctx.fillRect(0,280,W,40);}else{ctx.strokeStyle='#333';ctx.lineWidth=1;ctx.strokeRect(0,280,W,40);}
    }}
  ];

  var subj = subjects[Math.floor(rng()*subjects.length)];
  var cvsFill = document.createElement('canvas');cvsFill.width=W;cvsFill.height=H;
  var cvsBlank = document.createElement('canvas');cvsBlank.width=W;cvsBlank.height=H;
  var ctxF=cvsFill.getContext('2d'),ctxB=cvsBlank.getContext('2d');
  ctxF.fillStyle='#fafaf7';ctxF.fillRect(0,0,W,H);
  ctxB.fillStyle='white';ctxB.fillRect(0,0,W,H);
  subj.fn(ctxF,true);subj.fn(ctxB,false);

  /* Legenda numeri-colori */
  var legendCvs=document.createElement('canvas');legendCvs.width=W;legendCvs.height=50;
  var lctx=legendCvs.getContext('2d');
  lctx.fillStyle='#fafaf7';lctx.fillRect(0,0,W,50);
  lctx.font='bold 11px sans-serif';
  var keys=Object.keys(colorMap);
  for(var ki=0;ki<keys.length;ki++){
    var kx=20+ki*48;
    lctx.fillStyle=colorMap[keys[ki]];lctx.fillRect(kx,12,20,20);
    lctx.strokeStyle='#aaa';lctx.lineWidth=1;lctx.strokeRect(kx,12,20,20);
    lctx.fillStyle='#333';lctx.fillText(keys[ki],kx+7,42);
  }

  var card=makeCard('Colora per numero \u2014 '+subj.name,'Usa i colori indicati dalla legenda per colorare il disegno!',name);
  var row=document.createElement('div');row.style.cssText='display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-top:8px;';
  var wA=document.createElement('div'),wB=document.createElement('div');
  wA.style.cssText=wB.style.cssText='text-align:center;';
  var pA=document.createElement('p'),pB=document.createElement('p');
  pA.textContent='Modello';pA.style.cssText='font-size:0.78rem;color:#8a7a60;font-weight:700;margin-bottom:4px;';
  pB.textContent='Da colorare';pB.style.cssText='font-size:0.78rem;color:#8a7a60;font-weight:700;margin-bottom:4px;';
  wA.appendChild(pA);wA.appendChild(cvsFill);
  wB.appendChild(pB);wB.appendChild(cvsBlank);
  row.appendChild(wA);row.appendChild(wB);
  card.appendChild(row);card.appendChild(legendCvs);
  var gb=document.createElement('button');gb.className='guide-btn';gb.textContent='Guida per genitori';gb.onclick=function(){showGuide('colorbynumber');};
  card.appendChild(gb);area.appendChild(card);
}

/* ==================== SEQUENZE ==================== */
function generateSequence(area, diff, name) {
  var W=480, H=110;
  var numSeq = diff==='explorer'?1:diff==='curious'?2:3;

  var shapeDrawers = [
    function(ctx,x,y,sz,v){ctx.beginPath();ctx.arc(x,y,sz,0,Math.PI*2);if(v)ctx.fill();else ctx.stroke();},
    function(ctx,x,y,sz,v){ctx.beginPath();ctx.rect(x-sz,y-sz,sz*2,sz*2);if(v)ctx.fill();else ctx.stroke();},
    function(ctx,x,y,sz,v){ctx.beginPath();ctx.moveTo(x,y-sz);ctx.lineTo(x+sz,y+sz);ctx.lineTo(x-sz,y+sz);ctx.closePath();if(v)ctx.fill();else ctx.stroke();},
    function(ctx,x,y,sz,v){ctx.beginPath();for(var i=0;i<5;i++){var a=i*(Math.PI*2/5)-Math.PI/2;var r=i%2===0?sz:sz*0.45;ctx.lineTo(x+r*Math.cos(a),y+r*Math.sin(a));}ctx.closePath();if(v)ctx.fill();else ctx.stroke();},
    function(ctx,x,y,sz,v){ctx.beginPath();ctx.moveTo(x,y-sz);ctx.lineTo(x+sz,y);ctx.lineTo(x,y+sz);ctx.lineTo(x-sz,y);ctx.closePath();if(v)ctx.fill();else ctx.stroke();}
  ];
  var colors=['#e04f4f','#4a90d9','#4caf7d','#f5c842','#7c5cbf','#f47c2f'];
  var sizes=[14,18,22];

  var card=makeCard('Completa la sequenza','Trova l\'elemento mancante e disegnalo nell\'ultimo spazio!',name);
  var container=document.createElement('div');container.style.cssText='margin-top:8px;';

  for(var si=0;si<numSeq;si++){
    var cvs=document.createElement('canvas');cvs.width=W;cvs.height=H;
    var ctx=cvs.getContext('2d');
    ctx.fillStyle='#fafaf7';ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#e8e0d0';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);

    /* Genera una regola: shape + colore + size che variano secondo pattern */
    var baseShape=Math.floor(rng()*shapeDrawers.length);
    var baseColor=Math.floor(rng()*colors.length);
    var baseSize=Math.floor(rng()*sizes.length);
    var rule=Math.floor(rng()*3); /* 0=cambia shape, 1=cambia colore, 2=cambia size */

    var totalItems=5, missingIdx=totalItems-1;
    var cellW=W/totalItems;

    for(var ii=0;ii<totalItems;ii++){
      var cx2=cellW*ii+cellW/2, cy2=H/2;
      var shape=baseShape,col=baseColor,sz=sizes[baseSize];
      if(rule===0) shape=(baseShape+ii)%shapeDrawers.length;
      else if(rule===1) col=(baseColor+ii)%colors.length;
      else sz=sizes[ii%sizes.length];

      if(ii===missingIdx){
        /* Casella vuota con punto interrogativo */
        ctx.strokeStyle='#c0a890';ctx.lineWidth=2;ctx.setLineDash([4,4]);
        ctx.strokeRect(cx2-cellW/2+5,cy2-35,cellW-10,70);
        ctx.setLineDash([]);
        ctx.fillStyle='#c0a890';ctx.font='bold 28px sans-serif';ctx.textAlign='center';
        ctx.fillText('?',cx2,cy2+10);ctx.textAlign='left';
      } else {
        ctx.fillStyle=colors[col];ctx.strokeStyle=colors[col];ctx.lineWidth=2;
        shapeDrawers[shape](ctx,cx2,cy2,sz,true);
      }
      /* Separatore */
      if(ii<totalItems-1){ctx.strokeStyle='#e8e0d0';ctx.lineWidth=1;ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(cellW*(ii+1),10);ctx.lineTo(cellW*(ii+1),H-10);ctx.stroke();}
    }
    container.appendChild(cvs);
    if(si<numSeq-1) container.appendChild(document.createElement('br'));
  }

  card.appendChild(container);
  var gb=document.createElement('button');gb.className='guide-btn';gb.textContent='Guida per genitori';gb.onclick=function(){showGuide('sequence');};
  card.appendChild(gb);area.appendChild(card);
}

/* ==================== RIFLESSO ==================== */
function generateMirror(area, diff, name) {
  var W=440, H=260;
  var gridN = diff==='explorer'?6:diff==='curious'?8:diff==='growing'?10:12;

  var subjects = [
    {name:'Farfalla',fn:function(ctx,gw,gh,filled){
      var pts=[[3,2],[3,3],[3,4],[4,1],[4,2],[4,3],[4,4],[4,5],[5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6]];
      for(var pi=0;pi<pts.length;pi++){
        var px=pts[pi][0],py=pts[pi][1];
        if(filled){ctx.fillStyle=px<4?'#e04f4f':'#7c5cbf';}else{ctx.strokeStyle='#ccc';}
        if(filled)ctx.fillRect(px*gw,py*gh,gw,gh);
        ctx.strokeStyle='#ddd';ctx.lineWidth=0.5;ctx.strokeRect(px*gw,py*gh,gw,gh);
      }
    }},
    {name:'Casa',fn:function(ctx,gw,gh,filled){
      var pts=[[2,3],[2,4],[2,5],[3,2],[3,3],[3,4],[3,5],[4,1],[4,2],[4,3],[4,4],[4,5],[5,3],[5,4],[5,5]];
      for(var pi=0;pi<pts.length;pi++){
        var px=pts[pi][0],py=pts[pi][1];
        if(filled){ctx.fillStyle=py<=2?'#e04f4f':py===5?'#8B4513':'#f5c842';}else{ctx.strokeStyle='#ccc';}
        if(filled)ctx.fillRect(px*gw,py*gh,gw,gh);
        ctx.strokeStyle='#ddd';ctx.lineWidth=0.5;ctx.strokeRect(px*gw,py*gh,gw,gh);
      }
    }},
    {name:'Cuore',fn:function(ctx,gw,gh,filled){
      var pts=[[1,1],[1,2],[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3],[3,4],[4,1],[4,2],[4,3],[5,2]];
      for(var pi=0;pi<pts.length;pi++){
        var px=pts[pi][0],py=pts[pi][1];
        if(filled)ctx.fillStyle='#e04f4f';
        if(filled)ctx.fillRect(px*gw,py*gh,gw,gh);
        ctx.strokeStyle='#ddd';ctx.lineWidth=0.5;ctx.strokeRect(px*gw,py*gh,gw,gh);
      }
    }}
  ];

  var subj=subjects[Math.floor(rng()*subjects.length)];
  var gw=Math.floor(W/2/gridN), gh=Math.floor(H/gridN);

  var cvs=document.createElement('canvas');cvs.width=W;cvs.height=H;
  var ctx=cvs.getContext('2d');
  ctx.fillStyle='white';ctx.fillRect(0,0,W,H);

  /* Griglia sinistra (disegnata) */
  subj.fn(ctx,gw,gh,true);
  /* Griglia destra (vuota da completare) */
  ctx.fillStyle='#f8f5f0';ctx.fillRect(W/2,0,W/2,H);
  for(var gy=0;gy<gridN;gy++) for(var gx=0;gx<gridN;gx++){
    ctx.strokeStyle='#e0d8cc';ctx.lineWidth=0.5;ctx.strokeRect(W/2+gx*gw,gy*gh,gw,gh);
  }
  /* Asse di simmetria */
  ctx.strokeStyle='#4a90d9';ctx.lineWidth=2;ctx.setLineDash([6,4]);
  ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.stroke();
  ctx.setLineDash([]);
  /* Etichette */
  ctx.fillStyle='#8a7a60';ctx.font='bold 11px sans-serif';
  ctx.fillText('Modello',8,14);ctx.fillText('Disegna il riflesso \u2192',W/2+8,14);

  var card=makeCard('Disegna il riflesso \u2014 '+subj.name,'Completa la parte destra disegnando il riflesso speculare!',name);
  card.appendChild(cvs);
  var gb=document.createElement('button');gb.className='guide-btn';gb.textContent='Guida per genitori';gb.onclick=function(){showGuide('mirror');};
  card.appendChild(gb);area.appendChild(card);
}

/* ==================== TROVA L'INTRUSO ==================== */
function generateIntruder(area, diff, name) {
  var numGroups = diff==='explorer'?1:diff==='curious'?2:diff==='growing'?3:4;
  var W=480, H=120;

  var groups = [
    {name:'Animali domestici',items:['Cane','Gatto','Criceto','Coniglio','Pesce','Aquila'],intruder:5},
    {name:'Frutti',items:['Mela','Pera','Banana','Carota','Uva','Fragola'],intruder:3},
    {name:'Mezzi di trasporto',items:['Auto','Bus','Bici','Treno','Scarpa','Aereo'],intruder:4},
    {name:'Colori',items:['Rosso','Verde','Alto','Blu','Giallo','Viola'],intruder:2},
    {name:'Numeri',items:['1','2','3','B','5','6'],intruder:3},
    {name:'Forme',items:['Cerchio','Quadrato','Libro','Triangolo','Rombo','Stella'],intruder:2},
    {name:'Verdure',items:['Zucchina','Patata','Ciliegie','Carota','Cipolla','Cavolo'],intruder:2},
    {name:'Strumenti musicali',items:['Chitarra','Piano','Martello','Violino','Flauto','Tromba'],intruder:2},
    {name:'Sport',items:['Calcio','Nuoto','Lettura','Tennis','Basket','Corsa'],intruder:2},
    {name:'Professioni',items:['Medico','Maestro','Pompiere','Cuoco','Nuvola','Pilota'],intruder:4},
    {name:'Stagioni',items:['Estate','Inverno','Martedi','Primavera','Autunno','Estate'],intruder:2},
    {name:'Pianeti',items:['Marte','Venere','Luna','Saturno','Giove','Mercurio'],intruder:2},
    {name:'Insetti',items:['Ape','Farfalla','Ragno','Formica','Mosca','Grillo'],intruder:2},
    {name:'Cibi dolci',items:['Torta','Gelato','Biscotto','Pizza','Cioccolato','Caramella'],intruder:3},
    {name:'Oggetti di scuola',items:['Matita','Gomma','Righello','Zaino','Divano','Astuccio'],intruder:4},
    {name:'Animali marini',items:['Balena','Polpo','Squalo','Cavallo','Delfino','Granchio'],intruder:3},
    {name:'Fiori',items:['Rosa','Margherita','Girasole','Tavolino','Tulipano','Orchidea'],intruder:3},
    {name:'Parti del corpo',items:['Occhio','Naso','Sedia','Mano','Piede','Orecchio'],intruder:2},
    {name:'Animali della foresta',items:['Orso','Cervo','Volpe','Funghi','Scoiattolo','Gufo'],intruder:3},
    {name:'Cose nel cielo',items:['Sole','Luna','Nuvola','Aereo','Albero','Stella'],intruder:4}
  ];

  var allGroups=groups.slice().sort(function(){return rng()-0.5;});
  var card=makeCard("Trova l'intruso","Cerchia l'elemento che non appartiene al gruppo!",name);
  var container=document.createElement('div');container.style.cssText='margin-top:8px;';

  for(var gi=0;gi<numGroups;gi++){
    var g=allGroups[gi];
    var cvs=document.createElement('canvas');cvs.width=W;cvs.height=H;
    var ctx=cvs.getContext('2d');
    ctx.fillStyle='#fafaf7';ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#e8e0d0';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
    ctx.fillStyle='#7c5cbf';ctx.font='bold 12px sans-serif';ctx.fillText(g.name+':',10,22);
    var itemW=W/6;
    for(var ii=0;ii<6;ii++){
      var ix=ii*itemW+itemW/2;
      var isIntruder=(ii===g.intruder);
      ctx.fillStyle=isIntruder?'#fff0f0':'#f0f7ff';
      ctx.beginPath();ctx.roundRect?ctx.roundRect(ix-itemW/2+4,32,itemW-8,68,8):ctx.rect(ix-itemW/2+4,32,itemW-8,68);ctx.fill();
      ctx.strokeStyle=isIntruder?'#f5c842':'#c0d8f0';ctx.lineWidth=1.5;ctx.stroke();
      ctx.fillStyle='#2d2416';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
      /* Wrap text */
      var word=g.items[ii];
      ctx.fillText(word,ix,72);
      ctx.textAlign='left';
    }
    container.appendChild(cvs);
    if(gi<numGroups-1){var br=document.createElement('div');br.style.height='8px';container.appendChild(br);}
  }

  card.appendChild(container);
  var gb=document.createElement('button');gb.className='guide-btn';gb.textContent='Guida per genitori';gb.onclick=function(){showGuide('intruder');};
  card.appendChild(gb);area.appendChild(card);
}

/* ==================== ASSOCIA LE COPPIE ==================== */
function generatePairs(area, diff, name) {
  var W=460, H=300;

  var pairSets = [
    {name:'Animale + cibo',pairs:[['Cane','Osso'],['Ape','Miele'],['Coniglio','Carota'],['Mucca','Erba'],['Scimmia','Banana'],['Gatto','Pesce']]},
    {name:'Paese + capitale',pairs:[['Italia','Roma'],['Francia','Parigi'],['Spagna','Madrid'],['Germania','Berlino'],['Inghilterra','Londra'],['Giappone','Tokyo']]},
    {name:'Numero + doppio',pairs:[['1','2'],['3','6'],['5','10'],['4','8'],['7','14'],['2','4']]},
    {name:'Colore + oggetto',pairs:[['Rosso','Fuoco'],['Blu','Mare'],['Verde','Erba'],['Giallo','Sole'],['Bianco','Neve'],['Nero','Notte']]},
    {name:'Professione + strumento',pairs:[['Medico','Stetoscopio'],['Pittore','Pennello'],['Cuoco','Padella'],['Falegname','Martello'],['Musicista','Violino'],['Astronauta','Casco']]},
    {name:'Stagione + elemento',pairs:[['Primavera','Fiori'],['Estate','Sole'],['Autunno','Foglie'],['Inverno','Neve'],['Primavera','Pioggia'],['Estate','Mare']]},
    {name:'Animale + verso',pairs:[['Cane','Abbaia'],['Gatto','Miagola'],['Mucca','Muggisce'],['Rana','Gracida'],['Uccello','Cinguetta'],['Leone','Ruggisce']]},
    {name:'Frutto + colore',pairs:[['Banana','Giallo'],['Mela','Rosso'],['Uva','Viola'],['Kiwi','Verde'],['Arancia','Arancione'],['Mirtillo','Blu']]},
    {name:'Pianeta + caratteristica',pairs:[['Marte','Rosso'],['Saturno','Anelli'],['Giove','Grande'],['Mercurio','Piccolo'],['Venere','Caldo'],['Terra','Blu']]},
    {name:'Sport + attrezzo',pairs:[['Calcio','Pallone'],['Tennis','Racchetta'],['Nuoto','Cuffia'],['Ciclismo','Bici'],['Boxe','Guantoni'],['Golf','Mazza']]}
  ];

  var ps=pairSets[Math.floor(rng()*pairSets.length)];
  var numPairs=diff==='explorer'?3:diff==='curious'?4:diff==='growing'?5:6;
  var selectedPairs=ps.pairs.slice(0,numPairs);

  var cvs=document.createElement('canvas');cvs.width=W;cvs.height=H;
  var ctx=cvs.getContext('2d');
  ctx.fillStyle='#fafaf7';ctx.fillRect(0,0,W,H);

  var leftItems=selectedPairs.map(function(p){return p[0];});
  var rightItems=selectedPairs.map(function(p){return p[1];}).sort(function(){return rng()-0.5;});

  var rowH=H/(numPairs+1);
  var colors2=['#e04f4f','#4a90d9','#4caf7d','#f5c842','#7c5cbf','#f47c2f'];

  for(var pi=0;pi<numPairs;pi++){
    var y=rowH*(pi+1);
    /* Sinistra */
    ctx.fillStyle=colors2[pi%colors2.length];
    ctx.beginPath();if(ctx.roundRect)ctx.roundRect(20,y-18,140,36,8);else ctx.rect(20,y-18,140,36);ctx.fill();
    ctx.fillStyle='white';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
    ctx.fillText(leftItems[pi],90,y+5);
    /* Destra */
    ctx.fillStyle='#f0f0f0';ctx.strokeStyle='#ccc';ctx.lineWidth=1.5;
    ctx.beginPath();if(ctx.roundRect)ctx.roundRect(300,y-18,140,36,8);else ctx.rect(300,y-18,140,36);ctx.fill();ctx.stroke();
    ctx.fillStyle='#333';ctx.fillText(rightItems[pi],370,y+5);
    /* Puntini di collegamento */
    ctx.fillStyle='#ccc';ctx.beginPath();ctx.arc(175,y,5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(285,y,5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#e0d8cc';ctx.lineWidth=1;ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(180,y);ctx.lineTo(280,y);ctx.stroke();
    ctx.setLineDash([]);
    ctx.textAlign='left';
  }
  ctx.fillStyle='#8a7a60';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
  ctx.fillText(ps.name,W/2,18);ctx.textAlign='left';

  var card=makeCard('Associa le coppie','Collega con una linea ogni elemento della colonna sinistra a quello corrispondente a destra!',name);
  card.appendChild(cvs);
  var gb=document.createElement('button');gb.className='guide-btn';gb.textContent='Guida per genitori';gb.onclick=function(){showGuide('pairs');};
  card.appendChild(gb);area.appendChild(card);
}
