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
  if      (currentType === 'maze')   generateMaze(area, diff, name);
  else if (currentType === 'words')  generateWordSearch(area, diff, name);
  else if (currentType === 'sudoku') generateSudoku(area, diff, name);
  else if (currentType === 'color')  generateColor(area, diff, name);
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
  color: 'Colorare liberamente stimola creatività, concentrazione e motricità fine. Lasciate il bambino libero di scegliere i colori senza correggerlo. Usate la pagina come spunto: "Cosa sta facendo il dinosauro?" aiuta a sviluppare il linguaggio e la narrazione.'
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
  carve(0,0);
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
  ctx.clearRect(pad,pad,2,cellSize);
  ctx.clearRect(pad+(w-1)*cellSize,pad+(h-1)*cellSize,2,cellSize+2);
  ctx.fillStyle='#4caf7d';ctx.font='bold 11px sans-serif';ctx.fillText('GO',pad+1,pad+cellSize-4);
  ctx.fillStyle='#e04f4f';ctx.fillText('OK',pad+(w-1)*cellSize,pad+(h-1)*cellSize+cellSize-3);
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
  var W=680, H=460;

  var subjects = [

    { name:'Leone nella savana', fn:function(ctx){
      var sky=ctx.createLinearGradient(0,0,0,220);sky.addColorStop(0,'#fff8e8');sky.addColorStop(1,'#ffe0b0');ctx.fillStyle=sky;ctx.fillRect(0,0,W,220);
      ctx.fillStyle='#f5e0a0';ctx.fillRect(0,220,W,H-220);
      ctx.strokeStyle='#e8d060';ctx.lineWidth=2;ctx.beginPath();ctx.arc(580,80,45,0,Math.PI*2);ctx.stroke();
      for(var ri=0;ri<12;ri++){var ra=ri*Math.PI/6;ctx.beginPath();ctx.moveTo(580+52*Math.cos(ra),80+52*Math.sin(ra));ctx.lineTo(580+68*Math.cos(ra),80+68*Math.sin(ra));ctx.stroke();}
      ctx.strokeStyle='#d4c090';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,220);ctx.lineTo(80,155);ctx.lineTo(160,200);ctx.lineTo(240,145);ctx.lineTo(320,190);ctx.lineTo(400,148);ctx.lineTo(480,195);ctx.lineTo(560,160);ctx.lineTo(W,180);ctx.lineTo(W,220);ctx.stroke();
      ctx.strokeStyle='#c8b060';ctx.lineWidth=1.5;
      for(var gi=0;gi<30;gi++){var gx=10+gi*23;ctx.beginPath();ctx.moveTo(gx,245);ctx.lineTo(gx-5,225);ctx.moveTo(gx,245);ctx.lineTo(gx+3,222);ctx.moveTo(gx,245);ctx.lineTo(gx+8,228);ctx.stroke();}
      ctx.strokeStyle='#8B6914';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(80,440);ctx.lineTo(80,300);ctx.lineTo(55,270);ctx.moveTo(80,320);ctx.lineTo(110,285);ctx.moveTo(80,310);ctx.lineTo(60,295);ctx.stroke();
      ctx.strokeStyle='#7a9a40';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.ellipse(60,258,35,18,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.ellipse(110,278,30,15,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.ellipse(80,255,40,16,-0.2,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#8B6914';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(580,440);ctx.lineTo(580,310);ctx.lineTo(555,280);ctx.moveTo(580,330);ctx.lineTo(610,295);ctx.stroke();
      ctx.strokeStyle='#7a9a40';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.ellipse(558,268,32,16,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.ellipse(610,285,28,14,0,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#8B6914';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.ellipse(340,360,130,80,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(220,320,60,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(220,320,80,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(175,265);ctx.lineTo(158,240);ctx.lineTo(195,258);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(255,262);ctx.lineTo(268,238);ctx.lineTo(248,260);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.arc(200,312,8,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(238,308,8,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(210,332);ctx.lineTo(230,332);ctx.lineTo(220,342);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(210,342);ctx.quadraticCurveTo(220,352,230,342);ctx.stroke();
      ctx.beginPath();ctx.moveTo(180,330);ctx.lineTo(208,332);ctx.moveTo(180,338);ctx.lineTo(208,336);ctx.stroke();
      ctx.beginPath();ctx.moveTo(260,338);ctx.lineTo(232,332);ctx.moveTo(260,344);ctx.lineTo(232,336);ctx.stroke();
      ctx.beginPath();ctx.ellipse(260,430,35,22,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.ellipse(340,435,35,22,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.ellipse(420,430,35,22,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.ellipse(460,415,30,20,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(468,355);ctx.quadraticCurveTo(540,320,555,360);ctx.stroke();
      ctx.beginPath();ctx.arc(555,368,14,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#c8b060';ctx.lineWidth=1;
      ctx.beginPath();ctx.ellipse(580,370,40,25,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(548,350,18,0,Math.PI*2);ctx.stroke();
      ctx.lineWidth=1.5;for(var bi=0;bi<5;bi++){var bx=100+bi*100,by=50+bi*15;ctx.beginPath();ctx.moveTo(bx,by);ctx.quadraticCurveTo(bx+8,by-6,bx+16,by);ctx.stroke();}
    }},

    { name:'Delfini nell\'oceano', fn:function(ctx){
      var skyG=ctx.createLinearGradient(0,0,0,180);skyG.addColorStop(0,'#e8f4ff');skyG.addColorStop(1,'#b8d8f8');ctx.fillStyle=skyG;ctx.fillRect(0,0,W,180);
      var seaG=ctx.createLinearGradient(0,180,0,H);seaG.addColorStop(0,'#b8e0f8');seaG.addColorStop(1,'#d0f0f8');ctx.fillStyle=seaG;ctx.fillRect(0,180,W,H-180);
      ctx.strokeStyle='#f0d060';ctx.lineWidth=2;ctx.beginPath();ctx.arc(100,70,38,0,Math.PI*2);ctx.stroke();
      for(var ri=0;ri<10;ri++){var ra=ri*Math.PI/5;ctx.beginPath();ctx.moveTo(100+45*Math.cos(ra),70+45*Math.sin(ra));ctx.lineTo(100+58*Math.cos(ra),70+58*Math.sin(ra));ctx.stroke();}
      ctx.strokeStyle='#c8ddf0';ctx.lineWidth=1.5;
      function cloud(cx,cy,sz){ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(cx+sz*1.2,cy-sz*0.3,sz*0.8,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(cx+sz*2.2,cy,sz*0.9,0,Math.PI*2);ctx.stroke();}
      cloud(250,55,22);cloud(450,40,18);cloud(550,75,20);
      ctx.strokeStyle='#90c0e0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,180);ctx.lineTo(W,180);ctx.stroke();
      ctx.strokeStyle='#80b8d8';ctx.lineWidth=1.5;
      for(var wi=0;wi<4;wi++){ctx.beginPath();ctx.moveTo(0,195+wi*35);for(var wx=0;wx<W;wx+=60){ctx.quadraticCurveTo(wx+30,185+wi*35,wx+60,195+wi*35);}ctx.stroke();}
      ctx.strokeStyle='#5080a0';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.ellipse(330,248,65,22,-0.6,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(395,232,18,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(413,228);ctx.lineTo(438,218);ctx.lineTo(432,238);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(278,282);ctx.lineTo(258,268);ctx.lineTo(268,290);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(350,230);ctx.lineTo(360,205);ctx.lineTo(370,228);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.arc(400,230,4,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.ellipse(160,330,70,25,0.2,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(230,322,20,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(248,318);ctx.lineTo(272,308);ctx.lineTo(266,328);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(90,335);ctx.lineTo(68,318);ctx.lineTo(80,345);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(170,308);ctx.lineTo(180,285);ctx.lineTo(190,308);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.arc(234,320,4,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#7090a8';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.ellipse(520,290,45,16,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(565,285,13,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(475,292);ctx.lineTo(460,282);ctx.lineTo(468,298);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(528,276);ctx.lineTo(535,260);ctx.lineTo(542,276);ctx.closePath();ctx.stroke();
      ctx.strokeStyle='#60a0c0';ctx.lineWidth=1.2;
      var fishPos=[[100,400],[150,420],[200,390],[450,410],[500,430],[550,400],[600,380]];
      for(var fi=0;fi<fishPos.length;fi++){var fx=fishPos[fi][0],fy=fishPos[fi][1];ctx.beginPath();ctx.ellipse(fx,fy,12,6,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(fx+12,fy-4);ctx.lineTo(fx+20,fy-8);ctx.lineTo(fx+20,fy+8);ctx.lineTo(fx+12,fy+4);ctx.closePath();ctx.stroke();}
      ctx.strokeStyle='#a0c0d0';ctx.lineWidth=1.2;
      for(var si=0;si<5;si++){var sx=80+si*120,sy=440;ctx.beginPath();ctx.arc(sx,sy,12,Math.PI,0);ctx.stroke();ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-12,sy);ctx.moveTo(sx,sy);ctx.lineTo(sx+12,sy);ctx.stroke();}
      ctx.strokeStyle='#8090a0';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(580,170);ctx.lineTo(620,170);ctx.lineTo(615,185);ctx.lineTo(585,185);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(600,170);ctx.lineTo(600,148);ctx.lineTo(618,168);ctx.closePath();ctx.stroke();
    }},

    { name:'Dinosauro nel Giurassico', fn:function(ctx){
      ctx.fillStyle='#e0f0e8';ctx.fillRect(0,0,W,200);
      ctx.strokeStyle='#b0c8b0';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,200);ctx.lineTo(60,130);ctx.lineTo(120,170);ctx.lineTo(200,110);ctx.lineTo(280,155);ctx.lineTo(360,100);ctx.lineTo(440,145);ctx.lineTo(520,115);ctx.lineTo(600,150);ctx.lineTo(W,120);ctx.lineTo(W,200);ctx.stroke();
      ctx.fillStyle='#c8e0b0';ctx.fillRect(0,200,W,H-200);
      ctx.strokeStyle='#e0d080';ctx.lineWidth=2;ctx.beginPath();ctx.arc(80,65,35,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#60a050';ctx.lineWidth=2;
      function fern(bx,by,h,dir){ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx,by-h);ctx.stroke();for(var li=0;li<6;li++){var ly=by-li*(h/6),llen=(h/6)*(1-li/7)*0.9;ctx.beginPath();ctx.moveTo(bx,ly);ctx.quadraticCurveTo(bx+dir*llen*0.6,ly-llen*0.4,bx+dir*llen,ly-llen*0.2);ctx.stroke();ctx.beginPath();ctx.moveTo(bx,ly);ctx.quadraticCurveTo(bx-dir*llen*0.4,ly-llen*0.3,bx-dir*llen*0.7,ly-llen*0.1);ctx.stroke();}}
      fern(50,420,180,1);fern(120,440,150,-1);fern(580,410,170,1);fern(640,430,145,-1);
      ctx.strokeStyle='#5d4037';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(160,440);ctx.lineTo(160,280);ctx.stroke();
      ctx.lineWidth=2;ctx.strokeStyle='#60a050';
      ctx.beginPath();ctx.arc(160,260,50,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(160,220,35,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(160,192,20,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#5d4037';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(510,440);ctx.lineTo(510,290);ctx.stroke();
      ctx.lineWidth=2;ctx.strokeStyle='#60a050';
      ctx.beginPath();ctx.arc(510,268,45,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(510,232,30,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#909080';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(460,200);ctx.lineTo(500,120);ctx.lineTo(540,200);ctx.closePath();ctx.stroke();
      ctx.strokeStyle='#d04020';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(496,122);ctx.quadraticCurveTo(488,105,492,90);ctx.stroke();ctx.beginPath();ctx.moveTo(504,120);ctx.quadraticCurveTo(512,100,508,85);ctx.stroke();
      ctx.strokeStyle='#5a7a40';ctx.lineWidth=3;
      ctx.beginPath();ctx.ellipse(340,330,100,70,-0.3,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.ellipse(240,265,55,38,0.3,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(215,255);ctx.lineTo(165,270);ctx.lineTo(175,295);ctx.lineTo(218,285);ctx.closePath();ctx.stroke();
      ctx.lineWidth=1.5;for(var di=0;di<5;di++){ctx.beginPath();ctx.moveTo(168+di*9,270);ctx.lineTo(170+di*9,280);ctx.stroke();}
      ctx.beginPath();ctx.arc(228,258,9,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(228,258,4,0,Math.PI*2);ctx.stroke();
      ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(280,272);ctx.quadraticCurveTo(295,290,300,310);ctx.stroke();
      ctx.beginPath();ctx.moveTo(435,350);ctx.quadraticCurveTo(510,340,555,380);ctx.stroke();
      ctx.beginPath();ctx.moveTo(310,385);ctx.lineTo(290,430);ctx.lineTo(268,440);ctx.stroke();
      ctx.beginPath();ctx.moveTo(290,430);ctx.lineTo(250,445);ctx.moveTo(268,440);ctx.lineTo(265,452);ctx.stroke();
      ctx.beginPath();ctx.moveTo(370,390);ctx.lineTo(375,438);ctx.lineTo(395,448);ctx.stroke();
      ctx.beginPath();ctx.moveTo(375,438);ctx.lineTo(410,442);ctx.moveTo(395,448);ctx.lineTo(398,460);ctx.stroke();
      ctx.beginPath();ctx.moveTo(300,320);ctx.lineTo(268,340);ctx.lineTo(258,355);ctx.stroke();
      ctx.beginPath();ctx.moveTo(258,355);ctx.lineTo(250,362);ctx.moveTo(258,355);ctx.lineTo(265,364);ctx.stroke();
      ctx.lineWidth=1.5;for(var sci=0;sci<6;sci++){ctx.beginPath();ctx.moveTo(310+sci*22,270-sci*5);ctx.lineTo(315+sci*22,252-sci*5);ctx.lineTo(320+sci*22,270-sci*5);ctx.stroke();}
      ctx.strokeStyle='#708060';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(550,100);ctx.quadraticCurveTo(565,85,580,100);ctx.stroke();
      ctx.beginPath();ctx.moveTo(580,100);ctx.quadraticCurveTo(595,85,610,100);ctx.stroke();
      ctx.beginPath();ctx.arc(565,105,8,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(573,105);ctx.lineTo(590,112);ctx.stroke();
      ctx.strokeStyle='#8a9a70';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.ellipse(430,440,18,13,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(460,445,16,11,0.2,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(488,438,17,12,-0.1,0,Math.PI*2);ctx.stroke();
    }},

    { name:'Principessa nel castello', fn:function(ctx){
      var skyG=ctx.createLinearGradient(0,0,0,300);skyG.addColorStop(0,'#d0d8f8');skyG.addColorStop(1,'#f0e8f8');ctx.fillStyle=skyG;ctx.fillRect(0,0,W,H);
      ctx.strokeStyle='#c0c8e8';ctx.lineWidth=1;
      var stars=[[80,40],[150,25],[220,55],[300,30],[380,48],[450,22],[520,38],[600,28],[650,55]];
      for(var si=0;si<stars.length;si++){ctx.beginPath();ctx.arc(stars[si][0],stars[si][1],2,0,Math.PI*2);ctx.stroke();}
      ctx.strokeStyle='#d0d0b0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(600,60,30,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#c8e0b0';ctx.fillRect(0,360,W,H-360);
      ctx.strokeStyle='#d080a0';ctx.lineWidth=1.2;
      var flowers=[[50,390],[130,405],[600,395],[650,408]];
      for(var fi=0;fi<flowers.length;fi++){var fx=flowers[fi][0],fy=flowers[fi][1];for(var fp=0;fp<5;fp++){var fa=fp*(Math.PI*2/5);ctx.beginPath();ctx.arc(fx+8*Math.cos(fa),fy+8*Math.sin(fa),5,0,Math.PI*2);ctx.stroke();}ctx.beginPath();ctx.arc(fx,fy,5,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#80b050';ctx.beginPath();ctx.moveTo(fx,fy+5);ctx.lineTo(fx,fy+22);ctx.stroke();ctx.strokeStyle='#d080a0';}
      ctx.strokeStyle='#9090b0';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.rect(220,180,240,200);ctx.stroke();
      ctx.beginPath();ctx.rect(160,200,80,180);ctx.stroke();
      ctx.beginPath();ctx.rect(440,200,80,180);ctx.stroke();
      for(var mi=0;mi<5;mi++){ctx.beginPath();ctx.rect(160+mi*16,188,10,14);ctx.stroke();}
      for(var mi2=0;mi2<5;mi2++){ctx.beginPath();ctx.rect(440+mi2*16,188,10,14);ctx.stroke();}
      for(var mi3=0;mi3<9;mi3++){ctx.beginPath();ctx.rect(224+mi3*26,168,16,14);ctx.stroke();}
      ctx.strokeStyle='#a060a0';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(160,202);ctx.lineTo(200,155);ctx.lineTo(240,202);ctx.stroke();
      ctx.beginPath();ctx.moveTo(440,202);ctx.lineTo(480,155);ctx.lineTo(520,202);ctx.stroke();
      ctx.strokeStyle='#9090b0';ctx.lineWidth=2;
      ctx.beginPath();ctx.rect(250,145,60,50);ctx.stroke();ctx.beginPath();ctx.rect(370,145,60,50);ctx.stroke();
      ctx.strokeStyle='#a060a0';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(250,147);ctx.lineTo(280,112);ctx.lineTo(310,147);ctx.stroke();
      ctx.beginPath();ctx.moveTo(370,147);ctx.lineTo(400,112);ctx.lineTo(430,147);ctx.stroke();
      ctx.strokeStyle='#c04060';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(280,112);ctx.lineTo(280,92);ctx.stroke();ctx.beginPath();ctx.moveTo(280,92);ctx.lineTo(300,100);ctx.lineTo(280,108);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(400,112);ctx.lineTo(400,92);ctx.stroke();ctx.beginPath();ctx.moveTo(400,92);ctx.lineTo(420,100);ctx.lineTo(400,108);ctx.closePath();ctx.stroke();
      ctx.strokeStyle='#6060a0';ctx.lineWidth=2;
      ctx.beginPath();ctx.rect(310,300,60,80);ctx.stroke();ctx.beginPath();ctx.moveTo(310,300);ctx.quadraticCurveTo(340,275,370,300);ctx.stroke();
      ctx.strokeStyle='#7090c0';ctx.lineWidth=1.5;
      for(var wri=0;wri<2;wri++)for(var wci=0;wci<3;wci++){var wx=238+wci*76,wy=210+wri*65;ctx.beginPath();ctx.rect(wx,wy,28,35);ctx.stroke();ctx.beginPath();ctx.moveTo(wx,wy);ctx.quadraticCurveTo(wx+14,wy-12,wx+28,wy);ctx.stroke();}
      ctx.strokeStyle='#8050a0';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.moveTo(330,380);ctx.lineTo(290,460);ctx.lineTo(370,460);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.ellipse(330,348,22,28,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(330,308,26,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#c0a020';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(308,292);ctx.lineTo(308,278);ctx.lineTo(318,288);ctx.lineTo(330,275);ctx.lineTo(342,288);ctx.lineTo(352,278);ctx.lineTo(352,292);ctx.closePath();ctx.stroke();
      ctx.strokeStyle='#8050a0';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(308,300);ctx.quadraticCurveTo(295,330,298,360);ctx.stroke();
      ctx.beginPath();ctx.moveTo(352,300);ctx.quadraticCurveTo(365,330,362,360);ctx.stroke();
      ctx.beginPath();ctx.arc(322,308,4,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(338,308,4,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(325,318);ctx.quadraticCurveTo(330,323,335,318);ctx.stroke();
      ctx.beginPath();ctx.moveTo(312,345);ctx.lineTo(288,368);ctx.stroke();ctx.beginPath();ctx.moveTo(348,345);ctx.lineTo(372,368);ctx.stroke();
      ctx.strokeStyle='#c0a020';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(372,368);ctx.lineTo(400,340);ctx.stroke();ctx.beginPath();ctx.arc(400,337,8,0,Math.PI*2);ctx.stroke();
      for(var sti=0;sti<5;sti++){var sta=sti*Math.PI*2/5,stl=12+sti*4;ctx.beginPath();ctx.moveTo(400,337);ctx.lineTo(400+stl*Math.cos(sta),337+stl*Math.sin(sta));ctx.stroke();}
    }},

    { name:'Razzo nello spazio', fn:function(ctx){
      ctx.fillStyle='#0a0820';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='white';
      var starField=[[45,30],[90,55],[140,20],[200,45],[260,15],[320,38],[380,22],[440,50],[500,18],[560,42],[620,28],[670,55],[30,90],[110,100],[190,80],[270,95],[350,75],[430,98],[510,82],[590,70],[660,88],[80,200],[160,185],[240,205],[330,192],[420,178],[500,200],[580,188],[670,195]];
      for(var si=0;si<starField.length;si++){ctx.beginPath();ctx.arc(starField[si][0],starField[si][1],1.5,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle='#8060c0';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(560,320,90,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#a080d0';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(560,320,130,30,0,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#7050b0';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.arc(540,300,18,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(590,340,12,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#c0c0a0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(120,380,42,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#a0a080';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.arc(108,368,10,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(132,390,7,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#808070';ctx.lineWidth=1.5;
      var asteroids=[[220,350,14],[250,380,10],[280,360,12],[650,150,16],[680,180,10]];
      for(var ai=0;ai<asteroids.length;ai++){ctx.beginPath();ctx.arc(asteroids[ai][0],asteroids[ai][1],asteroids[ai][2],0,Math.PI*2);ctx.stroke();}
      ctx.strokeStyle='#e0e0f0';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.moveTo(330,80);ctx.lineTo(300,240);ctx.lineTo(360,240);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(300,240);ctx.quadraticCurveTo(310,200,330,180);ctx.quadraticCurveTo(350,200,360,240);ctx.stroke();
      ctx.beginPath();ctx.arc(330,200,22,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(330,200,14,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(300,240);ctx.lineTo(268,285);ctx.lineTo(300,272);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(360,240);ctx.lineTo(392,285);ctx.lineTo(360,272);ctx.closePath();ctx.stroke();
      ctx.strokeStyle='#e08020';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(315,272);ctx.quadraticCurveTo(310,310,320,340);ctx.stroke();
      ctx.beginPath();ctx.moveTo(330,272);ctx.quadraticCurveTo(325,320,330,358);ctx.stroke();
      ctx.beginPath();ctx.moveTo(345,272);ctx.quadraticCurveTo(350,310,340,340);ctx.stroke();
      ctx.strokeStyle='#e0e0f0';ctx.lineWidth=2;
      ctx.beginPath();ctx.rect(306,230,14,14);ctx.stroke();ctx.beginPath();ctx.rect(340,230,14,14);ctx.stroke();
      ctx.beginPath();ctx.moveTo(303,220);ctx.lineTo(357,220);ctx.stroke();
      ctx.strokeStyle='#e0d080';ctx.lineWidth=2;ctx.beginPath();ctx.arc(80,150,12,0,Math.PI*2);ctx.stroke();
      for(var ci=1;ci<5;ci++){ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(80-14,150-ci*4);ctx.lineTo(80-14-ci*18,150-ci*2);ctx.stroke();}
      ctx.strokeStyle='#d0d0e0';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(490,200,22,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.rect(476,222,28,35);ctx.stroke();
      ctx.beginPath();ctx.arc(490,208,14,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(476,232);ctx.lineTo(458,245);ctx.stroke();ctx.beginPath();ctx.moveTo(504,232);ctx.lineTo(522,245);ctx.stroke();
      ctx.beginPath();ctx.moveTo(478,257);ctx.lineTo(470,280);ctx.stroke();ctx.beginPath();ctx.moveTo(502,257);ctx.lineTo(510,280);ctx.stroke();
    }},

    { name:'Civetta nel bosco notturno', fn:function(ctx){
      var nightG=ctx.createLinearGradient(0,0,0,H);nightG.addColorStop(0,'#0a1530');nightG.addColorStop(1,'#1a2848');ctx.fillStyle=nightG;ctx.fillRect(0,0,W,H);
      ctx.fillStyle='white';
      var nightStars=[[60,30],[120,18],[180,42],[250,25],[320,38],[390,20],[460,35],[530,15],[600,28],[660,45],[40,70],[150,80],[280,65],[410,78],[540,60],[660,75],[90,120],[210,108],[340,125],[470,112],[590,118]];
      for(var si=0;si<nightStars.length;si++){ctx.beginPath();ctx.arc(nightStars[si][0],nightStars[si][1],1.5,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle='#e8e0b0';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(580,75,48,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#d8d0a0';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.arc(568,62,15,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(592,88,10,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#0a2010';ctx.fillRect(0,380,W,H-380);
      ctx.strokeStyle='#1a3018';ctx.lineWidth=3;
      function tree(tx,ty,th,tw){
        ctx.beginPath();ctx.moveTo(tx,ty+th);ctx.lineTo(tx,ty);ctx.stroke();
        ctx.lineWidth=1.5;
        ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx-tw,ty+th*0.4);ctx.lineTo(tx+tw,ty+th*0.4);ctx.closePath();ctx.stroke();
        ctx.beginPath();ctx.moveTo(tx,ty+th*0.15);ctx.lineTo(tx-tw*0.8,ty+th*0.55);ctx.lineTo(tx+tw*0.8,ty+th*0.55);ctx.closePath();ctx.stroke();
        ctx.beginPath();ctx.moveTo(tx,ty+th*0.3);ctx.lineTo(tx-tw*0.6,ty+th*0.7);ctx.lineTo(tx+tw*0.6,ty+th*0.7);ctx.closePath();ctx.stroke();
        ctx.lineWidth=3;
      }
      tree(80,120,260,70);tree(160,150,240,60);tree(550,130,250,65);tree(620,110,270,72);tree(680,160,220,55);
      ctx.strokeStyle='#3d2010';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(150,300);ctx.lineTo(530,280);ctx.stroke();
      ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(180,300);ctx.lineTo(140,340);ctx.stroke();ctx.beginPath();ctx.moveTo(480,282);ctx.lineTo(510,320);ctx.stroke();
      ctx.strokeStyle='#1a4020';ctx.lineWidth=1.5;
      for(var li=0;li<8;li++){var lx=200+li*38,ly=272+Math.sin(li)*8;ctx.beginPath();ctx.ellipse(lx,ly,12,7,li*0.3,0,Math.PI*2);ctx.stroke();}
      ctx.strokeStyle='#7a6030';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.ellipse(340,320,45,60,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(340,255,42,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(318,217);ctx.lineTo(310,195);ctx.lineTo(325,212);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(362,217);ctx.lineTo(370,195);ctx.lineTo(355,212);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.arc(322,252,18,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(358,252,18,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(322,252,10,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(358,252,10,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(332,265);ctx.lineTo(340,275);ctx.lineTo(348,265);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(298,300);ctx.quadraticCurveTo(265,330,275,370);ctx.stroke();
      ctx.beginPath();ctx.moveTo(382,300);ctx.quadraticCurveTo(415,330,405,370);ctx.stroke();
      ctx.lineWidth=1.2;for(var pi=0;pi<5;pi++){ctx.beginPath();ctx.moveTo(310+pi*12,340);ctx.quadraticCurveTo(314+pi*12,358,312+pi*12,375);ctx.stroke();}
      ctx.strokeStyle='#8a7040';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(325,375);ctx.lineTo(315,395);ctx.stroke();ctx.beginPath();ctx.moveTo(315,395);ctx.lineTo(300,400);ctx.moveTo(315,395);ctx.lineTo(312,405);ctx.moveTo(315,395);ctx.lineTo(325,402);ctx.stroke();
      ctx.beginPath();ctx.moveTo(355,375);ctx.lineTo(365,395);ctx.stroke();ctx.beginPath();ctx.moveTo(365,395);ctx.lineTo(378,400);ctx.moveTo(365,395);ctx.lineTo(368,405);ctx.moveTo(365,395);ctx.lineTo(355,402);ctx.stroke();
      ctx.strokeStyle='#c0e040';ctx.lineWidth=1;
      var fireflies=[[120,250],[420,230],[200,350],[480,310],[600,260],[660,340]];
      for(var fli=0;fli<fireflies.length;fli++){ctx.beginPath();ctx.arc(fireflies[fli][0],fireflies[fli][1],3,0,Math.PI*2);ctx.stroke();}
      ctx.strokeStyle='#8a4030';ctx.lineWidth=1.5;
      function mushroom(mx,my){ctx.beginPath();ctx.rect(mx-4,my,8,15);ctx.stroke();ctx.beginPath();ctx.arc(mx,my,14,Math.PI,0);ctx.stroke();}
      mushroom(60,390);mushroom(95,395);mushroom(600,388);mushroom(640,393);
    }},

    { name:'Fata nel giardino magico', fn:function(ctx){
      var magicSky=ctx.createLinearGradient(0,0,0,H);magicSky.addColorStop(0,'#f0e8ff');magicSky.addColorStop(0.5,'#ffe8f8');magicSky.addColorStop(1,'#e8ffe8');ctx.fillStyle=magicSky;ctx.fillRect(0,0,W,H);
      ctx.strokeStyle='#f0d080';ctx.lineWidth=2;ctx.beginPath();ctx.arc(80,80,35,0,Math.PI*2);ctx.stroke();
      for(var ri=0;ri<12;ri++){var ra=ri*Math.PI/6;ctx.beginPath();ctx.moveTo(80+42*Math.cos(ra),80+42*Math.sin(ra));ctx.lineTo(80+55*Math.cos(ra),80+55*Math.sin(ra));ctx.stroke();}
      ctx.lineWidth=10;
      var rainbowCols=['#f08080','#f0c060','#f0f080','#80c880','#80b0f0','#c080f0'];
      for(var rci=0;rci<6;rci++){ctx.strokeStyle=rainbowCols[rci];ctx.beginPath();ctx.arc(680,380,200-rci*20,Math.PI*0.9,Math.PI*1.9,false);ctx.stroke();}
      ctx.lineWidth=2;ctx.fillStyle='#c0e898';ctx.fillRect(0,350,W,H-350);
      ctx.strokeStyle='#e060a0';ctx.lineWidth=2;
      function bigFlower(fx,fy,r,nr){for(var fp=0;fp<nr;fp++){var fa=fp*(Math.PI*2/nr);ctx.beginPath();ctx.ellipse(fx+r*1.5*Math.cos(fa),fy+r*1.5*Math.sin(fa),r,r*0.6,fa,0,Math.PI*2);ctx.stroke();}ctx.beginPath();ctx.arc(fx,fy,r,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#60a040';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(fx,fy+r*2.5);ctx.lineTo(fx,fy+r*5);ctx.stroke();ctx.beginPath();ctx.ellipse(fx-r*1.5,fy+r*3.5,r*1.2,r*0.6,0.5,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#e060a0';ctx.lineWidth=2;}
      bigFlower(80,330,22,6);bigFlower(600,320,20,8);bigFlower(160,360,18,5);bigFlower(530,355,16,6);
      ctx.strokeStyle='#c04040';ctx.lineWidth=2.5;ctx.beginPath();ctx.rect(330,390,20,55);ctx.stroke();ctx.beginPath();ctx.arc(340,388,50,Math.PI,0);ctx.stroke();
      ctx.strokeStyle='#c060c0';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.moveTo(295,400);ctx.lineTo(265,460);ctx.lineTo(325,460);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.ellipse(295,375,18,22,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(295,345,24,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(274,340);ctx.quadraticCurveTo(262,358,265,378);ctx.stroke();ctx.beginPath();ctx.moveTo(316,340);ctx.quadraticCurveTo(328,358,325,378);ctx.stroke();
      ctx.beginPath();ctx.arc(287,343,4,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(303,343,4,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(289,353);ctx.quadraticCurveTo(295,358,301,353);ctx.stroke();
      ctx.strokeStyle='#a0c0f0';ctx.lineWidth=2;
      ctx.beginPath();ctx.ellipse(262,368,38,55,0.4,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(328,368,38,55,-0.4,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#c060c0';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(278,378);ctx.lineTo(255,395);ctx.stroke();ctx.beginPath();ctx.moveTo(312,378);ctx.lineTo(338,390);ctx.stroke();
      ctx.strokeStyle='#e0c030';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(338,390);ctx.lineTo(368,365);ctx.stroke();ctx.beginPath();ctx.arc(368,362,10,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#f0d040';ctx.lineWidth=1.2;
      var sparkPos=[[380,348],[392,362],[375,372],[388,340],[400,355]];
      for(var spi=0;spi<sparkPos.length;spi++){var spx=sparkPos[spi][0],spy=sparkPos[spi][1];ctx.beginPath();ctx.arc(spx,spy,3,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(spx-6,spy);ctx.lineTo(spx+6,spy);ctx.moveTo(spx,spy-6);ctx.lineTo(spx,spy+6);ctx.stroke();}
    }},

    { name:'Drago e il suo tesoro', fn:function(ctx){
      ctx.fillStyle='#1a1208';ctx.fillRect(0,0,W,H);
      ctx.strokeStyle='#3a2818';ctx.lineWidth=3;ctx.fillStyle='#251808';
      ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,H);ctx.lineTo(180,H);ctx.lineTo(150,350);ctx.lineTo(80,280);ctx.lineTo(60,180);ctx.lineTo(100,100);ctx.lineTo(80,0);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(W,0);ctx.lineTo(W,H);ctx.lineTo(W-160,H);ctx.lineTo(W-130,350);ctx.lineTo(W-70,270);ctx.lineTo(W-50,170);ctx.lineTo(W-90,90);ctx.lineTo(W-70,0);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='#3a2818';ctx.lineWidth=2;
      var stalac=[[120,0,18,70],[200,0,12,50],[300,0,15,65],[420,0,10,45],[500,0,16,58],[580,0,11,48],[640,0,14,55]];
      for(var sti=0;sti<stalac.length;sti++){ctx.fillStyle='#2a1808';ctx.beginPath();ctx.moveTo(stalac[sti][0]-stalac[sti][1]/2,0);ctx.lineTo(stalac[sti][0],stalac[sti][3]);ctx.lineTo(stalac[sti][0]+stalac[sti][2]/2,0);ctx.closePath();ctx.fill();ctx.stroke();}
      ctx.strokeStyle='#c09020';ctx.lineWidth=2;
      ctx.beginPath();ctx.ellipse(340,420,110,35,0,0,Math.PI*2);ctx.stroke();
      for(var ci=0;ci<12;ci++){var ca=ci*Math.PI/6,cr=70+Math.sin(ci)*20;ctx.beginPath();ctx.ellipse(340+cr*Math.cos(ca)*0.8,415+cr*Math.sin(ca)*0.3,14,9,ca,0,Math.PI*2);ctx.stroke();}
      ctx.strokeStyle='#8B5010';ctx.lineWidth=2.5;ctx.beginPath();ctx.rect(260,375,80,45);ctx.stroke();ctx.beginPath();ctx.rect(258,370,84,12);ctx.stroke();
      ctx.strokeStyle='#c09020';ctx.lineWidth=2;ctx.beginPath();ctx.rect(292,380,16,20);ctx.stroke();ctx.beginPath();ctx.arc(300,376,6,Math.PI,0);ctx.stroke();ctx.beginPath();ctx.moveTo(258,376);ctx.lineTo(342,376);ctx.stroke();
      ctx.strokeStyle='#406020';ctx.lineWidth=3;
      ctx.beginPath();ctx.ellipse(340,290,120,65,0.1,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.ellipse(200,178,55,38,0.2,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(165,172);ctx.lineTo(135,180);ctx.lineTo(140,200);ctx.lineTo(168,195);ctx.closePath();ctx.stroke();
      ctx.lineWidth=1.5;for(var di=0;di<4;di++){ctx.beginPath();ctx.moveTo(138+di*9,180);ctx.lineTo(140+di*9,190);ctx.stroke();}
      ctx.beginPath();ctx.moveTo(185,145);ctx.lineTo(178,118);ctx.lineTo(195,140);ctx.stroke();ctx.beginPath();ctx.moveTo(215,142);ctx.lineTo(225,115);ctx.lineTo(222,140);ctx.stroke();
      ctx.beginPath();ctx.arc(195,172,10,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(195,172,5,0,Math.PI*2);ctx.stroke();
      ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(265,258);ctx.quadraticCurveTo(235,220,220,195);ctx.stroke();
      ctx.beginPath();ctx.moveTo(300,248);ctx.lineTo(240,170);ctx.lineTo(280,210);ctx.lineTo(260,148);ctx.lineTo(305,195);ctx.stroke();
      ctx.beginPath();ctx.moveTo(380,248);ctx.lineTo(450,170);ctx.lineTo(415,210);ctx.lineTo(440,148);ctx.lineTo(398,195);ctx.stroke();
      ctx.beginPath();ctx.moveTo(295,345);ctx.lineTo(270,390);ctx.stroke();ctx.beginPath();ctx.moveTo(270,390);ctx.lineTo(250,398);ctx.moveTo(270,390);ctx.lineTo(268,405);ctx.moveTo(270,390);ctx.lineTo(282,400);ctx.stroke();
      ctx.beginPath();ctx.moveTo(385,350);ctx.lineTo(410,390);ctx.stroke();ctx.beginPath();ctx.moveTo(410,390);ctx.lineTo(428,398);ctx.moveTo(410,390);ctx.lineTo(412,405);ctx.moveTo(410,390);ctx.lineTo(400,402);ctx.stroke();
      ctx.beginPath();ctx.moveTo(458,305);ctx.quadraticCurveTo(520,280,545,310);ctx.stroke();ctx.beginPath();ctx.moveTo(545,310);ctx.lineTo(562,298);ctx.lineTo(558,318);ctx.closePath();ctx.stroke();
      for(var sci=0;sci<6;sci++){ctx.beginPath();ctx.moveTo(285+sci*25,242-sci*3);ctx.lineTo(292+sci*25,225-sci*3);ctx.lineTo(299+sci*25,242-sci*3);ctx.stroke();}
      ctx.strokeStyle='#808070';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(138,192);ctx.quadraticCurveTo(130,180,135,165);ctx.stroke();ctx.beginPath();ctx.moveTo(145,190);ctx.quadraticCurveTo(140,175,148,160);ctx.stroke();
    }},

    { name:'Treno a vapore in campagna', fn:function(ctx){
      var trainSky=ctx.createLinearGradient(0,0,0,200);trainSky.addColorStop(0,'#d0e8f8');trainSky.addColorStop(1,'#f0f4f8');ctx.fillStyle=trainSky;ctx.fillRect(0,0,W,200);
      ctx.strokeStyle='#c0ccd8';ctx.lineWidth=2;
      function bigCloud(cx,cy,sz){ctx.beginPath();ctx.arc(cx,cy,sz,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(cx+sz*1.3,cy-sz*0.2,sz*0.9,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(cx+sz*2.5,cy,sz,0,Math.PI*2);ctx.stroke();}
      bigCloud(80,55,22);bigCloud(350,42,25);bigCloud(560,60,20);
      ctx.strokeStyle='#d0d0d0';ctx.lineWidth=2;for(var vi=0;vi<4;vi++){ctx.beginPath();ctx.arc(220+vi*18,160-vi*15,10+vi*4,0,Math.PI*2);ctx.stroke();}
      ctx.strokeStyle='#f0d860';ctx.lineWidth=2;ctx.beginPath();ctx.arc(620,55,32,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#b8d890';ctx.fillRect(0,200,W,H-200);
      ctx.strokeStyle='#a8c878';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(0,250);ctx.quadraticCurveTo(100,200,200,240);ctx.quadraticCurveTo(300,200,400,235);ctx.quadraticCurveTo(500,205,600,238);ctx.quadraticCurveTo(650,215,W,240);ctx.stroke();
      ctx.strokeStyle='#808878';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,340);ctx.lineTo(W,340);ctx.stroke();ctx.beginPath();ctx.moveTo(0,358);ctx.lineTo(W,358);ctx.stroke();
      ctx.lineWidth=2.5;for(var ti=0;ti<16;ti++){ctx.beginPath();ctx.moveTo(25+ti*44,335);ctx.lineTo(25+ti*44,363);ctx.stroke();}
      ctx.strokeStyle='#5d7030';ctx.lineWidth=3;
      function ctree(tx,ty,th){ctx.beginPath();ctx.moveTo(tx,ty+th);ctx.lineTo(tx,ty);ctx.stroke();ctx.strokeStyle='#5d7030';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(tx,ty-th*0.15,th*0.45,0,Math.PI*2);ctx.stroke();ctx.lineWidth=3;}
      ctree(50,220,100);ctree(90,230,85);ctree(600,215,95);ctree(640,225,80);ctree(680,218,90);
      ctx.strokeStyle='#304060';ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(200,342,30,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(200,342,18,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(270,342,30,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(270,342,18,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(150,350,20,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(150,350,12,0,Math.PI*2);ctx.stroke();
      ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(150,342);ctx.lineTo(270,342);ctx.stroke();ctx.lineWidth=3;
      ctx.beginPath();ctx.rect(130,270,200,72);ctx.stroke();ctx.beginPath();ctx.rect(290,255,80,87);ctx.stroke();ctx.beginPath();ctx.rect(295,242,70,18);ctx.stroke();
      ctx.beginPath();ctx.rect(175,245,30,28);ctx.stroke();ctx.beginPath();ctx.rect(168,240,44,10);ctx.stroke();
      ctx.beginPath();ctx.ellipse(205,306,70,28,0,0,Math.PI*2);ctx.stroke();
      ctx.lineWidth=2;ctx.beginPath();ctx.rect(300,265,28,25);ctx.stroke();ctx.beginPath();ctx.rect(336,265,28,25);ctx.stroke();
      ctx.lineWidth=2.5;
      ctx.beginPath();ctx.rect(380,280,140,82);ctx.stroke();ctx.beginPath();ctx.rect(385,288,58,40);ctx.stroke();ctx.beginPath();ctx.rect(451,288,58,40);ctx.stroke();
      ctx.beginPath();ctx.arc(405,358,20,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(405,358,12,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(495,358,20,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(495,358,12,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.rect(530,280,140,82);ctx.stroke();ctx.beginPath();ctx.rect(535,288,58,40);ctx.stroke();ctx.beginPath();ctx.rect(601,288,58,40);ctx.stroke();
      ctx.beginPath();ctx.arc(555,358,20,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(555,358,12,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(645,358,20,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(645,358,12,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#708070';ctx.lineWidth=1.5;ctx.beginPath();ctx.rect(620,270,30,130);ctx.stroke();ctx.beginPath();ctx.moveTo(615,272);ctx.lineTo(635,248);ctx.lineTo(655,272);ctx.stroke();
    }},

    { name:'Squalo negli abissi', fn:function(ctx){
      var deepG=ctx.createLinearGradient(0,0,0,H);deepG.addColorStop(0,'#b0d8f0');deepG.addColorStop(0.3,'#6090c0');deepG.addColorStop(1,'#102848');ctx.fillStyle=deepG;ctx.fillRect(0,0,W,H);
      ctx.strokeStyle='rgba(200,230,255,0.3)';ctx.lineWidth=1.2;
      var bubbles=[[80,100,8],[140,180,5],[200,80,10],[280,150,6],[400,120,9],[480,200,5],[550,90,7],[620,160,6],[680,110,8],[350,220,4]];
      for(var bi=0;bi<bubbles.length;bi++){ctx.beginPath();ctx.arc(bubbles[bi][0],bubbles[bi][1],bubbles[bi][2],0,Math.PI*2);ctx.stroke();}
      ctx.strokeStyle='#c06050';ctx.lineWidth=2;
      function coral(cx,cy,h,branches){ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,cy-h);ctx.stroke();for(var bri=0;bri<branches;bri++){var bh=h*(0.5-bri*0.08),bdir=bri%2===0?1:-1,by=cy-h*0.2-bri*(h*0.15);ctx.beginPath();ctx.moveTo(cx,by);ctx.lineTo(cx+bdir*bh*0.7,by-bh*0.5);ctx.stroke();ctx.beginPath();ctx.arc(cx+bdir*bh*0.7,by-bh*0.5,5,0,Math.PI*2);ctx.stroke();}}
      coral(60,H,120,4);coral(110,H,95,3);coral(580,H,110,4);coral(640,H,90,3);coral(680,H,130,5);
      ctx.strokeStyle='#308040';ctx.lineWidth=2.5;
      for(var ai=0;ai<6;ai++){var ax=140+ai*80;ctx.beginPath();ctx.moveTo(ax,H);ctx.quadraticCurveTo(ax-20,H-60,ax+10,H-120);ctx.quadraticCurveTo(ax-15,H-180,ax+5,H-240);ctx.stroke();}
      ctx.fillStyle='#c0a870';ctx.fillRect(0,H-40,W,40);
      ctx.strokeStyle='#6088a0';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(100,250);ctx.quadraticCurveTo(300,200,500,252);ctx.quadraticCurveTo(560,255,580,270);ctx.quadraticCurveTo(560,285,500,290);ctx.quadraticCurveTo(300,300,100,268);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(100,250);ctx.lineTo(55,260);ctx.lineTo(100,268);ctx.stroke();
      ctx.beginPath();ctx.moveTo(55,260);ctx.lineTo(28,248);ctx.lineTo(55,248);ctx.stroke();ctx.beginPath();ctx.moveTo(55,260);ctx.lineTo(28,272);ctx.lineTo(55,272);ctx.stroke();
      ctx.lineWidth=1.5;for(var di=0;di<6;di++){ctx.beginPath();ctx.moveTo(30+di*5,248);ctx.lineTo(32+di*5,256);ctx.stroke();}for(var di2=0;di2<6;di2++){ctx.beginPath();ctx.moveTo(30+di2*5,272);ctx.lineTo(32+di2*5,264);ctx.stroke();}
      ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(280,210);ctx.lineTo(310,168);ctx.lineTo(350,208);ctx.stroke();
      ctx.beginPath();ctx.moveTo(580,260);ctx.lineTo(620,230);ctx.lineTo(615,262);ctx.stroke();ctx.beginPath();ctx.moveTo(580,268);ctx.lineTo(620,295);ctx.lineTo(615,268);ctx.stroke();
      ctx.beginPath();ctx.moveTo(200,268);ctx.lineTo(190,310);ctx.lineTo(240,278);ctx.stroke();ctx.beginPath();ctx.moveTo(200,255);ctx.lineTo(185,218);ctx.lineTo(238,245);ctx.stroke();
      ctx.beginPath();ctx.arc(80,255,9,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(80,255,4,0,Math.PI*2);ctx.stroke();
      ctx.lineWidth=1.5;for(var gi=0;gi<4;gi++){ctx.beginPath();ctx.moveTo(130+gi*15,245);ctx.quadraticCurveTo(125+gi*15,260,130+gi*15,275);ctx.stroke();}
      ctx.strokeStyle='#90b8d0';ctx.lineWidth=1.5;
      var fishPos=[[120,180],[200,160],[400,180],[150,320],[350,330],[500,180]];
      for(var fi=0;fi<fishPos.length;fi++){var fx=fishPos[fi][0],fy=fishPos[fi][1];ctx.beginPath();ctx.ellipse(fx,fy,14,7,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(fx+14,fy-4);ctx.lineTo(fx+22,fy-8);ctx.lineTo(fx+22,fy+8);ctx.lineTo(fx+14,fy+4);ctx.closePath();ctx.stroke();}
      ctx.strokeStyle='#b06080';ctx.lineWidth=2;ctx.beginPath();ctx.arc(630,380,25,Math.PI,0);ctx.stroke();
      for(var tti=0;tti<8;tti++){ctx.strokeStyle='#b06080';ctx.lineWidth=1.5;var tx=615+tti*4;ctx.beginPath();ctx.moveTo(tx,380);ctx.quadraticCurveTo(tx-5,400,tx,420);ctx.stroke();}
      ctx.beginPath();ctx.arc(618,372,5,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(632,370,5,0,Math.PI*2);ctx.stroke();
    }},

    { name:'Astronauta su pianeta alieno', fn:function(ctx){
      var alienSky=ctx.createLinearGradient(0,0,0,H);alienSky.addColorStop(0,'#180830');alienSky.addColorStop(0.5,'#301060');alienSky.addColorStop(1,'#180830');ctx.fillStyle=alienSky;ctx.fillRect(0,0,W,H);
      ctx.fillStyle='white';
      var dStars=[[50,30],[100,18],[160,40],[230,22],[300,35],[380,18],[450,30],[520,15],[590,28],[650,38],[680,20],[40,70],[130,80],[240,65],[360,75],[470,60],[580,72],[660,58]];
      for(var si=0;si<dStars.length;si++){ctx.beginPath();ctx.arc(dStars[si][0],dStars[si][1],2,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle='#e08040';ctx.lineWidth=2;ctx.beginPath();ctx.arc(580,80,42,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#c06030';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(568,68,12,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(592,92,8,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#302818';ctx.fillRect(0,360,W,H-360);
      ctx.strokeStyle='#605040';ctx.lineWidth=2;
      function alienRock(rx,ry,rw,rh){ctx.beginPath();ctx.ellipse(rx,ry,rw,rh,0,0,Math.PI*2);ctx.stroke();}
      alienRock(80,375,50,28);alienRock(580,368,60,32);alienRock(640,380,40,22);
      ctx.strokeStyle='#8060c0';ctx.lineWidth=2;
      function crystal(cx,cy,ch){ctx.beginPath();ctx.moveTo(cx-8,cy);ctx.lineTo(cx,cy-ch);ctx.lineTo(cx+8,cy);ctx.lineTo(cx+5,cy+12);ctx.lineTo(cx-5,cy+12);ctx.closePath();ctx.stroke();}
      crystal(180,360,60);crystal(200,360,45);crystal(450,358,55);crystal(470,362,40);crystal(500,356,65);
      ctx.strokeStyle='#608040';ctx.lineWidth=2;
      function alienPlant(px,py){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,py-80);ctx.stroke();ctx.beginPath();ctx.arc(px,py-85,18,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(px,py-85,8,0,Math.PI*2);ctx.stroke();for(var tni=0;tni<5;tni++){var tna=tni*(Math.PI*2/5);ctx.beginPath();ctx.moveTo(px+8*Math.cos(tna),py-85+8*Math.sin(tna));ctx.lineTo(px+24*Math.cos(tna),py-85+24*Math.sin(tna));ctx.stroke();}}
      alienPlant(120,430);alienPlant(560,420);alienPlant(670,440);
      ctx.strokeStyle='#d0d8e8';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.rect(300,378,22,65);ctx.stroke();ctx.beginPath();ctx.rect(338,378,22,65);ctx.stroke();
      ctx.beginPath();ctx.rect(295,438,32,18);ctx.stroke();ctx.beginPath();ctx.rect(333,438,32,18);ctx.stroke();
      ctx.beginPath();ctx.rect(288,295,84,90);ctx.stroke();
      ctx.lineWidth=1.5;ctx.beginPath();ctx.rect(298,310,25,20);ctx.stroke();ctx.beginPath();ctx.rect(337,310,25,20);ctx.stroke();ctx.beginPath();ctx.arc(330,348,8,0,Math.PI*2);ctx.stroke();
      ctx.lineWidth=2.5;ctx.beginPath();ctx.rect(272,300,18,70);ctx.stroke();
      ctx.beginPath();ctx.rect(265,300,28,18);ctx.stroke();ctx.beginPath();ctx.rect(367,300,28,18);ctx.stroke();
      ctx.beginPath();ctx.ellipse(272,318,12,10,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(388,318,12,10,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.rect(318,278,24,18);ctx.stroke();
      ctx.beginPath();ctx.arc(330,258,45,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(330,258,32,0,Math.PI*2);ctx.stroke();
      ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(318,248,10,Math.PI*1.2,Math.PI*1.8);ctx.stroke();
      ctx.beginPath();ctx.arc(330,258,18,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(322,254,5,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(336,254,5,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(324,264);ctx.quadraticCurveTo(330,269,336,264);ctx.stroke();
    }}
  ];

  var subjIdx = Math.floor(rng() * subjects.length);
  var subj = subjects[subjIdx];
  var cvs = document.createElement('canvas');
  cvs.width = W; cvs.height = H;
  var ctx = cvs.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  subj.fn(ctx);

  var card = makeCard('Colora liberamente \u2014 ' + subj.name, 'Usa matite o pennarelli e colora come preferisci!', name);
  card.appendChild(cvs);
  addGuideBtn(card, 'color');
  area.appendChild(card);
}
