(function () {
  "use strict";

  // ---- Trailer ----
  const trailer = document.getElementById("trailer");
  const trailerFrames = trailer ? trailer.querySelectorAll(".tframe") : [];
  const trailerDots = trailer ? trailer.querySelectorAll(".tdot") : [];
  const trailerSkyline = document.getElementById("trailerSkyline");
  const glitchCode = document.getElementById("glitchCode");
  const trailerHeroA = document.getElementById("trailerHeroA");
  const trailerHeroB = document.getElementById("trailerHeroB");
  const trailerHeroAVisual = document.getElementById("trailerHeroAVisual");
  const trailerHeroBVisual = document.getElementById("trailerHeroBVisual");
  const trailerHeroABubble = document.getElementById("trailerHeroABubble");
  const trailerHeroBBubble = document.getElementById("trailerHeroBBubble");
  const trailerSkipBtn = document.getElementById("trailerSkipBtn");

  let trailerCurrentFrame = 0;
  let trailerHeroLoopRunning = false;
  let trailerFinished = false;
  let trailerAdvanceTimer = null;

  function buildTrailerSkyline() {
    if (!trailerSkyline) return;
    trailerSkyline.innerHTML = "";
    const heights = [30, 55, 24, 70, 40, 85, 28, 62, 46, 75, 34, 58, 42, 66, 26, 78, 36, 60, 48, 22];
    const barWidth = 34;
    const step = 40;
    const targetWidth = Math.max(window.innerWidth, (trailer && trailer.offsetWidth) || 0, 1200);
    const count = Math.ceil(targetWidth / step) + 3;
    let x = 0;
    for (let i = 0; i < count; i++) {
      const h = heights[i % heights.length];
      const bar = document.createElement("span");
      bar.style.left = x + "px";
      bar.style.width = barWidth + "px";
      bar.style.height = h + "px";
      trailerSkyline.appendChild(bar);
      x += step;
    }
  }

  function buildTrailerGlitch() {
    if (!glitchCode || glitchCode.childElementCount) return;
    const snippets = [
      "01001000 01101001", "function thwip(x){", "  return x * 2;", "}",
      "const bea = 19;", "while(true){ love++; }", "<hero state='loading'/>",
      "sys.init(webshooter)", "> compiling gift.exe", "01100010 01100101 01100001",
      "render(heart, x, y)", "if(bea.birthday) party();", "spidey.sense += 1;",
      "> linking multiverse.dll", "class hero extends bae{}", "01110000 01110010",
    ];
    const columns = 11;
    for (let i = 0; i < columns; i++) {
      const col = document.createElement("div");
      col.className = "glitch-col";
      col.style.left = (i * (100 / columns)) + "%";
      col.style.animationDuration = (2.2 + Math.random() * 2.2).toFixed(2) + "s";
      col.style.animationDelay = (-Math.random() * 3).toFixed(2) + "s";
      const lines = 16 + Math.floor(Math.random() * 6);
      let text = "";
      for (let l = 0; l < lines; l++) {
        text += snippets[Math.floor(Math.random() * snippets.length)] + "\n";
      }
      col.textContent = text;
      glitchCode.appendChild(col);
    }
  }

  function runHeroLoop() {
    if (trailerHeroLoopRunning) return;
    trailerHeroLoopRunning = true;
    let ax = -60;
    let bx = -110;

    const SWEEP_MS = 2100;

    function step() {
      if (!trailer || trailer.classList.contains("hide") || trailerFinished) {
        trailerHeroLoopRunning = false;
        return;
      }
      if (trailerCurrentFrame !== 1) {
        ax = -60;
        bx = -110;
        requestAnimationFrame(step);
        return;
      }
      const stageWidth = trailer.offsetWidth || 800;
      const speed = (stageWidth + 170) / (SWEEP_MS / 16.67);
      ax += speed;
      bx += speed;
      if (ax > stageWidth + 60) ax = -60;
      if (bx > stageWidth + 110) bx = -110;
      const bobA = Math.sin(ax * 0.04) * 22;
      const bobB = Math.sin(bx * 0.04 + 1) * 18;
      if (trailerHeroA) trailerHeroA.style.transform = "translate(" + ax + "px," + bobA + "px)";
      if (trailerHeroAVisual) trailerHeroAVisual.style.transform = "rotate(" + (bobA * 1.4) + "deg)";
      if (trailerHeroB) trailerHeroB.style.transform = "translate(" + bx + "px," + bobB + "px)";
      if (trailerHeroBVisual) trailerHeroBVisual.style.transform = "rotate(" + (bobB * 1.4) + "deg)";
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---- Hero banter while swinging (frame 1 only) ----
  const spideyLines = ["Thwip!", "Left or right?", "Race ya!", "Watch that ledge!", "Almost there!", "Keep up!"];
  const gwenLines = ["Catch me first!", "Too slow, Spidey!", "Nice web!", "Woo-hoo!", "This way!", "Almost home!"];
  let heroDialogueTimer = null;
  let heroDialogueTurn = 0;

  function showHeroBubble(el, text) {
    if (!el) return;
    el.textContent = text;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 1400);
  }

  function cycleHeroDialogue() {
    if (trailerFinished) return;
    if (trailerCurrentFrame === 1) {
      if (heroDialogueTurn % 2 === 0) {
        showHeroBubble(trailerHeroABubble, spideyLines[Math.floor(Math.random() * spideyLines.length)]);
      } else {
        showHeroBubble(trailerHeroBBubble, gwenLines[Math.floor(Math.random() * gwenLines.length)]);
      }
      heroDialogueTurn += 1;
    }
    heroDialogueTimer = setTimeout(cycleHeroDialogue, 900 + Math.random() * 500);
  }

  function showTrailerFrame(i) {
    trailerCurrentFrame = i;
    trailerFrames.forEach((f) => f.classList.toggle("active", Number(f.dataset.f) === i));
    trailerDots.forEach((d) => d.classList.toggle("active", Number(d.dataset.d) === i));
  }

  function finishTrailer() {
    if (trailerFinished) return;
    trailerFinished = true;
    if (trailerAdvanceTimer) clearTimeout(trailerAdvanceTimer);
    if (trailer) {
      trailer.classList.add("hide");
      setTimeout(() => {
        trailer.hidden = true;
      }, 550);
    }
  }

  function advanceTrailer() {
    if (trailerFinished) return;
    const next = trailerCurrentFrame + 1;
    if (next >= trailerFrames.length) {
      trailerAdvanceTimer = setTimeout(finishTrailer, 2500);
      return;
    }
    showTrailerFrame(next);
    trailerAdvanceTimer = setTimeout(advanceTrailer, 2500);
  }

  let trailerStarted = false;
  function startTrailer() {
    if (!trailer || trailerStarted) return;
    trailerStarted = true;
    buildTrailerSkyline();
    buildTrailerGlitch();
    trailer.hidden = false;
    trailer.classList.remove("hide");
    showTrailerFrame(0);
    runHeroLoop();
    trailerAdvanceTimer = setTimeout(advanceTrailer, 2500);
  }

  if (trailerSkipBtn) trailerSkipBtn.addEventListener("click", finishTrailer);
  if (trailer) {
    trailer.addEventListener("click", (e) => {
      if (e.target === trailerSkipBtn) return;
      if (trailerCurrentFrame >= trailerFrames.length - 1) finishTrailer();
    });
  }

  // ---- Character select ----
  const charSelect = document.getElementById("charSelect");
  const csGrid = document.getElementById("csGrid");
  const csCallout = document.getElementById("csCallout");

  const csCharacters = [
    { name: "WEB-RED",    head: "#ED1D24", body: "#0D3B78" },
    { name: "NOIR",       head: "#2b2b2b", body: "#111111" },
    { name: "IRON ARC",   head: "#B0141A", body: "#FFC72C" },
    { name: "VENOM-X",    head: "#0f0f0f", body: "#1E5FC2" },
    { name: "SPIDER-BAE", head: "#F4EFE1", body: "#D4537E", accent: "#7F5AF0" },
    { name: "GOLD-WING",  head: "#FFC72C", body: "#33404F" },
  ];
  const csTargetIndex = 4;

  function buildCharGrid() {
    if (!csGrid) return [];
    if (csGrid.childElementCount) return Array.from(csGrid.children);
    const cards = [];
    csCharacters.forEach((c) => {
      const card = document.createElement("div");
      card.className = "cs-card";
      const head = document.createElement("span");
      head.className = "cs-card-head";
      head.style.background = c.head;
      if (c.accent) head.style.boxShadow = "0 0 0 2px " + c.accent;
      const body = document.createElement("span");
      body.className = "cs-card-body";
      body.style.background = c.body;
      const name = document.createElement("span");
      name.className = "cs-card-name";
      name.textContent = c.name;
      card.appendChild(head);
      card.appendChild(body);
      card.appendChild(name);
      csGrid.appendChild(card);
      cards.push(card);
    });
    return cards;
  }

  function setHighlighted(cards, index) {
    cards.forEach((card, i) => card.classList.toggle("cs-card--highlight", i === index));
  }

  function runGridSelection(cards, targetIndex, onDone) {
    if (!cards.length) { onDone(); return; }
    const total = cards.length;
    const loops = 2;
    const totalSteps = loops * total + targetIndex + 1;
    let step = 0;
    function tick() {
      const current = step % total;
      setHighlighted(cards, current);
      step += 1;
      if (step >= totalSteps) { onDone(); return; }
      const progress = step / totalSteps;
      const delay = 70 + Math.pow(progress, 3) * 260;
      setTimeout(tick, delay);
    }
    tick();
  }

  function finishCharSelect() {
    if (!charSelect) return;
    charSelect.classList.add("hide");
    setTimeout(() => {
      charSelect.hidden = true;
      if (GW) GW.start();
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }, 550);
  }

  function startCharSelect() {
    if (!charSelect || !csGrid || !csCallout) return;
    charSelect.hidden = false;
    charSelect.classList.remove("hide");
    csCallout.textContent = "SELECTING...";
    csCallout.classList.remove("locked");
    const cards = buildCharGrid();
    runGridSelection(cards, csTargetIndex, () => {
      setHighlighted(cards, -1);
      const target = cards[csTargetIndex];
      if (target) target.classList.add("cs-card--locked");
      csCallout.textContent = "SPIDER-BAE LOCKED IN";
      csCallout.classList.add("locked");
      setTimeout(finishCharSelect, 2400);
    });
  }

  // ---- Spidey-sense vitals monitor ----
  const VitalsSystem = (function () {
    const panel = document.getElementById("gwVitalsPanel");
    const canvas = document.getElementById("gwVitalsCanvas");
    const ctx = canvas ? canvas.getContext("2d") : null;
    const pulseEl = document.getElementById("gwVitalsPulse");
    const focusFill = document.getElementById("gwVitalsFocusFill");
    const signalWrap = document.getElementById("gwVitalsSignal");
    const signalBars = signalWrap ? Array.from(signalWrap.children) : [];
    const spikeLabel = document.getElementById("gwVitalsSpikeLabel");

    if (!panel || !canvas || !ctx) {
      return { setEnergy() {}, setSignal() {}, spike() {} };
    }

    const W = canvas.width;
    const H = canvas.height;
    const history = new Array(W).fill(0);

    let phase = 0;
    let energy = 0.22;
    let spikeEnergy = 0;
    let displayedPulse = 72;
    let signalTarget = 0.08;
    let signalDisplay = 0.08;
    let spikeTimer = null;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(255,199,44,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();

      ctx.strokeStyle = "#FFC72C";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < history.length; i++) {
        const y = H / 2 - history[i] * (H / 2 - 4);
        if (i === 0) ctx.moveTo(i, y); else ctx.lineTo(i, y);
      }
      ctx.stroke();
    }

    function tick() {
      phase += 0.18 + energy * 0.35;
      spikeEnergy *= 0.93;

      const heartbeat = Math.pow(Math.max(0, Math.sin(phase)), 6) * (0.5 + energy * 0.5 + spikeEnergy);
      const jitter = (Math.random() - 0.5) * 0.05;
      const sample = Math.max(-0.15, Math.min(1, heartbeat + jitter));
      history.shift();
      history.push(sample);
      draw();

      const targetPulse = 62 + energy * 55 + spikeEnergy * 60;
      displayedPulse += (targetPulse - displayedPulse) * 0.06;
      pulseEl.textContent = String(Math.round(displayedPulse));

      const focusPct = Math.max(6, Math.min(100, Math.round((1 - Math.abs(energy - 0.55)) * 100)));
      focusFill.style.width = focusPct + "%";

      signalDisplay += (signalTarget - signalDisplay) * 0.15;
      const activeCount = Math.round(signalDisplay * signalBars.length);
      signalBars.forEach((bar, i) => bar.classList.toggle("active", i < activeCount));

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    function setEnergy(value) {
      const clamped = Math.max(0, Math.min(1, value));
      energy += (clamped - energy) * 0.08;
    }

    function setSignal(strength) {
      signalTarget = Math.max(0, Math.min(1, strength));
    }

    function spike(intensity) {
      spikeEnergy = Math.min(1.4, spikeEnergy + (intensity || 0.8));
      panel.classList.remove("gw-vitals-spike");
      void panel.offsetWidth;
      panel.classList.add("gw-vitals-spike");
      if (spikeLabel) {
        spikeLabel.classList.add("show");
        if (spikeTimer) clearTimeout(spikeTimer);
        spikeTimer = setTimeout(() => spikeLabel.classList.remove("show"), 700);
      }
    }

    panel.addEventListener("click", () => spike(1));
    panel.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        spike(1);
      }
    });

    return { setEnergy, setSignal, spike };
  })();

  // ---- Quest log + Spider-Chips reward system ----
  const QuestSystem = (function () {
    const CHIP_REWARD = 10;
    const quests = ["letter", "npc", "music", "runner", "tracker"];
    const completed = new Set();

    const leftStack = document.getElementById("gwLeftStack");
    const questList = document.getElementById("gwQuestList");
    const progressFill = document.getElementById("gwQuestProgressFill");
    const progressLabel = document.getElementById("gwQuestProgressLabel");
    const chipTotalEl = document.getElementById("gwChipTotal");
    const chipIcon = document.getElementById("gwChipIcon");
    const chipToast = document.getElementById("gwChipToast");
    const chipToastText = document.getElementById("gwChipToastText");

    let chips = 0;
    let toastTimer = null;

    function reveal() {
      if (leftStack) leftStack.hidden = false;
    }

    function positionToast() {
      if (!chipToast || !leftStack) return;
      const rect = leftStack.getBoundingClientRect();
      chipToast.style.bottom = (window.innerHeight - rect.top + 14) + "px";
    }

    function showToast(questLabel) {
      if (!chipToast) return;
      chipToastText.innerHTML = 'Quest complete! <b>+' + CHIP_REWARD + ' Spider-Chips</b>';
      positionToast();
      chipToast.classList.add("show");
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => chipToast.classList.remove("show"), 2600);
    }

    function updateProgress() {
      const done = completed.size;
      const total = quests.length;
      if (progressFill) progressFill.style.width = (done / total * 100) + "%";
      if (progressLabel) progressLabel.textContent = done + "/" + total;
    }

    function updateChips() {
      if (chipTotalEl) chipTotalEl.textContent = String(chips);
      if (chipIcon) {
        chipIcon.classList.remove("earning");
        void chipIcon.offsetWidth;
        chipIcon.classList.add("earning");
      }
    }

    function complete(questId) {
      if (!quests.includes(questId) || completed.has(questId)) return;
      completed.add(questId);
      chips += CHIP_REWARD;

      const item = questList ? questList.querySelector('[data-quest="' + questId + '"]') : null;
      if (item) {
        item.classList.add("done", "just-done");
        setTimeout(() => item.classList.remove("just-done"), 420);
      }

      updateProgress();
      updateChips();
      showToast(questId);
      VitalsSystem.spike(1.2);
    }

    return { reveal, complete, updateProgress, updateChips };
  })();

  // ---- Inventory system ----
  // Small self-contained module: tracks collected items and renders them as
  // filled slots in the panel below the game viewport. Items are defined
  // once here (icon + display name) and picked up in-world via the same
  // gw-interact / E-key flow used by doors, NPCs, and other interactables.
  // GW calls InventorySystem.collect(itemId) whenever the player interacts
  // with a .gw-pickup element.
  const InventorySystem = (function () {
    const panel = document.getElementById("gwInventoryPanel");
    const grid = document.getElementById("gwInventoryGrid");
    const countEl = document.getElementById("gwInvCount");
    const totalEl = document.getElementById("gwInvTotal");
    const hintEl = document.getElementById("gwInventoryHint");

    const itemDefs = {
      webshooter: { icon: "🕸️", name: "Web Shooter" },
      photo:      { icon: "🖼️", name: "Old Photo" },
      vinyl:      { icon: "💿", name: "Mix Record" },
      token:      { icon: "🪙", name: "Arcade Token" },
      badge:      { icon: "🎖️", name: "Hero Badge" },
    };
    const order = ["webshooter", "photo", "vinyl", "token", "badge"];
    const collected = new Set();

    if (!panel || !grid) {
      return { collect() {}, has() { return false; } };
    }

    function buildSlots() {
      grid.innerHTML = "";
      order.forEach((id) => {
        const def = itemDefs[id];
        const slot = document.createElement("div");
        slot.className = "gw-inventory-slot";
        slot.dataset.item = id;
        slot.setAttribute("tabindex", "0");
        slot.setAttribute("aria-label", def.name + " (not yet collected)");

        const label = document.createElement("span");
        label.className = "gw-inventory-slot-label";
        label.textContent = def.name;
        slot.appendChild(label);

        grid.appendChild(slot);
      });
      if (totalEl) totalEl.textContent = String(order.length);
    }
    buildSlots();

    function updateCount() {
      if (countEl) countEl.textContent = String(collected.size);
      if (hintEl) hintEl.classList.toggle("hidden", collected.size > 0);
    }

    function collect(itemId) {
      const def = itemDefs[itemId];
      if (!def || collected.has(itemId)) return;
      collected.add(itemId);

      const slot = grid.querySelector('[data-item="' + itemId + '"]');
      if (slot) {
        slot.textContent = "";
        const label = document.createElement("span");
        label.className = "gw-inventory-slot-label";
        label.textContent = def.name;
        slot.appendChild(document.createTextNode(def.icon));
        slot.appendChild(label);
        slot.classList.add("filled");
        slot.setAttribute("aria-label", def.name + " (collected)");
      }
      updateCount();
      VitalsSystem.spike(0.9);
    }

    function has(itemId) {
      return collected.has(itemId);
    }

    updateCount();
    return { collect, has };
  })();

  // ---- Game World engine ----
  const GW = (function () {
    const world = document.getElementById("gameWorld");
    if (!world) return null;

    const viewport = document.querySelector(".gw-viewport");
    const stage = document.getElementById("gwStage");
    const player = document.getElementById("gwPlayer");
    const playerArrow = document.getElementById("gwPlayerArrow");
    const roomLabel = document.getElementById("gwRoomLabel");
    const dpad = document.getElementById("gwDpad");

    const dlgEl = document.getElementById("gwDialogue");
    const dlgBox = document.getElementById("gwDialogueBox");
    const dlgName = document.getElementById("gwDialogueName");
    const dlgText = document.getElementById("gwDialogueText");
    const dlgNext = document.getElementById("gwDialogueNext");
    const dlgChoices = document.getElementById("gwDialogueChoices");

    const STAGE_W = 640, STAGE_H = 360;
    const PLAYER_W = 22, PLAYER_H = 30;
    const INTERACT_RANGE = 46;

    let px = 300, py = 190;
    let currentRoom = "lounge";
    let facing = 1;
    let facingDir = "down";
    let bobPhase = 0;
    let nearestInteract = null;
    const keys = {};

    const ARROW_ROTATION = { up: 0, right: 90, down: 180, left: 270 };

    const npcRoster = [
      {
        id: "npc-webred", name: "WEB-RED", baseX: 110, baseY: 210, range: 34, speed: 0.8, phase: 0,
        lines: ["Yo! Watch the couch, I tripped on it twice already.", "Big day today, huh? Nineteen!"],
        question: "So — favorite way to celebrate a birthday?",
        choices: [
          { label: "Cake, obviously.", reply: "Ha, can't argue with that. Save me a slice." },
          { label: "A quiet day in.", reply: "Respect. Sometimes low-key is the best kind of celebration." },
          { label: "Go all out!", reply: "That's the spirit! Go make some noise, Bea." },
        ],
      },
      {
        id: "npc-noir", name: "NOIR", baseX: 480, baseY: 230, range: 30, speed: 0.7, phase: 0.8,
        lines: ["This room's quiet. Good for reading things twice.", "There's an envelope waiting for you, by the way."],
        question: "Read it now, or save it for later?",
        choices: [
          { label: "Now, obviously.", reply: "Can't say I blame you. Go on, then." },
          { label: "I'll save it.", reply: "Patience. I can respect that too." },
          { label: "What's it about?", reply: "Not my secret to tell. Go find out yourself." },
        ],
      },
      {
        id: "npc-ironarc", name: "IRON ARC", baseX: 130, baseY: 220, range: 36, speed: 0.9, phase: 2.1,
        lines: ["Nice speakers, right? Upgraded the bass myself. Unofficially.", "Every birthday needs a soundtrack."],
        question: "What's the vibe today?",
        choices: [
          { label: "Upbeat and loud.", reply: "Now we're talking. Turn it up." },
          { label: "Something chill.", reply: "Good pick. Chill still counts as celebrating." },
          { label: "Surprise me.", reply: "Dangerous request. I like it." },
        ],
      },
      {
        id: "npc-venomx", name: "VENOM-X", baseX: 470, baseY: 220, range: 32, speed: 0.75, phase: 1.7,
        lines: ["Think you can beat the high score? Doubt it.", "This cabinet's rigged with good vibes only. Promise."],
        question: "One round, for birthday luck?",
        choices: [
          { label: "You're on.", reply: "That's the spirit. Don't blame me if you lose, though." },
          { label: "Maybe later.", reply: "Sure, sure. I'll be here." },
          { label: "I don't play.", reply: "Boo. Fine, I'll cheer from the sidelines." },
        ],
      },
      {
        id: "npc-goldwing", name: "GOLD-WING", baseX: 470, baseY: 190, range: 28, speed: 0.65, phase: 0.3,
        lines: ["This console's been pinging non-stop.", "Every signal on this map points to one thing: today's your day."],
        question: "Ready to see what it found?",
        choices: [
          { label: "Let's see it.", reply: "That's the spirit. Go on, check it out." },
          { label: "A little nervous.", reply: "No need to be. It's all good things." },
          { label: "Later, maybe.", reply: "It'll be here when you're ready." },
        ],
      },
      {
        id: "npc-eubin", name: "EUBIN", baseX: 480, baseY: 210, range: 32, speed: 0.7, phase: 1.4,
        lines: ["Hii! Welcome to the lounge, make yourself at home!", "Did you know this whole place was made just for you?"],
        question: "So? What do you think so far?",
        choices: [
          { label: "I love it!", reply: "Yesss! Worth every late night, then. Happy birthday, Bea!" },
          { label: "It's really sweet.", reply: "That's exactly what I was going for. Enjoy your day!" },
          { label: "Still exploring.", reply: "Take your time! There's more to see. Happy birthday!" },
        ],
      },
    ];

    npcRoster.forEach((n) => {
      n.wanderX = 0;
      n.wanderY = 0;
      n.targetX = 0;
      n.targetY = 0;
      n.pauseUntil = 0;
      n.nextPick = 0;
      n.facingScale = 1;
    });

    function pickNewNpcTarget(n, now) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * n.range;
      n.targetX = Math.cos(angle) * dist;
      n.targetY = Math.sin(angle) * dist * 0.6;
      const willPause = Math.random() < 0.35;
      n.pauseUntil = willPause ? now + 600 + Math.random() * 1200 : 0;
      n.nextPick = now + 1800 + Math.random() * 2200;
    }

    let dialogueOpen = false;
    let dialogueNpc = null;
    let dialogueStep = 0;
    let dialoguePhase = "lines";
    let dialogueChoiceIndex = 0;

    function renderDialogue() {
      if (!dialogueNpc) return;
      if (dialoguePhase === "lines") {
        dlgText.textContent = dialogueNpc.lines[dialogueStep];
        dlgNext.hidden = false;
        dlgChoices.hidden = true;
      } else if (dialoguePhase === "question") {
        dlgText.textContent = dialogueNpc.question;
        dlgNext.hidden = true;
        dlgChoices.hidden = false;
        dlgChoices.innerHTML = "";
        dialogueNpc.choices.forEach((choice, i) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "gw-dialogue-choice";
          btn.textContent = choice.label;
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            selectDialogueChoice(i);
          });
          dlgChoices.appendChild(btn);
        });
      } else if (dialoguePhase === "reply") {
        dlgText.textContent = dialogueNpc.choices[dialogueChoiceIndex].reply;
        dlgNext.hidden = false;
        dlgChoices.hidden = true;
      }
    }

    function openDialogue(npc) {
      dialogueNpc = npc;
      dialogueStep = 0;
      dialoguePhase = "lines";
      dialogueOpen = true;
      dlgName.textContent = npc.name;
      dlgEl.hidden = false;
      renderDialogue();
      QuestSystem.complete("npc");
    }

    function closeDialogue() {
      dialogueOpen = false;
      dialogueNpc = null;
      dlgEl.hidden = true;
      dlgChoices.innerHTML = "";
    }

    function advanceDialogue() {
      if (!dialogueOpen) return;
      if (dialoguePhase === "lines") {
        dialogueStep += 1;
        if (dialogueStep >= dialogueNpc.lines.length) {
          dialoguePhase = "question";
        }
        renderDialogue();
      } else if (dialoguePhase === "reply") {
        closeDialogue();
      }
    }

    function selectDialogueChoice(i) {
      dialogueChoiceIndex = i;
      dialoguePhase = "reply";
      renderDialogue();
    }

    if (dlgBox) dlgBox.addEventListener("click", advanceDialogue);

    function updateNpcMovement(now) {
      const t = now || performance.now();
      npcRoster.forEach((n) => {
        const el = document.getElementById(n.id);
        if (!el) return;

        if (t >= n.nextPick) pickNewNpcTarget(n, t);

        if (t >= n.pauseUntil) {
          const ease = 0.02 * n.speed;
          n.wanderX += (n.targetX - n.wanderX) * ease;
          n.wanderY += (n.targetY - n.wanderY) * ease;
        }

        el.style.left = (n.baseX + n.wanderX) + "px";
        el.style.top = (n.baseY + n.wanderY) + "px";

        const dx = n.targetX - n.wanderX;
        if (Math.abs(dx) > 1) {
          n.facingScale = dx < 0 ? -1 : 1;
        }
        el.style.transform = "scaleX(" + n.facingScale + ")";
      });
    }

    document.querySelectorAll(".gw-npc").forEach((el) => {
      el.addEventListener("click", () => {
        if (dialogueOpen) return;
        const npc = npcRoster.find((n) => n.id === el.id);
        if (npc) openDialogue(npc);
      });
    });

    // Pickup items — clicking (or pressing E while near) a .gw-pickup marker
    // collects it into the inventory and hides the marker for the rest of
    // the session.
    document.querySelectorAll(".gw-pickup").forEach((el) => {
      el.addEventListener("click", () => {
        if (dialogueOpen) return;
        const itemId = el.getAttribute("data-item");
        if (!itemId) return;
        InventorySystem.collect(itemId);
        el.classList.add("gw-pickup--collected");
      });
    });

    function scaleStage() {
      if (!viewport || !stage) return;
      const scale = viewport.clientWidth / STAGE_W;
      stage.style.transform = "scale(" + scale + ")";
      viewport.style.height = (STAGE_H * scale) + "px";
    }
    window.addEventListener("resize", scaleStage);

    function activeRoomEl() {
      return document.getElementById("room-" + currentRoom);
    }

    function getRect(el) {
      return { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
    }
    function overlaps(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function hideAllHints() {
      document.querySelectorAll(".gw-interact-hint").forEach((h) => h.classList.remove("show"));
      document.querySelectorAll(".gw-interact").forEach((h) => h.classList.remove("gw-interact-near"));
    }

    function switchRoom(to, sx, sy) {
      const prev = activeRoomEl();
      if (prev) prev.classList.remove("active");
      currentRoom = to;
      const next = activeRoomEl();
      if (next) next.classList.add("active");
      px = sx;
      py = sy;
      if (roomLabel) roomLabel.textContent = to.toUpperCase();
      hideAllHints();
    }

    function resolveAxis(newX, newY, blockers) {
      let x = newX, y = newY;
      const rectX = { x: x, y: py, w: PLAYER_W, h: PLAYER_H };
      for (const b of blockers) {
        if (overlaps(rectX, b)) { x = px; break; }
      }
      const rectY = { x: x, y: y, w: PLAYER_W, h: PLAYER_H };
      for (const b of blockers) {
        if (overlaps(rectY, b)) { y = py; break; }
      }
      return { x, y };
    }

    function interact() {
      if (nearestInteract) nearestInteract.click();
    }

    function loop(now) {
      const room = activeRoomEl();
      if (!room) { requestAnimationFrame(loop); return; }

      updateNpcMovement(now);

      let dx = 0, dy = 0;
      if (!dialogueOpen) {
        if (keys["arrowup"] || keys["w"]) { dy -= 1; facingDir = "up"; }
        if (keys["arrowdown"] || keys["s"]) { dy += 1; facingDir = "down"; }
        if (keys["arrowleft"] || keys["a"]) { dx -= 1; facing = -1; facingDir = "left"; }
        if (keys["arrowright"] || keys["d"]) { dx += 1; facing = 1; facingDir = "right"; }
      }

      const moving = dx !== 0 || dy !== 0;
      const speed = 2.6;
      const blockers = Array.from(room.querySelectorAll(".gw-blocking, .gw-interact")).map(getRect);

      if (moving) {
        const len = Math.hypot(dx, dy) || 1;
        let nx = px + (dx / len) * speed;
        let ny = py + (dy / len) * speed;
        nx = Math.max(4, Math.min(STAGE_W - PLAYER_W - 4, nx));
        ny = Math.max(30, Math.min(STAGE_H - PLAYER_H - 4, ny));
        const resolved = resolveAxis(nx, ny, blockers);
        px = resolved.x;
        py = resolved.y;
        bobPhase += 0.35;
      } else {
        bobPhase = 0;
      }

      const bob = moving ? Math.abs(Math.sin(bobPhase)) * 2 : 0;
      player.style.left = px + "px";
      player.style.top = (py - bob) + "px";
      player.classList.toggle("facing-left", facing < 0);

      if (playerArrow) {
        playerArrow.style.setProperty("--arrow-rot", ARROW_ROTATION[facingDir] + "deg");
      }

      const pRect = { x: px, y: py, w: PLAYER_W, h: PLAYER_H };
      room.querySelectorAll(".gw-door").forEach((d) => {
        const r = getRect(d);
        if (overlaps(pRect, r)) {
          const to = d.getAttribute("data-to");
          const sx = parseFloat(d.getAttribute("data-spawn-x")) || 300;
          const sy = parseFloat(d.getAttribute("data-spawn-y")) || 250;
          switchRoom(to, sx, sy);
        }
      });

      nearestInteract = null;
      let bestDist = 9999;
      room.querySelectorAll(".gw-interact").forEach((it) => {
        if (it.classList.contains("gw-pickup--collected")) return;
        const r = getRect(it);
        const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
        const dist = Math.hypot((px + PLAYER_W / 2) - cx, (py + PLAYER_H / 2) - cy);
        const near = dist < INTERACT_RANGE;
        it.classList.toggle("gw-interact-near", near);
        const hintId = it.getAttribute("data-hint");
        const hint = hintId && document.getElementById(hintId);
        if (hint) hint.classList.toggle("show", near);
        if (near && dist < bestDist) { bestDist = dist; nearestInteract = it; }
      });

      VitalsSystem.setEnergy(dialogueOpen ? 0.5 : (moving ? 0.62 : 0.22));
      VitalsSystem.setSignal(nearestInteract ? Math.max(0.15, 1 - bestDist / INTERACT_RANGE) : 0.06);

      requestAnimationFrame(loop);
    }

    window.addEventListener("keydown", (e) => {
      if (world.hidden) return;
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
      if (dialogueOpen) {
        if (k === "e" || k === "enter" || k === " ") advanceDialogue();
        return;
      }
      keys[k] = true;
      if (k === "e") interact();
    });
    window.addEventListener("keyup", (e) => { keys[e.key.toLowerCase()] = false; });

    if (dpad) {
      dpad.querySelectorAll("button").forEach((btn) => {
        const dir = btn.getAttribute("data-dir");
        const setKey = (down) => {
          if (dialogueOpen) return;
          if (dir === "up") keys["arrowup"] = down;
          if (dir === "down") keys["arrowdown"] = down;
          if (dir === "left") keys["arrowleft"] = down;
          if (dir === "right") keys["arrowright"] = down;
        };
        const handlePress = () => {
          if (dir === "e") {
            if (dialogueOpen) advanceDialogue(); else interact();
          } else {
            setKey(true);
          }
        };
        btn.addEventListener("touchstart", (e) => { e.preventDefault(); handlePress(); }, { passive: false });
        btn.addEventListener("touchend", (e) => { e.preventDefault(); setKey(false); }, { passive: false });
        btn.addEventListener("mousedown", () => { handlePress(); });
        btn.addEventListener("mouseup", () => setKey(false));
        btn.addEventListener("mouseleave", () => setKey(false));
      });
    }

    function start() {
      world.hidden = false;
      scaleStage();
      player.style.left = px + "px";
      player.style.top = py + "px";
      if (playerArrow) {
        playerArrow.style.setProperty("--arrow-rot", ARROW_ROTATION[facingDir] + "deg");
      }
      requestAnimationFrame(loop);
      QuestSystem.reveal();
      QuestSystem.updateProgress();
      QuestSystem.updateChips();
    }

    return { start, scaleStage };
  })();

  // ---- Boot loader ----
  const bootLoader = document.getElementById("bootLoader");
  const bootBarFill = document.getElementById("bootBarFill");
  const bootPercent = document.getElementById("bootPercent");
  const bootSub = document.getElementById("bootSub");

  if (bootLoader) {
    const bootLines = [
      "INITIALIZING WEB-SHOOTERS",
      "CALIBRATING SPIDEY-SENSE",
      "LOADING BEA-VERSE ASSETS",
      "SYNCING WITH THE MULTIVERSE",
    ];
    let lineIndex = 0;
    let progress = 0;
    const minDuration = 5000;
    const start = performance.now();
    let pageLoaded = document.readyState === "complete";
    window.addEventListener("load", () => { pageLoaded = true; });

    function tick(now) {
      const elapsed = now - start;
      const timeRatio = Math.min(elapsed / minDuration, 1);
      const target = pageLoaded ? 100 : Math.min(90, timeRatio * 90);
      progress += (target - progress) * 0.18;
      if (target - progress < 0.3) progress = target;

      const shown = Math.floor(progress);
      bootBarFill.style.width = shown + "%";
      bootPercent.textContent = String(shown).padStart(2, "0") + "%";

      const newLineIndex = Math.min(bootLines.length - 1, Math.floor((shown / 100) * bootLines.length));
      if (newLineIndex !== lineIndex) {
        lineIndex = newLineIndex;
        bootSub.firstChild.textContent = bootLines[lineIndex];
      }

      if (progress >= 100 && pageLoaded) {
        startTrailer();
        setTimeout(() => bootLoader.classList.add("hide"), 350);
        setTimeout(() => {
          bootLoader.hidden = true;
        }, 900);
        return;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    bootLoader.addEventListener("click", () => {
      if (progress > 60) progress = 100;
    });
  } else {
    startTrailer();
  }

  const noBtn = document.getElementById("noBtn");
  const yesBtn = document.getElementById("yesBtn");
  const gate = document.getElementById("gate");
  const gateHint = document.getElementById("gateHint");
  const spideyCorner = document.getElementById("spideyCorner");
  const spideyBubble = document.getElementById("spideyBubble");
  const spideyMessages = ["Thwip!", "Hi, Bea!", "Nice catch!", "Web-slinging by~", "You found me!", "Keep reading!"];
  let spideyMsgIndex = 0;

  function pokeSpidey() {
    spideyCorner.classList.remove("popped");
    void spideyCorner.offsetWidth;
    spideyCorner.classList.add("popped");
    spideyBubble.textContent = spideyMessages[spideyMsgIndex % spideyMessages.length];
    spideyMsgIndex += 1;
    spideyBubble.classList.add("show");
    setTimeout(() => spideyBubble.classList.remove("show"), 1400);
    setTimeout(() => spideyCorner.classList.remove("popped"), 650);
  }

  if (spideyCorner) {
    spideyCorner.addEventListener("click", pokeSpidey);
    spideyCorner.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pokeSpidey();
      }
    });
  }

  const notifBell = document.getElementById("notifBell");
  if (notifBell) {
    notifBell.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      notifBell.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      if (!notifBell.contains(e.target)) notifBell.classList.remove("active");
    });
    function wiggleBell() {
      notifBell.classList.remove("wiggle");
      void notifBell.offsetWidth;
      notifBell.classList.add("wiggle");
    }
    setTimeout(wiggleBell, 1800);
    setInterval(wiggleBell, 9000);
  }

  const hints = [
    "hm, it moved.",
    "it seems to be avoiding you.",
    "still no luck.",
    "this button really does not want to be pressed.",
    "okay, this is getting a little silly.",
    "yes is right there, you know.",
    "at this point it's basically exercise.",
  ];
  let dodgeCount = 0;

  function randomPosition() {
    const rect = noBtn.getBoundingClientRect();
    const margin = 20;
    const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
    const maxY = Math.max(margin, window.innerHeight - rect.height - margin);
    const x = margin + Math.random() * (maxX - margin);
    const y = margin + Math.random() * (maxY - margin);
    return { x, y };
  }

  function moveNoBtn() {
    const { x, y } = randomPosition();
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
  }

  function evade() {
    dodgeCount += 1;

    if (!noBtn.classList.contains("dodging")) {
      noBtn.classList.add("dodging");
      const rect = noBtn.getBoundingClientRect();
      noBtn.style.left = rect.left + "px";
      noBtn.style.top = rect.top + "px";
      void noBtn.offsetWidth;
      requestAnimationFrame(moveNoBtn);
    } else {
      moveNoBtn();
    }
    gateHint.textContent = hints[Math.min(dodgeCount - 1, hints.length - 1)];
  }

  noBtn.addEventListener("pointerenter", evade);
  noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); evade(); }, { passive: false });
  noBtn.addEventListener("click", (e) => { e.preventDefault(); evade(); });

  yesBtn.addEventListener("click", () => {
    gate.style.transition = "opacity 0.6s ease";
    gate.style.opacity = "0";
    setTimeout(() => {
      gate.style.display = "none";
      startCharSelect();
    }, 600);
  });

  const modalOverlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalEyebrow = document.getElementById("modalEyebrow");
  const modalClose = document.getElementById("modalClose");
  const envelope = document.getElementById("envelope");

  function openModal(eyebrow, title, body) {
    modalEyebrow.textContent = eyebrow;
    modalTitle.textContent = title;
    modalBody.textContent = body;
    modalOverlay.hidden = false;
  }
  function closeModal() {
    modalOverlay.hidden = true;
    if (envelope) envelope.classList.remove("opening");
  }
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modalOverlay.hidden) closeModal(); });

  function fetchContent(type) {
    return fetch(`/api/content/${type}`).then((r) => {
      if (!r.ok) throw new Error("failed to load content");
      return r.json();
    });
  }

  envelope.addEventListener("click", () => {
    if (envelope.classList.contains("opening")) return;
    envelope.classList.add("opening");
    setTimeout(() => {
      fetchContent("letter")
        .then((data) => openModal("for you", data.title, data.body))
        .catch(() => openModal("for you", "For Beatrice", "The letter could not be loaded right now — please try again in a moment."));
      QuestSystem.complete("letter");
    }, 450);
  });

  document.querySelectorAll(".after-game-buttons .btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-content");
      fetchContent(type)
        .then((data) => openModal("for you", data.title, data.body))
        .catch(() => openModal("for you", "Hmm", "This could not be loaded right now — please try again in a moment."));
    });
  });

  // Music room song-letter books — each book corresponds to one track on
  // the playlist and opens a short letter explaining why that song made
  // the birthday playlist. Once opened, a book gets a "read" mark so it's
  // clear at a glance which ones have already been checked.
  document.querySelectorAll(".gw-book").forEach((book) => {
    book.addEventListener("click", () => {
      const songId = book.getAttribute("data-song");
      if (!songId) return;
      fetchContent(songId)
        .then((data) => {
          openModal("music room", data.title, data.body);
          book.classList.add("gw-book--read");
        })
        .catch(() => openModal("music room", "Hmm", "This letter could not be loaded right now — please try again in a moment."));
    });
  });

  const gameStage = document.getElementById("gameStage");
  const afterGame = document.getElementById("afterGame");

  window.addEventListener("dino:finished", () => {
    gameStage.classList.add("fading-out");
    setTimeout(() => {
      gameStage.hidden = true;
      afterGame.hidden = false;
    }, 900);
    QuestSystem.complete("runner");
  });

  // Runner arcade cabinet
  const runnerCabinet = document.getElementById("runnerCabinet");
  const runnerOverlay = document.getElementById("runnerOverlay");
  const runnerClose = document.getElementById("runnerClose");
  if (runnerCabinet && runnerOverlay) {
    runnerCabinet.addEventListener("click", () => { runnerOverlay.hidden = false; });
  }
  if (runnerClose && runnerOverlay) {
    runnerClose.addEventListener("click", () => { runnerOverlay.hidden = true; });
  }

  const musicToggle = document.getElementById("musicToggle");
  const musicPanel = document.getElementById("musicPanel");
  if (musicToggle && musicPanel) {
    musicToggle.addEventListener("click", () => {
      const isOpen = musicPanel.classList.toggle("open");
      musicToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  const gpsButton = document.getElementById("gpsButton");
  const gpsOverlay = document.getElementById("gpsOverlay");
  const gpsYes = document.getElementById("gpsYes");
  const gpsNo = document.getElementById("gpsNo");

  function openGpsPopup() {
    gpsOverlay.hidden = false;
    gpsButton.setAttribute("aria-expanded", "true");
    QuestSystem.complete("tracker");
  }
  function closeGpsPopup() {
    gpsOverlay.hidden = true;
    gpsButton.setAttribute("aria-expanded", "false");
  }

  if (gpsButton && gpsOverlay) {
    gpsButton.addEventListener("click", openGpsPopup);
    gpsOverlay.addEventListener("click", (e) => { if (e.target === gpsOverlay) closeGpsPopup(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !gpsOverlay.hidden) closeGpsPopup(); });
    gpsYes.addEventListener("click", () => {
      window.open("https://spideytracker.net/", "_blank", "noopener");
      closeGpsPopup();
    });
    gpsNo.addEventListener("click", closeGpsPopup);
  }

  // Desktop side playlist — play/pause/next/prev controls
  const gwAudio = document.getElementById("gwPlaylistAudio");
  const gwPlaylistItems = Array.from(document.querySelectorAll(".gw-side-playlist-item"));
  const playlistPlay = document.getElementById("playlistPlay");
  const playlistPlayIcon = document.getElementById("playlistPlayIcon");
  const playlistPrev = document.getElementById("playlistPrev");
  const playlistNext = document.getElementById("playlistNext");

  const ICON_PLAY = '<path d="M8 5v14l11-7z"/>';
  const ICON_PAUSE = '<path d="M7 5h4v14H7zm6 0h4v14h-4z"/>';

  let gwTrackIndex = 0;
  let gwMusicQuestDone = false;

  const gwSpotifyEmbed = document.getElementById("gwSpotifyEmbed");
  const gwSpotifyIframe = document.getElementById("gwSpotifyIframe");
  const gwPlaylistControls = document.getElementById("gwPlaylistControls");

  function gwLoadTrack(index, autoplay) {
    if (!gwPlaylistItems.length) return;
    gwTrackIndex = (index + gwPlaylistItems.length) % gwPlaylistItems.length;
    const item = gwPlaylistItems[gwTrackIndex];
    gwPlaylistItems.forEach((it) => it.classList.remove("playing"));
    item.classList.add("playing");

    if (autoplay && !gwMusicQuestDone) {
      gwMusicQuestDone = true;
      QuestSystem.complete("music");
    }

    const spotifyId = item.getAttribute("data-spotify");

    if (spotifyId) {
      if (gwAudio) {
        gwAudio.pause();
        gwAudio.removeAttribute("src");
      }
      if (gwSpotifyIframe) {
        gwSpotifyIframe.src =
          "https://open.spotify.com/embed/track/" + spotifyId +
          "?utm_source=generator" + (autoplay ? "&autoplay=1" : "");
      }
      if (gwSpotifyEmbed) gwSpotifyEmbed.hidden = false;
      if (gwPlaylistControls) gwPlaylistControls.hidden = true;
      gwUpdatePlayIcon();
      return;
    }

    if (gwSpotifyEmbed) gwSpotifyEmbed.hidden = true;
    if (gwSpotifyIframe) gwSpotifyIframe.src = "";
    if (gwPlaylistControls) gwPlaylistControls.hidden = false;

    if (!gwAudio) return;
    gwAudio.src = item.getAttribute("data-src");
    if (autoplay) {
      gwAudio.play().catch(() => {});
    }
  }

  function gwUpdatePlayIcon() {
    if (!playlistPlayIcon) return;
    playlistPlayIcon.innerHTML = (gwAudio && !gwAudio.paused) ? ICON_PAUSE : ICON_PLAY;
    if (playlistPlay) playlistPlay.setAttribute("aria-label", (gwAudio && !gwAudio.paused) ? "Pause" : "Play");
  }

  if (playlistPlay && gwAudio) {
    playlistPlay.addEventListener("click", () => {
      const currentItem = gwPlaylistItems[gwTrackIndex];
      if (currentItem && currentItem.getAttribute("data-spotify")) return;
      if (!gwAudio.src) gwLoadTrack(gwTrackIndex, false);
      if (gwAudio.paused) {
        gwAudio.play().catch(() => {});
        if (!gwMusicQuestDone) {
          gwMusicQuestDone = true;
          QuestSystem.complete("music");
        }
      } else {
        gwAudio.pause();
      }
    });
    gwAudio.addEventListener("play", gwUpdatePlayIcon);
    gwAudio.addEventListener("pause", gwUpdatePlayIcon);
    gwAudio.addEventListener("ended", () => gwLoadTrack(gwTrackIndex + 1, true));
  }

  if (playlistPrev) playlistPrev.addEventListener("click", () => gwLoadTrack(gwTrackIndex - 1, true));
  if (playlistNext) playlistNext.addEventListener("click", () => gwLoadTrack(gwTrackIndex + 1, true));

  gwPlaylistItems.forEach((item, i) => {
    item.style.cursor = "pointer";
    item.addEventListener("click", () => gwLoadTrack(i, true));
  });

  if (gwPlaylistItems.length) gwLoadTrack(0, false);
  gwMusicQuestDone = false;

})();
