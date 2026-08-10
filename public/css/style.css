/* =========================================================
   Tokens
========================================================= */
:root{
  --paper: #FBF3EC;
  --paper-2: #F4E8DE;
  --rose: #E7BFC2;
  --rose-deep: #C6858C;
  --sage: #8A9A7E;
  --sage-deep: #6F8064;
  --gold: #C9A15C;
  --ink: #3A2E2A;
  --ink-soft: #6B5C55;

  --display: 'Cormorant Garamond', serif;
  --body: 'Lora', serif;
  --ui: 'Nunito Sans', sans-serif;

  --radius: 18px;
  --shadow: 0 10px 30px rgba(58, 46, 42, 0.12);
}

@media (prefers-reduced-motion: reduce){
  *{ animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}

*{ box-sizing: border-box; }

html, body{
  margin: 0;
  padding: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--body);
  min-height: 100%;
}

button{ font-family: inherit; cursor: pointer; }
:focus-visible{ outline: 3px solid var(--gold); outline-offset: 3px; }

.eyebrow{
  font-family: var(--ui);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--rose-deep);
  margin: 0 0 0.6rem;
}
.eyebrow.center{ text-align: center; }

/* =========================================================
   Gate / Invitation
========================================================= */
#gate{
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 15%, rgba(231,191,194,0.55), transparent 55%),
    radial-gradient(circle at 85% 85%, rgba(138,154,126,0.25), transparent 50%),
    var(--paper);
}

.gate-bg .corner{
  position: absolute;
  width: 140px;
  height: 140px;
  fill: none;
  stroke: var(--sage);
  stroke-width: 1.5;
  opacity: 0.55;
}
.corner-tl{ top: 24px; left: 24px; }
.corner-br{ bottom: 24px; right: 24px; }

.gate-card{
  position: relative;
  z-index: 2;
  background: #fff;
  border: 1px solid rgba(58,46,42,0.08);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  max-width: 520px;
  width: 100%;
  padding: 3rem 2.5rem 2.5rem;
  text-align: center;
}

.headline{
  font-family: var(--display);
  font-weight: 600;
  font-size: clamp(2.2rem, 6vw, 3rem);
  line-height: 1.1;
  margin: 0 0 1.1rem;
  color: var(--ink);
}
.headline span{
  color: var(--rose-deep);
  font-style: italic;
}

.gate-copy{
  font-size: 1.02rem;
  color: var(--ink-soft);
  line-height: 1.65;
  margin: 0 0 1.4rem;
}

.gate-question{
  font-family: var(--display);
  font-style: italic;
  font-size: 1.3rem;
  color: var(--ink);
  margin: 0 0 1.8rem;
}

.gate-actions{
  position: relative;
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  min-height: 56px;
}

.btn{
  font-family: var(--ui);
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  border-radius: 999px;
  padding: 0.85rem 2.1rem;
  border: 2px solid transparent;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.btn-yes{
  background: var(--rose-deep);
  color: #fff;
  box-shadow: 0 8px 18px rgba(198,133,140,0.35);
}
.btn-yes:hover{ transform: translateY(-2px); box-shadow: 0 12px 22px rgba(198,133,140,0.45); }

.btn-no{
  background: transparent;
  color: var(--ink-soft);
  border-color: rgba(58,46,42,0.18);
  will-change: left, top;
}

.btn-no.dodging{
  position: fixed;
  transition: left 0.22s cubic-bezier(.2,.9,.3,1.3), top 0.22s cubic-bezier(.2,.9,.3,1.3);
  z-index: 50;
}

.gate-hint{
  font-family: var(--ui);
  font-size: 0.78rem;
  color: var(--ink-soft);
  opacity: 0.75;
  min-height: 1.2em;
  margin: 0.9rem 0 0;
}

/* =========================================================
   Inside site
========================================================= */
#site{
  max-width: 760px;
  margin: 0 auto;
  padding: 4.5rem 1.5rem 5rem;
}

.site-header{ text-align: center; margin-bottom: 3rem; }
.site-header h2{
  font-family: var(--display);
  font-weight: 600;
  font-size: clamp(1.9rem, 4.5vw, 2.5rem);
  margin: 0 0 0.6rem;
}
.site-intro{ color: var(--ink-soft); font-size: 1rem; max-width: 46ch; margin: 0 auto; }

/* Letter / envelope */
.letter-section{
  display: flex;
  justify-content: center;
  margin-bottom: 4.5rem;
}

.envelope{
  position: relative;
  width: min(360px, 80vw);
  aspect-ratio: 3 / 2;
  background: linear-gradient(180deg, var(--paper-2), var(--paper));
  border: 1px solid rgba(58,46,42,0.12);
  border-radius: 10px;
  box-shadow: var(--shadow);
  padding: 0;
  overflow: visible;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.envelope:hover{ transform: translateY(-4px); box-shadow: 0 16px 34px rgba(58,46,42,0.16); }

.envelope-back{
  position: absolute;
  inset: 0;
  border-radius: 10px;
}

.envelope-flap{
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 60%;
  background: var(--rose);
  clip-path: polygon(0 0, 100% 0, 50% 68%);
  border-radius: 10px 10px 0 0;
  opacity: 0.9;
}

.envelope-seal{
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #d9a15f, var(--gold));
  color: #fff;
  font-family: var(--display);
  font-style: italic;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 14px rgba(201,161,92,0.45);
}

.envelope-label{
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: var(--ui);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

/* Game */
.game-section{ text-align: center; }
.game-title{
  font-family: var(--display);
  font-weight: 600;
  font-size: 1.7rem;
  margin: 0 0 0.3rem;
}
.game-sub{ color: var(--ink-soft); font-size: 0.9rem; margin: 0 0 1.5rem; }

.game-stage{
  position: relative;
  background: var(--paper-2);
  border: 1px solid rgba(58,46,42,0.1);
  border-radius: var(--radius);
  padding: 1.25rem;
  max-width: 680px;
  margin: 0 auto;
  transition: opacity 0.9s ease, transform 0.9s ease;
}
.game-stage.fading-out{
  opacity: 0;
  transform: scale(0.97);
  pointer-events: none;
}

.game-hud{
  display: flex;
  justify-content: space-between;
  font-family: var(--ui);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin-bottom: 0.6rem;
}

#dinoCanvas{
  width: 100%;
  height: auto;
  display: block;
  background: #fff;
  border-radius: 10px;
  border: 1px solid rgba(58,46,42,0.08);
  touch-action: manipulation;
}

.game-instructions{
  font-family: var(--ui);
  font-size: 0.78rem;
  color: var(--ink-soft);
  margin: 0.7rem 0 0;
}

.after-game{
  max-width: 680px;
  margin: 1.5rem auto 0;
}
.after-game-copy{
  font-family: var(--display);
  font-style: italic;
  font-size: 1.15rem;
  margin: 0 0 1rem;
}
.after-game-buttons{
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.after-game-buttons .btn{ flex: 1; }

.btn-outline{
  background: #fff;
  color: var(--ink);
  border-color: rgba(58,46,42,0.14);
}
.btn-outline:hover{
  border-color: var(--rose-deep);
  color: var(--rose-deep);
  transform: translateY(-2px);
}

.site-footer{
  text-align: center;
  margin-top: 4.5rem;
  font-family: var(--ui);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
  opacity: 0.7;
}

/* =========================================================
   Modal
========================================================= */
.modal-overlay{
  position: fixed;
  inset: 0;
  background: rgba(58,46,42,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 100;
}
.modal-overlay[hidden]{ display: none; }

.modal{
  position: relative;
  background: var(--paper);
  border-radius: var(--radius);
  box-shadow: 0 24px 60px rgba(0,0,0,0.25);
  max-width: 600px;
  width: 100%;
  max-height: 82vh;
  overflow-y: auto;
  padding: 2.75rem 2.25rem 2.25rem;
}

.modal-close{
  position: absolute;
  top: 0.9rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.6rem;
  line-height: 1;
  color: var(--ink-soft);
}
.modal-close:hover{ color: var(--rose-deep); }

.modal h3{
  font-family: var(--display);
  font-weight: 600;
  font-size: 1.8rem;
  margin: 0 0 1.1rem;
}

.modal-body{
  font-family: var(--body);
  font-size: 1.02rem;
  line-height: 1.8;
  color: var(--ink);
  white-space: pre-line;
}

/* =========================================================
   Responsive
========================================================= */
@media (max-width: 480px){
  .gate-card{ padding: 2.4rem 1.6rem 2rem; }
  .gate-actions{ flex-wrap: wrap; }
  .after-game-buttons{ flex-direction: column; }
}
