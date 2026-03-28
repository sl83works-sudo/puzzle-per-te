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
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active');
  }
  btn.classList.add('active');
}

function generate() {
  var area = document.getElementById('puzzleArea');
  var diff = document.getElementById('difficulty').value;
  var nameVal = document.getElementById('nameInput').value.trim();
  var name = nameVal || 'Tesoro';
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
  card.innerHTML =
    '<div class="puzzle-title">' + title + '</div>' +
    '<div class="puzzle-subtitle">' + subtitle + '</div>' +
    '<span class="message-badge">Un pensiero per ' + name + ' con tutto il mio amore!</span>';
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
    var dirs = [N, S, E, W];
    dirs.sort(function() { return rng() - 0.5; });
    for (var i = 0; i < dirs.length; i++) {
      var d = dirs[i];
      var nx = x + dx[d], ny = y + dy[d];
      if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[ny][nx]) {
        grid[y][x]   &= ~d;
        grid[ny][nx] &= ~opp[d];
        carve(nx, ny);
      }
    }
  }
  carve(0, 0);

  var pad = 10;
  var cvs = document.createElement('canvas');
  cvs.width  = w * cellSize + pad * 2;
  cvs.height = h * cellSize + pad * 2;
  var ctx = cvs.getContext('2d');
  ctx.fillStyle = '#fafaf7';
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  ctx.strokeStyle = '#2d2416';
  ctx.lineWidth = 2;
  ctx.lineCap = 'square';

  var x, y, px, py;
  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      px = x * cellSize + pad;
      py = y * cellSize + pad;
      if (grid[y][x] & N) { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + cellSize, py); ctx.stroke(); }
      if (grid[y][x] & W) { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + cellSize); ctx.stroke(); }
      if (x === w - 1)    { ctx.beginPath(); ctx.moveTo(px + cellSize, py); ctx.lineTo(px + cellSize, py + cellSize); ctx.stroke(); }
      if (y === h - 1)    { ctx.beginPath(); ctx.moveTo(px, py + cellSize); ctx.lineTo(px + cellSize, py + cellSize); ctx.stroke(); }
    }
  }
  ctx.clearRect(pad, pad, 2, cellSize);
  ctx.clearRect(pad + (w-1)*cellSize, pad + (h-1)*cellSize, 2, cellSize + 2);
  ctx.fillStyle = '#4caf7d'; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('GO', pad + 2, pad + cellSize - 4);
  ctx.fillStyle = '#e04f4f';
  ctx.fillText('FIN', pad + (w-1)*cellSize, pad + (h-1)*cellSize + cellSize - 3);

  var card = makeCard('Labirinto', 'Trova la via d\'uscita! (GO = inizio, FIN = fine)', name);
  card.appendChild(cvs);
  area.appendChild(card);
}

/* ==================== CERCA PAROLE ==================== */
function generateWordSearch(area, diff, name) {
  var wordLists = {
    easy:   ['CANE','GATTO','SOLE','LUNA','MARE','FIORE','RANA','PANE'],
    medium: ['FARFALLA','ARCOBALENO','CONIGLIO','CASTELLO','GIRAFFA','ELEFANTE','TARTARUGA'],
    hard:   ['DINOSAURO','ASTRONAUTA','DRAGO','SERPENTE','COCCODRILLO','PAPPAGALLO','LEONESSA']
  };
  var allWords = wordLists[diff].slice().sort(function() { return rng() - 0.5; }).slice(0, 6);
  var gridSize = diff === 'easy' ? 10 : diff === 'medium' ? 13 : 16;
  var LETTERS  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  var grid = [], r, c;
  for (r = 0; r < gridSize; r++) {
    grid.push([]);
    for (c = 0; c < gridSize; c++) grid[r].push('');
  }
  var placed = [];

  function placeWord(word) {
    var dirs = [{dx:1,dy:0},{dx:0,dy:1},{dx:1,dy:1},{dx:-1,dy:1}];
    var dir = dirs[Math.floor(rng() * dirs.length)];
    for (var attempt = 0; attempt < 200; attempt++) {
      var sx = Math.floor(rng() * gridSize);
      var sy = Math.floor(rng() * gridSize);
      var ok = true, cells = [], i, nx, ny;
      for (i = 0; i < word.length; i++) {
        nx = sx + dir.dx * i; ny = sy + dir.dy * i;
        if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) { ok = false; break; }
        if (grid[ny][nx] !== '' && grid[ny][nx] !== word[i])       { ok = false; break; }
        cells.push({x: nx, y: ny});
      }
      if (ok) {
        for (var j = 0; j < cells.length; j++) grid[cells[j].y][cells[j].x] = word[j];
        placed.push({word: word, cells: cells});
        return;
      }
    }
  }

  var wi;
  for (wi = 0; wi < allWords.length; wi++) placeWord(allWords[wi]);
  for (r = 0; r < gridSize; r++)
    for (c = 0; c < gridSize; c++)
      if (grid[r][c] === '') grid[r][c] = LETTERS[Math.floor(rng() * 26)];

  var highlightSet = {};
  var pi, ci;
  for (pi = 0; pi < placed.length; pi++)
    for (ci = 0; ci < placed[pi].cells.length; ci++)
      highlightSet[placed[pi].cells[ci].x + ',' + placed[pi].cells[ci].y] = true;

  var container = document.createElement('div');
  container.className = 'word-grid';
  var gy, gx, row, cell;
  for (gy = 0; gy < gridSize; gy++) {
    row = document.createElement('div');
    row.className = 'word-grid-row';
    for (gx = 0; gx < gridSize; gx++) {
      cell = document.createElement('div');
      cell.className = 'word-cell' + (highlightSet[gx + ',' + gy] ? ' highlight' : '');
      cell.textContent = grid[gy][gx];
      row.appendChild(cell);
    }
    container.appendChild(row);
  }

  var wordListDiv = document.createElement('div');
  wordListDiv.className = 'wordlist';
  for (wi = 0; wi < allWords.length; wi++) {
    var chip = document.createElement('span');
    chip.className = 'word-chip';
    chip.textContent = allWords[wi];
    wordListDiv.appendChild(chip);
  }

  var card = makeCard('Cerca le parole', 'Trova tutte le parole nascoste nella griglia!', name);
  card.appendChild(container);
  card.appendChild(wordListDiv);
  area.appendChild(card);
}

/* ==================== TROVA LE DIFFERENZE ==================== */
function generateDifferences(area, diff, name) {
  var numDiff = diff === 'easy' ? 3 : diff === 'medium' ? 5 : 7;
  var W = 240, H = 180;

  function drawScene(ctx, appliedMap) {
    ctx.fillStyle = '#e8f4ff'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#87ceeb'; ctx.fillRect(0, 0, W, 90);
    ctx.fillStyle = '#7ec850'; ctx.fillRect(0, 120, W, 60);
    ctx.fillStyle = appliedMap[0] ? '#e04f4f' : '#f5c842';
    ctx.beginPath(); ctx.arc(200, 30, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = appliedMap[1] ? '#e8b4b8' : '#f5e6d0'; ctx.fillRect(60, 80, 80, 60);
    ctx.fillStyle = appliedMap[2] ? '#4a90d9' : '#c0392b';
    ctx.beginPath(); ctx.moveTo(55,80); ctx.lineTo(100,45); ctx.lineTo(145,80); ctx.closePath(); ctx.fill();
    ctx.fillStyle = appliedMap[3] ? '#7c5cbf' : '#8B4513'; ctx.fillRect(88, 110, 24, 30);
    ctx.fillStyle = appliedMap[4] ? '#f5c842' : '#87ceeb'; ctx.fillRect(115, 90, 20, 18);
    ctx.strokeStyle = '#aaa'; ctx.lineWidth = 1; ctx.strokeRect(115, 90, 20, 18);
    ctx.fillStyle = '#795548'; ctx.fillRect(appliedMap[5] ? 178 : 180, 110, 10, 30);
    ctx.fillStyle = appliedMap[6] ? '#e04f4f' : '#4caf7d';
    ctx.beginPath(); ctx.arc(appliedMap[5] ? 183 : 185, 100, 20, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white';
    var cx = appliedMap[7] ? 30 : 50;
    ctx.beginPath(); ctx.arc(cx, 40, 15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+15, 35, 18, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+30, 40, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = appliedMap[8] ? '#e04f4f' : '#795548';
    ctx.fillRect(120, 50, 12, appliedMap[8] ? 40 : 28);
    ctx.fillStyle = appliedMap[9] ? '#c0392b' : '#d4b483'; ctx.fillRect(95, 140, 20, 40);
  }

  var allIdxs = [0,1,2,3,4,5,6,7,8,9];
  allIdxs.sort(function() { return rng() - 0.5; });
  var chosen = allIdxs.slice(0, numDiff);
  var chosenMap = {};
  for (var ci = 0; ci < chosen.length; ci++) chosenMap[chosen[ci]] = true;

  var wrap = document.createElement('div');
  wrap.className = 'diff-row';
  var labels = ['Immagine A', 'Immagine B'];
  for (var idx = 0; idx < 2; idx++) {
    var div = document.createElement('div');
    div.className = 'diff-canvas-wrap';
    var cvs = document.createElement('canvas');
    cvs.width = W; cvs.height = H;
    drawScene(cvs.getContext('2d'), idx === 1 ? chosenMap : {});
    var p = document.createElement('p'); p.textContent = labels[idx];
    div.appendChild(cvs); div.appendChild(p);
    wrap.appendChild(div);
  }

  var card = makeCard('Trova le differenze', 'Ci sono ' + numDiff + ' differenze tra le due immagini. Riesci a trovarle tutte?', name);
  card.appendChild(wrap);
  area.appendChild(card);
}

/* ==================== SUDOKU ==================== */
function generateSudoku(area, diff, name) {
  var base = [
    [5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]
  ];

  var i, box, r1, r2, c1, c2, r, tmp;
  for (i = 0; i < 10; i++) {
    box = Math.floor(rng() * 3) * 3;
    r1 = box + Math.floor(rng() * 3); r2 = box + Math.floor(rng() * 3);
    tmp = base[r1]; base[r1] = base[r2]; base[r2] = tmp;
  }
  for (i = 0; i < 10; i++) {
    box = Math.floor(rng() * 3) * 3;
    c1 = box + Math.floor(rng() * 3); c2 = box + Math.floor(rng() * 3);
    for (r = 0; r < 9; r++) { tmp = base[r][c1]; base[r][c1] = base[r][c2]; base[r][c2] = tmp; }
  }

  var remove = diff === 'easy' ? 30 : diff === 'medium' ? 40 : 50;
  var puzzle = [], pr, pc;
  for (r = 0; r < 9; r++) puzzle.push(base[r].slice());
  var removed = 0;
  while (removed < remove) {
    pr = Math.floor(rng() * 9); pc = Math.floor(rng() * 9);
    if (puzzle[pr][pc] !== 0) { puzzle[pr][pc] = 0; removed++; }
  }

  var container = document.createElement('div');
  container.className = 'sudoku-grid';
  var c, cell;
  for (r = 0; r < 9; r++) {
    for (c = 0; c < 9; c++) {
      cell = document.createElement('div');
      cell.className = 'sudoku-cell' + (puzzle[r][c] !== 0 ? ' given' : '');
      if ((c+1) % 3 === 0 && c < 8) cell.classList.add('box-right');
      if ((r+1) % 3 === 0 && r < 8) cell.classList.add('box-bottom');
      if (puzzle[r][c] !== 0) cell.textContent = puzzle[r][c];
      container.appendChild(cell);
    }
  }

  var card = makeCard('Sudoku', 'Riempi la griglia: ogni numero da 1 a 9 deve comparire una sola volta in ogni riga, colonna e quadrato 3x3.', name);
  card.appendChild(container);
  area.appendChild(card);
}

/* ==================== UNISCI I PUNTI ==================== */
function generateConnect(area, diff, name) {
  var W = 480, H = 320;

  function starPoints() {
    var pts = [], i, rad, angle;
    for (i = 0; i < 10; i++) {
      rad = i % 2 === 0 ? 120 : 55;
      angle = i * Math.PI / 5 - Math.PI / 2;
      pts.push({x: Math.round(W/2 + rad * Math.cos(angle)), y: Math.round(H/2 + rad * Math.sin(angle))});
    }
    return pts;
  }

  function heartPoints() {
    var pts = [], i, t, sinT, n = 20;
    for (i = 0; i < n; i++) {
      t = (i / n) * Math.PI * 2;
      sinT = Math.sin(t);
      pts.push({
        x: Math.round(W/2 + 90 * (16 * sinT * sinT * sinT) / 16),
        y: Math.round(H/2 - 80 * (13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t)) / 13)
      });
    }
    return pts;
  }

  function rocketPoints() {
    return [
      {x:240,y:40},{x:280,y:100},{x:270,y:100},{x:270,y:180},
      {x:300,y:180},{x:300,y:220},{x:270,y:220},{x:270,y:260},
      {x:240,y:300},{x:210,y:260},{x:210,y:220},{x:180,y:220},
      {x:180,y:180},{x:210,y:180},{x:210,y:100},{x:200,y:100}
    ];
  }

  var shapeFns = [starPoints, heartPoints, rocketPoints];
  var pts = shapeFns[Math.floor(rng() * shapeFns.length)]();

  var cvs = document.createElement('canvas');
  cvs.width = W; cvs.height = H;
  var ctx = cvs.getContext('2d');
  ctx.fillStyle = '#fafaf7'; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(180,160,120,0.12)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  var pi;
  for (pi = 0; pi < pts.length; pi++) {
    if (pi === 0) ctx.moveTo(pts[pi].x, pts[pi].y);
    else          ctx.lineTo(pts[pi].x, pts[pi].y);
  }
  ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);

  for (pi = 0; pi < pts.length; pi++) {
    ctx.fillStyle = '#4a90d9';
    ctx.beginPath(); ctx.arc(pts[pi].x, pts[pi].y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2d2416';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(pi + 1, pts[pi].x + 7, pts[pi].y - 4);
  }

  var card = makeCard('Unisci i punti', "Collega i numeri in ordine e scopri l'immagine nascosta!", name);
  card.appendChild(cvs);
  area.appendChild(card);
}
