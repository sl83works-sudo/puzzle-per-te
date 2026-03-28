*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --c-bg: #fffdf7;
  --c-card: #ffffff;
  --c-border: #e8e0d0;
  --c-text: #2d2416;
  --c-muted: #8a7a60;
  --c-yellow: #f5c842;
  --c-orange: #f47c2f;
  --c-green: #4caf7d;
  --c-blue: #4a90d9;
  --c-pink: #e05f8e;
  --c-purple: #7c5cbf;
  --c-red: #e04f4f;
  --c-shadow: rgba(0,0,0,0.08);
}

body {
  font-family: 'Nunito', sans-serif;
  background: var(--c-bg);
  color: var(--c-text);
  min-height: 100vh;
}

/* ---- HEADER ---- */
.header {
  background: linear-gradient(135deg, #fff9e6 0%, #ffefd4 50%, #fff0f6 100%);
  border-bottom: 2px solid var(--c-border);
  padding: 1.5rem 2rem 1rem;
  text-align: center;
}
.header h1 {
  font-family: 'Fredoka One', cursive;
  font-size: 2.2rem;
  color: var(--c-orange);
  letter-spacing: 1px;
}
.header p { font-size: 0.95rem; color: var(--c-muted); margin-top: 0.3rem; }
.stars { font-size: 1.1rem; margin-bottom: 0.3rem; letter-spacing: 4px; }

/* ---- CONTROLS ---- */
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid var(--c-border);
  align-items: center;
  justify-content: center;
}

.btn {
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  padding: 0.5rem 1.1rem;
  border-radius: 50px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s;
}
.btn:active { transform: scale(0.96); }

.btn-type { background: white; border-color: var(--c-border); color: var(--c-muted); }
.btn-type:hover { border-color: var(--c-orange); color: var(--c-orange); }
.btn-type.active { background: var(--c-orange); border-color: var(--c-orange); color: white; }

.btn-gen {
  background: var(--c-green); color: white; border-color: var(--c-green);
  font-size: 0.95rem; padding: 0.55rem 1.4rem;
  box-shadow: 0 3px 0 #3a9068;
}
.btn-gen:hover { background: #43a070; }
.btn-gen:active { box-shadow: none; transform: translateY(2px) scale(0.98); }

.btn-print {
  background: var(--c-blue); color: white; border-color: var(--c-blue);
  box-shadow: 0 3px 0 #3578c0;
}
.btn-print:hover { background: #3d7ec8; }
.btn-print:active { box-shadow: none; transform: translateY(2px); }

.diff-label { font-size: 0.82rem; font-weight: 700; color: var(--c-muted); }

select {
  font-family: 'Nunito', sans-serif; font-weight: 600; font-size: 0.85rem;
  padding: 0.45rem 0.8rem; border-radius: 50px;
  border: 2px solid var(--c-border); background: white; color: var(--c-text); cursor: pointer;
}

input[type=text] {
  font-family: 'Nunito', sans-serif; font-weight: 600; font-size: 0.85rem;
  padding: 0.45rem 0.9rem; border-radius: 50px;
  border: 2px solid var(--c-border); color: var(--c-text); background: white; width: 170px;
}
input[type=text]:focus { outline: none; border-color: var(--c-pink); }

/* ---- PUZZLE AREA ---- */
.puzzle-area {
  padding: 1.5rem;
  display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
  min-height: 400px;
}

.puzzle-card {
  background: white; border-radius: 16px;
  border: 2px solid var(--c-border);
  box-shadow: 0 4px 20px var(--c-shadow);
  padding: 1.5rem; width: 100%; max-width: 600px;
}

.puzzle-title {
  font-family: 'Fredoka One', cursive; font-size: 1.3rem;
  color: var(--c-purple); margin-bottom: 0.4rem;
}
.puzzle-subtitle { font-size: 0.82rem; color: var(--c-muted); margin-bottom: 1rem; }

.message-badge {
  display: block;
  background: linear-gradient(135deg, #fff0f6, #fff5e0);
  border: 2px dashed var(--c-pink); border-radius: 12px;
  padding: 0.7rem 1.1rem; font-size: 0.85rem;
  color: var(--c-pink); font-weight: 700; text-align: center; margin-top: 0.75rem;
}

canvas { display: block; border-radius: 8px; border: 1.5px solid var(--c-border); }

/* ---- EMPTY STATE ---- */
.empty-state { text-align: center; padding: 3rem 1rem; color: var(--c-muted); }
.empty-state .emoji { font-size: 3rem; margin-bottom: 0.8rem; }
.empty-state p { font-size: 1rem; font-weight: 600; }
.empty-state small { font-size: 0.83rem; }

/* ---- WORD SEARCH ---- */
.word-grid { display: grid; gap: 2px; line-height: 1; }
.word-grid-row { display: flex; gap: 2px; }
.word-cell {
  width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
  border: 1px solid #e8e0d0; border-radius: 4px; background: #fafafa;
  font-size: 0.8rem; font-weight: 700; color: var(--c-text); text-transform: uppercase;
}
.word-cell.highlight { background: #fff0c0; border-color: var(--c-yellow); color: #8a6000; }
.wordlist { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem; }
.word-chip {
  background: #f0f8ff; border: 1.5px solid #c0dcf4; border-radius: 50px;
  padding: 3px 10px; font-size: 0.78rem; font-weight: 700;
  color: var(--c-blue); text-transform: uppercase; letter-spacing: 0.5px;
}

/* ---- DIFFERENCES ---- */
.diff-row { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
.diff-canvas-wrap { text-align: center; }
.diff-canvas-wrap p { font-size: 0.75rem; color: var(--c-muted); margin-top: 0.3rem; font-weight: 600; }

/* ---- SUDOKU ---- */
.sudoku-grid {
  display: inline-grid; grid-template-columns: repeat(9, 34px);
  gap: 1px; background: var(--c-text);
  border: 2px solid var(--c-text); border-radius: 6px; overflow: hidden;
}
.sudoku-cell {
  width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
  font-family: 'Fredoka One', cursive; font-size: 1rem;
  background: white; color: var(--c-text);
}
.sudoku-cell.given { color: var(--c-purple); }
.sudoku-cell.box-right { border-right: 2px solid var(--c-text); }
.sudoku-cell.box-bottom { border-bottom: 2px solid var(--c-text); }

/* ---- PRINT ---- */
@media print {
  .controls, .header { display: none !important; }
  .puzzle-card { box-shadow: none; border: 1.5px solid #ccc; page-break-after: always; }
  body { background: white; }
}
