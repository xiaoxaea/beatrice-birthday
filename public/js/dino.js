/* =========================================================
   Tiny offline-style runner game.
   Dispatches "dino:finished" on window when score reaches 100.
========================================================= */
(function () {
  const canvas = document.getElementById("dinoCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const W = canvas.width;   // 640
  const H = canvas.height;  // 180
  const GROUND_Y = 138;

  const scoreEl = document.getElementById("scoreDisplay");
  const bestEl = document.getElementById("bestDisplay");
  const instructionsEl = document.getElementById("gameInstructions");
  const stageEl = document.getElementById("gameStage");

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return v ? v.trim() : fallback;
  }
  const COLORS = {
    ground: cssVar("--ink-soft", "#6B5C55"),
    dino: cssVar("--sage-deep", "#6F8064"),
    cactus: cssVar("--rose-deep", "#C6858C"),
    text: cssVar("--ink", "#3A2E2A"),
  };

  const player = {
    x: 46,
    y: GROUND_Y - 32,
    w: 30,
    h: 32,
    vy: 0,
    onGround: true,
  };

  const GRAVITY = 2100;
  const JUMP_VELOCITY = -700;

  let obstacles = [];
  let speed = 260;
  let distance = 0;
  let score = 0;
  let best = 0;
  let finished = false;
  let state = "ready"; // ready | running | gameover | finished
  let lastTime = null;
  let spawnTimer = 0;
  let nextSpawnIn = 900;

  fetch("/api/highscore")
    .then((r) => (r.ok ? r.json() : { highscore: 0 }))
    .then((data) => {
      best = data.highscore || 0;
      bestEl.textContent = best;
    })
    .catch(() => {});

  function reset() {
    obstacles = [];
    speed = 260;
    distance = 0;
    score = 0;
    finished = false;
    player.y = GROUND_Y - player.h;
    player.vy = 0;
    player.onGround = true;
    spawnTimer = 0;
    nextSpawnIn = 900 + Math.random() * 400;
    scoreEl.textContent = "0";
  }

  function jump() {
    if (state === "ready") {
      state = "running";
      instructionsEl.textContent = "";
      lastTime = null;
      requestAnimationFrame(loop);
    }
    if (state === "gameover") {
      reset();
      state = "running";
      instructionsEl.textContent = "";
      lastTime = null;
      requestAnimationFrame(loop);
      return;
    }
    if (state === "running" && player.onGround) {
      player.vy = JUMP_VELOCITY;
      player.onGround = false;
    }
  }

  function spawnObstacle() {
    const h = 26 + Math.random() * 20;
    const w = 14 + Math.random() * 12;
    obstacles.push({ x: W + 10, y: GROUND_Y - h, w, h });
  }

  function update(dt) {
    distance += speed * dt;
    score = Math.floor(distance / 22);
    scoreEl.textContent = String(score);
    speed = 260 + Math.min(score, 220) * 1.4;

    // physics
    player.vy += GRAVITY * dt;
    player.y += player.vy * dt;
    if (player.y >= GROUND_Y - player.h) {
      player.y = GROUND_Y - player.h;
      player.vy = 0;
      player.onGround = true;
    }

    // obstacles
    spawnTimer += dt * 1000;
    if (spawnTimer > nextSpawnIn) {
      spawnObstacle();
      spawnTimer = 0;
      nextSpawnIn = Math.max(500, 900 - score * 3) + Math.random() * 400;
    }
    obstacles.forEach((o) => (o.x -= speed * dt));
    obstacles = obstacles.filter((o) => o.x + o.w > -5);

    // collisions
    const pBox = { x: player.x + 4, y: player.y + 4, w: player.w - 8, h: player.h - 6 };
    for (const o of obstacles) {
      if (
        pBox.x < o.x + o.w &&
        pBox.x + pBox.w > o.x &&
        pBox.y < o.y + o.h &&
        pBox.y + pBox.h > o.y
      ) {
        gameOver();
        break;
      }
    }

    if (score >= 100 && state === "running") {
      finish();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // ground
    ctx.strokeStyle = COLORS.ground;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 2);
    ctx.lineTo(W, GROUND_Y + 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // player (simple flat creature silhouette)
    ctx.fillStyle = COLORS.dino;
    ctx.beginPath();
    const px = player.x, py = player.y, pw = player.w, ph = player.h;
    roundRect(ctx, px, py + 6, pw, ph - 6, 6);
    ctx.fill();
    // head
    roundRect(ctx, px + pw - 12, py, 16, 16, 4);
    ctx.fill();

    // obstacles
    ctx.fillStyle = COLORS.cactus;
    obstacles.forEach((o) => {
      roundRect(ctx, o.x, o.y, o.w, o.h, 3);
      ctx.fill();
    });

    if (state === "ready") {
      ctx.fillStyle = COLORS.text;
      ctx.font = "14px 'Nunito Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("press space or tap to start", W / 2, H / 2);
    }
    if (state === "gameover") {
      ctx.fillStyle = COLORS.text;
      ctx.font = "14px 'Nunito Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("game over — press space or tap to try again", W / 2, H / 2);
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function gameOver() {
    state = "gameover";
    saveHighscore(score);
    draw();
  }

  function finish() {
    state = "finished";
    finished = true;
    saveHighscore(Math.max(score, 100));
    window.dispatchEvent(new CustomEvent("dino:finished"));
  }

  function saveHighscore(value) {
    if (value > best) {
      best = value;
      bestEl.textContent = best;
    }
    fetch("/api/highscore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: value }),
    }).catch(() => {});
  }

  function loop(t) {
    if (state !== "running") return;
    if (lastTime === null) lastTime = t;
    const dt = Math.min(0.033, (t - lastTime) / 1000);
    lastTime = t;
    update(dt);
    draw();
    if (state === "running") requestAnimationFrame(loop);
    else draw();
  }

  // input
  window.addEventListener("keydown", (e) => {
    const overlay = document.getElementById("runnerOverlay");
    if (e.code === "Space" && overlay && !overlay.hidden) {
      e.preventDefault();
      jump();
    }
  });
  canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    jump();
  });
  stageEl.addEventListener("touchstart", (e) => {
    e.preventDefault();
    jump();
  }, { passive: false });

  reset();
  draw();
})();
