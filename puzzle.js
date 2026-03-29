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

/* ==================== LABIRINTO ==================== */
function generateMaze(area, diff, name) {
  var sizes = { easy: 11, medium: 15, hard: 21 };
  var size = sizes[diff];
  var cellSize = Math.min(28, Math.floor(540 / size));
  var w = size, h = size;
  var N = 1, S = 2, E = 4, W = 8;
  var opp = {}; opp[N]=S; opp[S]=N; opp[E]=W; opp[W]=E;
  var dx = {}; dx[N]=0; dx[S]=0; dx[E]=1; dx[W]=-1;
  var dy = {}; dy[N]=-1; dy[S]=1; dy[E]=0; dy[W]=0;
  var grid = [], visited = [], r, c;
  for (r = 0; r < h; r++) {
    grid.push([]); visited.push([]);
    for (c = 0; c < w; c++) { grid[r].push(15); visited[r].push(false); }
  }
  function carve(x, y) {
    visited[y][x] = true;
    var dirs = [N,S,E,W];
    dirs.sort(function() { return rng()-0.5; });
    for (var i = 0; i < dirs.length; i++) {
      var d = dirs[i], nx = x+dx[d], ny = y+dy[d];
      if (nx>=0&&nx<w&&ny>=0&&ny<h&&!visited[ny][nx]) {
        grid[y][x] &= ~d; grid[ny][nx] &= ~opp[d]; carve(nx,ny);
      }
    }
  }
  carve(0,0);
  var pad = 10;
  var cvs = document.createElement('canvas');
  cvs.width = w*cellSize+pad*2; cvs.height = h*cellSize+pad*2;
  var ctx = cvs.getContext('2d');
  ctx.fillStyle='#fafaf7'; ctx.fillRect(0,0,cvs.width,cvs.height);
  ctx.strokeStyle='#2d2416'; ctx.lineWidth=2; ctx.lineCap='square';
  var x, y, px, py;
  for (y=0;y<h;y++) for (x=0;x<w;x++) {
    px=x*cellSize+pad; py=y*cellSize+pad;
    if (grid[y][x]&N){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+cellSize,py);ctx.stroke();}
    if (grid[y][x]&W){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,py+cellSize);ctx.stroke();}
    if (x===w-1){ctx.beginPath();ctx.moveTo(px+cellSize,py);ctx.lineTo(px+cellSize,py+cellSize);ctx.stroke();}
    if (y===h-1){ctx.beginPath();ctx.moveTo(px,py+cellSize);ctx.lineTo(px+cellSize,py+cellSize);ctx.stroke();}
  }
  ctx.clearRect(pad,pad,2,cellSize);
  ctx.clearRect(pad+(w-1)*cellSize,pad+(h-1)*cellSize,2,cellSize+2);
  ctx.fillStyle='#4caf7d'; ctx.font='bold 12px sans-serif';
  ctx.fillText('GO',pad+1,pad+cellSize-4);
  ctx.fillStyle='#e04f4f';
  ctx.fillText('OK',pad+(w-1)*cellSize,pad+(h-1)*cellSize+cellSize-3);
  var card = makeCard('Labirinto',"Trova la via d'uscita! (GO = inizio, OK = fine)",name);
  card.appendChild(cvs); area.appendChild(card);
}

/* ==================== CERCA PAROLE ==================== */
function generateWordSearch(area, diff, name) {

  var vocab = {
    easy: [
      'CANE','GATTO','SOLE','LUNA','MARE','FIORE','RANA','PANE','MELA','PERA',
      'UOVO','LUCE','NASO','MANO','PIEDE','OCCHIO','BOCCA','TESTA','CASA','PORTA',
      'LAGO','BOSCO','PINO','ROSA','RAMO','NIDO','FICO','UVA','RISO','RETE',
      'ORSO','LUPO','VOLPE','CERVO','LEPRE','ANATRA','ORCA','TOPO','GALLO','CAPRA',
      'ELMO','ARCO','DADO','FILO','VASO','PALLA','SEDIA','TAVOLO','LETTO','LIBRO',
      'AQUILA','CIGNO','AIRONE','FALCO','GUFO','CORVO','MERLO','TORDO','PASSERO','GAZZA',
      'FICO','KIWI','LIME','PRUGNA','CILIEGIA','ANGURIA','BANANA','FRAGOLA','PESCA','MANGO'
    ],
    medium: [
      'FARFALLA','CONIGLIO','CASTELLO','GIRAFFA','ELEFANTE','TARTARUGA','DELFINO','PINGUINO',
      'COCCODRILLO','PAPPAGALLO','LEONESSA','DINOSAURO','ASTRONAUTA','SERPENTE','PANTERA',
      'SCORPIONE','CALAMARO','RINOCERONTE','IPPOPOTAMO','CANGURO','GORILLA','GHEPARDO',
      'STRUZZO','FENICOTTERO','PELLICANO','ALBATROS','PORCOSPINO','PROCIONE','ORNITORINCO',
      'CAMALEONTE','AXOLOTL','PIRANHA','BARRACUDA','MURENA','ARAGOSTA','GRANCHIO','MEDUSA',
      'LIBELLULA','CICOGNA','PAVONE','GABBIANO','CARDELLINO','RONDINE','UPUPA','PICCHIO',
      'FORMICHIERE','BRADIPO','TAPIRO','CAPIBARA','VISONE','ERMELLINO','LONTRA','CASTORO',
      'FRAGOLA','LAMPONE','MIRTILLO','ANANAS','PAPAYA','COCCO','MELONE','COCOMERO',
      'ARANCIA','LIMONE','POMPELMO','MANDARINO','CLEMENTINA','AVOCADO','MANGO','GUAVA',
      'CASTELLO','GIARDINO','MONTAGNA','VULCANO','GHIACCIAIO','SAVANA','FORESTA','DESERTO'
    ],
    hard: [
      'TIRANNOSAURO','PTERODATTILO','TRICERATOPO','STEGOSAURO','BRACHIOSAURUS',
      'VELOCIRAPTOR','ANCHILOSAURUS','PARASAUROLOPHUS','DIPLODOCO','MEGALODONTE',
      'CHIMPANZE','ORANGUTAN','MANDRILLO','BABBUINO','MACACO','GIBBONE','SCIMPANZE',
      'CAMOSCIO','STAMBECCO','MUFLONE','CARIBU','ALCE','BISONTE','BUFALO','GNU',
      'ANACONDA','PITONE','MAMBA','COBRA','VIPERA','RETTILE','ANFIBIO','MAMMIFERO',
      'PEREGRINE','CONDOR','PELLICANO','FENICOTTERO','MARABOU','QUETZAL','TUCANO',
      'PLATESSA','MERLUZZO','SALMONE','STORIONE','PESCE SPADA','TONNO','BRANZINO',
      'CARAPACE','TENTACOLO','CLOROFILLA','FOTOSINTESI','POLMONE','CRISTALLO',
      'ASTRONAVE','ASTEROIDE','COSTELLAZIONE','GALASSIA','NEBULOSA','SUPERNOVA',
      'CALEIDOSCOPIO','PRISMA','PERISCOPO','TELESCOPIO','MICROSCOPIO','BAROMETRO',
      'BIBLIOTECARIO','MATEMATICA','GEOMETRIA','ORCHESTRA','SINFONIA','MELODIA',
      'CIOCCOLATO','MARMELLATA','CARAMELLA','PASTICCERIA','GELATERIA','PIZZERIA'
    ]
  };

  var pool = vocab[diff].slice().sort(function(){return rng()-0.5;});
  var maxLen = diff==='easy'?5:diff==='medium'?9:13;
  var minLen = diff==='easy'?3:diff==='medium'?5:7;
  var selected = [];
  for (var pi=0; pi<pool.length && selected.length<8; pi++) {
    if (pool[pi].length>=minLen && pool[pi].length<=maxLen) selected.push(pool[pi]);
  }
  if (selected.length < 6) selected = pool.slice(0,6);
  var allWords = selected.slice(0,6);

  var gridSize = diff==='easy'?11:diff==='medium'?14:17;
  var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var grid = [], r, c;
  for (r=0;r<gridSize;r++){grid.push([]);for(c=0;c<gridSize;c++)grid[r].push('');}

  function placeWord(word) {
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

  var container=document.createElement('div'); container.className='word-grid';
  var gy,gx,row,cell;
  for(gy=0;gy<gridSize;gy++){
    row=document.createElement('div'); row.className='word-grid-row';
    for(gx=0;gx<gridSize;gx++){
      cell=document.createElement('div'); cell.className='word-cell';
      cell.textContent=grid[gy][gx]; row.appendChild(cell);
    }
    container.appendChild(row);
  }
  var wordListDiv=document.createElement('div'); wordListDiv.className='wordlist';
  for(wi=0;wi<allWords.length;wi++){
    var chip=document.createElement('span'); chip.className='word-chip';
    chip.textContent=allWords[wi]; wordListDiv.appendChild(chip);
  }
  var card=makeCard('Cerca le parole','Trova tutte le parole elencate qui sotto nella griglia!',name);
  card.appendChild(container); card.appendChild(wordListDiv); area.appendChild(card);
}

/* ==================== TROVA LE DIFFERENZE ==================== */
function generateDifferences(area, diff, name) {
  var numDiff = diff==='easy'?3:diff==='medium'?5:7;
  var W=260, H=200;

  /* Ogni scena riceve ctx e un array m[0..9] booleani.
     Le differenze sono STRUTTURALI (presenza/assenza, dimensione, posizione)
     non di colore. I colori rimangono sempre uguali. */

  var scenes = [

    /* 0 Casetta di campagna */
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
      ctx.fillStyle='#f5c842';
      for(var bi=0;bi<(m[8]?2:4);bi++){ctx.beginPath();ctx.arc(20+bi*12,35,3,0,Math.PI*2);ctx.fill();}
      if(!m[9]){ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(210,35,8,0,Math.PI*2);ctx.fill();}
    }},

    /* 1 Spiaggia */
    { name:'Spiaggia', fn: function(ctx,m){
      ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,W,120);
      ctx.fillStyle='#4a90d9';ctx.fillRect(0,108,W,92);
      ctx.fillStyle='#f4d03f';ctx.fillRect(0,128,W,72);
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(225,38,26,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(85,88,m[0]?30:42,Math.PI,0);ctx.fill();
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(85,88,m[0]?15:21,Math.PI,0);ctx.fill();
      ctx.fillStyle='#795548';ctx.fillRect(83,88,4,m[1]?38:50);
      ctx.fillStyle='#d4b483';
      ctx.fillRect(155,138,55,28);ctx.fillRect(163,128,14,14);ctx.fillRect(181,128,14,14);
      if(m[2]){ctx.fillRect(171,118,14,14);}
      ctx.fillStyle='#f39c12';ctx.beginPath();ctx.arc(128,152,m[3]?8:14,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e74c3c';
      ctx.beginPath();ctx.moveTo(22,100);ctx.lineTo(62,100);ctx.lineTo(57,115);ctx.lineTo(27,115);ctx.closePath();ctx.fill();
      ctx.fillStyle='white';ctx.beginPath();ctx.moveTo(42,76);ctx.lineTo(42,100);ctx.lineTo(60,100);ctx.closePath();ctx.fill();
      if(!m[4]){ctx.fillStyle='#4a90d9';ctx.fillRect(42,100,20,0);}
      ctx.strokeStyle='#aaddff';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(0,118);ctx.quadraticCurveTo(65,106,130,118);ctx.quadraticCurveTo(195,130,260,118);ctx.stroke();
      if(m[5]){
        ctx.strokeStyle='#aaddff';ctx.lineWidth=3;
        ctx.beginPath();ctx.moveTo(0,110);ctx.quadraticCurveTo(65,98,130,110);ctx.quadraticCurveTo(195,122,260,110);ctx.stroke();
      }
      ctx.fillStyle='#e74c3c';
      for(var si=0;si<(m[6]?2:4);si++){ctx.beginPath();ctx.arc(40+si*18,145,5,0,Math.PI*2);ctx.fill();}
      if(m[7]){ctx.fillStyle='#4a90d9';ctx.beginPath();ctx.arc(200,80,16,0,Math.PI*2);ctx.fill();ctx.fillStyle='white';ctx.beginPath();ctx.arc(200,80,8,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#795548';if(!m[8]){ctx.beginPath();ctx.arc(165,155,6,0,Math.PI*2);ctx.fill();}
      if(m[9]){ctx.fillStyle='#f4d03f';ctx.fillRect(200,130,30,10);ctx.fillRect(205,120,20,12);}
    }},

    /* 2 Spazio */
    { name:'Spazio', fn: function(ctx,m){
      ctx.fillStyle='#0a0a2e';ctx.fillRect(0,0,W,H);
      var stars=[[20,15],[50,30],[80,10],[120,25],[160,8],[200,20],[240,35],[15,60],[90,55],[180,50],[230,65],[40,80],[130,70],[210,80],[70,40],[150,45],[100,90],[250,15]];
      ctx.fillStyle='white';
      for(var si=0;si<stars.length;si++){ctx.beginPath();ctx.arc(stars[si][0],stars[si][1],1.5,0,Math.PI*2);ctx.fill();}
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
      var nStars = m[7]?3:5;
      ctx.fillStyle='#f5c842';
      for(var ni=0;ni<nStars;ni++){ctx.beginPath();ctx.arc(30+ni*22,170,4,0,Math.PI*2);ctx.fill();}
      if(m[8]){ctx.fillStyle='#4caf7d';ctx.beginPath();ctx.arc(230,100,12,0,Math.PI*2);ctx.fill();}
      if(!m[9]){ctx.fillStyle='#aaaaaa';ctx.fillRect(190,170,20,8);ctx.fillRect(196,163,8,8);}
    }},

    /* 3 Giungla */
    { name:'Giungla', fn: function(ctx,m){
      ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,W,110);
      ctx.fillStyle='#2d5a1b';ctx.fillRect(0,120,W,80);
      ctx.fillStyle='#4caf7d';ctx.fillRect(0,110,W,18);
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(38,38,20,0,Math.PI*2);ctx.fill();
      var treeX=[28,95,175,238];
      for(var ti=0;ti<treeX.length;ti++){
        ctx.fillStyle='#5d4037';ctx.fillRect(treeX[ti]-5,100,10,80);
        ctx.fillStyle='#4caf7d';
        ctx.beginPath();ctx.arc(treeX[ti],92,28,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.arc(treeX[ti],72,m[0]&&ti===1?16:20,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle='#795548';ctx.beginPath();ctx.arc(128,92,16,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#a1887f';ctx.beginPath();ctx.arc(128,97,9,0,Math.PI);ctx.fill();
      ctx.fillStyle='#4e342e';ctx.beginPath();ctx.arc(122,88,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(134,88,3,0,Math.PI*2);ctx.fill();
      if(!m[1]){ctx.strokeStyle='#5d4037';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(128,108);ctx.quadraticCurveTo(100,100,95,85);ctx.stroke();}
      ctx.fillStyle='#4a90d9';ctx.fillRect(0,152,W,48);
      ctx.fillStyle='#4caf7d';ctx.fillRect(55,154,m[2]?60:80,16);
      ctx.beginPath();ctx.arc(m[2]?115:135,162,10,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.ellipse(195,78,16,9,-0.5,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(213,78,16,9,0.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#333';ctx.fillRect(203,73,4,9);
      if(!m[3]){
        ctx.fillStyle='#e74c3c';
        for(var fi=0;fi<6;fi++){var fa=fi*Math.PI/3;ctx.beginPath();ctx.arc(48+Math.cos(fa)*9,148+Math.sin(fa)*9,7,0,Math.PI*2);ctx.fill();}
        ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(48,148,6,0,Math.PI*2);ctx.fill();
      }
      if(m[4]){ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(210,145,8,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='white';
      ctx.beginPath();ctx.arc(155,28,16,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(170,23,13,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(183,28,14,0,Math.PI*2);ctx.fill();
      if(m[5]){ctx.beginPath();ctx.arc(197,25,11,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#4e342e';
      for(var ei=0;ei<(m[6]?2:4);ei++){ctx.fillRect(10+ei*8,155,5,12);}
      if(!m[7]){ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(230,148,7,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#795548';if(m[8]){ctx.fillRect(220,100,8,48);}
      if(!m[9]){ctx.strokeStyle='#4caf7d';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(160,110);ctx.quadraticCurveTo(175,90,190,110);ctx.stroke();}
    }},

    /* 4 Città */
    { name:'Citta', fn: function(ctx,m){
      ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#7f8c8d';ctx.fillRect(0,H-35,W,35);
      ctx.fillStyle='#bdc3c7';ctx.fillRect(0,H-38,W,5);
      var blds=[
        {x:0,w:38,h:128},{x:42,w:52,h:158},{x:98,w:42,h:118},{x:144,w:48,h:175},{x:196,w:52,h:138}
      ];
      for(var bi=0;bi<blds.length;bi++){
        var b=blds[bi];
        ctx.fillStyle='#95a5a6';ctx.fillRect(b.x,H-35-b.h,b.w,b.h);
        ctx.fillStyle='#f1c40f';
        for(var wr=0;wr<5;wr++) for(var wc=0;wc<3;wc++){
          if((bi+wr+wc)%3!==0) ctx.fillRect(b.x+5+wc*12,H-35-b.h+10+wr*22,8,12);
        }
      }
      if(!m[0]){ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(225,38,22,0,Math.PI*2);ctx.fill();}
      else{ctx.fillStyle='#ddeeff';ctx.beginPath();ctx.arc(225,38,22,0,Math.PI*2);ctx.fill();ctx.fillStyle='#87ceeb';ctx.beginPath();ctx.arc(233,33,16,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#e74c3c';ctx.fillRect(28,H-55,58,20);
      ctx.fillStyle='#85c1e9';ctx.fillRect(36,H-63,42,15);
      ctx.fillStyle='#333';ctx.beginPath();ctx.arc(43,H-35,7,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(76,H-35,7,0,Math.PI*2);ctx.fill();
      if(!m[1]){ctx.fillStyle='white';ctx.fillRect(128,H-80,48,12);ctx.fillRect(146,H-88,14,8);ctx.fillRect(168,H-78,8,20);}
      ctx.fillStyle='#333';ctx.fillRect(178,H-70,7,38);ctx.fillRect(174,H-72,15,40);
      ctx.fillStyle='#e04f4f';ctx.beginPath();ctx.arc(181,H-65,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(181,H-55,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=m[2]?'#ffffff':'#4caf7d';ctx.beginPath();ctx.arc(181,H-45,4,0,Math.PI*2);ctx.fill();
      if(m[3]){ctx.fillStyle='#e74c3c';ctx.fillRect(130,H-55,55,20);ctx.fillStyle='#85c1e9';ctx.fillRect(138,H-62,38,13);ctx.fillStyle='#333';ctx.beginPath();ctx.arc(137,H-35,7,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(175,H-35,7,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='white';
      ctx.beginPath();ctx.arc(60,30,14,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(74,25,17,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(90,30,13,0,Math.PI*2);ctx.fill();
      if(!m[4]){ctx.beginPath();ctx.arc(104,28,11,0,Math.PI*2);ctx.fill();}
      if(m[5]){ctx.fillStyle='#aaaaaa';ctx.fillRect(105,H-100,6,68);}
      var nWindows = m[6]?2:4;
      for(var nwi=0;nwi<nWindows;nwi++){ctx.fillStyle='#f1c40f';ctx.fillRect(144+nwi*10,H-165,7,10);}
      if(!m[7]){ctx.fillStyle='#795548';ctx.fillRect(5,H-140,12,108);}
      if(m[8]){ctx.fillStyle='#4a90d9';ctx.beginPath();ctx.arc(50,60,12,0,Math.PI*2);ctx.fill();}
      if(!m[9]){ctx.fillStyle='#e04f4f';ctx.fillRect(195,H-90,10,58);}
    }},

    /* 5 Cucina */
    { name:'Cucina', fn: function(ctx,m){
      ctx.fillStyle='#fff8f0';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#e8d5b0';ctx.fillRect(0,148,W,52);
      ctx.fillStyle='#c0392b';ctx.fillRect(0,148,W,8);
      ctx.fillStyle='#8B4513';ctx.fillRect(18,158,224,13);ctx.fillRect(23,171,14,29);ctx.fillRect(218,171,14,29);
      ctx.fillStyle='#f39c12';ctx.fillRect(80,118,68,38);
      ctx.fillStyle='#e74c3c';ctx.fillRect(76,115,76,8);
      var nCandles=m[0]?2:4;
      for(var ci=0;ci<nCandles;ci++){ctx.fillStyle='#f5c842';ctx.fillRect(90+ci*16,103,5,14);ctx.fillStyle='#ff6600';ctx.beginPath();ctx.arc(92+ci*16,101,4,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#3498db';ctx.fillRect(168,128,34,28);ctx.strokeStyle='#2980b9';ctx.lineWidth=4;ctx.beginPath();ctx.arc(206,142,9,Math.PI*1.5,Math.PI*0.5);ctx.stroke();
      ctx.fillStyle='#87ceeb';ctx.fillRect(10,18,68,58);
      ctx.strokeStyle='white';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(44,18);ctx.lineTo(44,76);ctx.stroke();ctx.beginPath();ctx.moveTo(10,47);ctx.lineTo(78,47);ctx.stroke();
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(38,33,m[1]?8:14,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#ecf0f1';ctx.fillRect(188,18,52,118);
      ctx.fillStyle='#bdc3c7';ctx.fillRect(188,18,52,68);
      ctx.fillStyle='#7f8c8d';ctx.fillRect(224,50,7,10);ctx.fillRect(224,90,7,10);
      if(!m[2]){ctx.fillStyle='rgba(135,206,235,0.6)';ctx.fillRect(28,128,24,28);ctx.strokeStyle='#aaa';ctx.lineWidth=1;ctx.strokeRect(28,128,24,28);}
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(130,38,m[3]?12:18,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.beginPath();ctx.arc(130,38,m[3]?12:18,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(130,38);ctx.lineTo(130,m[3]?28:23);ctx.stroke();ctx.beginPath();ctx.moveTo(130,38);ctx.lineTo(m[3]?138:142,38);ctx.stroke();
      if(m[4]){ctx.fillStyle='#f39c12';ctx.fillRect(155,148,45,10);ctx.fillRect(160,138,35,12);}
      if(!m[5]){ctx.strokeStyle='#795548';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(95,115);ctx.lineTo(155,115);ctx.stroke();}
      if(m[6]){ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(215,100,12,0,Math.PI*2);ctx.fill();}
      var nPlates=m[7]?1:3;
      for(var pli=0;pli<nPlates;pli++){ctx.strokeStyle='#bbb';ctx.lineWidth=2;ctx.beginPath();ctx.arc(55+pli*18,160,6,0,Math.PI*2);ctx.stroke();}
      if(!m[8]){ctx.fillStyle='#27ae60';ctx.fillRect(195,90,38,8);}
      if(m[9]){ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(148,155,8,0,Math.PI*2);ctx.fill();}
    }},

    /* 6 Fattoria */
    { name:'Fattoria', fn: function(ctx,m){
      ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#7ec850';ctx.fillRect(0,128,W,72);
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(30,35,18,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#c0392b';ctx.fillRect(148,78,88,88);
      ctx.beginPath();ctx.moveTo(142,78);ctx.lineTo(192,42);ctx.lineTo(242,78);ctx.closePath();ctx.fill();
      ctx.fillStyle='#f39c12';ctx.fillRect(173,118,38,48);
      ctx.fillStyle='white';ctx.fillRect(38,122,58,34);ctx.fillRect(53,108,28,18);
      ctx.fillStyle='#333';ctx.beginPath();ctx.arc(62,106,4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(74,106,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e74c3c';ctx.fillRect(58,118,20,5);
      ctx.fillStyle='#333';
      for(var si=0;si<(m[0]?2:4);si++){ctx.beginPath();ctx.arc(42+si*14,135,4,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#8B4513';
      for(var fi=0;fi<6;fi++){ctx.fillRect(8+fi*35,138,5,28);}
      ctx.fillRect(8,145,240,5);ctx.fillRect(8,158,240,5);
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(118,142,m[1]?10:14,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(118,128,m[1]?8:10,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e74c3c';ctx.fillRect(122,124,8,5);
      ctx.fillStyle='#f5c842';ctx.fillRect(125,131,5,4);
      ctx.fillStyle='#bdc3c7';ctx.fillRect(5,88,28,68);
      ctx.fillStyle='#7f8c8d';ctx.beginPath();ctx.arc(19,88,7,0,Math.PI*2);ctx.fill();
      if(!m[2]){for(var wi=0;wi<4;wi++){var wa=wi*Math.PI/2;ctx.fillStyle='#7f8c8d';ctx.fillRect(19+Math.cos(wa)*7-2,88+Math.sin(wa)*7-14,4,18);}}
      ctx.fillStyle='white';
      ctx.beginPath();ctx.arc(100,28,16,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(116,23,13,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(130,28,m[3]?8:14,0,Math.PI*2);ctx.fill();
      if(m[4]){ctx.fillStyle='#4a90d9';ctx.beginPath();ctx.arc(192,62,12,0,Math.PI*2);ctx.fill();}
      if(!m[5]){ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(165,155,6,0,Math.PI*2);ctx.fill();}
      if(m[6]){ctx.fillStyle='#795548';ctx.fillRect(220,128,10,50);}
      var nFence=m[7]?4:6;
      for(var nfi=0;nfi<nFence;nfi++){ctx.fillStyle='#8B4513';ctx.fillRect(8+nfi*38,138,5,28);}
      if(!m[8]){ctx.fillStyle='#4caf7d';ctx.fillRect(40,160,22,8);}
      if(m[9]){ctx.fillStyle='#e74c3c';ctx.fillRect(210,80,18,30);}
    }},

    /* 7 Parco giochi */
    { name:'Parco giochi', fn: function(ctx,m){
      ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#7ec850';ctx.fillRect(0,145,W,55);
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(230,32,22,0,Math.PI*2);ctx.fill();
      /* altalena */
      ctx.fillStyle='#795548';ctx.fillRect(20,60,5,90);ctx.fillRect(70,60,5,90);
      ctx.strokeStyle='#795548';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(22,62);ctx.lineTo(72,62);ctx.stroke();
      ctx.beginPath();ctx.moveTo(35,62);ctx.lineTo(35,110);ctx.stroke();
      ctx.beginPath();ctx.moveTo(58,62);ctx.lineTo(58,110);ctx.stroke();
      ctx.fillStyle='#8B4513';ctx.fillRect(28,110,m[0]?20:30,6);
      /* scivolo */
      ctx.fillStyle='#e74c3c';ctx.fillRect(100,70,15,80);
      ctx.strokeStyle='#c0392b';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(115,72);ctx.lineTo(m[1]?158:150,148);ctx.stroke();
      /* scala scivolo */
      ctx.strokeStyle='#795548';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(100,72);ctx.lineTo(100,148);ctx.stroke();
      for(var ri=0;ri<(m[2]?3:5);ri++){ctx.beginPath();ctx.moveTo(85,80+ri*16);ctx.lineTo(100,80+ri*16);ctx.stroke();}
      /* altalena a dondolo */
      ctx.fillStyle='#f39c12';
      ctx.fillRect(170,130,m[3]?50:70,10);
      ctx.fillStyle='#795548';ctx.fillRect(200,110,5,22);
      /* casetta piccola */
      ctx.fillStyle='#3498db';ctx.fillRect(185,85,40,45);
      ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.moveTo(182,86);ctx.lineTo(205,65);ctx.lineTo(228,86);ctx.closePath();ctx.fill();
      if(!m[4]){ctx.fillStyle='#f1c40f';ctx.fillRect(198,100,12,10);}
      /* sandbox */
      ctx.fillStyle='#f4d03f';ctx.fillRect(m[5]?5:10,155,60,35);
      ctx.strokeStyle='#8B4513';ctx.lineWidth=3;ctx.strokeRect(m[5]?5:10,155,60,35);
      /* bambino */
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(38,105,10,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e74c3c';ctx.fillRect(32,115,12,20);
      if(!m[6]){ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(38,100,5,0,Math.PI*2);ctx.fill();}
      /* pallone */
      if(!m[7]){ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(155,162,12,0,Math.PI*2);ctx.fill();}
      /* nuvole */
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(80,22,12,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(93,18,15,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(106,22,11,0,Math.PI*2);ctx.fill();
      if(m[8]){ctx.beginPath();ctx.arc(120,20,10,0,Math.PI*2);ctx.fill();}
      if(!m[9]){ctx.fillStyle='#4caf7d';ctx.fillRect(230,150,20,8);ctx.fillRect(230,160,20,8);}
    }},

    /* 8 Sottomarino */
    { name:'Sottomarino', fn: function(ctx,m){
      ctx.fillStyle='#1a5276';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#2980b9';ctx.fillRect(0,0,W,80);
      ctx.fillStyle='#7ec850';ctx.fillRect(0,178,W,22);
      /* bolle */
      ctx.fillStyle='rgba(255,255,255,0.3)';
      var bubbles=[[30,40,8],[80,20,5],[150,50,10],[220,30,6],[240,60,4]];
      for(var bbi=0;bbi<(m[0]?3:5);bbi++){ctx.beginPath();ctx.arc(bubbles[bbi][0],bubbles[bbi][1],bubbles[bbi][2],0,Math.PI*2);ctx.fill();}
      /* sottomarino */
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.ellipse(130,120,90,30,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#f5c842';ctx.fillRect(105,90,50,32);
      ctx.fillStyle='#e6b800';ctx.fillRect(118,80,12,12);
      if(!m[1]){ctx.fillStyle='#e6b800';ctx.fillRect(138,75,5,18);}
      /* oblò */
      for(var oi=0;oi<(m[2]?2:4);oi++){
        ctx.fillStyle='#87ceeb';ctx.beginPath();ctx.arc(60+oi*42,120,10,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#e6b800';ctx.lineWidth=2;ctx.beginPath();ctx.arc(60+oi*42,120,10,0,Math.PI*2);ctx.stroke();
      }
      /* elica */
      ctx.fillStyle='#e6b800';
      for(var ei=0;ei<4;ei++){var ea=ei*Math.PI/2;ctx.beginPath();ctx.ellipse(40+Math.cos(ea)*12,120+Math.sin(ea)*12,10,4,ea,0,Math.PI*2);ctx.fill();}
      /* pesce */
      ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.ellipse(210,155,22,10,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.moveTo(232,148);ctx.lineTo(248,138);ctx.lineTo(248,162);ctx.closePath();ctx.fill();
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(202,152,4,0,Math.PI*2);ctx.fill();
      if(m[3]){ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.ellipse(210,175,16,8,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(226,169);ctx.lineTo(238,162);ctx.lineTo(238,182);ctx.closePath();ctx.fill();}
      /* alghe */
      ctx.fillStyle='#4caf7d';
      if(!m[4]){ctx.fillRect(18,158,8,22);ctx.fillRect(22,148,8,22);}
      ctx.fillRect(240,162,8,18);ctx.fillRect(244,152,8,18);
      if(m[5]){ctx.fillStyle='#f39c12';ctx.beginPath();ctx.arc(180,170,10,0,Math.PI*2);ctx.fill();}
      /* polipo */
      ctx.fillStyle='#8e44ad';ctx.beginPath();ctx.arc(m[6]?65:70,168,16,Math.PI,0);ctx.fill();
      for(var ti2=0;ti2<6;ti2++){ctx.beginPath();ctx.moveTo(55+ti2*5,168);ctx.quadraticCurveTo(53+ti2*5,180,55+ti2*5,188);ctx.stroke();}
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(63,164,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(73,164,3,0,Math.PI*2);ctx.fill();
      if(!m[7]){ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(190,85,8,0,Math.PI*2);ctx.fill();}
      if(m[8]){ctx.fillStyle='rgba(255,255,255,0.15)';ctx.beginPath();ctx.arc(130,120,95,0,Math.PI*2);ctx.fill();}
      if(!m[9]){ctx.fillStyle='#7ec850';ctx.fillRect(115,178,20,22);}
    }},

    /* 9 Montagna */
    { name:'Montagna', fn: function(ctx,m){
      ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#4a90d9';ctx.fillRect(0,155,W,45);
      /* montagna grande */
      ctx.fillStyle='#7f8c8d';ctx.beginPath();ctx.moveTo(0,180);ctx.lineTo(130,40);ctx.lineTo(260,180);ctx.closePath();ctx.fill();
      ctx.fillStyle='white';ctx.beginPath();ctx.moveTo(100,65);ctx.lineTo(130,40);ctx.lineTo(160,65);ctx.closePath();ctx.fill();
      /* montagna piccola */
      ctx.fillStyle='#95a5a6';ctx.beginPath();ctx.moveTo(150,180);ctx.lineTo(230,90);ctx.lineTo(260,140);ctx.lineTo(260,180);ctx.closePath();ctx.fill();
      if(!m[0]){ctx.fillStyle='white';ctx.beginPath();ctx.moveTo(210,105);ctx.lineTo(230,90);ctx.lineTo(248,110);ctx.closePath();ctx.fill();}
      /* sole */
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(220,35,m[1]?15:22,0,Math.PI*2);ctx.fill();
      /* aquila */
      if(!m[2]){
        ctx.fillStyle='#5d4037';ctx.beginPath();ctx.moveTo(40,70);ctx.quadraticCurveTo(55,60,70,70);ctx.quadraticCurveTo(55,80,40,70);ctx.fill();
        ctx.beginPath();ctx.moveTo(70,68);ctx.quadraticCurveTo(85,58,100,68);ctx.quadraticCurveTo(85,78,70,68);ctx.fill();
      }
      /* alberi */
      for(var ti=0;ti<(m[3]?3:5);ti++){
        ctx.fillStyle='#5d4037';ctx.fillRect(8+ti*38,155,6,25);
        ctx.fillStyle='#4caf7d';ctx.beginPath();ctx.arc(11+ti*38,148,12,0,Math.PI*2);ctx.fill();
      }
      /* capanna */
      ctx.fillStyle='#8B4513';ctx.fillRect(10,130,45,28);
      ctx.fillStyle='#5d4037';ctx.beginPath();ctx.moveTo(6,130);ctx.lineTo(32,110);ctx.lineTo(58,130);ctx.closePath();ctx.fill();
      if(!m[4]){ctx.fillStyle='#f1c40f';ctx.fillRect(24,138,10,10);}
      /* fumo capanna */
      if(m[5]){ctx.fillStyle='white';ctx.beginPath();ctx.arc(28,108,6,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(32,100,5,0,Math.PI*2);ctx.fill();}
      /* lago */
      ctx.fillStyle='#4a90d9';ctx.beginPath();ctx.ellipse(130,168,m[6]?35:50,12,0,0,Math.PI*2);ctx.fill();
      /* nuvola */
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(155,38,13,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(168,33,16,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(182,38,12,0,Math.PI*2);ctx.fill();
      /* cervo */
      if(!m[7]){ctx.fillStyle='#795548';ctx.fillRect(195,145,10,25);ctx.beginPath();ctx.arc(200,142,8,0,Math.PI*2);ctx.fill();}
      if(m[8]){ctx.fillStyle='#bdc3c7';ctx.fillRect(195,60,5,40);}
      if(!m[9]){ctx.strokeStyle='#5d4037';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(38,115);ctx.lineTo(32,108);ctx.lineTo(28,100);ctx.stroke();}
    }},

    /* 10 Pirata */
    { name:'Pirata', fn: function(ctx,m){
      ctx.fillStyle='#1a5276';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#2980b9';ctx.fillRect(0,120,W,80);
      ctx.fillStyle='#f4d03f';ctx.fillRect(0,158,W,42);
      /* nave pirata */
      ctx.fillStyle='#8B4513';ctx.beginPath();ctx.moveTo(20,130);ctx.lineTo(40,90);ctx.lineTo(220,90);ctx.lineTo(240,130);ctx.closePath();ctx.fill();
      ctx.fillStyle='#5d4037';ctx.fillRect(118,40,8,52);
      /* vela */
      ctx.fillStyle='white';ctx.beginPath();ctx.moveTo(126,42);ctx.lineTo(126,88);ctx.lineTo(m[0]?170:180,88);ctx.closePath();ctx.fill();
      /* jolly roger */
      if(!m[1]){ctx.fillStyle='black';ctx.fillRect(118,30,30,20);ctx.fillStyle='white';ctx.beginPath();ctx.arc(133,40,6,0,Math.PI*2);ctx.fill();}
      /* cannone */
      ctx.fillStyle='#333';ctx.beginPath();ctx.ellipse(60,130,18,10,0,0,Math.PI*2);ctx.fill();
      ctx.fillRect(68,125,m[2]?20:30,10);
      /* forziere */
      ctx.fillStyle='#8B4513';ctx.fillRect(165,100,40,28);
      ctx.fillStyle='#f5c842';ctx.fillRect(163,100,44,8);ctx.fillRect(182,100,8,28);
      if(!m[3]){ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(186,115,5,0,Math.PI*2);ctx.fill();}
      /* gabbiano */
      if(!m[4]){ctx.strokeStyle='white';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(30,60);ctx.quadraticCurveTo(40,50,50,60);ctx.stroke();ctx.beginPath();ctx.moveTo(55,55);ctx.quadraticCurveTo(65,45,75,55);ctx.stroke();}
      /* isola */
      ctx.fillStyle='#f4d03f';ctx.beginPath();ctx.ellipse(220,155,m[5]?25:35,12,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#5d4037';ctx.fillRect(218,128,4,28);
      ctx.fillStyle='#4caf7d';ctx.beginPath();ctx.arc(220,122,14,0,Math.PI*2);ctx.fill();
      /* polpo */
      ctx.fillStyle='#8e44ad';ctx.beginPath();ctx.arc(m[6]?155:160,145,12,Math.PI,0);ctx.fill();
      /* stelle marine */
      ctx.fillStyle='#e74c3c';
      if(!m[7]){ctx.beginPath();ctx.arc(85,162,7,0,Math.PI*2);ctx.fill();}
      ctx.beginPath();ctx.arc(110,168,m[8]?5:9,0,Math.PI*2);ctx.fill();
      /* luna */
      if(m[9]){ctx.fillStyle='#ddeeff';ctx.beginPath();ctx.arc(40,30,16,0,Math.PI*2);ctx.fill();ctx.fillStyle='#1a5276';ctx.beginPath();ctx.arc(47,26,12,0,Math.PI*2);ctx.fill();}
    }},

    /* 11 Dinosauri */
    { name:'Dinosauri', fn: function(ctx,m){
      ctx.fillStyle='#a8d5a2';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#87ceeb';ctx.fillRect(0,0,W,100);
      ctx.fillStyle='#c8e6c9';ctx.fillRect(0,140,W,60);
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(228,32,20,0,Math.PI*2);ctx.fill();
      /* vulcano */
      ctx.fillStyle='#7f8c8d';ctx.beginPath();ctx.moveTo(180,200);ctx.lineTo(210,80);ctx.lineTo(240,200);ctx.closePath();ctx.fill();
      if(m[0]){ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.moveTo(202,82);ctx.lineTo(210,60);ctx.lineTo(218,82);ctx.closePath();ctx.fill();}
      /* T-Rex */
      ctx.fillStyle='#4caf7d';
      ctx.fillRect(28,100,28,50);ctx.fillRect(36,88,20,18);
      ctx.fillRect(20,138,12,22);ctx.fillRect(44,138,12,22);
      ctx.fillRect(50,108,18,8);
      ctx.fillStyle='#333';ctx.beginPath();ctx.arc(48,91,3,0,Math.PI*2);ctx.fill();
      if(!m[1]){ctx.fillStyle='#4caf7d';ctx.fillRect(14,110,16,8);}
      /* triceratopo */
      ctx.fillStyle='#8B6914';ctx.beginPath();ctx.ellipse(145,145,40,22,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(183,140,16,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#7a5c10';
      ctx.fillRect(108,158,10,22);ctx.fillRect(122,158,10,22);ctx.fillRect(158,158,10,22);ctx.fillRect(172,158,10,22);
      /* corna */
      if(!m[2]){ctx.fillStyle='#5d4037';ctx.fillRect(188,125,4,18);ctx.fillRect(194,128,4,14);}
      else{ctx.fillStyle='#5d4037';ctx.fillRect(188,130,4,12);}
      /* alberi preistorici */
      for(var ti=0;ti<(m[3]?2:4);ti++){
        ctx.fillStyle='#5d4037';ctx.fillRect(5+ti*55,100,6,42);
        ctx.fillStyle='#4caf7d';ctx.beginPath();ctx.arc(8+ti*55,92,16,0,Math.PI*2);ctx.fill();
      }
      /* nuvola */
      ctx.fillStyle='white';ctx.beginPath();ctx.arc(88,22,12,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(100,18,15,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(114,22,11,0,Math.PI*2);ctx.fill();
      if(m[4]){ctx.beginPath();ctx.arc(128,20,10,0,Math.PI*2);ctx.fill();}
      /* pterodattilo */
      if(!m[5]){ctx.fillStyle='#795548';ctx.beginPath();ctx.moveTo(60,55);ctx.quadraticCurveTo(75,40,90,55);ctx.lineTo(75,70);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(88,50);ctx.quadraticCurveTo(103,35,118,50);ctx.lineTo(103,65);ctx.closePath();ctx.fill();}
      /* uova */
      for(var ei=0;ei<(m[6]?2:4);ei++){ctx.fillStyle='#f39c12';ctx.beginPath();ctx.ellipse(20+ei*18,170,7,9,0,0,Math.PI*2);ctx.fill();}
      if(m[7]){ctx.fillStyle='#4a90d9';ctx.fillRect(60,160,50,20);}
      if(!m[8]){ctx.strokeStyle='#5d4037';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(120,140);ctx.quadraticCurveTo(115,120,125,110);ctx.stroke();}
      if(m[9]){ctx.fillStyle='#7f8c8d';ctx.beginPath();ctx.arc(175,45,14,0,Math.PI*2);ctx.fill();}
    }},

    /* 12 Circo */
    { name:'Circo', fn: function(ctx,m){
      ctx.fillStyle='#fff0f0';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#7ec850';ctx.fillRect(0,162,W,38);
      /* tendone */
      var stripes=['#e74c3c','#f5c842','#e74c3c','#f5c842','#e74c3c'];
      for(var si2=0;si2<5;si2++){ctx.fillStyle=stripes[si2];ctx.fillRect(si2*52,0,52,80);}
      ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.moveTo(0,80);ctx.lineTo(130,35);ctx.lineTo(260,80);ctx.closePath();ctx.fill();
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.moveTo(0,80);ctx.lineTo(65,58);ctx.lineTo(130,80);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(130,80);ctx.lineTo(195,58);ctx.lineTo(260,80);ctx.closePath();ctx.fill();
      /* palo */
      ctx.fillStyle='#795548';ctx.fillRect(127,35,6,130);
      /* elefante */
      ctx.fillStyle='#bdc3c7';ctx.beginPath();ctx.ellipse(65,148,38,25,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(95,135,18,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#bdc3c7';ctx.fillRect(35,165,12,25);ctx.fillRect(52,165,12,25);ctx.fillRect(72,165,12,25);ctx.fillRect(88,165,12,25);
      ctx.fillStyle='#bdc3c7';
      if(!m[0]){ctx.beginPath();ctx.moveTo(100,138);ctx.quadraticCurveTo(120,145,115,162);ctx.lineWidth=8;ctx.strokeStyle='#bdc3c7';ctx.stroke();}
      ctx.fillStyle='#333';ctx.beginPath();ctx.arc(100,132,3,0,Math.PI*2);ctx.fill();
      /* palloncini */
      var ballColors=['#e74c3c','#f5c842','#4a90d9','#4caf7d','#8e44ad'];
      for(var bai=0;bai<(m[1]?3:5);bai++){ctx.fillStyle=ballColors[bai];ctx.beginPath();ctx.arc(165+bai*14,m[2]?55:45,10,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#795548';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(165+bai*14,m[2]?65:55);ctx.lineTo(163+bai*14,90);ctx.stroke();}
      /* acrobata */
      ctx.fillStyle='#e74c3c';ctx.fillRect(m[3]?155:160,95,12,30);
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(m[3]?161:166,90,10,0,Math.PI*2);ctx.fill();
      if(!m[4]){ctx.fillStyle='#e74c3c';ctx.fillRect(145,100,30,5);}
      /* leone */
      ctx.fillStyle='#f39c12';ctx.beginPath();ctx.arc(210,155,22,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#f5c842';ctx.beginPath();ctx.arc(210,155,15,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#333';ctx.beginPath();ctx.arc(205,151,2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(215,151,2,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e74c3c';ctx.fillRect(205,158,10,4);
      if(!m[5]){ctx.fillStyle='#f39c12';ctx.fillRect(225,152,20,6);ctx.fillRect(238,150,10,5);}
      if(m[6]){ctx.fillStyle='#f5c842';for(var si3=0;si3<5;si3++){ctx.beginPath();ctx.arc(12+si3*20,170,6,0,Math.PI*2);ctx.fill();}}
      if(!m[7]){ctx.fillStyle='#8e44ad';ctx.beginPath();ctx.arc(130,168,10,0,Math.PI*2);ctx.fill();}
      if(m[8]){ctx.strokeStyle='#795548';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(100,120);ctx.lineTo(158,105);ctx.stroke();}
      if(!m[9]){ctx.fillStyle='white';ctx.beginPath();ctx.arc(28,30,10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(28,30,5,0,Math.PI*2);ctx.fill();}
    }}
  ];

  var sceneIdx = Math.floor(rng() * scenes.length);
  var scene = scenes[sceneIdx];

  var allIdxs=[0,1,2,3,4,5,6,7,8,9];
  allIdxs.sort(function(){return rng()-0.5;});
  var chosen=allIdxs.slice(0,numDiff);
  var chosenMap={};
  for(var ci=0;ci<chosen.length;ci++) chosenMap[chosen[ci]]=true;

  var wrap=document.createElement('div'); wrap.className='diff-row';
  var labels=['Immagine A','Immagine B'];
  for(var idx=0;idx<2;idx++){
    var div=document.createElement('div'); div.className='diff-canvas-wrap';
    var cvs=document.createElement('canvas'); cvs.width=W; cvs.height=H;
    scene.fn(cvs.getContext('2d'), idx===1?chosenMap:{});
    var p=document.createElement('p'); p.textContent=labels[idx];
    div.appendChild(cvs); div.appendChild(p); wrap.appendChild(div);
  }
  var card=makeCard('Trova le differenze &mdash; '+scene.name,'Ci sono '+numDiff+' differenze tra le due immagini. Riesci a trovarle tutte?',name);
  card.appendChild(wrap); area.appendChild(card);
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
  var remove=diff==='easy'?30:diff==='medium'?40:50;
  var puzzle=[],pr,pc;
  for(r=0;r<9;r++) puzzle.push(base[r].slice());
  var removed=0;
  while(removed<remove){pr=Math.floor(rng()*9);pc=Math.floor(rng()*9);if(puzzle[pr][pc]!==0){puzzle[pr][pc]=0;removed++;}}
  var container=document.createElement('div');container.className='sudoku-grid';
  var c,cell;
  for(r=0;r<9;r++) for(c=0;c<9;c++){
    cell=document.createElement('div');
    cell.className='sudoku-cell'+(puzzle[r][c]!==0?' given':'');
    if((c+1)%3===0&&c<8) cell.classList.add('box-right');
    if((r+1)%3===0&&r<8) cell.classList.add('box-bottom');
    if(puzzle[r][c]!==0) cell.textContent=puzzle[r][c];
    container.appendChild(cell);
  }
  var card=makeCard('Sudoku','Riempi la griglia: ogni numero da 1 a 9 deve comparire una sola volta in ogni riga, colonna e quadrato 3x3.',name);
  card.appendChild(container);area.appendChild(card);
}

/* ==================== UNISCI I PUNTI ==================== */
function generateConnect(area, diff, name) {
  var W=480, H=340;

  function norm(pts) {
    var minX=9999,minY=9999,maxX=-9999,maxY=-9999,i;
    for(i=0;i<pts.length;i++){if(pts[i].x<minX)minX=pts[i].x;if(pts[i].y<minY)minY=pts[i].y;if(pts[i].x>maxX)maxX=pts[i].x;if(pts[i].y>maxY)maxY=pts[i].y;}
    var pw=maxX-minX||1, ph=maxY-minY||1;
    var scale=Math.min((W-100)/pw,(H-80)/ph);
    var ox=(W-pw*scale)/2-minX*scale;
    var oy=(H-ph*scale)/2-minY*scale;
    for(i=0;i<pts.length;i++){pts[i].x=Math.round(pts[i].x*scale+ox);pts[i].y=Math.round(pts[i].y*scale+oy);}
    return pts;
  }

  /* Genera punti su cerchio con raggio variabile per evitare sovrapposizioni */
  function circleShape(n, radFn, cx, cy) {
    var pts=[], i, a, r;
    for(i=0;i<n;i++){a=i*(Math.PI*2/n)-Math.PI/2;r=radFn(i,n);pts.push({x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)});}
    return pts;
  }

  /* Aggiusta le label per evitare sovrapposizioni */
  function safeLabels(pts) {
    /* Restituisce array di offset {dx,dy} per ogni punto */
    var offsets=[];
    var i, j, ox, oy;
    for(i=0;i<pts.length;i++){
      ox=8; oy=-6;
      /* Prova 8 direzioni finché non c'è sovrapposizione */
      var dirs=[{dx:8,dy:-6},{dx:-18,dy:-6},{dx:8,dy:12},{dx:-18,dy:12},{dx:8,dy:3},{dx:-18,dy:3},{dx:0,dy:-14},{dx:0,dy:16}];
      for(var d=0;d<dirs.length;d++){
        ox=dirs[d].dx; oy=dirs[d].dy;
        var ok=true;
        for(j=0;j<offsets.length;j++){
          var lx=pts[i].x+ox, ly=pts[i].y+oy;
          var px2=pts[j].x+offsets[j].dx, py2=pts[j].y+offsets[j].dy;
          if(Math.abs(lx-px2)<16&&Math.abs(ly-py2)<12){ok=false;break;}
        }
        /* Controlla anche distanza dai punti stessi */
        if(ok){
          for(j=0;j<pts.length;j++){
            if(j===i) continue;
            if(Math.abs(pts[i].x+ox-pts[j].x)<14&&Math.abs(pts[i].y+oy-pts[j].y)<12){ok=false;break;}
          }
        }
        if(ok) break;
      }
      offsets.push({dx:ox,dy:oy});
    }
    return offsets;
  }

  var easyShapes = [
    {name:'Stella',fn:function(){return norm(circleShape(10,function(i){return i%2===0?100:42;},130,100));}},
    {name:'Cuore',fn:function(){var pts=[],i,t,n=16,s;for(i=0;i<n;i++){t=(i/n)*Math.PI*2;s=Math.sin(t);pts.push({x:130+70*(16*s*s*s)/16,y:100-60*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/13});}return norm(pts);}},
    {name:'Casa',fn:function(){return norm([{x:0,y:60},{x:60,y:0},{x:120,y:60},{x:100,y:60},{x:100,y:130},{x:70,y:130},{x:70,y:95},{x:50,y:95},{x:50,y:130},{x:20,y:130},{x:20,y:60}]);}},
    {name:'Pesce',fn:function(){return norm([{x:0,y:55},{x:0,y:15},{x:0,y:95},{x:0,y:55},{x:25,y:42},{x:60,y:35},{x:105,y:40},{x:145,y:55},{x:165,y:55},{x:145,y:70},{x:105,y:75},{x:60,y:72},{x:25,y:68}]);}},
    {name:'Fungo',fn:function(){return norm([{x:50,y:130},{x:30,y:130},{x:30,y:90},{x:10,y:90},{x:0,y:70},{x:5,y:40},{x:25,y:15},{x:50,y:0},{x:75,y:15},{x:95,y:40},{x:100,y:70},{x:90,y:90},{x:70,y:90},{x:70,y:130}]);}},
    {name:'Sole',fn:function(){return norm(circleShape(16,function(i){return i%2===0?100:72;},130,100));}},
    {name:'Diamante',fn:function(){return norm([{x:50,y:0},{x:100,y:0},{x:130,y:45},{x:75,y:130},{x:20,y:45}]);}},
    {name:'Luna',fn:function(){var pts=[],i,t,n=14;for(i=0;i<n;i++){t=Math.PI/2+(i/(n-1))*Math.PI;pts.push({x:100+80*Math.cos(t),y:100+80*Math.sin(t)});}pts.push({x:100+30*Math.cos(Math.PI*0.6),y:100+80*Math.sin(Math.PI*0.6)});return norm(pts);}},
    {name:'Barca',fn:function(){return norm([{x:0,y:80},{x:10,y:120},{x:110,y:120},{x:120,y:80},{x:0,y:80},{x:55,y:0},{x:55,y:80}]);}},
    {name:'Fiore',fn:function(){return norm(circleShape(12,function(i){return i%2===0?90:55;},130,100));}},
    {name:'Omino',fn:function(){return norm([{x:50,y:20},{x:60,y:0},{x:70,y:20},{x:65,y:22},{x:70,y:20},{x:80,y:40},{x:65,y:60},{x:85,y:85},{x:70,y:90},{x:60,y:68},{x:55,y:90},{x:40,y:85},{x:55,y:60},{x:40,y:40},{x:50,y:20}]);}},
    {name:'Cupcake',fn:function(){return norm([{x:10,y:80},{x:20,y:130},{x:90,y:130},{x:100,y:80},{x:10,y:80},{x:15,y:60},{x:25,y:40},{x:35,y:20},{x:55,y:5},{x:75,y:20},{x:85,y:40},{x:95,y:60},{x:85,y:75}]);}},
    {name:'Pallone',fn:function(){return norm(circleShape(12,function(){return 100;},130,110));}},
    {name:'Chitarra',fn:function(){return norm([{x:50,y:0},{x:50,y:0},{x:30,y:20},{x:10,y:50},{x:20,y:80},{x:50,y:90},{x:55,y:140},{x:50,y:170},{x:30,y:190},{x:40,y:210},{x:70,y:220},{x:100,y:210},{x:110,y:190},{x:90,y:170},{x:85,y:140},{x:90,y:90},{x:120,y:80},{x:130,y:50},{x:110,y:20},{x:90,y:0}]);}},
    {name:'Farfalla',fn:function(){var pts=[],i,t,n=20,r2;for(i=0;i<n;i++){t=(i/n)*Math.PI*2;r2=80+38*Math.cos(2*t);pts.push({x:130+r2*Math.cos(t),y:100+r2*Math.sin(t)*0.55});}return norm(pts);}}
  ];

  var mediumShapes = [
    {name:'Razzo',fn:function(){return norm([{x:50,y:0},{x:70,y:40},{x:65,y:40},{x:65,y:100},{x:80,y:100},{x:80,y:130},{x:65,y:130},{x:65,y:155},{x:50,y:175},{x:35,y:155},{x:35,y:130},{x:20,y:130},{x:20,y:100},{x:35,y:100},{x:35,y:40},{x:30,y:40}]);}},
    {name:'Aereo',fn:function(){return norm([{x:0,y:55},{x:55,y:45},{x:95,y:0},{x:120,y:12},{x:90,y:55},{x:165,y:50},{x:185,y:60},{x:165,y:70},{x:90,y:65},{x:120,y:108},{x:95,y:120},{x:55,y:75},{x:0,y:65}]);}},
    {name:'Dinosauro',fn:function(){return norm([{x:10,y:100},{x:0,y:70},{x:15,y:40},{x:35,y:20},{x:60,y:10},{x:80,y:20},{x:90,y:40},{x:85,y:60},{x:100,y:55},{x:120,y:30},{x:140,y:35},{x:130,y:60},{x:110,y:75},{x:100,y:90},{x:110,y:120},{x:100,y:150},{x:80,y:160},{x:70,y:140},{x:65,y:120},{x:45,y:120},{x:40,y:140},{x:20,y:150},{x:10,y:130}]);}},
    {name:'Drago',fn:function(){return norm([{x:20,y:80},{x:0,y:60},{x:10,y:30},{x:30,y:10},{x:60,y:0},{x:90,y:15},{x:100,y:45},{x:90,y:65},{x:110,y:55},{x:130,y:60},{x:120,y:80},{x:105,y:85},{x:115,y:100},{x:100,y:120},{x:80,y:130},{x:60,y:120},{x:55,y:140},{x:40,y:155},{x:20,y:160},{x:5,y:145},{x:10,y:125},{x:30,y:110},{x:25,y:95}]);}},
    {name:'Balena',fn:function(){return norm([{x:0,y:60},{x:10,y:30},{x:40,y:10},{x:80,y:0},{x:130,y:5},{x:170,y:25},{x:200,y:55},{x:205,y:85},{x:185,y:100},{x:200,y:115},{x:185,y:140},{x:155,y:130},{x:120,y:110},{x:80,y:100},{x:50,y:105},{x:20,y:95},{x:0,y:80}]);}},
    {name:'Castello',fn:function(){return norm([{x:0,y:160},{x:0,y:60},{x:15,y:60},{x:15,y:40},{x:30,y:40},{x:30,y:60},{x:45,y:60},{x:45,y:40},{x:60,y:40},{x:60,y:60},{x:60,y:80},{x:80,y:80},{x:80,y:20},{x:95,y:20},{x:95,y:0},{x:110,y:0},{x:110,y:20},{x:125,y:20},{x:125,y:80},{x:145,y:80},{x:145,y:60},{x:160,y:60},{x:160,y:40},{x:175,y:40},{x:175,y:60},{x:190,y:60},{x:190,y:160}]);}},
    {name:'Robot',fn:function(){return norm([{x:30,y:0},{x:70,y:0},{x:70,y:20},{x:90,y:20},{x:90,y:70},{x:110,y:70},{x:110,y:120},{x:90,y:120},{x:90,y:160},{x:75,y:160},{x:75,y:180},{x:60,y:180},{x:60,y:160},{x:40,y:160},{x:40,y:180},{x:25,y:180},{x:25,y:160},{x:10,y:160},{x:10,y:120},{x:-10,y:120},{x:-10,y:70},{x:10,y:70},{x:10,y:20},{x:30,y:20}]);}},
    {name:'Cavallo',fn:function(){return norm([{x:20,y:150},{x:10,y:120},{x:0,y:80},{x:10,y:50},{x:30,y:30},{x:50,y:20},{x:60,y:0},{x:80,y:10},{x:85,y:35},{x:95,y:25},{x:115,y:30},{x:110,y:55},{x:100,y:70},{x:115,y:90},{x:120,y:120},{x:110,y:150},{x:95,y:165},{x:80,y:155},{x:75,y:130},{x:55,y:120},{x:50,y:140},{x:40,y:160}]);}},
    {name:'Orsetto',fn:function(){return norm([{x:25,y:50},{x:10,y:30},{x:20,y:10},{x:40,y:0},{x:55,y:10},{x:70,y:0},{x:90,y:10},{x:100,y:30},{x:85,y:50},{x:100,y:70},{x:105,y:100},{x:95,y:130},{x:80,y:150},{x:60,y:160},{x:40,y:150},{x:25,y:130},{x:15,y:100},{x:20,y:70}]);}},
    {name:'Coniglio',fn:function(){return norm([{x:45,y:170},{x:20,y:160},{x:10,y:130},{x:20,y:100},{x:10,y:60},{x:15,y:20},{x:30,y:0},{x:45,y:15},{x:40,y:50},{x:50,y:60},{x:60,y:50},{x:55,y:15},{x:70,y:0},{x:85,y:20},{x:90,y:60},{x:80,y:100},{x:90,y:130},{x:80,y:160},{x:55,y:170}]);}},
    {name:'Volpe',fn:function(){return norm([{x:0,y:100},{x:0,y:60},{x:20,y:20},{x:30,y:0},{x:45,y:20},{x:55,y:40},{x:65,y:20},{x:80,y:0},{x:90,y:20},{x:110,y:60},{x:110,y:100},{x:95,y:120},{x:100,y:150},{x:80,y:160},{x:70,y:140},{x:55,y:160},{x:40,y:140},{x:30,y:160},{x:10,y:150},{x:15,y:120}]);}},
    {name:'Tartaruga',fn:function(){return norm(circleShape(18,function(i){return i%2===0?100:80;},130,100));}},
    {name:'Numero 8',fn:function(){var pts=[],i,t,n=24;for(i=0;i<n/2;i++){t=(i/(n/2))*Math.PI*2;pts.push({x:80+40*Math.cos(t),y:50+40*Math.sin(t)});}for(i=0;i<n/2;i++){t=(i/(n/2))*Math.PI*2;pts.push({x:80+40*Math.cos(t),y:130+40*Math.sin(t)});}return norm(pts);}},
    {name:'Chitarra elettrica',fn:function(){return norm([{x:40,y:0},{x:60,y:0},{x:70,y:15},{x:70,y:40},{x:80,y:50},{x:95,y:55},{x:90,y:75},{x:75,y:70},{x:70,y:80},{x:75,y:110},{x:65,y:140},{x:55,y:160},{x:65,y:180},{x:55,y:200},{x:45,y:180},{x:55,y:160},{x:45,y:140},{x:35,y:110},{x:40,y:80},{x:35,y:70},{x:20,y:75},{x:15,y:55},{x:30,y:50},{x:40,y:40},{x:40,y:15}]);}},
    {name:'Ancora',fn:function(){return norm([{x:50,y:0},{x:70,y:0},{x:70,y:20},{x:90,y:40},{x:80,y:45},{x:70,y:40},{x:70,y:120},{x:90,y:110},{x:100,y:120},{x:80,y:140},{x:60,y:130},{x:60,y:130},{x:60,y:140},{x:40,y:130},{x:20,y:140},{x:0,y:120},{x:10,y:110},{x:30,y:120},{x:30,y:40},{x:20,y:45},{x:10,y:40},{x:30,y:20},{x:30,y:0}]);}},
    {name:'Aquila',fn:function(){return norm([{x:60,y:0},{x:80,y:10},{x:100,y:5},{x:140,y:0},{x:160,y:20},{x:130,y:35},{x:110,y:30},{x:100,y:40},{x:120,y:60},{x:110,y:80},{x:90,y:70},{x:80,y:80},{x:80,y:110},{x:65,y:120},{x:55,y:110},{x:55,y:80},{x:45,y:70},{x:25,y:80},{x:15,y:60},{x:35,y:40},{x:25,y:30},{x:0,y:35},{x:20,y:15},{x:50,y:20}]);}}
  ];

  var hardShapes = [
    {name:'Gatto',fn:function(){return norm([{x:20,y:160},{x:10,y:130},{x:0,y:100},{x:10,y:70},{x:5,y:40},{x:20,y:15},{x:30,y:0},{x:40,y:15},{x:35,y:35},{x:50,y:20},{x:60,y:10},{x:65,y:25},{x:60,y:45},{x:75,y:30},{x:85,y:20},{x:90,y:35},{x:85,y:55},{x:95,y:70},{x:100,y:100},{x:90,y:130},{x:80,y:160},{x:70,y:175},{x:55,y:180},{x:50,y:160},{x:40,y:175},{x:30,y:175}]);}},
    {name:'Fenicottero',fn:function(){return norm([{x:60,y:0},{x:70,y:20},{x:65,y:40},{x:50,y:55},{x:30,y:60},{x:15,y:75},{x:10,y:95},{x:20,y:115},{x:40,y:120},{x:55,y:110},{x:60,y:130},{x:50,y:160},{x:35,y:190},{x:30,y:220},{x:40,y:230},{x:60,y:220},{x:65,y:200},{x:70,y:180},{x:75,y:160},{x:80,y:190},{x:90,y:220},{x:100,y:230},{x:110,y:220},{x:100,y:200},{x:90,y:170},{x:85,y:140},{x:90,y:120},{x:105,y:110},{x:120,y:115},{x:130,y:100},{x:125,y:80},{x:110,y:65},{x:95,y:55},{x:80,y:40},{x:75,y:20}]);}},
    {name:'Granchio',fn:function(){return norm([{x:50,y:60},{x:30,y:40},{x:10,y:50},{x:0,y:70},{x:15,y:80},{x:30,y:70},{x:20,y:100},{x:10,y:120},{x:20,y:130},{x:35,y:120},{x:30,y:140},{x:20,y:155},{x:35,y:160},{x:50,y:148},{x:45,y:165},{x:40,y:180},{x:55,y:180},{x:65,y:165},{x:75,y:180},{x:90,y:180},{x:85,y:165},{x:80,y:148},{x:95,y:160},{x:110,y:155},{x:100,y:140},{x:90,y:120},{x:105,y:130},{x:120,y:120},{x:130,y:100},{x:120,y:80},{x:135,y:70},{x:150,y:50},{x:130,y:40},{x:110,y:60},{x:90,y:65},{x:80,y:50},{x:70,y:60}]);}},
    {name:'Polpo',fn:function(){return norm([{x:60,y:0},{x:90,y:0},{x:110,y:20},{x:120,y:50},{x:110,y:70},{x:120,y:90},{x:105,y:115},{x:95,y:140},{x:100,y:165},{x:90,y:175},{x:80,y:165},{x:85,y:140},{x:75,y:115},{x:60,y:120},{x:45,y:115},{x:35,y:140},{x:40,y:165},{x:30,y:175},{x:20,y:165},{x:25,y:140},{x:30,y:115},{x:15,y:90},{x:0,y:70},{x:10,y:50},{x:20,y:20}]);}},
    {name:'Scorpione',fn:function(){return norm([{x:80,y:0},{x:100,y:10},{x:110,y:30},{x:100,y:50},{x:110,y:65},{x:100,y:80},{x:85,y:75},{x:75,y:85},{x:90,y:100},{x:85,y:120},{x:70,y:125},{x:60,y:115},{x:65,y:100},{x:50,y:95},{x:35,y:100},{x:30,y:115},{x:20,y:120},{x:5,y:110},{x:0,y:90},{x:15,y:80},{x:5,y:65},{x:15,y:50},{x:10,y:30},{x:25,y:15},{x:45,y:10},{x:55,y:20},{x:55,y:40},{x:65,y:50},{x:75,y:40},{x:75,y:20}]);}},
    {name:'Medusa',fn:function(){var pts=[],i,t,n=20,r3;for(i=0;i<n;i++){t=(i/n)*Math.PI*2;r3=80+25*Math.sin(5*t);pts.push({x:120+r3*Math.cos(t),y:80+r3*Math.sin(t)*0.7});}for(i=0;i<8;i++){var ta=i*(Math.PI/7)+Math.PI/14+Math.PI*0.1;pts.push({x:120+60*Math.cos(ta),y:80+50*Math.sin(ta)});pts.push({x:120+80*Math.cos(ta),y:80+110+20*Math.sin(i)});}return norm(pts);}},
    {name:'Sirena',fn:function(){return norm([{x:55,y:0},{x:70,y:10},{x:75,y:35},{x:65,y:55},{x:80,y:65},{x:90,y:55},{x:100,y:65},{x:85,y:80},{x:70,y:75},{x:65,y:90},{x:70,y:115},{x:80,y:140},{x:75,y:165},{x:60,y:175},{x:45,y:185},{x:30,y:195},{x:20,y:185},{x:35,y:170},{x:55,y:160},{x:60,y:145},{x:55,y:120},{x:50,y:95},{x:40,y:80},{x:25,y:85},{x:10,y:75},{x:20,y:60},{x:35,y:60},{x:45,y:55},{x:38,y:35},{x:40,y:10}]);}},
    {name:'Drago volante',fn:function(){return norm([{x:90,y:0},{x:120,y:15},{x:130,y:40},{x:120,y:65},{x:140,y:55},{x:165,y:60},{x:155,y:80},{x:130,y:80},{x:115,y:95},{x:130,y:115},{x:120,y:140},{x:100,y:155},{x:80,y:165},{x:60,y:155},{x:55,y:130},{x:65,y:110},{x:50,y:100},{x:35,y:115},{x:20,y:105},{x:30,y:85},{x:15,y:70},{x:0,y:55},{x:20,y:50},{x:40,y:60},{x:55,y:50},{x:50,y:30},{x:65,y:15},{x:80,y:10}]);}},
    {name:'Unicorno',fn:function(){return norm([{x:50,y:0},{x:60,y:20},{x:55,y:45},{x:70,y:35},{x:90,y:40},{x:100,y:60},{x:90,y:80},{x:100,y:100},{x:95,y:125},{x:80,y:145},{x:70,y:170},{x:60,y:185},{x:55,y:200},{x:45,y:200},{x:40,y:185},{x:30,y:165},{x:15,y:145},{x:5,y:120},{x:10,y:95},{x:20,y:75},{x:10,y:55},{x:25,y:40},{x:40,y:45},{x:42,y:22}]);}},
    {name:'Astronave',fn:function(){return norm([{x:70,y:0},{x:90,y:0},{x:100,y:20},{x:120,y:20},{x:140,y:40},{x:150,y:65},{x:140,y:85},{x:120,y:95},{x:115,y:115},{x:130,y:130},{x:125,y:145},{x:100,y:140},{x:80,y:155},{x:60,y:140},{x:35,y:145},{x:30,y:130},{x:45,y:115},{x:40,y:95},{x:20,y:85},{x:10,y:65},{x:20,y:40},{x:40,y:20},{x:60,y:20}]);}},
    {name:'Ragno',fn:function(){return norm([{x:60,y:30},{x:80,y:20},{x:100,y:30},{x:110,y:55},{x:100,y:75},{x:115,y:70},{x:130,y:50},{x:145,y:55},{x:135,y:80},{x:115,y:90},{x:110,y:110},{x:100,y:130},{x:90,y:150},{x:70,y:160},{x:50,y:150},{x:40,y:130},{x:30,y:110},{x:25,y:90},{x:5,y:80},{x:-5,y:55},{x:10,y:50},{x:25,y:70},{x:40,y:75},{x:30,y:55},{x:20,y:30}]);}},
    {name:'Treno',fn:function(){return norm([{x:0,y:50},{x:0,y:100},{x:15,y:115},{x:15,y:100},{x:185,y:100},{x:185,y:115},{x:200,y:100},{x:200,y:50},{x:185,y:35},{x:150,y:35},{x:150,y:10},{x:120,y:10},{x:120,y:35},{x:80,y:35},{x:80,y:10},{x:50,y:10},{x:50,y:35},{x:15,y:35}]);}},
    {name:'Nave',fn:function(){return norm([{x:10,y:120},{x:0,y:140},{x:10,y:160},{x:190,y:160},{x:200,y:140},{x:190,y:120},{x:160,y:120},{x:155,y:40},{x:145,y:40},{x:140,y:120},{x:115,y:120},{x:110,y:20},{x:100,y:0},{x:90,y:20},{x:85,y:120},{x:60,y:120},{x:55,y:60},{x:45,y:60},{x:40,y:120}]);}},
    {name:'Tartaruga marina',fn:function(){return norm([{x:60,y:0},{x:90,y:5},{x:115,y:25},{x:120,y:55},{x:110,y:80},{x:130,y:70},{x:150,y:75},{x:145,y:95},{x:120,y:100},{x:115,y:120},{x:95,y:140},{x:70,y:150},{x:45,y:140},{x:25,y:120},{x:20,y:100},{x:-5,y:95},{x:0,y:75},{x:20,y:70},{x:10,y:45},{x:20,y:20},{x:40,y:5}]);}},
    {name:'Mago',fn:function(){return norm([{x:50,y:0},{x:70,y:20},{x:65,y:45},{x:80,y:40},{x:95,y:50},{x:90,y:70},{x:75,y:72},{x:80,y:90},{x:90,y:110},{x:85,y:140},{x:70,y:165},{x:75,y:185},{x:60,y:195},{x:50,y:185},{x:55,y:165},{x:40,y:140},{x:35,y:110},{x:45,y:90},{x:50,y:72},{x:35,y:70},{x:30,y:50},{x:45,y:40},{x:55,y:45}]);}}
  ];

  var shapeSets = { easy: easyShapes, medium: mediumShapes, hard: hardShapes };
  var pool = shapeSets[diff];
  var shapeIdx = Math.floor(rng() * pool.length);
  var shape = pool[shapeIdx];
  var pts;
  try { pts = shape.fn(); } catch(e) { pts = norm(circleShape(12,function(){return 100;},130,100)); }

  var cvs = document.createElement('canvas');
  cvs.width=W; cvs.height=H;
  var ctx = cvs.getContext('2d');
  ctx.fillStyle='#fafaf7'; ctx.fillRect(0,0,W,H);

  /* guida leggerissima */
  ctx.strokeStyle='rgba(180,160,120,0.12)'; ctx.lineWidth=1.5; ctx.setLineDash([3,4]);
  ctx.beginPath();
  var pi;
  for(pi=0;pi<pts.length;pi++){if(pi===0)ctx.moveTo(pts[pi].x,pts[pi].y);else ctx.lineTo(pts[pi].x,pts[pi].y);}
  ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);

  /* calcola offset label senza sovrapposizioni */
  var offsets = safeLabels(pts);

  /* disegna punti e numeri */
  for(pi=0;pi<pts.length;pi++){
    ctx.fillStyle='#4a90d9';
    ctx.beginPath();ctx.arc(pts[pi].x,pts[pi].y,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#2d2416';
    ctx.font='bold 10px sans-serif';
    ctx.fillText(pi+1, pts[pi].x+offsets[pi].dx, pts[pi].y+offsets[pi].dy);
  }

  var card=makeCard('Unisci i punti &mdash; '+shape.name,"Collega i numeri in ordine e scopri l'immagine nascosta!",name);
  card.appendChild(cvs); area.appendChild(card);
}
